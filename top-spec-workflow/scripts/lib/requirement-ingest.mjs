import fs from "node:fs";
import path from "node:path";
import { specRoot } from "./workspace.mjs";

export const DEFAULT_PARENT_ID = "1673134837";
/** Toyota Function Key, e.g. WCRM010203 */
export const FUNCTION_KEY_TOYOTA_RE = /\b([A-Z]{2,8}\d{6,10})\b/i;
export const FUNCTION_KEY_SAFE_RE = /^[A-Za-z][A-Za-z0-9._-]{2,31}$/;
export const DEFAULT_SPACE_KEY = "TC1";
export const XLSX_PREFIXES = ["Item_Desc_", "API_Data_Map_Details_", "DATA_MAP_"];
export const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"]);

const AC_IMAGE_RE = /<ac:image\b[^>]*>.*?<\/ac:image>/gi;
const RI_FILENAME_RE = /ri:filename="([^"]+)"/gi;
const UNSAFE_FILENAME_RE = /[<>:"/\\|?*]/g;

export function featureDir(cwd, functionKey) {
  return path.join(specRoot, functionKey);
}

export function rawDir(cwd, functionKey) {
  return path.join(featureDir(cwd, functionKey), "raw");
}

export function loadDotEnvFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] == null || process.env[key] === "") process.env[key] = value;
  }
}

export function resolveEnvFiles(cwd) {
  const candidates = [
    process.env.CONFLUENCE_ENV_FILE,
    path.join(cwd, ".env"),
    path.resolve(cwd, "..", "..", "crm_dr_gen", "dr_creation_agent", ".env"),
    path.resolve(cwd, "..", "crm_dr_gen", "dr_creation_agent", ".env"),
    "D:\\toyota_crm\\crm_dr_gen\\dr_creation_agent\\.env",
  ].filter(Boolean);
  const seen = new Set();
  const files = [];
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    const n = path.normalize(p);
    if (seen.has(n)) continue;
    seen.add(n);
    files.push(p);
  }
  return files;
}

export function loadConfluenceEnv(cwd) {
  const files = resolveEnvFiles(cwd);
  for (const envFile of files) loadDotEnvFile(envFile);
  const envFile = files[0] ?? null;
  const base = (process.env.CONFLUENCE_BASE_URL || "").trim().replace(/\/+$/, "");
  const email = (process.env.CONFLUENCE_EMAIL || "").trim();
  const token = (process.env.CONFLUENCE_API_TOKEN || "").trim();
  const missing = [
    !base && "CONFLUENCE_BASE_URL",
    !email && "CONFLUENCE_EMAIL",
    !token && "CONFLUENCE_API_TOKEN",
  ].filter(Boolean);
  if (missing.length) {
    throw new Error(
      `Missing ${missing.join(", ")}. Set CONFLUENCE_ENV_FILE to the DR agent .env or copy those keys.`
    );
  }
  return {
    base,
    email,
    token,
    envFile,
    spaceKey: (process.env.CONFLUENCE_SPACE_KEY || DEFAULT_SPACE_KEY).trim(),
    parentId: (process.env.CONFLUENCE_DR_PARENT_ID || DEFAULT_PARENT_ID).trim(),
    timeoutMs: Number(process.env.CONFLUENCE_TIMEOUT_SECONDS || "30") * 1000,
  };
}

export function confluenceHeaders(email, token) {
  const basic = Buffer.from(`${email}:${token}`).toString("base64");
  return {
    Accept: "application/json",
    Authorization: `Basic ${basic}`,
  };
}

