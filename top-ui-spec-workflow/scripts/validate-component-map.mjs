import fs from "node:fs";
import path from "node:path";
import { fileExists, loadCatalog, normalizePath } from "./lib/catalog.mjs";
import { appRoot, specRoot } from "./lib/workspace.mjs";

const storyId = process.argv[2];
if (!storyId) {
  console.error("Usage: npm run component-map:validate -- <STORY-ID>");
  process.exit(1);
}

const cwd = appRoot;
const root = path.join(specRoot, storyId);
const contractFile = path.join(root, "ui-contract.json");
const mapFile = path.join(root, "component-map.json");
for (const file of [contractFile, mapFile]) {
  if (!fs.existsSync(file)) {
    console.error(`[component-map:validate] Missing ${file}`);
    process.exit(1);
  }
}

const contract = JSON.parse(fs.readFileSync(contractFile, "utf8"));
const map = JSON.parse(fs.readFileSync(mapFile, "utf8"));
const { byName: catalog } = loadCatalog(cwd);
const errors = [];
const warnings = [];
const allowed = new Set(["reuse", "configure", "compose", "extend", "new-shared", "page-specific"]);
const catalogDecisions = new Set(["reuse", "configure"]);
const sharedDecisions = new Set(["reuse", "configure", "extend", "new-shared"]);

function isScreenPath(p) {
  return p.startsWith("src/components/screens/");
}

function isComponentsPath(p) {
  return p.startsWith("src/components/");
}

function isSharedComponentsPath(p) {
  return isComponentsPath(p) && !isScreenPath(p);
}

function isPagePath(p) {
  return p.startsWith("src/demoModules/") || p.startsWith("src/modules/") || isScreenPath(p);
}

function isFunctionKeyModulePath(p) {
  return p.startsWith(`src/modules/${storyId}/`);
}

function inCatalog(name, file) {
  const files = catalog.get(name);
  if (!files?.length) return false;
  const normalized = normalizePath(file);
  return files.includes(normalized);
}

if (map.featureId !== storyId) errors.push(`component-map featureId must equal ${storyId}`);

const required = new Set([
  ...(contract.fields ?? []).map((x) => x.id),
  ...(contract.actions ?? []).map((x) => x.id),
]);
const found = new Map();

(map.mappings ?? []).forEach((mapping, i) => {
  const loc = `mappings[${i}]`;
  if (!mapping.requirementId) {
    errors.push(`${loc}.requirementId is required`);
    return;
  }
  if (found.has(mapping.requirementId)) errors.push(`Duplicate mapping for ${mapping.requirementId}`);
  found.set(mapping.requirementId, mapping);
  if (!allowed.has(mapping.decision)) errors.push(`${loc}.decision "${mapping.decision}" is not allowed`);
  if (!mapping.capability) errors.push(`${loc}.capability is required`);
  if (!Array.isArray(mapping.components)) {
    errors.push(`${loc}.components must be an array`);
    return;
  }
  if (!mapping.rationale) errors.push(`${loc}.rationale is required`);
  if (["new-shared", "page-specific", "extend"].includes(mapping.decision) && String(mapping.rationale ?? "").trim().length < 25) {
    warnings.push(`${mapping.requirementId}: ${mapping.decision} rationale is very short`);
  }

  const components = mapping.components.filter(Boolean);
  if (!components.length) errors.push(`${mapping.requirementId}: components must not be empty`);

  let catalogHits = 0;
  components.forEach((comp, ci) => {
    const name = comp.name;
    const rel = normalizePath(comp.path ?? "");
    const cloc = `${mapping.requirementId}.components[${ci}]`;
    if (!name) errors.push(`${cloc}.name is required`);
    if (!rel) {
      errors.push(`${cloc}.path is required`);
      return;
    }

    if (mapping.decision === "page-specific") {
      if (!isPagePath(rel) && !isSharedComponentsPath(rel)) {
        errors.push(`${cloc}: page-specific path must be under src/components/screens, src/demoModules, src/modules, or src/components (got ${rel})`);
      }
      if (rel.startsWith("src/modules/") && !isFunctionKeyModulePath(rel)) {
        errors.push(`${cloc}: generated module paths must be under src/modules/${storyId}/ (got ${rel})`);
      }
      if (!fileExists(cwd, rel)) errors.push(`${cloc}: file does not exist: ${rel}`);
      return;
    }

    if (sharedDecisions.has(mapping.decision) && !isSharedComponentsPath(rel)) {
      errors.push(`${cloc}: ${mapping.decision} path must be under src/components (not screens/) (got ${rel})`);
    }

    if (mapping.decision === "compose") {
      if (!isSharedComponentsPath(rel) && !isPagePath(rel)) {
        errors.push(`${cloc}: compose path must be under src/components, src/components/screens, src/demoModules, or src/modules (got ${rel})`);
      }
    }

    if (!fileExists(cwd, rel)) errors.push(`${cloc}: file does not exist: ${rel}`);

    if (isSharedComponentsPath(rel)) {
      if (inCatalog(name, rel)) catalogHits += 1;
      else if (catalogDecisions.has(mapping.decision)) {
        errors.push(`${cloc}: reuse/configure must name a catalog export. "${name}" is not listed at ${rel} in COMPONENT_CATALOG.md. Run npm run ui:catalog if the export is new.`);
      } else if (mapping.decision === "new-shared") {
        warnings.push(`${cloc}: new-shared "${name}" is not in COMPONENT_CATALOG.md yet. Run npm run ui:catalog after adding it.`);
      } else if (mapping.decision === "extend" || mapping.decision === "compose") {
        if (!catalog.has(name)) {
          errors.push(`${cloc}: "${name}" is not a catalog export. ${mapping.decision} of src/components must use a catalog name.`);
        } else if (!inCatalog(name, rel)) {
          errors.push(`${cloc}: catalog lists "${name}" at ${catalog.get(name).join(", ")}, not ${rel}`);
        } else {
          catalogHits += 1;
        }
      }
    }
  });

  if (mapping.decision === "compose" && catalogHits < 1) {
    errors.push(`${mapping.requirementId}: compose must include at least one src/components catalog export`);
  }
});

for (const id of required) {
  if (!found.has(id)) errors.push(`Missing component mapping for ${id}`);
}

if (errors.length) {
  console.error(`\n[component-map:validate] FAIL — ${errors.length} error(s)\n`);
  errors.forEach((e) => console.error(`  ERROR: ${e}`));
  warnings.forEach((w) => console.error(`  WARN: ${w}`));
  process.exit(2);
}

console.log(`[component-map:validate] PASS — ${storyId}`);
console.log(`  mapped requirements: ${required.size}`);
console.log(`  catalog exports checked: ${catalog.size}`);
warnings.forEach((w) => console.log(`  WARN: ${w}`));
