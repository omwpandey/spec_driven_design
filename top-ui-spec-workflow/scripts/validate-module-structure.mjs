import fs from "node:fs";
import path from "node:path";
import { appRoot } from "./lib/workspace.mjs";

const functionKey = process.argv[2];
if (!functionKey || functionKey.startsWith("--")) {
  console.error("Usage: npm run module:validate -- <FUNCTION_KEY>");
  process.exit(1);
}

const modulesRoot = path.join(appRoot, "src", "modules");
const directModuleDir = path.join(modulesRoot, functionKey);
const moduleDir = fs.existsSync(directModuleDir) ? directModuleDir : findModuleDir(modulesRoot, functionKey);
const errors = [];
const requireFile = (relativePath) => {
  if (!fs.existsSync(path.join(moduleDir, relativePath))) errors.push(`missing ${relativePath}`);
};

if (!moduleDir || !fs.existsSync(moduleDir)) {
  errors.push(`missing module directory src/modules/${functionKey}`);
} else {
  const pageFiles = fs.readdirSync(moduleDir).filter((file) => /^[A-Z][A-Za-z0-9]*Page\.tsx$/.test(file));
  if (!pageFiles.length) errors.push("missing PascalCase *Page.tsx");
  requireFile("index.ts");
  const testsDir = path.join(moduleDir, "__tests__");
  if (!fs.existsSync(testsDir) || !fs.statSync(testsDir).isDirectory()) errors.push("missing __tests__ directory");
  else if (!fs.readdirSync(testsDir).some((file) => /\.(test|spec)\.(ts|tsx)$/.test(file))) errors.push("__tests__ has no test file");

  for (const exportableFolder of ["components", "types"]) {
    const folder = path.join(moduleDir, exportableFolder);
    if (fs.existsSync(folder) && fs.statSync(folder).isDirectory() && !fs.existsSync(path.join(folder, "index.ts"))) {
      errors.push(`${exportableFolder}/ must contain index.ts barrel`);
    }
  }
}

if (errors.length) {
  console.error(`[module:validate] FAIL - ${functionKey}`);
  errors.forEach((error) => console.error(`  ${error}`));
  process.exit(2);
}

console.log(`[module:validate] PASS - ${functionKey}`);

function findModuleDir(root, name) {
  if (!fs.existsSync(root)) return null;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "node_modules") continue;
    const candidate = path.join(root, entry.name);
    if (entry.name === name || entry.name.startsWith(`${name}-`)) return candidate;
    const nested = findModuleDir(candidate, name);
    if (nested) return nested;
  }
  return null;
}