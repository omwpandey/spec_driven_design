/**
 * Tech-team playbook: artifacts, I/O chain, harness, guardrails.
 * Run: node scripts/build-agent-workflow-tech-ppt.mjs
 */
import PptxGenJS from "pptxgenjs";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "docs", "Spec-Driven-UI-Tech-Team-Playbook.pptx");

const C = {
  navy: "1B2A4A",
  navyDeep: "121C33",
  red: "EB0A1E",
  ink: "1A1A1A",
  body: "3D4555",
  mute: "6B7380",
  line: "D8DCE3",
  card: "FFFFFF",
  wash: "F4F6F9",
  ice: "E8EEF6",
  gold: "C4A35A",
  green: "1F7A4D",
  greenBg: "E8F4EE",
  redBg: "FFF4F4",
  amber: "8A6D1B",
  amberBg: "FBF3DC",
};

const TOTAL = 12;

mkdirSync(dirname(OUT), { recursive: true });

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "TOPS CRM UI";
pptx.title = "Spec-Driven UI — Tech Team Playbook";
pptx.subject = "Artifacts, I/O chain, harness, guardrails, spec enforcement";

const S = pptx.ShapeType;

function chrome(slide, page) {
  slide.addShape(S.rect, {
    x: 0, y: 0, w: 13.333, h: 0.08,
    fill: { color: C.red }, line: { color: C.red },
  });
  slide.addText("TOPS CRM  ·  Tech playbook  ·  Internal", {
    x: 0.4, y: 7.14, w: 9, h: 0.24,
    fontSize: 10, fontFace: "Calibri", color: C.mute, margin: 0,
  });
  slide.addText(`${page}  /  ${TOTAL}`, {
    x: 11.3, y: 7.14, w: 1.6, h: 0.24,
    fontSize: 10, fontFace: "Calibri", color: C.mute, align: "right", margin: 0,
  });
}

function kicker(slide, text) {
  slide.addText(text, {
    x: 0.4, y: 0.2, w: 12.5, h: 0.2,
    fontSize: 11, fontFace: "Calibri", color: C.red, bold: true,
    charSpacing: 1.2, margin: 0,
  });
}

function title(slide, text, y = 0.4) {
  slide.addText(text, {
    x: 0.4, y, w: 12.5, h: 0.4,
    fontSize: 24, fontFace: "Calibri", color: C.navy, bold: true, margin: 0,
  });
}

function bg(slide) {
  slide.addShape(S.rect, {
    x: 0, y: 0, w: 13.333, h: 7.5,
    fill: { color: C.wash }, line: { color: C.wash },
  });
}

const th = {
  fill: { color: C.navy },
  color: "FFFFFF",
  bold: true,
  align: "left",
  valign: "middle",
  fontFace: "Calibri",
  fontSize: 10,
};
const td = {
  fill: { color: C.card },
  color: C.body,
  align: "left",
  valign: "middle",
  fontFace: "Calibri",
  fontSize: 10,
};
const tdAlt = { ...td, fill: { color: "F0F3F8" } };

function rows(header, data) {
  return [
    header.map((t) => ({ text: t, options: th })),
    ...data.map((r, i) => r.map((t) => ({ text: t, options: i % 2 ? tdAlt : td }))),
  ];
}

function tableOpts(x, y, w, colW, rowH = 0.32) {
  return {
    x, y, w, colW,
    border: [{ pt: 0.5, color: C.line }],
    fontFace: "Calibri",
    valign: "middle",
    align: "left",
    rowH,
  };
}

function ioBox(slide, x, y, w, h, label, color, lines) {
  slide.addShape(S.roundRect, {
    x, y, w, h,
    fill: { color: C.card },
    line: { color: C.line },
    rectRadius: 0.05,
  });
  slide.addShape(S.rect, {
    x, y, w, h: 0.06,
    fill: { color }, line: { color },
  });
  slide.addText(label, {
    x: x + 0.1, y: y + 0.12, w: w - 0.2, h: 0.22,
    fontSize: 10, fontFace: "Calibri", color, bold: true, margin: 0,
  });
  slide.addText(lines, {
    x: x + 0.1, y: y + 0.34, w: w - 0.2, h: h - 0.42,
    fontSize: 11, fontFace: "Calibri", color: C.body, margin: 0,
  });
}

