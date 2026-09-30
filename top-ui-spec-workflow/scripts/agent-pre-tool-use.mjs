import fs from "node:fs";
import path from "node:path";
import { specRoot } from "./lib/workspace.mjs";
import {
  candidatePaths,
  detectAgent,
  isKiroRuntime,
  featureIdFromFeaturesPath,
  featuresClaimingSrcFile,
  grillStatus,
  isAnalystAllowedPath,
  isComponentMapPath,
  isContractPath,
  isEditLike,
  isReviewMd,
  isSrcUiPath,
  mentionedFeatureIds,
  pendingGrillFeatureIds,
} from "./lib/hook-paths.mjs";

let payload = {};

function allow(extra = {}) {
  const reason = extra.additionalContext;
  console.log(
    JSON.stringify({
      permission: "allow",
      ...(reason ? { agent_message: reason } : {}),
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "allow",
        ...extra,
      },
    }),
  );
  process.exit(0);
}

function deny(reason) {
  console.log(
    JSON.stringify({
      permission: "deny",
      user_message: reason,
      agent_message: reason,
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }),
  );
  // Copilot/Cursor honor permission JSON and exit 0. Kiro PreToolUse blocks on non-zero.
  if (isKiroRuntime(payload)) {
    process.stderr.write(`${reason}\n`);
    process.exit(2);
  }
  process.exit(0);
}

let input = "";
for await (const chunk of process.stdin) input += chunk;

try {
  payload = input.trim() ? JSON.parse(input) : {};
} catch {
  allow();
}

const cwd = String(payload.cwd ?? process.cwd());
const toolName = String(payload.tool_name ?? payload.toolName ?? payload.tool ?? "");
const toolInput = payload.tool_input ?? payload.toolInput ?? {};
const agent = process.env.UI_HOOK_AGENT || detectAgent(payload);
const eventName = String(payload.hook_event_name ?? payload.hookEventName ?? payload.trigger ?? "");
const extraPath = {
  file_path: payload.file_path ?? payload.filePath ?? payload.path,
};

if (!isEditLike(toolName)) {
  const kiroWrite = isKiroRuntime(payload) && /PreToolUse/i.test(eventName) && extraPath.file_path;
  if (!kiroWrite) allow();
}

const candidates = candidatePaths(toolInput, cwd, extraPath);
const blob = `${JSON.stringify(toolInput)}\n${candidates.join("\n")}`;

const featureIds = new Set([
  ...mentionedFeatureIds(blob, cwd),
  ...candidates.map(featureIdFromFeaturesPath).filter(Boolean),
]);
for (const p of candidates.filter(isSrcUiPath)) {
  for (const id of featuresClaimingSrcFile(cwd, p)) featureIds.add(id);
}

if (!candidates.length && agent === "analyst") {
  deny(
    "Requirement Analyst edit blocked because target path could not be verified. It may only write contract/grill artifacts under specs/<ID>/.",
  );
}

if (!candidates.length) allow();

const srcComp = candidates.filter((p) => p === "src/comp" || p.startsWith("src/comp/"));
if (srcComp.length) deny(`Do not create a parallel UI kit. Blocked: ${srcComp.join(", ")}`);

if (agent === "analyst") {
  const unsafe = candidates.filter((p) => !isAnalystAllowedPath(p));
  if (unsafe.length) {
    deny(
      `Requirement Analyst may only write sources.md, feature.md, ui-contract.json, grill.md, or grill.json under specs/<ID>/. Blocked: ${unsafe.join(", ")}`,
    );
  }
}

if (agent === "reviewer") {
  const unsafe = candidates.filter((p) => !isReviewMd(p));
  if (unsafe.length) {
    deny(`UI Reviewer may only write specs/<ID>/review.md. Blocked: ${unsafe.join(", ")}`);
  }
}

const writingReview = candidates.some(isReviewMd);
const writingSrc = candidates.some(isSrcUiPath);
const writingContract = candidates.some(isContractPath);
const writingMap = candidates.some(isComponentMapPath);

if (writingReview && writingSrc) {
  deny("Do not mix review.md with source edits. UI Reviewer writes only review.md.");
}

if (writingSrc && !featureIds.size) {
  const pending = pendingGrillFeatureIds(cwd);
  if (pending.length) {
    deny(
      `Pending grill for ${pending.join(", ")}. Include the Function Key / Story ID in the edit, or agree first: npm run feature:grill -- <ID> --agree --by "<name>"`,
    );
  }
}

for (const id of featureIds) {
  const status = grillStatus(cwd, id);
  if (status === null) continue; // as-built / no grill gate
  if (status === "agreed") continue;
  if (writingContract) {
    deny(
      `grill.json for ${id} is "${status}". Do not write ui-contract.json until: npm run feature:grill -- ${id} --agree --by "<name>"`,
    );
  }
  if (writingMap) {
    deny(
      `grill.json for ${id} is "${status}". Do not write component-map.json until the developer agrees the grill.`,
    );
  }
  if (writingSrc) {
    deny(`grill.json for ${id} is "${status}". Do not implement React until the developer agrees.`);
  }
}

if (writingSrc) {
  for (const id of featureIds) {
    if (grillStatus(cwd, id) !== "agreed") continue;
    const mapFile = path.join(specRoot, id, "component-map.json");
    if (!fs.existsSync(mapFile)) {
      deny(
        `component-map.json missing for ${id}. Run component-discovery and npm run component-map:validate -- ${id} before implementing pages.`,
      );
    }
  }
}

if (agent === "analyst") allow({ additionalContext: "Write is within analyst-allowed feature artifacts." });
if (agent === "reviewer") allow({ additionalContext: "Write is limited to review.md." });
allow();
