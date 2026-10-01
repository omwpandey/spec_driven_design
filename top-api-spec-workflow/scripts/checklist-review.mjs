import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const workflowRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workbookPath = process.env.TOP_API_CHECKLIST_XLSX
  ? path.resolve(process.env.TOP_API_CHECKLIST_XLSX)
  : path.join(workflowRoot, "Backend_development_checkList 2.xlsx");
const specRoot = path.resolve(
  process.env.TOP_API_SPEC_ROOT ?? path.join(workflowRoot, "..", "top-spec-workflow", "specs"),
);
const statuses = ["PASS", "FAIL", "NOT REVIEWABLE", "N/A", "NOT REVIEWED"];

function readZipEntries(buffer) {
  let endOffset = -1;
  for (let offset = buffer.length - 22; offset >= 0 && offset >= buffer.length - 66_000; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      endOffset = offset;
      break;
    }
  }
  if (endOffset < 0) throw new Error("Invalid .xlsx: ZIP end record not found");

  const totalEntries = buffer.readUInt16LE(endOffset + 10);
  let entryOffset = buffer.readUInt32LE(endOffset + 16);
  const entries = new Map();
  for (let index = 0; index < totalEntries; index += 1) {
    if (buffer.readUInt32LE(entryOffset) !== 0x02014b50) break;
    const method = buffer.readUInt16LE(entryOffset + 10);
    const compressedSize = buffer.readUInt32LE(entryOffset + 20);
    const nameLength = buffer.readUInt16LE(entryOffset + 28);
    const extraLength = buffer.readUInt16LE(entryOffset + 30);
    const commentLength = buffer.readUInt16LE(entryOffset + 32);
    const localOffset = buffer.readUInt32LE(entryOffset + 42);
    const name = buffer.toString("utf8", entryOffset + 46, entryOffset + 46 + nameLength);
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);

    if (method === 0) entries.set(name, compressed);
    else if (method === 8) entries.set(name, zlib.inflateRawSync(compressed));
    entryOffset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

function decodeXml(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\u00a0/g, " ");
}