// =============================================================================
// 1. Title
// =============================================================================
{
  const s = pptx.addSlide();
  s.addShape(S.rect, {
    x: 0, y: 0, w: 13.333, h: 7.5,
    fill: { color: C.navyDeep }, line: { color: C.navyDeep },
  });
  s.addShape(S.rect, {
    x: 0, y: 0, w: 0.14, h: 7.5,
    fill: { color: C.red }, line: { color: C.red },
  });
  s.addText("TECH TEAM PLAYBOOK", {
    x: 0.65, y: 0.45, w: 8, h: 0.26,
    fontSize: 12, fontFace: "Calibri", color: C.gold, bold: true, charSpacing: 1.6, margin: 0,
  });
  s.addText("Spec-Driven UI — how the harness works", {
    x: 0.65, y: 0.82, w: 12, h: 0.7,
    fontSize: 30, fontFace: "Calibri", color: "FFFFFF", bold: true, margin: 0,
  });
  s.addText("Artifacts, input → output chain, npm gates, agent hooks, and how we keep the published DR as the only source of truth.", {
    x: 0.65, y: 1.6, w: 11.8, h: 0.55,
    fontSize: 16, fontFace: "Calibri", color: "C5CDD8", margin: 0,
  });

  const agenda = [
    ["01", "I/O spine", "What each phase consumes and what it emits"],
    ["02", "File catalog", "Every file under specs/<KEY>/ and why it exists"],
    ["03", "Phases 0–2", "Fetch → grill → contract → map → screen → review"],
    ["04", "Harness + hooks", "npm scripts, Cursor/Copilot/Kiro guards, spec enforcement"],
  ];
  agenda.forEach((a, i) => {
    const y = 2.4 + i * 0.9;
    s.addShape(S.roundRect, {
      x: 0.65, y, w: 12, h: 0.8,
      fill: { color: "1E2E4F" }, line: { color: "2A3F68" }, rectRadius: 0.05,
    });
    s.addText(a[0], {
      x: 0.85, y: y + 0.2, w: 0.7, h: 0.4,
      fontSize: 18, fontFace: "Calibri", color: C.red, bold: true, margin: 0,
    });
    s.addText(a[1], {
      x: 1.65, y: y + 0.1, w: 10.7, h: 0.3,
      fontSize: 16, fontFace: "Calibri", color: "FFFFFF", bold: true, margin: 0,
    });
    s.addText(a[2], {
      x: 1.65, y: y + 0.4, w: 10.7, h: 0.28,
      fontSize: 13, fontFace: "Calibri", color: "C5CDD8", margin: 0,
    });
  });
  s.addText("Companion to the 3-slide leadership briefing. This deck is the runbook.", {
    x: 0.65, y: 7.1, w: 12, h: 0.22,
    fontSize: 11, fontFace: "Calibri", color: "7A8799", margin: 0,
  });
  s.addNotes(
    "This is for developers and tech leads. Pair with the 3-slide leadership deck if execs are in the room first.\n\n" +
      "Promise: after this, anyone can pick a Function Key and know which file is truth, which command gates the next step, and which hook will block a skip.",
  );
}

// =============================================================================
// 2. I/O spine
// =============================================================================
{
  const s = pptx.addSlide();
  bg(s); chrome(s, 2); kicker(s, "THE SPINE"); title(s, "Every output is the next phase’s only input");

  s.addText("Agents do not go back to Confluence after Phase 0. Downstream work reads local artifacts only.", {
    x: 0.4, y: 0.84, w: 12.5, h: 0.28,
    fontSize: 13, fontFace: "Calibri", color: C.body, margin: 0,
  });

  const steps = [
    { n: "IN", t: "Published DR", d: "Confluence URL or Function Key\nUX Design + Item_Desc / DATA_MAP / API map" },
    { n: "0", t: "Fetch + grill", d: "raw/  +  grill.md/.json\nHuman: agree / edit / reject" },
    { n: "1a", t: "Contract", d: "sources.md  feature.md\nui-contract.json\nfeature:validate" },
    { n: "1b", t: "Component map", d: "component-map.json\ncomponent-map:validate\nHuman accepts map" },
    { n: "2a", t: "Screen", d: "src/components/screens/<ID>/\nroute + i18n\nui:guard" },
    { n: "2b", t: "Review", d: "review.md\nPASS / WARNING / FAIL\nui:harness <ID>" },
  ];
  steps.forEach((st, i) => {
    const x = 0.32 + i * 2.16;
    s.addShape(S.roundRect, {
      x, y: 1.28, w: 2.05, h: 2.55,
      fill: { color: i === 0 ? C.navy : C.card },
      line: { color: i === 0 ? C.navy : C.line },
      rectRadius: 0.05,
    });
    s.addText(st.n, {
      x: x + 0.1, y: 1.38, w: 1.85, h: 0.22,
      fontSize: 11, fontFace: "Calibri", color: i === 0 ? C.gold : C.red, bold: true, margin: 0,
    });
    s.addText(st.t, {
      x: x + 0.1, y: 1.62, w: 1.85, h: 0.5,
      fontSize: 13, fontFace: "Calibri", color: i === 0 ? "FFFFFF" : C.navy, bold: true, margin: 0,
    });
    s.addText(st.d, {
      x: x + 0.1, y: 2.16, w: 1.85, h: 1.5,
      fontSize: 11, fontFace: "Calibri", color: i === 0 ? "C5CDD8" : C.body, margin: 0,
    });
    if (i < steps.length - 1) {
      s.addText("→", {
        x: x + 1.92, y: 2.2, w: 0.28, h: 0.3,
        fontSize: 16, fontFace: "Calibri", color: C.red, bold: true, margin: 0,
      });
    }
  });

  s.addTable(
    rows(
      ["Handoff", "Producer", "Must exist before next write", "Blocked if missing"],
      [
        ["DR → grill", "feature:fetch", "raw/page.md + grill.json pending_review", "Nothing — fetch is the start"],
        ["Grill → contract", "Developer --agree", 'grill.json status "agreed"', "Hooks deny ui-contract.json"],
        ["Contract → map", "Analyst + feature:validate", "ui-contract.json PASS", "Map has nothing to map"],
        ["Map → screen", "Architect + map validate", "component-map.json exists", "Hooks deny src/**/*.tsx"],
        ["Screen → review", "Architect + ui:guard", "Screen under screens/<ID>/", "Reviewer FAILs unused catalog / raw MUI"],
      ],
    ),
    tableOpts(0.35, 4.05, 12.65, [2.1, 2.4, 4.5, 3.65], 0.42),
  );

  s.addNotes(
    "This is the one slide to stay on if time is short.\n\n" +
      "Emphasize: after fetch, Confluence is frozen locally. Architect and Reviewer must not re-read the wiki.\n\n" +
      "Human gates: agree grill, accept map, accept review verdict.",
  );
}

