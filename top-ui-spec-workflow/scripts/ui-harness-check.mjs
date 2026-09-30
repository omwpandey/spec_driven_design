#!/usr/bin/env node
/**
 * Machine gate for spec-driven UI work.
 * Usage:
 *   npm run ui:harness --            # ui:guard only
 *   npm run ui:harness -- WCRM020104 # ui:guard + feature + component-map validate
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { specRoot } from "./lib/workspace.mjs";

const cwd = process.cwd();
const storyId = process.argv[2];
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

function run(label, args) {
  console.log(`\n[ui:harness] ${label}`);
  const result = spawnSync(npmCmd, args, {
    cwd,
    encoding: "utf8",
    shell: process.platform === "win32",
    stdio: "inherit",
  });
  if (result.error) {
    console.error(`[ui:harness] ${label} could not start: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`[ui:harness] ${label} failed with exit code ${result.status ?? 1}`);
    process.exit(result.status ?? 1);
  }
}

if (!fs.existsSync(cwd)) {
  console.error(`[ui:harness] Workflow root does not exist: ${cwd}`);
  process.exit(1);
}

if (!fs.existsSync(process.env.TOP_UI_APP_ROOT ?? "")) {
  console.error(`[ui:harness] TOP_UI_APP_ROOT does not exist: ${process.env.TOP_UI_APP_ROOT ?? "<unset>"}`);
  process.exit(1);
}

run("ui:guard", ["run", "ui:guard"]);

if (storyId) {
  const root = path.join(specRoot, storyId);
  if (!fs.existsSync(root)) {
    console.error(`[ui:harness] Missing feature folder: ${root}`);
    process.exit(1);
  }
  const contract = path.join(root, "ui-contract.json");
  const map = path.join(root, "component-map.json");
  if (fs.existsSync(contract)) run(`feature:validate ${storyId}`, ["run", "feature:validate", "--", storyId]);
  if (fs.existsSync(map)) {
    run(`component-map:validate ${storyId}`, ["run", "component-map:validate", "--", storyId]);
  }
}

console.log("\n[ui:harness] PASS");
