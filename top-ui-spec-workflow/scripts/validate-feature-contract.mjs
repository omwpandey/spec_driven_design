import fs from "node:fs";
import path from "node:path";
import { specRoot } from "./lib/workspace.mjs";

const storyId = process.argv[2];
if (!storyId) {
  console.error("Usage: npm run feature:validate -- <STORY-ID>");
  process.exit(1);
}

const file = path.join(specRoot, storyId, "ui-contract.json");
if (!fs.existsSync(file)) {
  console.error(`[feature:validate] Missing ${file}`);
  process.exit(1);
}

let contract;
try {
  contract = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (error) {
  console.error(`[feature:validate] Invalid JSON: ${error.message}`);
  process.exit(1);
}

const errors = [];
const warnings = [];
const requireValue = (condition, message) => {
  if (!condition) errors.push(message);
};
const sourceIds = new Set((contract.sources ?? []).map((source) => source.id));
const validationIds = new Set();

function refs(sourceRefs, location, required = true) {
  if (!Array.isArray(sourceRefs) || !sourceRefs.length) {
    if (required) errors.push(`${location}: sourceRefs are required`);
    return;
  }
  sourceRefs.forEach((ref, index) => {
    if (!sourceIds.has(ref.sourceId)) errors.push(`${location}.sourceRefs[${index}]: unknown sourceId "${ref.sourceId}"`);
    if (!ref.locator) warnings.push(`${location}.sourceRefs[${index}]: locator is empty`);
  });
}

requireValue(contract.schemaVersion === "1.0", 'schemaVersion must be "1.0"');
requireValue(contract.feature?.id === storyId, `feature.id must equal ${storyId}`);
requireValue(Boolean(contract.feature?.title), "feature.title is required");
requireValue(Boolean(contract.screen?.route), "screen.route is required");
requireValue(Array.isArray(contract.screen?.api) && contract.screen.api.length > 0, "screen.api must contain at least one API definition");
for (const [index, definition] of (contract.screen?.api ?? []).entries()) {
  requireValue(Boolean(definition.id), `screen.api[${index}].id is required`);
  requireValue(["GET", "POST", "PUT", "PATCH", "DELETE"].includes(definition.method), `screen.api[${index}].method is invalid`);
  requireValue(Boolean(definition.path), `screen.api[${index}].path is required`);
  requireValue(definition.mockResponse !== undefined, `screen.api[${index}].mockResponse is required`);
}
for (const key of ["sources", "fields", "actions", "states", "permissions", "acceptanceCriteria", "conflicts", "openQuestions"]) {
  requireValue(Array.isArray(contract[key]), `${key} must be an array`);
}

(contract.fields ?? []).forEach((field, fieldIndex) => {
  requireValue(Boolean(field.id), `fields[${fieldIndex}].id is required`);
  requireValue(Boolean(field.label), `fields[${fieldIndex}].label is required`);
  refs(field.sourceRefs, `fields[${fieldIndex}]`);
  (field.validation ?? []).forEach((validation, validationIndex) => {
    requireValue(Boolean(validation.id), `fields[${fieldIndex}].validation[${validationIndex}].id is required`);
    if (validation.id) {
      if (validationIds.has(validation.id)) errors.push(`Duplicate validation id "${validation.id}"`);
      validationIds.add(validation.id);
    }
    requireValue(Boolean(validation.rule), `fields[${fieldIndex}].validation[${validationIndex}].rule is required`);
    refs(validation.sourceRefs, `fields[${fieldIndex}].validation[${validationIndex}]`);
  });
});

(contract.actions ?? []).forEach((action, index) => {
  requireValue(Boolean(action.id), `actions[${index}].id is required`);
  requireValue(Boolean(action.label), `actions[${index}].label is required`);
  requireValue(Boolean(action.trigger?.type), `actions[${index}].trigger.type is required`);
  refs(action.sourceRefs, `actions[${index}]`);
  for (const validationId of action.frontendValidations ?? []) {
    if (!validationIds.has(validationId)) errors.push(`actions[${index}]: frontend validation "${validationId}" does not exist`);
  }
});
(contract.permissions ?? []).forEach((permission, index) => refs(permission.sourceRefs, `permissions[${index}]`));
(contract.acceptanceCriteria ?? []).forEach((criterion, index) => {
  requireValue(Boolean(criterion.id), `acceptanceCriteria[${index}].id is required`);
  requireValue(Boolean(criterion.statement), `acceptanceCriteria[${index}].statement is required`);
  refs(criterion.sourceRefs, `acceptanceCriteria[${index}]`);
});
(contract.conflicts ?? []).forEach((conflict, index) => {
  requireValue(Boolean(conflict.id), `conflicts[${index}].id is required`);
  requireValue(["open", "resolved"].includes(conflict.status), `conflicts[${index}].status must be open or resolved`);
  refs(conflict.sourceRefs, `conflicts[${index}]`);
  if (conflict.status === "resolved" && !conflict.resolution) errors.push(`conflicts[${index}]: resolved conflict needs resolution`);
});

const grillFile = path.join(specRoot, storyId, "grill.json");
if (fs.existsSync(grillFile)) {
  try {
    const grill = JSON.parse(fs.readFileSync(grillFile, "utf8"));
    if (grill.status !== "agreed") errors.push(`grill.json status is "${grill.status}". Developer must agree before this feature is ready.`);
  } catch (error) {
    errors.push(`grill.json is invalid JSON: ${error.message}`);
  }
}

const blocking = (contract.openQuestions ?? []).filter((question) => question.blocking === true).length;
if (errors.length) {
  console.error(`\n[feature:validate] FAIL - ${errors.length} error(s)\n`);
  errors.forEach((error) => console.error(`  ERROR: ${error}`));
  warnings.forEach((warning) => console.error(`  WARN: ${warning}`));
  process.exit(2);
}

console.log(`[feature:validate] PASS - ${storyId}`);
console.log(`  sources: ${contract.sources.length}`);
console.log(`  fields: ${contract.fields.length}`);
console.log(`  actions: ${contract.actions.length}`);
console.log(`  conflicts: ${contract.conflicts.length}`);
console.log(`  blocking open questions: ${blocking}`);
warnings.forEach((warning) => console.log(`  WARN: ${warning}`));