// =============================================================================
// 3. File catalog
// =============================================================================
{
  const s = pptx.addSlide();
  bg(s); chrome(s, 3); kicker(s, "ARTIFACT CATALOG"); title(s, "What lives under specs/<FUNCTION_KEY>/");

  s.addTable(
    rows(
      ["File", "Phase", "Owner", "Purpose — this is why it exists"],
      [
        ["raw/meta.json", "0", "fetch", "Page id, version, URL, space. Detects DR version change on --force."],
        ["raw/page.md", "0", "fetch", "Full published DR body as markdown. Source of fields, events, APIs, menu path."],
        ["raw/ux-design.md", "0", "fetch", "UX Design heading only. If missing → grill lists it as a gap. Do not invent screens."],
        ["raw/images/*", "0", "fetch", "UX Design mockups only. One image = one task. Several = UX-001, UX-002, …"],
        ["raw/xlsx + sheets/", "0", "fetch", "Item_Desc_, API_Data_Map_Details_, DATA_MAP_ workbooks + markdown conversion."],
        ["grill.md / grill.json", "0", "fetch + you", "Human-readable task list + machine status (pending_review | agreed | rejected)."],
        ["sources.md", "1a", "Analyst", "Stable source IDs (dr-page, item-desc, ux-image, developer-decision-00N)."],
        ["feature.md", "1a", "Analyst", "Short human brief. Not the contract. Do not implement from this alone."],
        ["ui-contract.json", "1a", "Analyst", "Requirement truth: fields, actions, validation, AC, conflicts, openQuestions."],
        ["component-map.json", "1b", "Architect", "Every field/action id → catalog decision + file path. Required before .tsx."],
        ["review.md", "2b", "Reviewer", "Only file Reviewer may write. PASS / WARNING / FAIL against contract + map."],
      ],
    ),
    tableOpts(0.3, 0.92, 12.75, [2.35, 0.7, 1.45, 8.25], 0.46),
  );

  s.addNotes(
    "Walk the table top to bottom — that is also time order.\n" +
      "raw/ is evidence. grill is scope. contract is requirement truth. map is implementation intent. review is verdict.\n" +
      "Never merge ui-contract.json with ScreenManifest or CrudConfig — those are runtime.",
  );
}