export async function confluenceGet(env, apiPath, params) {
  const url = new URL(env.base + apiPath);
  if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const response = await fetch(url, {
    headers: confluenceHeaders(env.email, env.token),
    signal: AbortSignal.timeout(env.timeoutMs),
  });
  if (response.status === 401) throw new Error("Confluence auth failed (401). Check email/API token.");
  if (response.status === 403) throw new Error("Confluence access denied (403). Check page permissions.");
  if (response.status === 404) throw new Error(`Confluence not found (404): ${apiPath}`);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Confluence ${response.status} ${apiPath}: ${body.slice(0, 400)}`);
  }
  return response;
}

export async function confluenceJson(env, apiPath, params) {
  return (await confluenceGet(env, apiPath, params)).json();
}

export function attachmentDownloadUrl(env, downloadPath) {
  if (!downloadPath) return null;
  if (downloadPath.startsWith("http")) return downloadPath;
  if (downloadPath.startsWith("/download")) return env.base + downloadPath;
  if (downloadPath.startsWith("/wiki")) return env.base.replace(/\/wiki$/, "") + downloadPath;
  return env.base + (downloadPath.startsWith("/") ? downloadPath : `/${downloadPath}`);
}

export async function confluenceBytes(env, downloadPath) {
  const url = attachmentDownloadUrl(env, downloadPath);
  if (!url) return null;
  const response = await fetch(url, {
    headers: confluenceHeaders(env.email, env.token),
    signal: AbortSignal.timeout(env.timeoutMs),
  });
  if (!response.ok) return null;
  return Buffer.from(await response.arrayBuffer());
}

export function pageWebUrl(env, page) {
  const webui = page?._links?.webui || "";
  if (webui.startsWith("http")) return webui;
  if (page?._links?.base && webui) return String(page._links.base).replace(/\/+$/, "") + webui;
  if (webui) return env.base.replace(/\/wiki$/, "") + (webui.startsWith("/wiki") ? webui : `/wiki${webui}`);
  const id = page?.id;
  const space = page?.space?.key || env.spaceKey;
  return `${env.base}/spaces/${space}/pages/${id}`;
}

export function parsePageIdFromUrl(url) {
  const m = String(url || "").match(/\/pages\/(\d+)/);
  return m ? m[1] : null;
}

export function looksLikeConfluenceUrl(value) {
  const s = String(value || "").trim();
  return /^https?:\/\//i.test(s) || /\/pages\/\d+/.test(s);
}

/**
 * Resolve a Function Key from an explicit arg, page title `[WCRM010203] …`, URL slug, or body.
 */
export function extractFunctionKey({ explicit, title, url, markdown } = {}) {
  const given = String(explicit || "").trim();
  if (given && FUNCTION_KEY_SAFE_RE.test(given) && !looksLikeConfluenceUrl(given)) {
    return given;
  }

  const titleText = String(title || "");
  const titleBracket = titleText.match(/\[([A-Za-z][A-Za-z0-9._-]{2,31})\]/);
  if (titleBracket) return titleBracket[1];
  const titleToyota = titleText.match(FUNCTION_KEY_TOYOTA_RE);
  if (titleToyota) return titleToyota[1].toUpperCase();

  const rawUrl = String(url || "");
  let decodedUrl = rawUrl;
  try {
    decodedUrl = decodeURIComponent(rawUrl.replace(/\+/g, " "));
  } catch {
    decodedUrl = rawUrl.replace(/\+/g, " ");
  }
  const slug = decodedUrl.split("/").filter(Boolean).pop() || "";
  const slugToyota = slug.match(FUNCTION_KEY_TOYOTA_RE) || decodedUrl.match(FUNCTION_KEY_TOYOTA_RE);
  if (slugToyota) return slugToyota[1].toUpperCase();
  const slugStart = slug.match(/^([A-Za-z][A-Za-z0-9._-]{2,31})(?:\b|[+\-_ ]|$)/);
  if (slugStart && FUNCTION_KEY_SAFE_RE.test(slugStart[1]) && !/^\d+$/.test(slugStart[1])) {
    return slugStart[1];
  }

  const md = String(markdown || "");
  const mdBracket = md.match(/\[([A-Za-z][A-Za-z0-9._-]{2,31})\]/);
  if (mdBracket) return mdBracket[1];
  const mdToyota = md.match(FUNCTION_KEY_TOYOTA_RE);
  if (mdToyota) return mdToyota[1].toUpperCase();

  return null;
}

export function scorePage(page, functionKey, parentId) {
  const title = String(page.title || "");
  const key = functionKey.trim();
  let score = 0;
  if (title.includes(`[${key}]`)) score += 10;
  if (new RegExp(`\\b${key}\\b`, "i").test(title)) score += 4;
  const ancestors = page.ancestors || [];
  if (parentId && ancestors.some((a) => String(a.id) === String(parentId))) score += 3;
  score += Number(page.version?.number || 0) / 1000;
  return score;
}

export async function findDrPage(env, functionKey) {
  const key = functionKey.trim();
  const results = [];
  const cql = `type=page AND title~"${key}"`;
  try {
    const payload = await confluenceJson(env, "/rest/api/content/search", {
      cql,
      limit: 25,
      expand: "space,version,ancestors",
    });
    results.push(...(payload.results || []));
  } catch {
    /* CQL can fail on some tenants; fall back to parent children */
  }

  if (env.parentId) {
    let start = 0;
    while (start < 200) {
      const payload = await confluenceJson(env, `/rest/api/content/${env.parentId}/child/page`, {
        limit: 50,
        start,
        expand: "space,version,ancestors",
      });
      const batch = payload.results || [];
      for (const page of batch) {
        if (String(page.title || "").includes(key) && !results.some((r) => r.id === page.id)) {
          results.push(page);
        }
      }
      if (batch.length < 50) break;
      start += batch.length;
    }
  }

  const ranked = results
    .map((page) => ({ page, score: scorePage(page, key, env.parentId) }))
    .filter((x) => x.score >= 4)
    .sort((a, b) => b.score - a.score);

  if (!ranked.length) {
    throw new Error(
      `No Confluence DR page found for function key ${key}. Pass --url with /pages/<id>.`
    );
  }
  return ranked[0].page;
}

export async function fetchPageDetail(env, pageId) {
  return confluenceJson(env, `/rest/api/content/${pageId}`, {
    expand: "body.storage,version,space,ancestors,metadata.labels",
  });
}

export function extractFilenames(storageHtml, imageOnly) {
  const found = [];
  const seen = new Set();
  const source = imageOnly ? storageHtml.match(AC_IMAGE_RE) || [] : [storageHtml];
  for (const block of source) {
    RI_FILENAME_RE.lastIndex = 0;
    let match;
    while ((match = RI_FILENAME_RE.exec(block))) {
      const name = decodeHtml(match[1]).trim();
      if (!name || seen.has(name)) continue;
      const ext = path.posix.extname(name).toLowerCase();
      if (imageOnly && !IMAGE_EXTS.has(ext)) continue;
      seen.add(name);
      found.push(name);
    }
  }
  return found;
}

const UX_DESIGN_HEADING_RE = /ux[\s-]*design/i;
const UX_SUPPORTING_HEADING_RE = /^link\s*:/i;

function storageHeadingText(innerHtml) {
  return normalizeHeading(
    stripTags(
      String(innerHtml || "").replace(/<\/?ac:inline-comment-marker\b[^>]*>/gi, ""),
    ),
  );
}

function titleFromImageName(name) {
  return path
    .posix.basename(String(name || ""), path.posix.extname(name))
    .replace(/[_+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pushUxScreen(screens, seen, filename, heading) {
  const name = decodeHtml(filename).trim();
  if (!name || seen.has(name)) return;
  const ext = path.posix.extname(name).toLowerCase();
  if (!IMAGE_EXTS.has(ext)) return;
  seen.add(name);
  const title =
    heading && !UX_DESIGN_HEADING_RE.test(heading) ? heading : titleFromImageName(name) || "Screen UX";
  screens.push({
    id: `UX-${String(screens.length + 1).padStart(3, "0")}`,
    title,
    image: name,
    source: "dr-page:UX Design",
  });
}

/**
 * Screens to build are only mockups under the DR **UX Design** heading.
 * Images in other sections are ignored and must not be fetched.
 */
export function extractUxDesignFromStorage(storageHtml) {
  const html = String(storageHtml || "");
  const headingRe = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let uxStart = -1;
  let uxLevel = 9;
  let uxInnerStart = -1;
  let match;
  while ((match = headingRe.exec(html))) {
    const title = storageHeadingText(match[2]);
    const level = Number(match[1]);
    if (uxStart < 0 && UX_DESIGN_HEADING_RE.test(title)) {
      uxStart = match.index;
      uxLevel = level;
      uxInnerStart = match.index + match[0].length;
      continue;
    }
    if (uxStart >= 0 && level <= uxLevel) {
      if (UX_SUPPORTING_HEADING_RE.test(title)) continue;
      return finishUxStorage(html, uxStart, uxInnerStart, match.index);
    }
  }
  if (uxStart >= 0) return finishUxStorage(html, uxStart, uxInnerStart, html.length);
  return {
    found: false,
    html: "",
    screens: [],
    skippedOutside: extractFilenames(html, true),
  };
}

function finishUxStorage(html, uxStart, uxInnerStart, uxEnd) {
  const innerHtml = html.slice(uxInnerStart, uxEnd);
  const screens = [];
  const seen = new Set();
  let lastTitle = "Screen UX";
  const tokenRe = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>|<ac:image\b[^>]*>[\s\S]*?<\/ac:image>/gi;
  let token;
  while ((token = tokenRe.exec(innerHtml))) {
    if (token[2] != null && token[0].toLowerCase().startsWith("<h")) {
      const title = storageHeadingText(token[2]);
      if (!UX_SUPPORTING_HEADING_RE.test(title)) lastTitle = title || lastTitle;
      continue;
    }
    RI_FILENAME_RE.lastIndex = 0;
    const fileMatch = RI_FILENAME_RE.exec(token[0]);
    if (fileMatch) pushUxScreen(screens, seen, fileMatch[1], lastTitle);
  }
  const uxNames = new Set(screens.map((s) => s.image));
  return {
    found: true,
    html: innerHtml,
    screens,
    skippedOutside: extractFilenames(html, true).filter((n) => !uxNames.has(n)),
  };
}

export function extractUxDesignFromMarkdown(markdown) {
  const lines = String(markdown || "").split(/\r?\n/);
  const buf = [];
  const screens = [];
  const seen = new Set();
  let capturing = false;
  let sawUx = false;
  let startLevel = 99;
  let lastTitle = "Screen UX";
  for (const line of lines) {
    const h = line.match(/^(#{1,6})\s+(.*)/);
    if (h) {
      const level = h[1].length;
      const title = normalizeHeading(h[2]);
      if (!capturing && UX_DESIGN_HEADING_RE.test(title)) {
        capturing = true;
        sawUx = true;
        startLevel = level;
        lastTitle = "Screen UX";
        continue;
      }
      if (capturing && level <= startLevel) break;
      if (capturing) lastTitle = title || lastTitle;
      continue;
    }
    if (!capturing) continue;
    buf.push(line);
    const img = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (!img) continue;
    const name = path.posix.basename(img[2].trim().replace(/^images\//, ""));
    pushUxScreen(screens, seen, name, lastTitle);
  }
  return { found: sawUx, markdown: buf.join("\n").trim(), screens };
}

export function pickXlsxByPrefix(candidates) {
  const picked = {};
  for (const prefix of XLSX_PREFIXES) {
    const match = candidates.find((name) => name.toLowerCase().startsWith(prefix.toLowerCase()));
    if (match) picked[prefix] = match;
  }
  return picked;
}

export async function listAttachments(env, pageId) {
  const all = [];
  let start = 0;
  while (true) {
    const payload = await confluenceJson(env, `/rest/api/content/${pageId}/child/attachment`, {
      limit: 50,
      start,
      expand: "version",
    });
    const batch = payload.results || [];
    all.push(...batch);
    if (batch.length < 50) break;
    start += batch.length;
  }
  return all;
}

export function safeFilename(name) {
  return name.replace(UNSAFE_FILENAME_RE, "_");
}

export function decodeHtml(value) {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function storageToMarkdown(html) {
  let s = html || "";
  s = s.replace(AC_IMAGE_RE, (block) => {
    const m = /ri:filename="([^"]+)"/i.exec(block);
    if (!m) return "";
    const name = decodeHtml(m[1]);
    return `\n\n![${name}](images/${safeFilename(name)})\n\n`;
  });
  s = s.replace(/<ac:link[^>]*>[\s\S]*?ri:filename="([^"]+)"[\s\S]*?<\/ac:link>/gi, (_, n) => `\`${decodeHtml(n)}\``);
  s = s.replace(/<ac:[^>]+\/?>/g, "");
  s = s.replace(/<\/ac:[^>]+>/g, "");
  s = s.replace(/<ri:[^>]+\/?>/g, "");
  s = tablesToMarkdown(s);
  s = s.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => `\n\n${"#".repeat(Number(level))} ${stripTags(inner).trim()}\n\n`);
  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, inner) => `- ${stripTags(inner).trim()}\n`);
  s = s.replace(/<\/(p|div|br|tr)>/gi, "\n");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<[^>]+>/g, "");
  s = decodeHtml(s);
  s = s.replace(/\n{3,}/g, "\n\n").trim();
  return s + "\n";
}