function readSharedStrings(xml = "") {
  return [...xml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((entry) =>
    decodeXml([...entry[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((text) => text[1]).join("")),
  );
}

function readRows(xml, sharedStrings) {
  const rows = [];
  for (const row of xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = {};
    for (const cell of row[1].matchAll(/<c([^>]*)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const reference = cell[1].match(/r="([A-Z]+)\d+"/)?.[1];
      if (!reference) continue;
      const body = cell[2] ?? "";
      const type = cell[1].match(/t="([^"]+)"/)?.[1];
      const value = body.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      const inline = body.match(/<is>([\s\S]*?)<\/is>/)?.[1];
      let text = "";
      if (type === "s" && value !== undefined) text = sharedStrings[Number(value)] ?? "";
      else if (inline) text = [...inline.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((item) => decodeXml(item[1])).join("");
      else if (value !== undefined) text = decodeXml(value);
      cells[reference] = text.trim();
    }
    if (Object.values(cells).some(Boolean)) rows.push(cells);
  }
  return rows;
}

function columnIndex(column) {
  return [...column].reduce((value, letter) => value * 26 + letter.charCodeAt(0) - 64, 0) - 1;
}

function findWorksheet(entries, workbookXml, relationshipsXml, wantedName) {
  const sheetTag = [...workbookXml.matchAll(/<sheet[^>]*\/>/g)]
    .map((match) => match[0])
    .find((tag) => decodeXml(tag.match(/name="([^"]+)"/)?.[1] ?? "").toLowerCase() === wantedName.toLowerCase());
  const relationshipId = sheetTag?.match(/r:id="([^"]+)"/)?.[1];
  const relation = [...relationshipsXml.matchAll(/<Relationship[^>]*\/>/g)]
    .map((match) => match[0])
    .find((tag) => tag.match(/Id="([^"]+)"/)?.[1] === relationshipId);
  const target = relation?.match(/Target="([^"]+)"/)?.[1];
  if (!target) return null;
  const entryName = `xl/${target.replace(/^\/?(?:xl\/)?/, "")}`;
  return entries.get(entryName)?.toString("utf8") ?? null;
}

function loadChecklist() {
  if (!fs.existsSync(workbookPath)) throw new Error(`Checklist workbook not found: ${workbookPath}`);
  const entries = readZipEntries(fs.readFileSync(workbookPath));
  const workbookXml = entries.get("xl/workbook.xml")?.toString("utf8") ?? "";
  const relationshipsXml = entries.get("xl/_rels/workbook.xml.rels")?.toString("utf8") ?? "";
  const sharedStrings = readSharedStrings(entries.get("xl/sharedStrings.xml")?.toString("utf8"));
  const sheetXml = findWorksheet(entries, workbookXml, relationshipsXml, "Backend_checkList");
  if (!sheetXml) throw new Error('Worksheet "Backend_checkList" not found in the workbook');

  const rows = readRows(sheetXml, sharedStrings);
  const headerIndex = rows.findIndex((row) => {
    const values = Object.values(row).map((value) => value.toLowerCase());
    return values.some((value) => value === "id") && values.some((value) => value.includes("category"));
  });
  if (headerIndex < 0) throw new Error('Could not find the checklist header row containing "ID" and "Category"');

  const header = rows[headerIndex];
  const headers = Object.entries(header).map(([column, value]) => [columnIndex(column), value.toLowerCase()]);
  const findColumn = (fragment) => headers.find(([, value]) => value.includes(fragment))?.[0];
  const idColumn = findColumn("id");
  const categoryColumn = findColumn("category");
  const checkColumn = findColumn("reviewer check");
  const evidenceColumn = findColumn("required evidence");
  if ([idColumn, categoryColumn, checkColumn, evidenceColumn].some((column) => column === undefined)) {
    throw new Error("Checklist is missing an ID, Category, Reviewer check, or Required evidence column");
  }
  const cellAt = (row, index) => row[Object.keys(row).find((column) => columnIndex(column) === index)] ?? "";
  const items = rows.slice(headerIndex + 1).flatMap((row) => {
    const id = cellAt(row, idColumn).trim();
    const category = cellAt(row, categoryColumn).trim();
    const check = cellAt(row, checkColumn).trim();
    const requiredEvidence = cellAt(row, evidenceColumn).trim();
    return id && category && check ? [{ id, category, check, requiredEvidence }] : [];
  });
  if (!items.length) throw new Error("No checklist items found in the workbook");
  return { source: path.basename(workbookPath), sourcePath: workbookPath, items };
}

function reportPath(functionKey) {
  return path.join(specRoot, functionKey, "backend-checklist-review.md");
}

function scaffold(checklist, functionKey, force) {
  if (!/^[A-Za-z0-9_-]+$/.test(functionKey)) throw new Error("Function Key contains unsupported characters");
  const directory = path.join(specRoot, functionKey);
  if (!fs.existsSync(directory)) throw new Error(`No shared spec folder for ${functionKey}: ${directory}`);
  const target = reportPath(functionKey);
  if (fs.existsSync(target) && !force) throw new Error(`${target} already exists; use --force to regenerate`);
  const rows = checklist.items.map((item) => `| ${item.id} | ${item.category} | NOT REVIEWED | |`).join("\n");
  const report = `# Backend Checklist Review - ${functionKey}

Source workbook: \`${checklist.source}\`
Reviewer: <agent or name>
Review Date: <YYYY-MM-DD>
Java Repository: <repository path>
Overall Status: <PASS | FAIL | INCOMPLETE>

## Coverage

| Metric | Value |
| --- | ---: |
| Total items | ${checklist.items.length} |
| Reviewed (PASS, FAIL, N/A) | 0 |
| PASS | 0 |
| FAIL | 0 |
| NOT REVIEWABLE | 0 |
| N/A | 0 |
| NOT REVIEWED | ${checklist.items.length} |

## Results

| ID | Category | Status | Evidence / Finding |
| --- | --- | --- | --- |
${rows}

## Failure Detail

<!-- Add one block per FAIL item with the failed check, cause, and all evidence locations. -->

## Not Reviewable

<!-- List each NOT REVIEWABLE item and the unavailable required evidence. -->
`;
  fs.writeFileSync(target, report, "utf8");
  console.log(`[checklist:load] Wrote ${target} (${checklist.items.length} items).`);
}

function verify(functionKey, checklist) {
  if (!/^[A-Za-z0-9_-]+$/.test(functionKey)) throw new Error("Function Key contains unsupported characters");
  const target = reportPath(functionKey);
  if (!fs.existsSync(target)) throw new Error(`Missing report: ${target}; scaffold it with checklist:load -- ${functionKey} --scaffold`);
  const report = fs.readFileSync(target, "utf8");
  const rows = new Map();
  const duplicates = new Set();
  for (const line of report.split(/\r?\n/)) {
    if (!line.trim().startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length >= 4 && /^[A-Z]\d+$/i.test(cells[0])) {
      if (rows.has(cells[0])) duplicates.add(cells[0]);
      rows.set(cells[0], { category: cells[1], status: cells[2].toUpperCase(), evidence: cells[3] });
    }
  }

  const errors = [];
  if (duplicates.size) errors.push(`Duplicate checklist item ID(s): ${[...duplicates].join(", ")}.`);
  const counts = Object.fromEntries(statuses.map((status) => [status, 0]));
  for (const item of checklist.items) {
    const row = rows.get(item.id);
    if (!row) {
      errors.push(`Item ${item.id} is missing from the Results table.`);
      continue;
    }
    if (row.category !== item.category) errors.push(`Item ${item.id} category must match the workbook: ${item.category}.`);
    if (!statuses.includes(row.status)) {
      errors.push(`Item ${item.id} has invalid status "${row.status}". Use ${statuses.join(", ")}.`);
      continue;
    }
    counts[row.status] += 1;
    if (!row.evidence) errors.push(`Item ${item.id} (${row.status}) needs evidence, a finding, or a reason.`);
  }
  const extras = [...rows.keys()].filter((id) => !checklist.items.some((item) => item.id === id));
  if (extras.length) errors.push(`Unknown checklist item ID(s): ${extras.join(", ")}.`);

  const overall = counts.FAIL ? "FAIL" : counts["NOT REVIEWABLE"] || counts["NOT REVIEWED"] ? "INCOMPLETE" : "PASS";
  const overallMatch = report.match(/^Overall Status:\s*(.+)$/m)?.[1]?.trim().toUpperCase();
  if (overallMatch !== overall) errors.push(`Overall Status must be ${overall} based on the item statuses.`);
  const reviewed = counts.PASS + counts.FAIL + counts["N/A"];
  const coverage = new Map();
  for (const line of report.split(/\r?\n/)) {
    if (!line.trim().startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length >= 2 && /^\d+$/.test(cells[1])) coverage.set(cells[0].toLowerCase(), Number(cells[1]));
  }
  const expectedCoverage = new Map([
    ["total items", checklist.items.length],
    ["reviewed (pass, fail, n/a)", reviewed],
    ["pass", counts.PASS],
    ["fail", counts.FAIL],
    ["not reviewable", counts["NOT REVIEWABLE"]],
    ["n/a", counts["N/A"]],
    ["not reviewed", counts["NOT REVIEWED"]],
  ]);
  for (const [metric, expected] of expectedCoverage) {
    if (coverage.get(metric) !== expected) errors.push(`Coverage "${metric}" must be ${expected}.`);
  }
  console.log(`[checklist:verify] ${functionKey} - ${checklist.source}`);
  console.log(`  total: ${checklist.items.length}; reviewed: ${reviewed}; PASS: ${counts.PASS}; FAIL: ${counts.FAIL}; NOT REVIEWABLE: ${counts["NOT REVIEWABLE"]}; N/A: ${counts["N/A"]}; NOT REVIEWED: ${counts["NOT REVIEWED"]}`);
  if (errors.length) {
    console.error(`[checklist:verify] FAIL - ${errors.length} error(s)`);
    errors.forEach((error) => console.error(`  ${error}`));
    process.exitCode = 2;
  } else {
    console.log(`[checklist:verify] PASS - report is complete and internally consistent.`);
  }
}

const [action, functionKey, ...options] = process.argv.slice(2);
try {
  const checklist = loadChecklist();
  if (action === "load") {
    if (options.includes("--json")) console.log(JSON.stringify(checklist, null, 2));
    else if (options.includes("--scaffold")) {
      if (!functionKey) throw new Error("Usage: npm run checklist:load -- <FUNCTION_KEY> --scaffold");
      scaffold(checklist, functionKey, options.includes("--force"));
    } else {
      console.log(`Source workbook: ${checklist.source}\nTotal checklist items: ${checklist.items.length}`);
      for (const item of checklist.items) {
        console.log(`\n${item.id}. ${item.category}\n   Check: ${item.check}\n   Required evidence: ${item.requiredEvidence}`);
      }
      console.log(`\nAllowed report statuses: ${statuses.join(" | ")}`);
    }
  } else if (action === "verify") {
    if (!functionKey) throw new Error("Usage: npm run checklist:verify -- <FUNCTION_KEY>");
    verify(functionKey, checklist);
  } else {
    throw new Error("Usage: node scripts/checklist-review.mjs <load|verify> <FUNCTION_KEY> [options]");
  }
} catch (error) {
  console.error(`[checklist:${action ?? "review"}] FAIL - ${error.message}`);
  process.exitCode = 1;
}