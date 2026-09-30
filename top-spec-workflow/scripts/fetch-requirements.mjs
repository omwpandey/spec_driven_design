#!/usr/bin/env node
/**
 * Fetch a published Confluence DR by URL and/or Function Key.
 * Writes specs/<FunctionKey>/raw/ and a pending grill pack for developer agree.
 *
 *   npm run feature:fetch -- --url "https://tdem.atlassian.net/wiki/spaces/TC1/pages/<id>/..."
 *   npm run feature:fetch -- https://tdem.atlassian.net/wiki/spaces/TC1/pages/<id>/...
 *   npm run feature:fetch -- WCRM020104
 *   npm run feature:fetch -- WCRM020104 --url "https://..."
 */
import fs from "node:fs";
import path from "node:path";
import { workflowRoot } from "./lib/workspace.mjs";
import {
  XLSX_PREFIXES,
  IMAGE_EXTS,
  FUNCTION_KEY_SAFE_RE,
  featureDir,
  rawDir,
  loadConfluenceEnv,
  findDrPage,
  fetchPageDetail,
  pageWebUrl,
  extractFilenames,
  extractUxDesignFromStorage,
  pickXlsxByPrefix,
  listAttachments,
  safeFilename,
  storageToMarkdown,
  workbookToMarkdown,
  buildIdentification,
  renderGrillMarkdown,
  GRILL_JSON,
  GRILL_MD,
  writeJson,
  readJson,
  ensureDir,
  resetDirFiles,
  confluenceBytes,
  parsePageIdFromUrl,
  looksLikeConfluenceUrl,
  extractFunctionKey,
} from "./lib/requirement-ingest.mjs";

function parseArgs(argv) {
  const args = { functionKey: null, url: null, force: false };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--url") args.url = argv[++i];
    else if (a === "--force") args.force = true;
    else if (a === "--function-key") args.functionKey = argv[++i];
    else if (a.startsWith("-")) {
      console.error(`Unknown flag: ${a}`);
      process.exit(1);
    } else rest.push(a);
  }
  for (const token of rest) {
    if (looksLikeConfluenceUrl(token)) args.url = args.url || token;
    else args.functionKey = args.functionKey || token;
  }
  return args;
}