// =============================================================================
// 4. Phase 0 fetch
// =============================================================================
{
  const s = pptx.addSlide();
  bg(s); chrome(s, 4); kicker(s, "PHASE 0  ·  FETCH"); title(s, "Input: URL or Function Key. Output: local evidence + pending grill");

  ioBox(s, 0.35, 0.95, 4.0, 1.85, "INPUT", C.navy,
    "Confluence DR URL  (/pages/<id>)\nor Function Key  (WCRM010203)\n\nEnv: CONFLUENCE_BASE_URL, EMAIL, API_TOKEN via CONFLUENCE_ENV_FILE / .env");
  ioBox(s, 4.55, 0.95, 4.15, 1.85, "COMMAND", C.gold,
    "npm run feature:fetch -- --url \"<DR>\"\nnpm run feature:fetch -- WCRM010203\n\n--force if the published version changed (resets grill to pending_review)");
  ioBox(s, 8.9, 0.95, 4.1, 1.85, "OUTPUT (feeds Phase 0 grill)", C.green,
    "raw/  (page, ux-design, images, xlsx, sheets)\ngrill.md  +  grill.json\nstatus = pending_review\nmissing[] for absent workbooks / UX images");

  s.addTable(
    rows(
      ["raw/ file", "What fetch actually does", "What you do with it"],
      [
        ["page.md", "Storage HTML → markdown. Full DR, not a summary.", "Compare Menu Path vs moduleRegistry + Sidebar."],
        ["ux-design.md + images/", "Only images under the UX Design heading. Other page images are skipped.", "One mockup = one Phase 2 pass. Do not invent extra screens."],
        ["xlsx/ + sheets/*.md", "Downloads Item_Desc_ / API_Data_Map_Details_ / DATA_MAP_ and converts sheets.", "Missing prefix is listed — do not invent the workbook."],
        ["images/manifest.json", "Records fetched screens + skipped_not_ux_design.", "Proof of what was ignored on purpose."],
        ["grill.json identified", "Modes, fields, actions, APIs, missing — extracted, not invented.", "You may edit identified only from raw/. Then refresh grill.md."],
      ],
    ),
    tableOpts(0.35, 3.0, 12.65, [2.4, 5.35, 4.9], 0.58),
  );

  s.addNotes(
    "Fetch is a Node script, not Jira MCP and not the agent calling Confluence APIs itself.\n" +
      "agenticDR in the title is NOT required. Jira key is NOT an input.\n" +
      "If Function Key cannot be derived from title/slug, ask for --function-key.",
  );
}

// =============================================================================
// 5. Phase 0 grill
// =============================================================================
{
  const s = pptx.addSlide();
  bg(s); chrome(s, 5); kicker(s, "PHASE 0  ·  GRILL + AGREE"); title(s, "Input: pending grill. Output: named human sign-off");

  s.addText("Agent: UI Requirement Analyst  ·  Cursor: phase-0-grill  ·  Copilot/Kiro: grill-ui-requirement", {
    x: 0.4, y: 0.86, w: 12.5, h: 0.24,
    fontSize: 12, fontFace: "Calibri", color: C.mute, margin: 0,
  });

  ioBox(s, 0.35, 1.2, 6.2, 1.7, "INPUT", C.navy,
    "grill.md (readable task list) + grill.json (machine pack)\nraw/page.md, ux-design, images, sheets\nExisting product: moduleRegistry.ts + Sidebar.tsx (already built vs new)");
  ioBox(s, 6.75, 1.2, 6.2, 1.7, "OUTPUT → Phase 1 input", C.green,
    'grill.json  { status: "agreed", agreement: { by, at, notes } }\ngrill.md header Status = agreed\nNotes carry scope cuts (e.g. UX-001 only, DATA_MAP out of scope)');

  s.addTable(
    rows(
      ["Developer choice", "Command / action", "What happens next"],
      [
        ["Agree", 'feature:grill -- <KEY> --agree --by "Name" [--notes]', "Phase 0 done. Analyst may write the contract. Hooks unlock contract/map/src."],
        ["Edit", "Change grill.json → identified only. Keep status pending_review. Re-run feature:grill.", "Re-present grill.md. You still must --agree. Do not invent fields not in raw/."],
        ["Reject", 'feature:grill -- <KEY> --reject --reason "…"', "Stop. Fetch the correct page. Do not patch raw/page.md to “fix” a wrong DR."],
        ["Already built", "Agree with notes: refresh vs new screen", "Same agree record. Phase 1 still required if you are refreshing the contract."],
      ],
    ),
    tableOpts(0.35, 3.1, 12.65, [2.1, 5.35, 5.2], 0.58),
  );

  s.addShape(S.roundRect, {
    x: 0.35, y: 5.58, w: 12.65, h: 1.35,
    fill: { color: C.redBg }, line: { color: "F3D0D3" }, rectRadius: 0.05,
  });
  s.addText("HARD STOP — Phase 0 writes nothing else", {
    x: 0.55, y: 5.7, w: 12.2, h: 0.26,
    fontSize: 13, fontFace: "Calibri", color: C.red, bold: true, margin: 0,
  });
  s.addText("No ui-contract.json. No component-map.json. No src/. feature:validate will FAIL until grill is agreed. If an agent starts a contract or .tsx here, stop it. --force on a new Confluence version clears the previous agree.", {
    x: 0.55, y: 6.0, w: 12.2, h: 0.75,
    fontSize: 13, fontFace: "Calibri", color: C.ink, margin: 0,
  });

  s.addNotes(
    "The agree is the legal act of the pipeline. --by is required so the harness records who signed.\n" +
      "Edits must come from raw/ or a written developer decision (later source developer-decision-00N on the contract).",
  );
}

