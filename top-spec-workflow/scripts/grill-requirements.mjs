#!/usr/bin/env node
/**
 * Developer review gate for a fetched DR.
 *
 *   npm run feature:grill -- WCRM020104
 *   npm run feature:grill -- WCRM020104 --agree --by "Ada"
 *   npm run feature:grill -- WCRM020104 --reject --reason "Wrong page"
 */
import fs from "node:fs";
import path from "node:path";
import { workflowRoot } from "./lib/workspace.mjs";
import {
  featureDir,
  rawDir,
  buildIdentification,
  extractUxDesignFromMarkdown,
  renderGrillMarkdown,
  writeJson,
  readJson,
} from "./lib/requirement-ingest.mjs";

function parseArgs(argv) {
  const args = { functionKey: null, agree: false, reject: false, by: "", reason: "", notes: "" };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--agree") args.agree = true;
    else if (a === "--reject") args.reject = true;
    else if (a === "--by") args.by = argv[++i] || "";
    else if (a === "--reason" || a === "--notes") args.notes = argv[++i] || "";
    else if (a.startsWith("-")) {
      console.error(`Unknown flag: ${a}`);
      process.exit(1);
    } else rest.push(a);
  }
  args.functionKey = rest[0];
  return args;
}

function rebuildIfPossible(cwd, functionKey, existing) {
  const raw = rawDir(cwd, functionKey);
  const pageFile = path.join(raw, "page.md");
  const metaFile = path.join(raw, "meta.json");
  if (!fs.existsSync(pageFile) || !fs.existsSync(metaFile)) return existing;
  const meta = readJson(metaFile);
  const markdown = fs.readFileSync(pageFile, "utf8").replace(/^# .*\n+/, "");
  const images = fs.existsSync(path.join(raw, "images", "manifest.json"))
    ? readJson(path.join(raw, "images", "manifest.json")).images || []
    : [];
  const xlsx = (fs.existsSync(path.join(raw, "manifest.json")) && readJson(path.join(raw, "manifest.json")).xlsx) || {};
  return buildIdentification({
    functionKey,
    page: {
      id: meta.id,
      title: meta.title,
      version: { number: meta.version, when: meta.when },
      space: { key: meta.space_key },
    },
    url: meta.source_url,
    markdown,
    images,
    xlsx,
    sheetIndex: existing?.identified ? null : [],
    missing: existing?.identified?.missing || [],
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.functionKey) {
    console.error("Usage: npm run feature:grill -- <FUNCTION_KEY> [--agree --by <name>] [--reject --reason <text>]");
    process.exit(1);
  }
  const cwd = workflowRoot;
  const root = featureDir(cwd, args.functionKey);
  const grillFile = path.join(root, "grill.json");
  if (!fs.existsSync(grillFile)) {
    console.error(`[feature:grill] Missing ${grillFile}. Run npm run feature:fetch -- ${args.functionKey} first.`);
    process.exit(1);
  }

  let pack = readJson(grillFile);
  if (args.agree && args.reject) {
    console.error("Use only one of --agree or --reject.");
    process.exit(1);
  }
  if (args.agree) {
    if (!args.by.trim()) {
      console.error("Agree requires --by \"<developer name>\".");
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

  if (!pack.identified && pack.functionKey) {
    pack = { ...rebuildIfPossible(cwd, args.functionKey, pack), ...pack };
  }

  const pageMd = path.join(rawDir(cwd, args.functionKey), "page.md");
  if (pack.identified && fs.existsSync(pageMd) && !pack.identified.screens?.length) {
    const ux = extractUxDesignFromMarkdown(fs.readFileSync(pageMd, "utf8"));
    pack.identified.screens = ux.screens;
    if (ux.screens.length) pack.identified.images = ux.screens.map((s) => s.image);
    const missing = new Set(pack.identified.missing || []);
    if (!ux.found) missing.add("UX Design section");
    else if (!ux.screens.length) missing.add("UX Design screen image");
    pack.identified.missing = [...missing];
  }

  fs.writeFileSync(path.join(root, "grill.md"), renderGrillMarkdown(pack), "utf8");
  writeJson(grillFile, pack);

  console.log(`[feature:grill] ${args.functionKey}  status=${pack.status}`);
  console.log(`  ${path.relative(cwd, path.join(root, "grill.md"))}`);
  if (pack.page?.url) console.log(`  ${pack.page.url}`);
  console.log(`  fields=${pack.identified?.fields?.length ?? 0}  actions=${pack.identified?.actions?.length ?? 0}  modes=${pack.identified?.modes?.length ?? 0}`);
  if (pack.status === "pending_review") {
    console.log(`  next: npm run feature:grill -- ${args.functionKey} --agree --by "<name>"`);
  }
  if (pack.status === "rejected") process.exit(2);
}

main();