function usage() {
  console.error(
    [
      "Usage:",
      "  npm run feature:fetch -- --url <DR_URL>",
      "  npm run feature:fetch -- <DR_URL>",
      "  npm run feature:fetch -- <FUNCTION_KEY>",
      "  npm run feature:fetch -- <FUNCTION_KEY> --url <DR_URL>",
    ].join("\n"),
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.functionKey && !args.url) {
    usage();
    process.exit(1);
  }
  if (args.functionKey && !FUNCTION_KEY_SAFE_RE.test(args.functionKey)) {
    console.error("Function key contains unsupported characters.");
    process.exit(1);
  }

  const cwd = workflowRoot;
  const env = loadConfluenceEnv(cwd);

  let listed;
  if (args.url) {
    const id = parsePageIdFromUrl(args.url);
    if (!id) {
      throw new Error("Could not resolve a Confluence page id. Pass --url with /pages/<id>.");
    }
    listed = { id };
  } else {
    listed = await findDrPage(env, args.functionKey);
  }
  if (!listed?.id) {
    throw new Error("Could not resolve a Confluence page id. Pass --url with /pages/<id>.");
  }

  const page = await fetchPageDetail(env, listed.id);
  const url = pageWebUrl(env, page);
  const storage = page.body?.storage?.value || "";
  const markdown = storageToMarkdown(storage);
  const title = page.title || args.functionKey || listed.id;
  const derivedKey = extractFunctionKey({
    title,
    url: args.url || url,
    markdown,
  });
  const key = args.functionKey || derivedKey;
  if (!key) {
    throw new Error(
      "Could not derive a Function Key from the page title or URL. Pass --function-key <KEY>.",
    );
  }
  if (args.functionKey && derivedKey && args.functionKey !== derivedKey) {
    console.log(`[feature:fetch] note: page suggests ${derivedKey}; using provided ${args.functionKey}`);
  }

  const root = featureDir(cwd, key);
  const raw = rawDir(cwd, key);
  ensureDir(path.join(raw, "images"));
  ensureDir(path.join(raw, "xlsx"));
  ensureDir(path.join(raw, "sheets"));

  const previous = readPreviousGrill(path.join(root, GRILL_JSON), args.force);

  writeJson(path.join(raw, "meta.json"), {
    functionKey: key,
    source_url: url,
    id: page.id,
    title,
    space_key: page.space?.key ?? env.spaceKey,
    version: page.version?.number ?? null,
    when: page.version?.when ?? null,
    envFile: env.envFile,
    parentId: env.parentId,
  });
  fs.writeFileSync(path.join(raw, "page.md"), `# ${title}\n\n${markdown}`, "utf8");

  const ux = extractUxDesignFromStorage(storage);
  if (ux.found) {
    fs.writeFileSync(path.join(raw, "ux-design.md"), `# UX Design\n\n${storageToMarkdown(ux.html)}`, "utf8");
  } else if (fs.existsSync(path.join(raw, "ux-design.md"))) {
    fs.unlinkSync(path.join(raw, "ux-design.md"));
  }

  const visibleImages = ux.screens.map((s) => s.image);
  const bodyFiles = extractFilenames(storage, false);
  const attachments = await listAttachments(env, page.id);
  const byTitle = new Map(attachments.map((a) => [a.title, a]));

  const imageNames = [];
  const missing = [];
  if (!ux.found) missing.push("UX Design section");
  else if (!ux.screens.length) missing.push("UX Design screen image");

  for (const name of visibleImages) {
    const att = byTitle.get(name);
    const download = att?._links?.download;
    const bytes = download ? await confluenceBytes(env, download) : null;
    if (!bytes) {
      missing.push(name);
      continue;
    }
    const safe = safeFilename(name);
    fs.writeFileSync(path.join(raw, "images", safe), bytes);
    imageNames.push(safe);
  }
  resetDirFiles(path.join(raw, "images"), [...imageNames, "manifest.json"]);
  writeJson(path.join(raw, "images", "manifest.json"), {
    page_id: page.id,
    images: imageNames,
    screens: ux.screens,
    skipped_not_ux_design: ux.skippedOutside,
    skipped_not_on_page: attachments
      .map((a) => a.title)
      .filter((n) => n && !visibleImages.includes(n) && IMAGE_EXTS.has(path.posix.extname(n).toLowerCase())),
    missing_from_attachments: missing.filter((n) => IMAGE_EXTS.has(path.posix.extname(n).toLowerCase())),
  });

  const xlsxCandidates = bodyFiles.filter((n) => XLSX_PREFIXES.some((p) => n.toLowerCase().startsWith(p.toLowerCase())));
  const fallback = attachments
    .map((a) => a.title)
    .filter((n) => n && XLSX_PREFIXES.some((p) => n.toLowerCase().startsWith(p.toLowerCase())));
  const picked = pickXlsxByPrefix(xlsxCandidates.length ? xlsxCandidates : fallback);
  const xlsxSaved = {};
  const sheetIndex = [];
  for (const prefix of XLSX_PREFIXES) {
    const name = picked[prefix];
    if (!name) {
      missing.push(`${prefix}*`);
      continue;
    }
    const att = byTitle.get(name);
    const bytes = att?._links?.download ? await confluenceBytes(env, att._links.download) : null;
    if (!bytes) {
      missing.push(name);
      continue;
    }
    const safe = safeFilename(name);
    const filePath = path.join(raw, "xlsx", safe);
    fs.writeFileSync(filePath, bytes);
    xlsxSaved[prefix] = safe;
    try {
      const converted = await workbookToMarkdown(filePath);
      const sheetFile = path.join(raw, "sheets", `${prefix.replace(/_$/, "")}.md`);
      fs.writeFileSync(sheetFile, converted.markdown, "utf8");
      for (const sheet of converted.sheets) {
        sheetIndex.push({ workbook: safe, name: sheet.name, rows: sheet.rows });
      }
    } catch (err) {
      missing.push(`${name} (sheet convert failed: ${err.message})`);
    }
  }
  resetDirFiles(path.join(raw, "xlsx"), Object.values(xlsxSaved));

  const identification = buildIdentification({
    functionKey: key,
    page,
    url,
    markdown,
    images: imageNames,
    xlsx: xlsxSaved,
    sheetIndex,
    missing,
    screens: ux.screens,
  });

  applyPreviousAgreement(identification, previous);
  fs.writeFileSync(path.join(root, GRILL_MD), renderGrillMarkdown(identification), "utf8");
  writeJson(path.join(root, GRILL_JSON), identification);
  for (const name of ["ui-grill.json", "ui-grill.md", "api-grill.json", "api-grill.md"]) {
    const stale = path.join(root, name);
    if (fs.existsSync(stale)) fs.unlinkSync(stale);
  }

  if (!fs.existsSync(path.join(root, "sources.md"))) {
    fs.writeFileSync(
      path.join(root, "sources.md"),
      `# ${key} Sources\n\nFetched from published DR. Fill after grill is agreed.\n`,
      "utf8"
    );
  }

  writeJson(path.join(raw, "manifest.json"), {
    functionKey: key,
    url,
    title,
    images: imageNames,
    screens: ux.screens,
    skipped_not_ux_design: ux.skippedOutside,
    xlsx: xlsxSaved,
    grill: identification.status,
  });

  console.log(`[feature:fetch] ${key}`);
  console.log(`  page: ${title}`);
  console.log(`  url: ${url}`);
  if (!ux.found) {
    console.log("  UX Design: not found — no screen images fetched");
  } else if (ux.screens.length === 1) {
    console.log(`  UX Design: 1 screen (single task) ${ux.screens[0].image}`);
  } else if (ux.screens.length > 1) {
    console.log(`  UX Design: ${ux.screens.length} screens — split into tasks ${ux.screens.map((s) => s.id).join(", ")}`);
  } else {
    console.log("  UX Design: section present but no screen image");
  }
  if (ux.skippedOutside.length) {
    console.log(`  skipped images outside UX Design: ${ux.skippedOutside.length}`);
  }
  console.log(`  images fetched: ${imageNames.length}`);
  console.log(`  xlsx: ${Object.values(xlsxSaved).join(", ") || "(none)"}`);
  console.log(`  grill: ${identification.status} -> ${path.relative(cwd, path.join(root, GRILL_MD))}`);
  console.log(`  validations: ${identification.identified.validations.length}`);
  if (identification.status !== "agreed") {
    console.log(`  next: npm run feature:grill -- ${key} --agree --by "<name>"`);
  }
}

function readPreviousGrill(file, force) {
  if (force || !fs.existsSync(file)) return null;
  try {
    return readJson(file);
  } catch {
    return null;
  }
}

function applyPreviousAgreement(pack, previous) {
  if (previous?.status === "agreed" && previous.page?.version === pack.page.version) {
    pack.status = "agreed";
    pack.agreement = previous.agreement ?? null;
  }
}

main().catch((err) => {
  console.error(`[feature:fetch] ${err.message}`);
  process.exit(1);
});