function tablesToMarkdown(html) {
  return html.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, body) => {
    const rows = [];
    for (const rowHtml of body.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || []) {
      const cells = [...rowHtml.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((m) =>
        stripTags(m[1]).replace(/\s+/g, " ").replace(/\|/g, "\\|").trim()
      );
      if (cells.length) rows.push(cells);
    }
    if (!rows.length) return "\n";
    const width = Math.max(...rows.map((r) => r.length));
    const norm = rows.map((r) => [...r, ...Array(width - r.length).fill("")]);
    const lines = [
      "",
      `| ${norm[0].join(" | ")} |`,
      `| ${norm[0].map(() => "---").join(" | ")} |`,
      ...norm.slice(1).map((r) => `| ${r.join(" | ")} |`),
      "",
    ];
    return lines.join("\n");
  });
}

function stripTags(html) {
  return decodeHtml(String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")).trim();
}

export async function workbookToMarkdown(filePath) {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const parts = [`# ${path.basename(filePath)}`, ""];
  const sheets = [];
  wb.eachSheet((sheet) => {
    const rows = [];
    sheet.eachRow({ includeEmpty: false }, (row) => {
      const values = row.values
        .slice(1)
        .map((cell) => String(cell ?? "").replace(/\r?\n/g, " ").replace(/\|/g, "\\|").trim());
      if (values.some((v) => v)) rows.push(values);
    });
    sheets.push({ name: sheet.name, rows });
    parts.push(`## ${sheet.name}`, "");
    if (!rows.length) {
      parts.push("_Empty sheet._", "");
      return;
    }
    const width = Math.max(...rows.map((r) => r.length));
    const norm = rows.map((r) => [...r, ...Array(width - r.length).fill("")]);
    parts.push(`| ${norm[0].join(" | ")} |`);
    parts.push(`| ${norm[0].map(() => "---").join(" | ")} |`);
    for (const r of norm.slice(1)) parts.push(`| ${r.join(" | ")} |`);
    parts.push("");
  });
  return { markdown: parts.join("\n"), sheets };
}

export function parseMarkdownTables(md) {
  const lines = (md || "").split(/\r?\n/);
  const tables = [];
  let heading = "";
  for (let i = 0; i < lines.length; i += 1) {
    const h = lines[i].match(/^#{1,6}\s+(.*)/);
    if (h) heading = normalizeHeading(h[1]);
    if (/^\s*\|/.test(lines[i]) && i + 1 < lines.length && /^\s*\|[\s|:-]+$/.test(lines[i + 1])) {
      const header = splitMdRow(lines[i]);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i]) && !/^\s*\|[\s|:-]+$/.test(lines[i])) {
        rows.push(splitMdRow(lines[i]));
        i += 1;
      }
      i -= 1;
      tables.push({ heading, header, rows });
    }
  }
  return tables;
}