// =============================================================================
// 6. Phase 1 contract
// =============================================================================
{
  const s = pptx.addSlide();
  bg(s); chrome(s, 6); kicker(s, "PHASE 1A  ·  CONTRACT"); title(s, "Input: agreed grill + raw/. Output: requirement truth");

  s.addText("Agent: UI Requirement Analyst  ·  Skill: analyze-ui-requirement  ·  Must not pick React components", {
    x: 0.4, y: 0.86, w: 12.5, h: 0.22,
    fontSize: 12, fontFace: "Calibri", color: C.mute, margin: 0,
  });

  ioBox(s, 0.35, 1.16, 6.2, 1.55, "INPUT", C.navy,
    "grill.json agreed + grill.md scope\nraw/page.md, ux-design.md, images, sheets\nDeveloper notes / decisions from agree");
  ioBox(s, 6.75, 1.16, 6.2, 1.55, "OUTPUT → Phase 1b input", C.green,
    "sources.md   feature.md   ui-contract.json\nnpm run feature:validate -- <KEY>  must PASS\nBlocking openQuestions stay blocking");

  s.addTable(
    rows(
      ["ui-contract.json node", "What it holds", "Spec rule"],
      [
        ["sources[]", "id, type, reference (dr-page, item-desc, ux-image, data-map, developer-decision)", "Every later object must sourceRef a real sourceId."],
        ["fields[]", "id, label, uiType, section, modeBehavior, validation[]", "Validation only if the source states it. Duplicate validation ids fail."],
        ["actions[]", "id, trigger.type, frontendValidations[], effects", "frontendValidations[] must point at existing validation ids."],
        ["permissions / states / AC", "Source-backed only", "AC needs id + statement + sourceRefs."],
        ["conflicts[]", "Disagreement between sources; open | resolved", "Resolved needs a written resolution."],
        ["openQuestions[]", "Unknowns. blocking: true if a business rule would otherwise be invented", "Do not resolve in chat by guessing. Write a developer-decision source."],
      ],
    ),
    tableOpts(0.35, 2.88, 12.65, [2.45, 5.4, 4.8], 0.52),
  );

  s.addNotes(
    "feature:validate checks schemaVersion 1.0, feature.id === KEY, all arrays present, sourceRefs resolve, grill agreed.\n" +
      "Analyst write-guard: may only write sources.md, feature.md, ui-contract.json, grill.md, grill.json.",
  );
}

// =============================================================================
// 7. Phase 1 map
// =============================================================================
{
  const s = pptx.addSlide();
  bg(s); chrome(s, 7); kicker(s, "PHASE 1B  ·  COMPONENT MAP"); title(s, "Input: valid contract + catalog. Output: every id mapped");

  s.addText("Agent: UI Architect  ·  Skill: component-discovery  ·  Stop after the map if you want a second human look", {
    x: 0.4, y: 0.86, w: 12.5, h: 0.22,
    fontSize: 12, fontFace: "Calibri", color: C.mute, margin: 0,
  });

  ioBox(s, 0.35, 1.16, 6.2, 1.45, "INPUT", C.navy,
    "ui-contract.json (fields[].id + actions[].id)\nsrc/components/COMPONENT_CATALOG.md\n1–2 similar screens under screens/ / modules/");
  ioBox(s, 6.75, 1.16, 6.2, 1.45, "OUTPUT → Phase 2 input", C.green,
    "component-map.json\nnpm run component-map:validate -- <KEY>\nDeveloper accepts page-specific / new-shared rationales");

  const hier = [
    ["1 reuse", "Use catalog export as-is", "Must name a catalog export + existing path"],
    ["2 configure", "Same export, props/mode only", "Same catalog rule"],
    ["3 compose", "Combine catalog pieces", "≥1 catalog export required"],
    ["4 extend", "Backward-compatible change to shared", "Catalog name; rationale ≥ 25 chars (warn)"],
    ["5 new-shared", "New wrapper under form/common/layout/table", "Then npm run ui:catalog"],
    ["6 page-specific", "Only this screen, under screens/<ID>/", "Path must exist; do not catalog it"],
  ];
  s.addTable(
    rows(["Decision (in order)", "Meaning", "Validator rule"], hier),
    tableOpts(0.35, 2.78, 12.65, [2.6, 4.4, 5.65], 0.46),
  );

  s.addShape(S.roundRect, {
    x: 0.35, y: 5.72, w: 12.65, h: 1.2,
    fill: { color: C.amberBg }, line: { color: "E6D59A" }, rectRadius: 0.05,
  });
  s.addText("Map validate also fails when", {
    x: 0.55, y: 5.82, w: 12.2, h: 0.22,
    fontSize: 12, fontFace: "Calibri", color: C.amber, bold: true, margin: 0,
  });
  s.addText("featureId ≠ KEY  ·  a contract field/action has no mapping  ·  reuse/configure names a non-catalog export  ·  shared paths leak into screens/  ·  raw MUI Button/TextField/Select/Table/IconButton/Dialog is not a legal mapping target", {
    x: 0.55, y: 6.08, w: 12.2, h: 0.68,
    fontSize: 13, fontFace: "Calibri", color: C.ink, margin: 0,
  });

  s.addNotes(
    "There is no second feature:grill flag for the map. Developer review of component-map.json is the agree.\n" +
      "Hooks: src writes denied until this file exists for an agreed Function Key.",
  );
}

