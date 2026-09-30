import fs from "node:fs";
import path from "node:path";
import { specRoot } from "./lib/workspace.mjs";
import { loadChecklist } from "./lib/checklist-xlsx.mjs";

const functionKey = process.argv[2];
if (!functionKey || functionKey.startsWith("--")) {
  console.error("Usage: npm run checklist:verify -- <FUNCTION_KEY>");
  process.exit(1);
}

const file = path.join(specRoot, functionKey, "checklist-review.md");
if (!fs.existsSync(file)) {
  console.error(`[checklist:verify] FAIL - missing ${file}`);
  console.error(`  Create it first: npm run checklist:load -- ${functionKey} --scaffold`);
  process.exit(1);
}

let checklist;
try {
  checklist = loadChecklist();
} catch (error) {
  console.error(`[checklist:verify] FAIL - ${error.message}`);
  process.exit(1);
}

const report = fs.readFileSync(file, "utf8");
const statuses = new Set(checklist.statuses.map((value) => value.toLowerCase()));
const severities = new Set(checklist.severities.map((value) => value.toLowerCase()));
const verdicts = new Set(checklist.verdicts.map((value) => value.toLowerCase()));

const rows = new Map();
for (const line of report.split(/\r?\n/)) {
  if (!line.trim().startsWith("|")) continue;
  const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
  if (cells.length < 5) continue;
  if (!/^\d+$/.test(cells[0])) continue;
  rows.set(cells[0], {
    id: cells[0],
    category: cells[1],
    status: cells[2],
    severity: cells[3],
    evidence: cells[4] ?? "",
    locations: cells[5] ?? "",
  });
}

const errors = [];
const warnings = [];
const counts = { PASS: 0, FAIL: 0, "Follow-up": 0, "N/A": 0, "Not Reviewed": 0 };

for (const item of checklist.items) {
  const row = rows.get(item.id);
  if (!row) {
    errors.push(`Item ${item.id} (${item.category}) is missing from the Results table.`);
    continue;
  }
  if (!statuses.has(row.status.toLowerCase())) {
    errors.push(`Item ${item.id}: status "${row.status}" is not one of ${checklist.statuses.join(", ")}.`);
    continue;
  }
  const status = checklist.statuses.find((value) => value.toLowerCase() === row.status.toLowerCase());
  counts[status] = (counts[status] ?? 0) + 1;

  if (!severities.has(row.severity.toLowerCase())) {
    errors.push(`Item ${item.id}: severity "${row.severity}" is not one of ${checklist.severities.join(", ")}.`);
  }
  if (/^fail$/i.test(status)) {
    if (!row.evidence) errors.push(`Item ${item.id} is FAIL but has no cause in Evidence / Comments.`);
    if (!row.locations) errors.push(`Item ${item.id} is FAIL but lists no Failure Locations.`);
    if (/^none$/i.test(row.severity)) errors.push(`Item ${item.id} is FAIL but severity is None.`);
  }
  if (/^(n\/a|follow-up)$/i.test(status) && !row.evidence) {
    warnings.push(`Item ${item.id} is ${status} without an explanation.`);
  }
  if (/^not reviewed$/i.test(status) && !row.evidence) {
    warnings.push(`Item ${item.id} is Not Reviewed without a reason. Record why it could not be reviewed.`);
  }
}

const extra = [...rows.keys()].filter((id) => !checklist.items.some((item) => item.id === id));
if (extra.length) warnings.push(`Results table has unknown item id(s): ${extra.join(", ")}.`);

const verdictMatch = report.match(/^\s*Verdict:\s*(.+)$/m);
const verdict = verdictMatch ? verdictMatch[1].trim() : "";
if (!verdict || verdict.startsWith("<")) {
  errors.push(`Verdict is not set. Use one of: ${checklist.verdicts.join(", ")}.`);
} else if (!verdicts.has(verdict.toLowerCase())) {
  errors.push(`Verdict "${verdict}" is not one of ${checklist.verdicts.join(", ")}.`);
} else if (counts.FAIL > 0 && /^pass$/i.test(verdict)) {
  errors.push(`Verdict is PASS but ${counts.FAIL} item(s) are FAIL.`);
}

const total = checklist.items.length;
const reviewed = total - (counts["Not Reviewed"] ?? 0);
const completion = total ? Math.round((reviewed / total) * 100) : 0;

console.log(`[checklist:verify] ${functionKey} - ${checklist.source}`);
console.log(`  total items: ${total}`);
console.log(`  reviewed: ${reviewed} (${completion}%)`);
for (const [status, count] of Object.entries(counts)) console.log(`  ${status}: ${count}`);

if (errors.length) {
  console.error(`\n[checklist:verify] FAIL - ${errors.length} error(s)\n`);
  errors.forEach((error) => console.error(`  ERROR: ${error}`));
  warnings.forEach((warning) => console.error(`  WARN: ${warning}`));
  process.exit(2);
}

warnings.forEach((warning) => console.log(`  WARN: ${warning}`));
console.log(`[checklist:verify] PASS - report is complete and internally consistent.`);
