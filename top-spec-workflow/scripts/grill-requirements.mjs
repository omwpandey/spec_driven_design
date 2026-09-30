#!/usr/bin/env node
/**
 * One developer agreement for a fetched DR. UI and API share this grill.
 *
 *   npm run feature:grill -- WCRM020104
 *   npm run feature:grill -- WCRM020104 --agree --by "Ada"
 *   npm run feature:grill -- WCRM020104 --reject --reason "Wrong page"
 */
import fs from "node:fs";
import path from "node:path";
import { workflowRoot } from "./lib/workspace.mjs";
import { featureDir, GRILL_JSON, GRILL_MD, renderGrillMarkdown, writeJson, readJson } from "./lib/requirement-ingest.mjs";

const SPLIT_FILES = ["ui-grill.json", "ui-grill.md", "api-grill.json", "api-grill.md"];

function parseArgs(argv) {
  const args = { functionKey: null, agree: false, reject: false, by: "", notes: "" };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--agree") args.agree = true;
    else if (a === "--reject") args.reject = true;
    else if (a === "--ui" || a === "--api") {
      console.log("[feature:grill] One grill covers the screen and the APIs. Ignoring " + a + ".");
    } else if (a === "--by") args.by = argv[++i] || "";
    else if (a === "--reason" || a === "--notes") args.notes = argv[++i] || "";
    else if (a.startsWith("-")) {
      console.error(`Unknown flag: ${a}`);
      process.exit(1);
    } else rest.push(a);
  }
  args.functionKey = rest[0];
  return args;
}

function removeSplitFiles(root) {
  for (const name of SPLIT_FILES) {
    const file = path.join(root, name);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.functionKey) {
    console.error('Usage: npm run feature:grill -- <FUNCTION_KEY> [--agree --by "<name>"] [--reject --reason "<text>"]');
    process.exit(1);
  }
  if (args.agree && args.reject) {
    console.error("Use only one of --agree or --reject.");
    process.exit(1);
  }
  const root = featureDir(workflowRoot, args.functionKey);
  const grillFile = path.join(root, GRILL_JSON);
  if (!fs.existsSync(grillFile)) {
    console.error(`[feature:grill] Missing ${grillFile}. Run npm run feature:fetch -- ${args.functionKey} first.`);
    process.exit(1);
  }
  const pack = readJson(grillFile);
  if (args.agree) {
    if (!args.by.trim()) {
      console.error('Agree requires --by "<developer name>".');
      process.exit(1);
    }
    pack.status = "agreed";
    pack.agreement = {
      by: args.by.trim(),
      at: new Date().toISOString(),
      notes: args.notes.trim() || null,
    };
  } else if (args.reject) {
    pack.status = "rejected";
    pack.agreement = {
      by: args.by.trim() || "developer",
      at: new Date().toISOString(),
      notes: args.notes.trim() || "Rejected. Re-fetch or correct identification before building.",
    };
  }

  fs.writeFileSync(path.join(root, GRILL_MD), renderGrillMarkdown(pack), "utf8");
  writeJson(grillFile, pack);
  removeSplitFiles(root);

  const identified = pack.identified || {};
  console.log(`[feature:grill] ${args.functionKey}  status=${pack.status}`);
  console.log(`  ${path.relative(workflowRoot, path.join(root, GRILL_MD))}`);
  if (pack.page?.url) console.log(`  ${pack.page.url}`);
  console.log(
    `  fields=${identified.fields?.length ?? 0}  actions=${identified.actions?.length ?? 0}  apis=${identified.apis?.length ?? 0}  validations=${identified.validations?.length ?? 0}`,
  );
  if (pack.status === "pending_review") {
    console.log(`  next: npm run feature:grill -- ${args.functionKey} --agree --by "<name>"`);
  }
  if (pack.status === "rejected") process.exit(2);
}

main();