function splitMdRow(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
}

export function normalizeHeading(title) {
  return String(title || "")
    .replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\uFE0F\u200D]/gu, "")
    .replace(/^\d+\.\s*/, "")
    .trim();
}

function tableByHeading(tables, ...needles) {
  return tables.filter((t) => needles.some((n) => t.heading.toLowerCase().includes(n)));
}

function compactRows(table, limit = 40) {
  if (!table) return [];
  return table.rows.slice(0, limit).map((row) => {
    const obj = {};
    table.header.forEach((h, i) => {
      if (h && row[i]) obj[h] = row[i];
    });
    return obj;
  });
}

export function buildIdentification({
  functionKey,
  page,
  url,
  markdown,
  images,
  xlsx,
  sheetIndex,
  missing,
  screens: screensIn,
}) {
  const tables = parseMarkdownTables(markdown);
  const displayOrder = tableByHeading(tables, "display order")[0];
  const access = tableByHeading(tables, "access control")[0];
  const screenMode = tableByHeading(tables, "screen mode", "button settings")[0];
  const buttons = tableByHeading(tables, "button state", "button settings").find((t) =>
    t.header.some((h) => /add|save|search|edit/i.test(h))
  );
  const objective =
    extractSection(markdown, "objective") || extractSection(markdown, "operation description");
  const pre = extractSection(markdown, "pre-condition") || extractSection(markdown, "pre condition");
  const post = extractSection(markdown, "post-condition") || extractSection(markdown, "post condition");

  const itemSheet = findSheet(sheetIndex, /ui\s*components/i);
  const eventSheet = findSheet(sheetIndex, /ui\s*event/i);
  const apiSheet = findSheet(sheetIndex, /endpoint|api_details|request/i);
  const dataMapSheet = findSheet(sheetIndex, /db\s*entity|api_ids/i);

  const fields = uniqueBy(
    [
      ...compactRows(displayOrder).map((r) => ({
        label:
          r["Field Name"] ||
          r.Field ||
          r["Field_Name-Eng"] ||
          r["Field_me-Eng"] ||
          Object.values(r)[2] ||
          "",
        section: r.Section || "",
        source: "dr-page:Display Order",
      })),
      ...sheetRows(itemSheet, [
        "Field_Name-Eng",
        "Field_me-Eng",
        "Field Name",
        "Field_Name",
        "Field",
        "Label",
      ]).map((r) => ({
        label: r.value,
        section: r.row.Section || r.row.section || "",
        source: `item-desc:${itemSheet?.name || "ui-components"}`,
      })),
    ],
    (x) => `${x.label.toLowerCase()}|${(x.section || "").toLowerCase()}`
  ).filter((x) => x.label);

  const eventRows = sheetRows(eventSheet, ["Event", "Event_Type", "Event Name", "Action", "Button"]);
  const actions = uniqueBy(
    [
      ...compactRows(buttons).flatMap((r) =>
        Object.entries(r)
          .filter(([k, v]) => k && v && !/^mode/i.test(k))
          .map(([k, v]) => ({ label: k, state: v, source: "dr-page:Button Settings" }))
      ),
      ...eventRows.map((r) => {
        const eventId = r.row.Event_id || r.row.Event_ID || "";
        const eventName = r.row.Event || r.row.Event_Type || r.row["Event Name"] || r.value;
        return {
          label: [eventId, eventName].filter(Boolean).join(" ").trim(),
          state: (r.row.Processing_Logic || r.row.Pre_Condition || "").slice(0, 160),
          source: `item-desc:${eventSheet?.name || "ui-events"}`,
        };
      }),
    ],
    (x) => x.label.toLowerCase()
  ).filter((x) => x.label && !/^mode|^section/i.test(x.label));

  const modes = uniqueBy(
    compactRows(screenMode).map((r) => ({
      name: r["Screen Mode"] || r.Mode || "",
      section: r.Section || "",
      description: r.Description || "",
      source: "dr-page:Screen Mode",
    })),
    (x) => `${x.name}|${x.section}`
  ).filter((x) => x.name);

  const uxFromMd = extractUxDesignFromMarkdown(markdown);
  const screens = Array.isArray(screensIn) && screensIn.length ? screensIn : uxFromMd.screens;
  const uxImages = screens.map((s) => s.image);
  const gapMissing = [...(missing || [])];
  if (!screens.length && !uxFromMd.found && !gapMissing.includes("UX Design section")) {
    gapMissing.push("UX Design section");
  }
  if (uxFromMd.found && !screens.length && !gapMissing.includes("UX Design screen image")) {
    gapMissing.push("UX Design screen image");
  }

  const permissions = compactRows(access).filter((r) => Object.values(r).some(Boolean));
  let apis = sheetRows(apiSheet, ["API_ID", "API Id", "Path", "Endpoint"]).slice(0, 40);
  if (!apis.length) {
    const fromMaps = [
      ...sheetRows(dataMapSheet, ["API_IDs", "API_ID", "API Id"]).flatMap((r) => collectApiIds(r.value)),
      ...eventRows.flatMap((r) => collectApiIds(r.row.Processing_Logic || r.value)),
      ...sheetRows(itemSheet, ["Combo_API"]).flatMap((r) => collectApiIds(r.value)),
    ];
    apis = uniqueBy(
      fromMaps.map((value) => ({ value, row: {} })),
      (x) => x.value.toLowerCase()
    ).map((x) => ({ value: x.value, row: {} }));
  }

  return {
    schemaVersion: "1.0",
    functionKey,
    status: "pending_review",
    page: {
      id: page.id,
      title: page.title,
      version: page.version?.number ?? null,
      when: page.version?.when ?? null,
      url,
      spaceKey: page.space?.key ?? null,
    },
    identified: {
      objective: objective.slice(0, 600),
      preCondition: pre.slice(0, 400),
      postCondition: post.slice(0, 400),
      modes,
      fields,
      actions,
      permissions,
      apis: apis.map((r) => ({
        value: r.value,
        source: apiSheet ? `api-map:${apiSheet.name}` : dataMapSheet ? `data-map:${dataMapSheet.name}` : "item-desc",
      })),
      screens,
      images: uxImages.length ? uxImages : images || [],
      workbooks: xlsx,
      missing: gapMissing,
    },
    agreement: null,
  };
}