// =============================================================================
// 8. Phase 2 implement
// =============================================================================
{
  const s = pptx.addSlide();
  bg(s); chrome(s, 8); kicker(s, "PHASE 2A  ·  IMPLEMENT"); title(s, "Input: contract + map. Output: one screen. No invented rules");

  s.addText("Agent: UI Architect  ·  Skill: build-react-page  ·  One Function Key / one UX task per pass", {
    x: 0.4, y: 0.86, w: 12.5, h: 0.22,
    fontSize: 12, fontFace: "Calibri", color: C.mute, margin: 0,
  });

  ioBox(s, 0.35, 1.16, 6.2, 1.5, "INPUT (do not reread Confluence)", C.navy,
    "ui-contract.json + component-map.json\nCOMPONENT_CATALOG.md + mapped wrappers\nExisting useApi / apiService for listed APIs only");
  ioBox(s, 6.75, 1.16, 6.2, 1.5, "OUTPUT → Phase 2b input", C.green,
    "src/components/screens/<SCREEN_ID>/<Name>Screen.tsx\nhooks, local tables, i18n en.ts/th.ts\nmoduleRegistry route  ·  ui:guard PASS");

  s.addTable(
    rows(
      ["Must", "Must not"],
      [
        ["Path: screens/<SCREEN_ID>/*Screen.tsx  (S&G §5)", "src/comp or a second kit"],
        ["Chrome: PageContainer, PageHeader, PageFooter, SectionCard", "MUI Button, TextField, Select, Table, IconButton, Dialog"],
        ["Fields: Form* + RHF/Yup only for contract validation", "Raw <button> <input> <select> <textarea>"],
        ["Actions: SaveButton, SearchButton, ConfirmDialog, …", "CSS modules; cataloging the screen in COMPONENT_CATALOG.md"],
        ["Layout MUI only: Box, Grid, Stack, Typography", "Copy allowFiles as-built exceptions into a new screen"],
        ["APIs: only those on the contract; include screen id in path when listed", "Invent permissions, copy, or close a blocking openQuestion"],
      ],
    ),
    tableOpts(0.35, 2.84, 12.65, [6.35, 6.3], 0.5),
  );

  s.addNotes(
    "Thin screens: hook + handlers + catalog composition.\n" +
      "Naming: handle{Event}, is/has/should, UPPER_SNAKE_CASE. See react.instructions.md.\n" +
      "After UI edits, PostToolUse / afterFileEdit re-runs ui:guard.",
  );
}

// =============================================================================
// 9. Phase 2 review
// =============================================================================
{
  const s = pptx.addSlide();
  bg(s); chrome(s, 9); kicker(s, "PHASE 2B  ·  REVIEW"); title(s, "Input: contract + map + diff. Output: written verdict only");

  s.addText("Agent: UI Reviewer  ·  Skill: ui-review  ·  Write-guard: review.md only", {
    x: 0.4, y: 0.86, w: 12.5, h: 0.22,
    fontSize: 12, fontFace: "Calibri", color: C.mute, margin: 0,
  });

  ioBox(s, 0.35, 1.16, 6.2, 1.4, "INPUT", C.navy,
    "ui-contract.json  ·  component-map.json\nChanged screen files + catalog usages\nfeature:validate / map:validate / ui:guard results");
  ioBox(s, 6.75, 1.16, 6.2, 1.4, "OUTPUT (end of this Function Key)", C.green,
    "specs/<KEY>/review.md\nVerdict: PASS | WARNING | FAIL\nFindings stay with the feature, not only in chat");

  s.addTable(
    rows(
      ["Verdict", "Meaning for the team"],
      [
        ["PASS", "Contract fields/actions/states that are not blocked are implemented with mapped catalog exports."],
        ["WARNING", "Ship only if the warning is accepted in writing (typical: blocking openQuestions left open on purpose)."],
        ["FAIL", "Back to Architect. Do not waive in chat. Typical: mapped catalog unused + raw MUI used instead."],
      ],
    ),
    tableOpts(0.35, 2.72, 12.65, [1.8, 10.85], 0.42),
  );

  s.addText("Automatic FAIL when", {
    x: 0.4, y: 4.12, w: 12, h: 0.24,
    fontSize: 13, fontFace: "Calibri", color: C.red, bold: true, margin: 0,
  });
  s.addTable(
    rows(
      ["#", "Condition"],
      [
        ["1", "Mapped catalog export unused and page uses raw MUI Button / TextField / Select / Table / IconButton / Dialog"],
        ["2", "New screen not under src/components/screens/<SCREEN_ID>/ or not named *Screen.tsx"],
        ["3", "S&G §5 naming ignored (handle{Event}, is/has/should, UPPER_SNAKE_CASE)"],
        ["4", "Contract field / action / validation / AC unimplemented with no open question"],
        ["5", "Business behavior invented (copy, validation, API, permissions)"],
        ["6", "ui:guard fails and the file is not a documented allowFiles exception"],
      ],
    ),
    tableOpts(0.35, 4.4, 12.65, [0.7, 11.95], 0.36),
  );

  s.addNotes(
    "Reviewer must not edit src/. Mixing review.md with source edits is denied by the hook.\n" +
      "Do not start another Function Key in the same implementation pass.",
  );
}

