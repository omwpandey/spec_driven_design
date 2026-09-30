import fs from "node:fs";
import path from "node:path";
import { appRoot } from "./lib/workspace.mjs";

const cwd = appRoot;
const config = JSON.parse(fs.readFileSync(path.join(cwd, "ui-governance.config.json"), "utf8"));
const ext = new Set([".tsx", ".jsx"]);
const allow = new Set((config.allowFiles ?? []).map(normalize));
const forbiddenElements = config.forbiddenRawElements ?? ["button", "input", "select", "textarea"];
const forbiddenMui = new Set(config.forbiddenMuiControls ?? ["Button", "TextField", "Select", "Table", "IconButton", "Dialog"]);

function normalize(v) {
  return v.replaceAll("\\", "/").replace(/^\.\//, "");
}

function isTestFile(rel) {
  return /\.test\.|\.spec\.|\.stories\./i.test(rel) || rel.includes("/__tests__/");
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (["node_modules", "dist", "build"].includes(entry.name) || entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) out.push(...walk(full));
    else if (ext.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function importedMuiNames(source) {
  const names = new Set();
  const named = [
    ...source.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]@mui\/material(?:\/[^'"]+)?['"]/g),
  ];
  for (const match of named) {
    for (const part of match[1].split(",")) {
      const token = part.trim();
      if (!token || token.startsWith("//")) continue;
      const original = token.split(/\s+as\s+/)[0].trim();
      if (original) names.add(original);
    }
  }
  for (const match of source.matchAll(/import\s+([A-Za-z_][A-Za-z0-9_]*)\s+from\s*['"]@mui\/material\/([A-Za-z_][A-Za-z0-9_]*)['"]/g)) {
    names.add(match[2]);
  }
  return names;
}

const violations = [];

for (const root of config.enforcedRoots ?? []) {
  for (const file of walk(path.join(cwd, root))) {
    const rel = normalize(path.relative(cwd, file));
    if (allow.has(rel) || isTestFile(rel)) continue;
    const source = fs.readFileSync(file, "utf8");
    const lines = source.split(/\r?\n/);

    for (const el of forbiddenElements) {
      const re = new RegExp(`<${el}(?:\\s|>|/)`);
      lines.forEach((line, i) => {
        if (re.test(line)) violations.push({ file: rel, line: i + 1, kind: `<${el}>` });
      });
    }

    const muiNames = importedMuiNames(source);
    for (const name of muiNames) {
      if (!forbiddenMui.has(name)) continue;
      const lineNo = lines.findIndex((line) => line.includes(name) && /@mui\/material/.test(source)) + 1;
      const importLine = lines.findIndex((line) => line.includes(name) && (line.includes("import") || line.includes(name))) + 1;
      violations.push({
        file: rel,
        line: importLine || lineNo || 1,
        kind: `@mui/material ${name}`,
      });
    }
  }
}

if (!violations.length) {
  console.log("[ui-guard] PASS - no forbidden raw UI controls found.");
  console.log("  Layout primitives (Box, Grid, Stack, Typography) from MUI are allowed in pages.");
  console.log("  Prefer src/components wrappers over Button, TextField, Select, Table, IconButton, Dialog.");
  process.exit(0);
}

console.error("\n[ui-guard] FAIL - raw UI controls found in governed UI code.\n");
console.error("  Use src/components (Form*, ActionButtons, DataTable, ConfirmDialog, …).");
console.error("  MUI Box/Grid/Stack/Typography are allowed. Document exceptions in ui-governance.config.json allowFiles.\n");
violations.forEach((v) => console.error(`  ${v.file}:${v.line}  ${v.kind}`));
process.exit(2);