function normalizeSheetName(name) {
  return String(name || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findSheet(sheetIndex, re) {
  return (sheetIndex || []).find((s) => re.test(normalizeSheetName(s.name)));
}

function collectApiIds(text) {
  return [...String(text || "").matchAll(/\b(API[_-]?[A-Z0-9]+|CMB[_-]?\d+)\b/gi)].map((m) => m[1]);
}

function sheetRows(sheet, columns) {
  if (!sheet?.rows?.length) return [];
  const header = sheet.rows[0] || [];
  const idx = columns.map((c) => header.findIndex((h) => String(h).toLowerCase() === c.toLowerCase())).find((i) => i >= 0);
  if (idx == null || idx < 0) {
    return sheet.rows.slice(1, 41).map((row) => ({
      value: row.find((c) => c) || "",
      row: Object.fromEntries(header.map((h, i) => [h, row[i] || ""])),
    }));
  }
  return sheet.rows.slice(1, 41).map((row) => ({
    value: row[idx] || "",
    row: Object.fromEntries(header.map((h, i) => [h, row[i] || ""])),
  }));
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = keyFn(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function extractSection(md, heading) {
  const needle = heading.toLowerCase();
  const lines = String(md || "").split(/\r?\n/);
  const buf = [];
  let capturing = false;
  for (const line of lines) {
    const h = line.match(/^#{1,6}\s+(.*)/);
    if (h) {
      if (capturing) break;
      if (normalizeHeading(h[1]).toLowerCase().includes(needle)) {
        capturing = true;
      }
      continue;
    }
    if (capturing) buf.push(line);
  }
  return buf.join("\n").replace(/!\[[^\]]*\]\([^)]+\)/g, "").trim();
}

export function renderGrillMarkdown(id) {
  const i = id.identified;
  const status = id.status;
  const lines = [
    `# Grill: ${id.functionKey}`,
    "",
    `**Status:** \`${status}\``,
    `**DR page:** ${id.page.title}`,
    `**URL:** ${id.page.url}`,
    `**Version:** ${id.page.version ?? "unknown"}`,
    "",
    "This is what the fetch identified to **design and implement**. Nothing below is implemented yet.",
    "Review it. Correct it in chat if needed. Then agree before the UI contract or React work starts.",
    "",
    "## Screens to build (UX Design only)",
    "",
  ];
  const screens = i.screens || [];
  if (!screens.length) {
    lines.push(
      "_No screen mockup under **UX Design**. Other page images were not fetched. Add UX Design mockups, or reject this grill._",
      "",
    );
  } else {
    if (screens.length === 1) {
      lines.push("**One screen** — this Function Key is a single implementation pass.", "");
    } else {
      lines.push(
        `**${screens.length} screens** — each UX Design mockup is its own task. Agree this list; implement **one task per Phase 2 pass**. Do not bundle.`,
        "",
      );
    }
    lines.push("| Task | Screen | Image |", "|---|---|---|");
    for (const s of screens) lines.push(`| ${s.id} | ${esc(s.title)} | \`${s.image}\` |`);
    lines.push("");
  }
  lines.push(
    "## Screen logic",
    "",
    i.objective ? `**Objective:** ${i.objective}` : "**Objective:** _not found in DR body_",
    "",
    i.preCondition ? `**Pre-condition:** ${i.preCondition}` : "**Pre-condition:** _not found_",
    "",
    i.postCondition ? `**Post-condition:** ${i.postCondition}` : "**Post-condition:** _not found_",
    "",
    "## Screen modes",
    "",
  );
  if (!i.modes.length) lines.push("_No Screen Mode table found._", "");
  else {
    lines.push("| Mode | Section | Description |", "|---|---|---|");
    for (const m of i.modes) lines.push(`| ${m.name} | ${m.section} | ${esc(m.description)} |`);
    lines.push("");
  }
  lines.push("## Fields (page + Item_Desc)", "");
  if (!i.fields.length) lines.push("_No fields extracted. Check Display Order and Item_Desc sheets._", "");
  else {
    lines.push("| Field | Section | Source |", "|---|---|---|");
    for (const f of i.fields) lines.push(`| ${esc(f.label)} | ${esc(f.section)} | ${f.source} |`);
    lines.push("");
  }
  lines.push("## Actions / buttons / events", "");
  if (!i.actions.length) lines.push("_No actions extracted._", "");
  else {
    lines.push("| Action | State / note | Source |", "|---|---|---|");
    for (const a of i.actions) lines.push(`| ${esc(a.label)} | ${esc(a.state)} | ${a.source} |`);
    lines.push("");
  }
  lines.push("## Access", "");
  if (!i.permissions.length) lines.push("_No Access Control table found._", "");
  else {
    const keys = [...new Set(i.permissions.flatMap((r) => Object.keys(r)))];
    lines.push(`| ${keys.join(" | ")} |`, `| ${keys.map(() => "---").join(" | ")} |`);
    for (const r of i.permissions) lines.push(`| ${keys.map((k) => esc(r[k] || "")).join(" | ")} |`);
    lines.push("");
  }
  lines.push("## APIs (from workbook)", "");
  if (!i.apis.length) lines.push("_No API rows extracted. Check API_Data_Map_Details sheets._", "");
  else {
    for (const a of i.apis) lines.push(`- ${esc(a.value)} (${a.source})`);
    lines.push("");
  }
  lines.push("## UX images (UX Design section only)", "");
  if (!screens.length) lines.push("_None — only mockups under UX Design are fetched._", "");
  else for (const s of screens) lines.push(`- \`${s.image}\` (${esc(s.title)})`);
  lines.push("", "## Workbooks", "");
  for (const prefix of XLSX_PREFIXES) {
    lines.push(`- ${prefix}*: ${i.workbooks[prefix] ? `\`${i.workbooks[prefix]}\`` : "**missing**"}`);
  }
  if (i.missing?.length) {
    lines.push("", "## Missing from attachments", "");
    for (const name of i.missing) lines.push(`- ${name}`);
  }
  lines.push(
    "",
    "## Agree",
    "",
    "If this list is wrong, say what to drop or add. Do not start React until status is `agreed`.",
    "",
    "```bash",
    `npm run feature:grill -- ${id.functionKey} --agree --by "<your name>"`,
    "```",
    ""
  );
  if (id.agreement) {
    lines.push(
      `Agreed by **${id.agreement.by}** at ${id.agreement.at}.`,
      id.agreement.notes ? `Notes: ${id.agreement.notes}` : "",
      ""
    );
  }
  return lines.filter((x) => x !== undefined).join("\n");
}

function esc(value) {
  return String(value || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

export function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function resetDirFiles(dir, keep) {
  if (!fs.existsSync(dir)) return;
  const keepSet = new Set(keep);
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isFile() && !keepSet.has(name)) fs.unlinkSync(full);
  }
}

