import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { workflowRoot } from "./workspace.mjs";

export const CHECKLIST_WORKBOOK = process.env.UI_CHECKLIST_XLSX
  ? path.resolve(process.env.UI_CHECKLIST_XLSX)
  : path.join(workflowRoot, "UI_REVIEW_CHECKLIST_28-Sep.xlsx");

/** Minimal reader for the stored/deflated entries an .xlsx uses. No third-party dependency. */
function readZipEntries(buffer) {
  let eocd = -1;
  for (let i = buffer.length - 22; i >= 0 && i >= buffer.length - 66_000; i -= 1) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("Not a valid .xlsx (zip end-of-central-directory not found)");

  const total = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const entries = new Map();

  for (let n = 0; n < total; n += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) break;
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString("utf8", offset + 46, offset + 46 + nameLength);

    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const raw = buffer.subarray(dataStart, dataStart + compressedSize);

    if (method === 0) entries.set(name, raw);
    else if (method === 8) entries.set(name, zlib.inflateRawSync(raw));

    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

function decodeXmlText(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function readSharedStrings(xml) {
  if (!xml) return [];
  return [...xml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((si) =>
    decodeXmlText([...si[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join("")),
  );
}

/** Rows as `{ A: "value", B: "value" }` objects keyed by column letter. */
function readSheetRows(xml, sharedStrings) {
  const rows = [];
  for (const row of xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = {};
    for (const cell of row[1].matchAll(/<c([^>]*)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const attrs = cell[1];
      const body = cell[2] ?? "";
      const column = (attrs.match(/r="([A-Z]+)\d+"/) ?? [])[1];
      if (!column) continue;
      const type = (attrs.match(/t="([^"]+)"/) ?? [])[1];
      const inline = body.match(/<is>[\s\S]*?<t[^>]*>([\s\S]*?)<\/t>/);
      const value = body.match(/<v>([\s\S]*?)<\/v>/);
      let text = null;
      if (type === "s" && value) text = sharedStrings[Number(value[1])] ?? "";
      else if (inline) text = decodeXmlText(inline[1]);
      else if (value) text = decodeXmlText(value[1]);
      if (text !== null && text.trim() !== "") cells[column] = text.trim();
    }
    if (Object.keys(cells).length) rows.push(cells);
  }
  return rows;
}

function sheetFileByName(entries, workbookXml, relsXml, wanted) {
  const sheet = [...workbookXml.matchAll(/<sheet[^>]*\/>/g)]
    .map((m) => m[0])
    .find((tag) => decodeXmlText((tag.match(/name="([^"]*)"/) ?? [])[1] ?? "").toLowerCase() === wanted.toLowerCase());
  if (!sheet) return null;
  const rid = (sheet.match(/r:id="([^"]+)"/) ?? [])[1];
  const target = [...relsXml.matchAll(/<Relationship[^>]*\/>/g)]
    .map((m) => m[0])
    .find((tag) => (tag.match(/Id="([^"]+)"/) ?? [])[1] === rid);
  const file = (target?.match(/Target="([^"]+)"/) ?? [])[1];
  if (!file) return null;
  const buffer = entries.get(`xl/${file.replace(/^\/?xl\//, "")}`);
  return buffer ? buffer.toString("utf8") : null;
}

function splitChecks(cellText) {
  return String(cellText ?? "")
    .split(/\r?\n|(?=•)/)
    .map((line) => line.replace(/^[•\-*\u2022\s]+/, "").trim())
    .filter(Boolean);
}

/**
 * Parse the review checklist workbook into a stable shape:
 * `{ source, items: [{ id, category, checks[] }], statuses, severities, verdicts }`.
 */
export function loadChecklist(file = CHECKLIST_WORKBOOK) {
  if (!fs.existsSync(file)) {
    throw new Error(`Checklist workbook not found: ${file}`);
  }
  const entries = readZipEntries(fs.readFileSync(file));
  const workbookXml = entries.get("xl/workbook.xml")?.toString("utf8") ?? "";
  const relsXml = entries.get("xl/_rels/workbook.xml.rels")?.toString("utf8") ?? "";
  const sharedStrings = readSharedStrings(entries.get("xl/sharedStrings.xml")?.toString("utf8"));

  const checklistXml = sheetFileByName(entries, workbookXml, relsXml, "UI Review Checklist");
  if (!checklistXml) throw new Error('Worksheet "UI Review Checklist" not found in the workbook');
  const rows = readSheetRows(checklistXml, sharedStrings);

  const headerIndex = rows.findIndex((row) => /^id$/i.test(row.A ?? "") && /category/i.test(row.B ?? ""));
  if (headerIndex < 0) throw new Error('Header row with "ID" and "Category" not found');

  const items = rows
    .slice(headerIndex + 1)
    .filter((row) => row.A && row.B)
    .map((row) => ({
      id: row.A,
      category: row.B,
      checks: splitChecks(row.C),
      defaultStatus: row.D ?? "Not Reviewed",
      defaultSeverity: row.E ?? "None",
    }));

  const listsXml = sheetFileByName(entries, workbookXml, relsXml, "Lists");
  const lists = listsXml ? readSheetRows(listsXml, sharedStrings) : [];
  const column = (key) => lists.map((row) => row[key]).filter(Boolean);

  return {
    source: path.basename(file),
    sourcePath: file,
    title: rows[0]?.A ?? "UI Review Checklist",
    instructions: rows[1]?.A ?? "",
    columns: Object.entries(rows[headerIndex]).map(([, label]) => label),
    items,
    statuses: column("A").length ? column("A") : ["Not Reviewed", "PASS", "FAIL", "N/A", "Follow-up"],
    severities: column("B").length ? column("B") : ["None", "Low", "Medium", "High", "Blocking"],
    verdicts: column("C").length ? column("C") : ["PASS", "PASS WITH FOLLOW-UP", "WARNING", "FAIL"],
  };
}

export function checklistToMarkdown(checklist, functionKey) {
  const lines = [
    `# ${checklist.title}`,
    "",
    `Source workbook: \`${checklist.source}\``,
    functionKey ? `Function Key: \`${functionKey}\`` : "",
    "",
    checklist.instructions,
    "",
    `Allowed status values: ${checklist.statuses.join(" | ")}`,
    `Allowed severity values: ${checklist.severities.join(" | ")}`,
    `Allowed verdicts: ${checklist.verdicts.join(" | ")}`,
    "",
    `Total checklist items: ${checklist.items.length}`,
    "",
  ].filter((line) => line !== "");

  for (const item of checklist.items) {
    lines.push("", `## ${item.id}. ${item.category}`, "");
    for (const check of item.checks) lines.push(`- [ ] ${check}`);
  }
  return `${lines.join("\n")}\n`;
}
