import fs from "node:fs";
import path from "node:path";
import { specRoot } from "./lib/workspace.mjs";
import { CHECKLIST_WORKBOOK, checklistToMarkdown, loadChecklist } from "./lib/checklist-xlsx.mjs";

const args = process.argv.slice(2);
const flags = new Set(args.filter((arg) => arg.startsWith("--")));
const functionKey = args.find((arg) => !arg.startsWith("--"));

let checklist;
try {
  checklist = loadChecklist();
} catch (error) {
  console.error(`[checklist:load] FAIL - ${error.message}`);
  console.error(`  Expected workbook: ${CHECKLIST_WORKBOOK}`);
  console.error("  Override with UI_CHECKLIST_XLSX=<absolute path>.");
  process.exit(1);
}

if (flags.has("--json")) {
  console.log(JSON.stringify(checklist, null, 2));
  process.exit(0);
}

if (flags.has("--scaffold")) {
  if (!functionKey) {
    console.error("Usage: npm run checklist:load -- <FUNCTION_KEY> --scaffold");
    process.exit(1);
  }
  const dir = path.join(specRoot, functionKey);
  if (!fs.existsSync(dir)) {
    console.error(`[checklist:load] FAIL - no spec folder for ${functionKey} at ${dir}`);
    process.exit(1);
  }
  const target = path.join(dir, "checklist-review.md");
  if (fs.existsSync(target) && !flags.has("--force")) {
    console.error(`[checklist:load] ${target} already exists. Re-run with --force to overwrite.`);
    process.exit(1);
  }

  const rows = checklist.items
    .map((item) => `| ${item.id} | ${item.category} | Not Reviewed | None | | |`)
    .join("\n");
  const report = `# Checklist Review - ${functionKey}

Source workbook: \`${checklist.source}\`
Reviewer: <agent or name>
Review Date: ${new Date().toISOString().slice(0, 10)}
Verdict: <${checklist.verdicts.join(" | ")}>

## Coverage

| Metric | Value |
| --- | --- |
| Total items | ${checklist.items.length} |
| Reviewed | 0 |
| PASS | 0 |
| FAIL | 0 |
| Follow-up | 0 |
| N/A | 0 |
| Not Reviewed | ${checklist.items.length} |

## Results

| ID | Category | Status | Severity | Evidence / Comments | Failure Locations |
| --- | --- | --- | --- | --- | --- |
${rows}

## Failure Detail

<!-- One block per FAIL item. Delete this comment when filled in. -->

## Not Reviewable

<!-- List any item that could not be reviewed and the reason (for example: no Figma access). -->
`;
  fs.writeFileSync(target, report, "utf8");
  console.log(`[checklist:load] Wrote ${target} (${checklist.items.length} items).`);
  process.exit(0);
}

console.log(checklistToMarkdown(checklist, functionKey));
