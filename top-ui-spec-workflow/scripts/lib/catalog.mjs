import fs from "node:fs";
import path from "node:path";
import { appRoot } from "./workspace.mjs";

export function normalizePath(v) {
  return String(v ?? "")
    .replaceAll("\\", "/")
    .replace(/^\.\//, "");
}

export function loadCatalog(cwd = appRoot) {
  const configPath = path.join(cwd, "ui-governance.config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const catalogFile = path.join(cwd, config.catalogFile ?? "src/components/COMPONENT_CATALOG.md");
  const byName = new Map();
  if (!fs.existsSync(catalogFile)) return { config, byName, catalogFile };
  for (const line of fs.readFileSync(catalogFile, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\| `([^`]+)` \| `([^`]+)` \|/);
    if (!match) continue;
    const name = match[1];
    const file = normalizePath(match[2]);
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push(file);
  }
  return { config, byName, catalogFile };
}

export function fileExists(cwd, rel) {
  return fs.existsSync(path.join(cwd, rel));
}
