import fs from "node:fs";
import path from "node:path";
import { specRoot } from "./workspace.mjs";

export function collectStrings(value, key = "", out = []) {
  if (typeof value === "string") out.push({ k: key, v: value });
  else if (Array.isArray(value)) value.forEach((item, i) => collectStrings(item, `${key}[${i}]`, out));
  else if (value && typeof value === "object") {
    Object.entries(value).forEach(([name, item]) => collectStrings(item, key ? `${key}.${name}` : name, out));
  }
  return out;
}

export function looksLikePath(entry) {
  return (
    /(file|path|files|target|destination|uri)/.test(entry.k.toLowerCase()) ||
    /[\\/]/.test(entry.v) ||
    /\.(md|json|tsx|ts|jsx|js|css|scss|html|ya?ml)$/i.test(entry.v)
  );
}

export function normalizeHookPath(raw, cwd) {
  let x = String(raw ?? "")
    .replace(/^file:\/\//i, "")
    .replaceAll("\\", "/")
    .replace(/^["']|["']$/g, "");
  const base = String(cwd ?? process.cwd()).replaceAll("\\", "/");
  const specsBase = specRoot.replaceAll("\\", "/");
  if (x === specsBase) return "specs";
  if (x.startsWith(specsBase + "/")) return path.posix.normalize(`specs/${x.slice(specsBase.length + 1)}`);
  if (x.startsWith(base + "/")) x = x.slice(base.length + 1);
  return path.posix.normalize(x.replace(/^\.\//, ""));
}

export function candidatePaths(toolInput, cwd, extra = {}) {
  return collectStrings({ ...extra, ...(toolInput && typeof toolInput === "object" ? toolInput : {}) })
    .filter(looksLikePath)
    .map((e) => normalizeHookPath(e.v, cwd))
    .filter((x) => x && !/^https?:\/\//.test(x));
}

export function isEditLike(toolName) {
  return /(create|replace|edit|write|delete|remove|patch|rename|move|apply)/i.test(String(toolName ?? ""));
}

function agentLabel(value) {
  if (value && typeof value === "object") {
    return [value.name, value.id, value.agentName, value.agent_name].filter(Boolean).join(" ");
  }
  return String(value ?? "");
}

export function isKiroRuntime(payload = {}) {
  if (process.env.UI_HOOK_RUNTIME === "kiro") return true;
  if (process.env.KIRO || process.env.KIRO_AGENT || process.env.KIRO_AGENT_NAME) return true;
  const hint = [payload?.runtime, payload?.source, payload?.client, payload?.ide]
    .map((v) => String(v ?? "").toLowerCase())
    .join(" ");
  return /\bkiro\b/.test(hint);
}

export function detectAgent(payload) {
  const keys = [
    payload?.agent,
    payload?.agent_name,
    payload?.agentName,
    payload?.custom_agent,
    payload?.customAgent,
    payload?.active_agent,
    payload?.activeAgent,
    payload?.agent_id,
    payload?.agentId,
    process.env.KIRO_AGENT,
    process.env.KIRO_AGENT_NAME,
  ];
  const text = keys.map(agentLabel).join(" ").toLowerCase();
  if (/requirement[-_ ]?analyst|ui-requirement-analyst|ui requirement analyst/.test(text)) return "analyst";
  if (/ui[-_ ]?reviewer|ui reviewer/.test(text)) return "reviewer";
  if (/ui[-_ ]?architect|ui architect/.test(text)) return "architect";
  if (/\breviewer\b/.test(text)) return "reviewer";
  if (/\barchitect\b/.test(text)) return "architect";
  if (/\banalyst\b/.test(text)) return "analyst";
  return "unknown";
}

export function listFeatureIds(cwd) {
  const dir = specRoot;
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
}

export function grillStatus(cwd, featureId) {
  const file = path.join(specRoot, featureId, "grill.json");
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")).status ?? "unknown";
  } catch {
    return "invalid";
  }
}

export function mentionedFeatureIds(text, cwd) {
  const hay = String(text ?? "");
  return listFeatureIds(cwd).filter((id) => hay.includes(id));
}

export function featureIdFromFeaturesPath(p) {
  const m = String(p ?? "").match(/^specs\/([^/]+)\//);
  return m ? m[1] : null;
}

export function normalizeRelPath(p) {
  return String(p ?? "")
    .replaceAll("\\", "/")
    .replace(/^\.\//, "");
}

function pathRelated(a, b) {
  if (!a || !b) return false;
  return a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);
}

/** Features whose component-map references this page/module file (components or evidenceUsages). */
export function featuresClaimingSrcFile(cwd, relPath) {
  const target = normalizeRelPath(relPath);
  if (!target) return [];
  const hits = [];
  for (const id of listFeatureIds(cwd)) {
    const mapFile = path.join(specRoot, id, "component-map.json");
    if (!fs.existsSync(mapFile)) continue;
    try {
      const map = JSON.parse(fs.readFileSync(mapFile, "utf8"));
      for (const mapping of map.mappings ?? []) {
        for (const comp of mapping.components ?? []) {
          if (pathRelated(target, normalizeRelPath(comp.path ?? ""))) hits.push(id);
        }
        for (const usage of mapping.evidenceUsages ?? []) {
          if (pathRelated(target, normalizeRelPath(usage))) hits.push(id);
        }
      }
    } catch {
      /* ignore invalid maps */
    }
  }
  return [...new Set(hits)];
}

export function pendingGrillFeatureIds(cwd) {
  return listFeatureIds(cwd).filter((id) => {
    const status = grillStatus(cwd, id);
    return status === "pending_review" || status === "rejected" || status === "invalid";
  });
}

export function isTsxPath(p) {
  return /\.(tsx|jsx)$/i.test(p);
}

export function isScreenPath(p) {
  return /^src\/components\/screens\//.test(p);
}

export function isSrcUiPath(p) {
  return (/^(src\/demoModules\/|src\/modules\/)/.test(p) || isScreenPath(p)) && isTsxPath(p);
}

export function isReviewMd(p) {
  return /^specs\/[^/]+\/review\.md$/.test(p);
}

export function isFeaturesPath(p) {
  return p === "specs" || p.startsWith("specs/");
}

export function isContractPath(p) {
  return /(^|\/)ui-contract\.json$/.test(p);
}

export function isComponentMapPath(p) {
  return /(^|\/)component-map\.json$/.test(p);
}

/** Analyst may only touch these artifacts under specs/<ID>/. */
export function isAnalystAllowedPath(p) {
  return /^specs\/[^/]+\/(sources\.md|requirements\.md|feature\.md|design\.md|tasks\.md|acceptance\.md|ui-contract\.json|grill\.md|grill\.json)$/.test(
    p,
  );
}