// =============================================================================
// 10. Harness commands
// =============================================================================
{
  const s = pptx.addSlide();
  bg(s); chrome(s, 10); kicker(s, "HARNESS"); title(s, "npm scripts — what each gate checks");

  s.addTable(
    rows(
      ["Command", "When", "Pass means", "Fail means"],
      [
        ["feature:fetch", "Phase 0 start", "raw/ + pending grill written", "No page / no key / credentials"],
        ["feature:grill -- <ID>", "Anytime", "Prints status; refreshes grill.md from JSON", "No grill.json (fetch first)"],
        ["feature:grill --agree|--reject", "Phase 0 gate", "status agreed|rejected + who/when", "Agree missing --by; reject missing reason"],
        ["feature:validate -- <ID>", "After contract; in harness", "schema, sourceRefs, grill agreed", "Bad JSON, unknown sourceId, grill not agreed"],
        ["component-map:validate -- <ID>", "After map; in harness", "Every field/action mapped to catalog rules", "Missing mapping, non-catalog reuse"],
        ["ui:guard", "After any governed UI edit", "No forbidden MUI/HTML in screens/modules", "Raw control found (unless allowFiles)"],
        ["ui:catalog", "After new shared export", "COMPONENT_CATALOG.md regenerated", "Export not listed → map reuse fails"],
        ["ui:harness -- <ID>", "Before review handoff", "Runs guard + validate + map validate", "Any child script non-zero"],
        ["ui:harness  (no id)", "Quick check", "ui:guard only", "Forbidden controls in enforcedRoots"],
      ],
    ),
    tableOpts(0.28, 0.92, 12.78, [3.15, 2.35, 3.7, 3.58], 0.52),
  );

  s.addText("ui:harness is the machine gate, not a substitute for human agree. Config: ui-governance.config.json (enforcedRoots, forbiddenMuiControls, allowFiles + reasons).", {
    x: 0.4, y: 5.8, w: 12.5, h: 0.55,
    fontSize: 13, fontFace: "Calibri", color: C.body, margin: 0,
  });
  s.addText("enforcedRoots: src/demoModules, src/modules, src/components/screens   ·   allowed layout: Box, Grid, Stack, Typography   ·   tests/stories skipped", {
    x: 0.4, y: 6.35, w: 12.5, h: 0.55,
    fontSize: 12, fontFace: "Calibri", color: C.mute, margin: 0,
  });

  s.addNotes(
    "Show the command they will type most: npm run ui:harness -- WCRM010203\n" +
      "allowFiles are as-built exceptions. Do not copy those patterns. New screens never get a silent exception.",
  );
}

// =============================================================================
// 11. Guardrails
// =============================================================================
{
  const s = pptx.addSlide();
  bg(s); chrome(s, 11); kicker(s, "GUARDRAILS"); title(s, "Hooks block skipped phases — same Node gates in Cursor, Copilot, and Kiro");

  s.addTable(
    rows(
      ["Where", "Event", "Script", "What it blocks"],
      [
        ["Cursor  .cursor/hooks.json", "preToolUse  Write|StrReplace|Delete", "agent-pre-tool-use.mjs", "Wrong-phase writes (failClosed)"],
        ["Cursor  afterFileEdit", "tsx/jsx under governed roots", "after-file-edit-ui-guard.mjs", "Feeds ui:guard output back into chat"],
        ["Copilot  .github/hooks/", "PreToolUse / PostToolUse", "same agent-*-tool-use.mjs", "Same path + grill gates"],
        ["Copilot custom agent", "Analyst / Architect / Reviewer PreToolUse", "analyst|architect|reviewer-write-guard.mjs", "Sets UI_HOOK_AGENT then runs pre-gate"],
        ["Kiro  .kiro/hooks/ + agents", "PreToolUse / PostToolUse / PostFileSave", "kiro-*-tool-use.mjs <role>", "Same gates; non-zero exit blocks writes"],
        ["All  post edit", "tsx/jsx UI paths", "agent-post-tool-use.mjs → ui:guard", "Exit 2 on raw MUI/HTML"],
      ],
    ),
    tableOpts(0.3, 0.92, 12.75, [2.7, 2.85, 3.35, 3.85], 0.36),
  );

  s.addText("preToolUse rules (scripts/agent-pre-tool-use.mjs)", {
    x: 0.4, y: 3.18, w: 12, h: 0.24,
    fontSize: 13, fontFace: "Calibri", color: C.navy, bold: true, margin: 0,
  });

  s.addTable(
    rows(
      ["If the agent tries to write…", "Denied unless"],
      [
        ["src/comp/**", "Never. Parallel kit is always denied."],
        ["ui-contract.json or component-map.json", 'grill.json status === "agreed"'],
        ["src/components/screens|modules|demoModules *.tsx", "Grill agreed AND component-map.json exists for that Function Key"],
        ["Anything (Analyst)", "Path is sources.md | feature.md | ui-contract.json | grill.md | grill.json"],
        ["Anything (Reviewer)", "Path is exactly specs/<ID>/review.md (no mix with src)"],
        ["src without a Function Key in the edit", "No pending/rejected grill in the repo — otherwise name the KEY"],
      ],
    ),
    tableOpts(0.3, 3.46, 12.75, [5.4, 7.35], 0.38),
  );

  s.addNotes(
    "Cursor Agent has no Copilot custom-agent identity; it relies on path + grill gates.\n" +
      "Copilot agent-scoped hooks need user setting chat.useCustomAgentHooks. Do not commit .vscode/.\n" +
      "Kiro workspace hooks in .kiro/hooks/ plus agent-scoped hooks on .kiro/agents/. Same scripts/ gates; Kiro blocks on exit 2.\n" +
      "Enable Cursor project hooks once; they call the same scripts/ files.",
  );
}

// =============================================================================
// 12. Spec enforcement + run order
// =============================================================================
{
  const s = pptx.addSlide();
  bg(s); chrome(s, 12); kicker(s, "SPEC ENFORCEMENT + RUN ORDER"); title(s, "How we know the screen still matches the DR");

  s.addTable(
    rows(
      ["Spec risk", "Where it is captured", "How it is enforced"],
      [
        ["Wrong or stale DR", "raw/meta.json version + grill agree", "Human review of grill.md; --force clears agree on new version"],
        ["Invented field / validation / API", "openQuestions.blocking + conflicts", "Analyst skill + feature:validate sourceRefs; Reviewer FAIL"],
        ["Scope creep (extra mockup / mode)", "grill identified + agreement.notes", "One UX task per Phase 2 pass; notes become developer-decision sources"],
        ["Wrong component / raw MUI", "component-map + ui-governance.config", "map:validate + ui:guard + Reviewer unused-mapping FAIL"],
        ["Skipped phase", "grill.json / missing map file", "preToolUse deny on contract, map, or src"],
        ["Contract ≠ code", "review.md + ui:harness", "Reviewer reads contract+map+diff, not Confluence"],
        ["Runtime vs requirement mix-up", "Keep contract separate from ScreenManifest / CrudConfig", "AGENTS.md rule — contract is not a runtime config"],
      ],
    ),
    tableOpts(0.28, 0.9, 12.78, [2.85, 4.2, 5.73], 0.46),
  );

  s.addShape(S.roundRect, {
    x: 0.3, y: 4.3, w: 12.75, h: 2.6,
    fill: { color: C.navy }, line: { color: C.navy }, rectRadius: 0.06,
  });
  s.addText("Copy-paste run order for the next Function Key", {
    x: 0.5, y: 4.42, w: 12.3, h: 0.28,
    fontSize: 14, fontFace: "Calibri", color: C.gold, bold: true, margin: 0,
  });
  s.addText(
    "1  Analyst:  feature:fetch → review grill.md → feature:grill -- <ID> --agree --by \"<you>\"\n" +
      "2  Analyst:  write sources.md + feature.md + ui-contract.json → feature:validate -- <ID>\n" +
      "3  Architect: component-map.json from catalog → component-map:validate -- <ID>  → you accept the map\n" +
      "4  Architect: screens/<ID>/*Screen.tsx + route + i18n → ui:guard → ui:harness -- <ID>\n" +
      "5  Reviewer:  review.md only  → fix FAILs  → do not start another KEY in the same pass",
    {
      x: 0.5, y: 4.78, w: 12.3, h: 1.95,
      fontSize: 14, fontFace: "Calibri", color: "FFFFFF", margin: 0,
    },
  );

  s.addNotes(
    "Close by opening WCRM010203 as a worked example: agreed grill, contract, map, screen, review.md WARNING with open questions left open.\n" +
      "Ask the room: next KEY we run together live.",
  );
}

await pptx.writeFile({ fileName: OUT });
console.log(`Wrote ${OUT}`);
