/**
 * One-off generator for the "shared spec, two tracks" briefing deck.
 * Covers: top-spec-workflow as the common DR intake, the phase-wise flow,
 * the split into UI-spec and API-spec tracks (with developer questionnaire
 * mockups for each), and the instructions/prompts responsibility split.
 *
 * Run: node scripts/build-spec-split-overview-ppt.mjs
 */
import PptxGenJS from "pptxgenjs";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "docs", "Spec-Driven-Shared-DR-UI-API-Split.pptx");

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
  blue: "1E5FA8",
  purple: "5B3A8E",
};

mkdirSync(dirname(OUT), { recursive: true });

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "TOP AI Initiatives";
pptx.title = "Shared DR, Two Specialized Tracks";
pptx.subject = "top-spec-workflow → top-ui-spec-workflow / top-api-spec-workflow";

const TOTAL = 9;

function background(s, color = C.wash) {
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color },
    line: { color },
  });
}

function chrome(s, page, total = TOTAL) {
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.08,
    fill: { color: C.red },
    line: { color: C.red },
  });
  s.addText("TOP AI INITIATIVES  ·  Spec-Driven Delivery", {
    x: 0.45,
    y: 7.12,
    w: 8,
    h: 0.28,
    fontSize: 10,
    fontFace: "Calibri",
    color: C.mute,
    margin: 0,
  });
  s.addText(`${page}  /  ${total}`, {
    x: 11.4,
    y: 7.12,
    w: 1.5,
    h: 0.28,
    fontSize: 10,
    fontFace: "Calibri",
    color: C.mute,
    align: "right",
    margin: 0,
  });
}

function kicker(s, text, color = C.red) {
  s.addText(text, {
    x: 0.45,
    y: 0.28,
    w: 10,
    h: 0.22,
    fontSize: 11,
    fontFace: "Calibri",
    color,
    bold: true,
    charSpacing: 1.4,
    margin: 0,
  });
}

function title(s, text, w = 12.4) {
  s.addText(text, {
    x: 0.45,
    y: 0.52,
    w,
    h: 0.42,
    fontSize: 26,
    fontFace: "Calibri",
    color: C.navy,
    bold: true,
    margin: 0,
  });
}

/**
 * Renders a mock "developer questionnaire" chat panel used to illustrate
 * how a developer interacts with the agent after supplying a DR link.
 */
function questionnaireMock(s, { x, y, w, h, accent, turns }) {
  s.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    fill: { color: "1E2431" },
    line: { color: "323A4C" },
    rectRadius: 0.08,
    shadow: { type: "outer", color: "000000", opacity: 0.25, blur: 12, offset: 3 },
  });
  // title bar
  s.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.42,
    fill: { color: "171B26" },
    line: { color: "171B26" },
    rectRadius: 0.08,
  });
  ["EB0A1E", "C4A35A", "1F7A4D"].forEach((c, i) => {
    s.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.2 + i * 0.24,
      y: y + 0.14,
      w: 0.14,
      h: 0.14,
      fill: { color: c },
      line: { color: c },
    });
  });
  s.addText("Developer Questionnaire — agent chat", {
    x: x + 1.0,
    y: y + 0.06,
    w: w - 1.2,
    h: 0.3,
    fontSize: 11,
    fontFace: "Calibri",
    color: "C5CDD8",
    margin: 0,
  });

  let cy = y + 0.62;
  turns.forEach((t) => {
    const isAgent = t.role === "agent";
    const bubbleW = w - 0.9;
    const bx = isAgent ? x + 0.24 : x + 0.66;
    s.addText(isAgent ? "AGENT" : "DEVELOPER", {
      x: bx,
      y: cy,
      w: 2,
      h: 0.2,
      fontSize: 9,
      fontFace: "Calibri",
      bold: true,
      color: isAgent ? accent : C.gold,
      margin: 0,
    });
    cy += 0.22;
    s.addShape(pptx.ShapeType.roundRect, {
      x: bx,
      y: cy,
      w: bubbleW,
      h: t.h,
      fill: { color: isAgent ? "2A3142" : "323A4C" },
      line: { color: isAgent ? accent : "4A5468" },
      rectRadius: 0.06,
    });
    s.addText(t.text, {
      x: bx + 0.16,
      y: cy + 0.06,
      w: bubbleW - 0.32,
      h: t.h - 0.12,
      fontSize: 12,
      fontFace: "Calibri",
      color: "EAEDF2",
      margin: 0,
      valign: "top",
    });
    cy += t.h + 0.18;
  });
}

function footerBanner(s, y, text, sub) {
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.4,
    y,
    w: 12.54,
    h: sub ? 1.0 : 0.62,
    fill: { color: C.navy },
    line: { color: C.navy },
    rectRadius: 0.06,
  });
  s.addText(text, {
    x: 0.62,
    y: y + 0.12,
    w: 12.1,
    h: 0.32,
    fontSize: 14,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    margin: 0,
  });
  if (sub) {
    s.addText(sub, {
      x: 0.62,
      y: y + 0.46,
      w: 12.1,
      h: 0.46,
      fontSize: 12.5,
      fontFace: "Calibri",
      color: "C5CDD8",
      margin: 0,
    });
  }
}

// ---------------------------------------------------------------------------
// Slide 1 — Cover
// ---------------------------------------------------------------------------
{
  const s = pptx.addSlide();
  background(s, C.navyDeep);
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.14,
    h: 7.5,
    fill: { color: C.red },
    line: { color: C.red },
  });
  s.addText("SPEC-DRIVEN DELIVERY", {
    x: 0.7,
    y: 0.42,
    w: 6,
    h: 0.28,
    fontSize: 11,
    fontFace: "Calibri",
    color: C.gold,
    bold: true,
    charSpacing: 2,
    margin: 0,
  });
  s.addText("One Shared DR. Two Specialized Tracks.", {
    x: 0.7,
    y: 0.82,
    w: 12,
    h: 0.7,
    fontSize: 34,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    margin: 0,
  });
  s.addText("How top-spec-workflow feeds a phase-wise pipeline that splits into UI Specification\nand API Specification, each with its own developer questionnaire.", {
    x: 0.7,
    y: 1.58,
    w: 11.6,
    h: 0.7,
    fontSize: 17,
    fontFace: "Calibri",
    color: "C5CDD8",
    margin: 0,
  });

  const cols = [
    { t: "top-spec-workflow", d: "Shared DR intake, traceability, agreed scope — technology-neutral", c: C.gold },
    { t: "top-ui-spec-workflow", d: "React contract, component map, UI questionnaire", c: C.blue },
    { t: "top-api-spec-workflow", d: "API contract, Java generation rules, API questionnaire", c: C.red },
  ];
  cols.forEach((col, i) => {
    const x = 0.7 + i * 4.05;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 2.55,
      w: 3.88,
      h: 2.05,
      fill: { color: "1E2E4F" },
      line: { color: "2A3F68" },
      rectRadius: 0.07,
    });
    s.addShape(pptx.ShapeType.rect, {
      x,
      y: 2.55,
      w: 3.88,
      h: 0.07,
      fill: { color: col.c },
      line: { color: col.c },
    });
    s.addText(col.t, {
      x: x + 0.22,
      y: 2.78,
      w: 3.44,
      h: 0.5,
      fontSize: 16,
      fontFace: "Calibri",
      color: "FFFFFF",
      bold: true,
      margin: 0,
    });
    s.addText(col.d, {
      x: x + 0.22,
      y: 3.32,
      w: 3.44,
      h: 1.1,
      fontSize: 13,
      fontFace: "Calibri",
      color: "C5CDD8",
      margin: 0,
    });
  });

  s.addText("Confidential  ·  Internal use", {
    x: 0.7,
    y: 7.12,
    w: 6,
    h: 0.24,
    fontSize: 10,
    fontFace: "Calibri",
    color: "7A8799",
    margin: 0,
  });
  s.addText("1  /  9", {
    x: 11.2,
    y: 7.12,
    w: 1.5,
    h: 0.24,
    fontSize: 10,
    fontFace: "Calibri",
    color: "7A8799",
    align: "right",
    margin: 0,
  });
  s.addNotes(
    "Frame the whole deck: one shared spec repository takes in the DR once, then two technology-specific " +
      "repositories build their own contracts and questionnaires from it. Nobody re-fetches or re-interprets the DR twice.",
  );
}

// ---------------------------------------------------------------------------
// Slide 2 — Common foundation: top-spec-workflow, phase-wise
// ---------------------------------------------------------------------------
{
  const s = pptx.addSlide();
  background(s);
  chrome(s, 2);
  kicker(s, "THE COMMON FOUNDATION");
  title(s, "top-spec-workflow is the single DR intake — phase by phase");

  const phases = [
    { n: "1", t: "Fetch", d: "Pull the published Design Requirement from Confluence into specs/<FUNCTION_KEY>/raw/." },
    { n: "2", t: "Grill", d: "Generate a reviewable grill pack. Developer agrees, edits, or rejects scope." },
    { n: "3", t: "Record", d: "Agreement is written to grill.json before any contract work starts." },
    { n: "4", t: "Normalize", d: "Only DR-supported facts move into requirements.md, design.md, acceptance.md." },
    { n: "5", t: "Split", d: "UI and API repos each create their own technology contract from the same facts." },
  ];
  const pw = 2.4;
  phases.forEach((p, i) => {
    const x = 0.42 + i * (pw + 0.12);
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.15,
      w: pw,
      h: 2.5,
      fill: { color: C.card },
      line: { color: C.line },
      rectRadius: 0.07,
      shadow: { type: "outer", color: "1B2A4A", opacity: 0.08, blur: 8, offset: 2 },
    });
    s.addText(p.n, {
      x: x + 0.18,
      y: 1.3,
      w: pw - 0.36,
      h: 0.4,
      fontSize: 20,
      fontFace: "Calibri",
      color: C.red,
      bold: true,
      margin: 0,
    });
    s.addText(p.t, {
      x: x + 0.18,
      y: 1.7,
      w: pw - 0.36,
      h: 0.34,
      fontSize: 15,
      fontFace: "Calibri",
      color: C.navy,
      bold: true,
      margin: 0,
    });
    s.addText(p.d, {
      x: x + 0.18,
      y: 2.06,
      w: pw - 0.36,
      h: 1.5,
      fontSize: 11.5,
      fontFace: "Calibri",
      color: C.body,
      margin: 0,
    });
    if (i < phases.length - 1) {
      s.addText("→", {
        x: x + pw + 0.005,
        y: 2.15,
        w: 0.12,
        h: 0.3,
        fontSize: 16,
        color: C.mute,
        align: "center",
        margin: 0,
      });
    }
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.4,
    y: 3.95,
    w: 12.54,
    h: 1.5,
    fill: { color: C.ice },
    line: { color: "C7D6EA" },
    rectRadius: 0.07,
  });
  s.addText("Repository layout", {
    x: 0.62,
    y: 4.1,
    w: 5,
    h: 0.28,
    fontSize: 13,
    fontFace: "Calibri",
    color: C.navy,
    bold: true,
    margin: 0,
  });
  s.addText(
    "specs/<FUNCTION_KEY>/  raw/ · grill.json · grill.md · sources.md · requirements.md · design.md · tasks.md · acceptance.md · decisions.md · feature.md",
    {
      x: 0.62,
      y: 4.42,
      w: 12.1,
      h: 0.9,
      fontSize: 13,
      fontFace: "Consolas",
      color: C.body,
      margin: 0,
    },
  );

  footerBanner(
    s,
    5.7,
    "Technology-specific contracts never live here.",
    "ui-contract.json and component-map.json belong to top-ui-spec-workflow. api-contract.json and Java generation guidance belong to top-api-spec-workflow. Both are stored beside the shared feature folder, not duplicated.",
  );
  s.addNotes(
    "This is the shared spine every feature goes through exactly once: fetch → grill → record → normalize → split. " +
      "The DR is never re-fetched or re-interpreted independently by the UI and API tracks — they read the same agreed facts.",
  );
}

// ---------------------------------------------------------------------------
// Slide 3 — The split (diagram)
// ---------------------------------------------------------------------------
{
  const s = pptx.addSlide();
  background(s);
  chrome(s, 3);
  kicker(s, "AFTER SCOPE IS AGREED");
  title(s, "One DR, two independent specification tracks");

  // Shared spec box
  s.addShape(pptx.ShapeType.roundRect, {
    x: 4.9,
    y: 1.1,
    w: 3.5,
    h: 1.15,
    fill: { color: C.navy },
    line: { color: C.navy },
    rectRadius: 0.07,
  });
  s.addText("top-spec-workflow", {
    x: 5.1,
    y: 1.22,
    w: 3.1,
    h: 0.32,
    fontSize: 15,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    margin: 0,
  });
  s.addText("Agreed DR · requirements.md · design.md · acceptance.md", {
    x: 5.1,
    y: 1.56,
    w: 3.1,
    h: 0.6,
    fontSize: 11,
    fontFace: "Calibri",
    color: "C5CDD8",
    margin: 0,
  });

  // connectors
  s.addShape(pptx.ShapeType.line, {
    x: 5.6,
    y: 2.25,
    w: -2.1,
    h: 1.0,
    line: { color: C.mute, width: 1.5, dashType: "dash" },
  });
  s.addShape(pptx.ShapeType.line, {
    x: 7.7,
    y: 2.25,
    w: 2.1,
    h: 1.0,
    line: { color: C.mute, width: 1.5, dashType: "dash" },
  });

  const tracks = [
    {
      x: 0.7,
      c: C.blue,
      name: "top-ui-spec-workflow",
      role: "UI Specification",
      items: ["ui-contract.json", "component-map.json", "Analyst → Architect → Reviewer agents", "React validation against approved components"],
      out: "→ implemented in top-ui",
    },
    {
      x: 6.9,
      c: C.red,
      name: "top-api-spec-workflow",
      role: "API Specification",
      items: ["api-contract.json", "Entities, actions, permissions, validations", "API Contract Analyst agent", "Java generation prompts (CRUD / SQL-chain)"],
      out: "→ implemented in the Java service",
    },
  ];
  tracks.forEach((t) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: t.x,
      y: 3.35,
      w: 5.7,
      h: 3.15,
      fill: { color: C.card },
      line: { color: C.line },
      rectRadius: 0.07,
      shadow: { type: "outer", color: "1B2A4A", opacity: 0.08, blur: 8, offset: 2 },
    });
    s.addShape(pptx.ShapeType.rect, {
      x: t.x,
      y: 3.35,
      w: 5.7,
      h: 0.08,
      fill: { color: t.c },
      line: { color: t.c },
    });
    s.addText(t.role.toUpperCase(), {
      x: t.x + 0.25,
      y: 3.55,
      w: 5.2,
      h: 0.22,
      fontSize: 11,
      fontFace: "Calibri",
      color: t.c,
      bold: true,
      charSpacing: 1.2,
      margin: 0,
    });
    s.addText(t.name, {
      x: t.x + 0.25,
      y: 3.78,
      w: 5.2,
      h: 0.36,
      fontSize: 18,
      fontFace: "Calibri",
      color: C.navy,
      bold: true,
      margin: 0,
    });
    t.items.forEach((it, i) => {
      const y = 4.28 + i * 0.42;
      s.addShape(pptx.ShapeType.ellipse, {
        x: t.x + 0.28,
        y: y + 0.07,
        w: 0.1,
        h: 0.1,
        fill: { color: t.c },
        line: { color: t.c },
      });
      s.addText(it, {
        x: t.x + 0.48,
        y,
        w: 5.0,
        h: 0.36,
        fontSize: 12.5,
        fontFace: "Calibri",
        color: C.body,
        margin: 0,
      });
    });
    s.addText(t.out, {
      x: t.x + 0.25,
      y: 6.02,
      w: 5.2,
      h: 0.3,
      fontSize: 12.5,
      fontFace: "Calibri",
      color: C.navy,
      bold: true,
      italic: true,
      margin: 0,
    });
  });

  s.addNotes(
    "Once the shared DR facts are agreed in top-spec-workflow, the two tracks proceed independently and in parallel. " +
      "Neither track re-reads Confluence directly — both read the agreed requirements.md / design.md / acceptance.md.",
  );
}

// ---------------------------------------------------------------------------
// Slide 4 — UI Specification track overview
// ---------------------------------------------------------------------------
{
  const s = pptx.addSlide();
  background(s);
  chrome(s, 4);
  kicker(s, "UI SPECIFICATION TRACK", C.blue);
  title(s, "From agreed scope to a reviewed, component-accurate screen");

  const phases = [
    { n: "0", name: "Align", agent: "Analyst", d: "Reads the shared DR facts. Produces a task list scoped to this Function Key." },
    { n: "1", name: "Specify", agent: "Analyst → Architect", d: "Maps every field/action to the approved component library. Writes ui-contract.json + component-map.json." },
    { n: "2", name: "Deliver", agent: "Architect → Reviewer", d: "Builds the screen from the contract. Reviewer checks it against the map before merge." },
  ];
  phases.forEach((p, i) => {
    const x = 0.4 + i * 4.28;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.12,
      w: 4.12,
      h: 2.5,
      fill: { color: C.card },
      line: { color: C.line },
      rectRadius: 0.07,
      shadow: { type: "outer", color: "1B2A4A", opacity: 0.08, blur: 8, offset: 2 },
    });
    s.addShape(pptx.ShapeType.rect, {
      x,
      y: 1.12,
      w: 4.12,
      h: 0.08,
      fill: { color: C.blue },
      line: { color: C.blue },
    });
    s.addText(`PHASE ${p.n}  ·  ${p.name}`, {
      x: x + 0.22,
      y: 1.32,
      w: 3.7,
      h: 0.3,
      fontSize: 13,
      fontFace: "Calibri",
      color: C.blue,
      bold: true,
      margin: 0,
    });
    s.addText(p.agent, {
      x: x + 0.22,
      y: 1.62,
      w: 3.7,
      h: 0.24,
      fontSize: 11.5,
      fontFace: "Calibri",
      color: C.mute,
      italic: true,
      margin: 0,
    });
    s.addText(p.d, {
      x: x + 0.22,
      y: 1.94,
      w: 3.7,
      h: 1.5,
      fontSize: 12.5,
      fontFace: "Calibri",
      color: C.body,
      margin: 0,
    });
  });

  footerBanner(
    s,
    3.85,
    "The developer never talks to raw Confluence markup.",
    "After pasting the DR link once (handled upstream in top-spec-workflow), every remaining interaction is a short, targeted questionnaire — confirm the component, confirm the field, confirm the edge case. See next slide for the actual flow.",
  );

  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.4,
    y: 5.05,
    w: 12.54,
    h: 1.55,
    fill: { color: C.ice },
    line: { color: "C7D6EA" },
    rectRadius: 0.07,
  });
  s.addText("Repository boundary", {
    x: 0.62,
    y: 5.2,
    w: 6,
    h: 0.26,
    fontSize: 13,
    fontFace: "Calibri",
    color: C.navy,
    bold: true,
    margin: 0,
  });
  s.addText(
    "Owns: ui-contract.json, component-map.json, UI agents, React validation scripts (feature:validate, component-map:validate, ui:guard).\nDoes not own: DR evidence, requirements text, or React implementation code — those live in top-spec-workflow and top-ui.",
    {
      x: 0.62,
      y: 5.5,
      w: 12.1,
      h: 1.0,
      fontSize: 12.5,
      fontFace: "Calibri",
      color: C.body,
      margin: 0,
    },
  );
  s.addNotes(
    "Same three-phase model as the earlier UI briefing deck, reframed here as one of two tracks fed by the shared spec repository.",
  );
}

// ---------------------------------------------------------------------------
// Slide 5 — UI Specification questionnaire demo
// ---------------------------------------------------------------------------
{
  const s = pptx.addSlide();
  background(s, C.navyDeep);
  chrome(s, 5);
  kicker(s, "UI SPECIFICATION — DEVELOPER EXPERIENCE", C.blue);
  title(s, "Questionnaire demo: confirming the component map");
  s.addText(
    "After the DR link is provided and scope is agreed, the Architect agent asks short, specific questions before writing ui-contract.json.",
    { x: 0.45, y: 0.94, w: 12.2, h: 0.4, fontSize: 14, fontFace: "Calibri", color: "C5CDD8", margin: 0 },
  );

  questionnaireMock(s, {
    x: 0.5,
    y: 1.5,
    w: 7.6,
    h: 5.4,
    accent: C.blue,
    turns: [
      { role: "agent", text: "WCRM020104 has a filter grid with 12 fields. I'll map 'Customer Status' to the approved <ComboFilter> component backed by combo API CRM_STATUS. Confirm?", h: 0.66 },
      { role: "dev", text: "Confirmed.", h: 0.32 },
      { role: "agent", text: "The DR shows a date range picker for 'Registered Between'. Approved library has <DateRangeField>. Use it, or is a custom control required?", h: 0.6 },
      { role: "dev", text: "Use <DateRangeField>.", h: 0.32 },
      { role: "agent", text: "Grid has 40+ rows expected. Apply the standard 20/page pagination default, or override?", h: 0.5 },
      { role: "dev", text: "Standard default is fine.", h: 0.32 },
    ],
  });

  const cardX = 8.3;
  s.addShape(pptx.ShapeType.roundRect, {
    x: cardX,
    y: 1.5,
    w: 4.55,
    h: 5.4,
    fill: { color: "1E2E4F" },
    line: { color: "2A3F68" },
    rectRadius: 0.07,
  });
  s.addText("Why this matters", {
    x: cardX + 0.25,
    y: 1.72,
    w: 4.1,
    h: 0.32,
    fontSize: 15,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    margin: 0,
  });
  const bullets = [
    "Every question ties to a specific DR fact — nothing is invented.",
    "Answers are recorded directly into ui-contract.json / component-map.json.",
    "No question is asked twice: unresolved items block the next phase instead of being silently guessed.",
    "The developer stays in control of every UI decision; the agent only proposes.",
  ];
  bullets.forEach((b, i) => {
    const y = 2.2 + i * 1.02;
    s.addShape(pptx.ShapeType.ellipse, {
      x: cardX + 0.25,
      y: y + 0.06,
      w: 0.12,
      h: 0.12,
      fill: { color: C.blue },
      line: { color: C.blue },
    });
    s.addText(b, {
      x: cardX + 0.5,
      y,
      w: 3.85,
      h: 0.95,
      fontSize: 12.5,
      fontFace: "Calibri",
      color: "C5CDD8",
      margin: 0,
    });
  });
  s.addNotes(
    "This mockup illustrates the interaction pattern, not a literal transcript. The point for leadership: questions are narrow, " +
      "traceable to the DR, and recorded as durable contract data rather than left in chat history.",
  );
}

// ---------------------------------------------------------------------------
// Slide 6 — API Specification track overview
// ---------------------------------------------------------------------------
{
  const s = pptx.addSlide();
  background(s);
  chrome(s, 6);
  kicker(s, "API SPECIFICATION TRACK  ·  1 OF 4");
  title(s, "Contract-first: agreed scope becomes api-contract.json");

  s.addText(
    "The API Contract Analyst agent runs after the shared grill is agreed. It produces or reviews the API contract only — Java implementation stays in the Java application repository.",
    { x: 0.45, y: 0.94, w: 12.3, h: 0.5, fontSize: 14, fontFace: "Calibri", color: C.body, margin: 0 },
  );

  const rows = [
    { t: "Entities & mappings", d: "Tables, primary keys, relationships — only what the DR and schema confirm." },
    { t: "Fields & validation", d: "Data types, nullability, lengths; validation messages as error codes, not prose." },
    { t: "Actions & registration", d: "Function ID, actions, and one registration path per functionId." },
    { t: "Rules & permissions", d: "Named query / SQL-chain needs, processor rules, permission and error-code references." },
  ];
  rows.forEach((r, i) => {
    const y = 1.65 + i * 0.85;
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.42,
      y,
      w: 12.5,
      h: 0.72,
      fill: { color: C.card },
      line: { color: C.line },
      rectRadius: 0.06,
    });
    s.addShape(pptx.ShapeType.rect, {
      x: 0.42,
      y,
      w: 0.07,
      h: 0.72,
      fill: { color: C.red },
      line: { color: C.red },
    });
    s.addText(r.t, {
      x: 0.66,
      y: y + 0.09,
      w: 3.2,
      h: 0.54,
      fontSize: 13.5,
      fontFace: "Calibri",
      color: C.navy,
      bold: true,
      margin: 0,
      valign: "middle",
    });
    s.addText(r.d, {
      x: 4.0,
      y: y + 0.09,
      w: 8.8,
      h: 0.54,
      fontSize: 12.5,
      fontFace: "Calibri",
      color: C.body,
      margin: 0,
      valign: "middle",
    });
  });

  footerBanner(
    s,
    5.35,
    "Only the API contract is the approved input for Java scaffolding.",
    "Prompts must not generate Java directly from raw DR files or from ui-contract.json. Unresolved material behavior stays unresolved — never invented.",
  );
  s.addNotes("First of four API-focused slides: what api-contract.json must contain before any code generation is attempted.");
}

// ---------------------------------------------------------------------------
// Slide 7 — API Specification questionnaire demo
// ---------------------------------------------------------------------------
{
  const s = pptx.addSlide();
  background(s, C.navyDeep);
  chrome(s, 7);
  kicker(s, "API SPECIFICATION  ·  2 OF 4  ·  DEVELOPER EXPERIENCE", C.red);
  title(s, "Questionnaire demo: confirming the API contract");
  s.addText(
    "Before api-contract.json is written, the agent confirms entity mapping, concurrency handling, and permissions — each traceable to a DR fact or an explicit developer decision.",
    { x: 0.45, y: 0.94, w: 12.3, h: 0.5, fontSize: 14, fontFace: "Calibri", color: "C5CDD8", margin: 0 },
  );

  questionnaireMock(s, {
    x: 0.5,
    y: 1.55,
    w: 7.6,
    h: 5.35,
    accent: C.red,
    turns: [
      { role: "agent", text: "DR confirms CUSTOMER_MASTER as the entity, PK 'customerId'. I found no documented FK to ACCOUNT_MASTER — should the relationship be added?", h: 0.66 },
      { role: "dev", text: "No, leave it unresolved for now.", h: 0.32 },
      { role: "agent", text: "'Update balance' looks concurrency-sensitive. Use SELECT_FOR_UPDATE + a native guarded update with a version predicate?", h: 0.6 },
      { role: "dev", text: "Yes, that's the standard pattern here.", h: 0.32 },
      { role: "agent", text: "Which permission code guards PUT /customers/{id} — CRM_CUST_EDIT?", h: 0.44 },
      { role: "dev", text: "Confirmed: CRM_CUST_EDIT.", h: 0.32 },
    ],
  });

  const cardX = 8.3;
  s.addShape(pptx.ShapeType.roundRect, {
    x: cardX,
    y: 1.55,
    w: 4.55,
    h: 5.35,
    fill: { color: "2A1620" },
    line: { color: "4A2430" },
    rectRadius: 0.07,
  });
  s.addText("Why this matters", {
    x: cardX + 0.25,
    y: 1.77,
    w: 4.1,
    h: 0.32,
    fontSize: 15,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    margin: 0,
  });
  const bullets = [
    "Concurrency and permission decisions are locked in before any Java is generated.",
    "Unknown behavior (like an undocumented FK) is left unresolved rather than guessed.",
    "Every answer becomes a durable field in api-contract.json, sourced back to a DR reference.",
    "Java generation prompts read only the agreed contract — never raw DR or chat memory.",
  ];
  bullets.forEach((b, i) => {
    const y = 2.25 + i * 1.02;
    s.addShape(pptx.ShapeType.ellipse, {
      x: cardX + 0.25,
      y: y + 0.06,
      w: 0.12,
      h: 0.12,
      fill: { color: C.red },
      line: { color: C.red },
    });
    s.addText(b, {
      x: cardX + 0.5,
      y,
      w: 3.85,
      h: 0.95,
      fontSize: 12.5,
      fontFace: "Calibri",
      color: "E7C9CE",
      margin: 0,
    });
  });
  s.addNotes("Second API slide: the contract questionnaire is where concurrency and permission risk gets resolved before code exists.");
}

// ---------------------------------------------------------------------------
// Slide 8 — API Specification: contract to Java generation pipeline
// ---------------------------------------------------------------------------
{
  const s = pptx.addSlide();
  background(s);
  chrome(s, 8);
  kicker(s, "API SPECIFICATION  ·  3 OF 4");
  title(s, "From an agreed contract to generated, framework-compliant Java");

  const steps = [
    { n: "1", t: "create-api-contract", d: "Writes the single durable api-contract.json from the agreed shared spec." },
    { n: "2", t: "review-api-contract", d: "Checks traceability back to the DR and fit against the TOP Spring Boot starter." },
    { n: "3", t: "generate-crud / sql-chain", d: "Generates config, entity, dto, repository, processor files — never a controller." },
    { n: "4", t: "review-generated-function", d: "Reviews generated Java against the contract before it reaches the service module." },
  ];
  steps.forEach((st, i) => {
    const x = 0.42 + i * 3.08;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.15,
      w: 2.9,
      h: 2.35,
      fill: { color: C.card },
      line: { color: C.line },
      rectRadius: 0.07,
      shadow: { type: "outer", color: "1B2A4A", opacity: 0.08, blur: 8, offset: 2 },
    });
    s.addText(st.n, {
      x: x + 0.18,
      y: 1.3,
      w: 2.5,
      h: 0.34,
      fontSize: 18,
      fontFace: "Calibri",
      color: C.red,
      bold: true,
      margin: 0,
    });
    s.addText(st.t, {
      x: x + 0.18,
      y: 1.64,
      w: 2.56,
      h: 0.55,
      fontSize: 13,
      fontFace: "Consolas",
      color: C.navy,
      bold: true,
      margin: 0,
    });
    s.addText(st.d, {
      x: x + 0.18,
      y: 2.22,
      w: 2.56,
      h: 1.2,
      fontSize: 11.5,
      fontFace: "Calibri",
      color: C.body,
      margin: 0,
    });
    if (i < steps.length - 1) {
      s.addText("→", { x: x + 2.9, y: 2.15, w: 0.16, h: 0.3, fontSize: 16, color: C.mute, align: "center", margin: 0 });
    }
  });

  footerBanner(
    s,
    3.75,
    "The framework already owns CRUD, auth, pagination, and OpenAPI.",
    "GenericController, GenericService, global exception handling, and authorization ship with top-spring-boot-starter. Generated code targets only <function-key>/config, entity, dto, repository, processor.",
  );

  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.4,
    y: 4.95,
    w: 12.54,
    h: 1.65,
    fill: { color: C.ice },
    line: { color: "C7D6EA" },
    rectRadius: 0.07,
  });
  s.addText("Never generated", {
    x: 0.62,
    y: 5.1,
    w: 5,
    h: 0.28,
    fontSize: 13,
    fontFace: "Calibri",
    color: C.red,
    bold: true,
    margin: 0,
  });
  s.addText(
    "Feature controllers · CRUD services · exception handlers · security filters · manual OpenAPI annotations · DTO mappers · custom repository query methods — the framework already provides these.",
    { x: 0.62, y: 5.42, w: 12.1, h: 0.95, fontSize: 12.5, fontFace: "Calibri", color: C.body, margin: 0 },
  );
  s.addNotes("Third API slide: the generation pipeline, and an explicit boundary of what the agent must not scaffold.");
}

// ---------------------------------------------------------------------------
// Slide 9 — API Specification: quality gates + Responsibility split
// ---------------------------------------------------------------------------
{
  const s = pptx.addSlide();
  background(s);
  chrome(s, 9);
  kicker(s, "API SPECIFICATION  ·  4 OF 4  ·  RESPONSIBILITY SPLIT");
  title(s, "Who tells the agent what: instructions, main instructions, prompts");

  const cols = [
    {
      c: C.navy,
      t: "copilot-instructions.md",
      sub: "Project constitution — always on",
      items: [
        "Applies broadly across the whole workspace",
        "Tech stack, architecture, mandatory rules",
        "Keeps requirements/design/tasks ordering",
        "Stays short — no detailed workflows",
      ],
    },
    {
      c: C.red,
      t: "main-source-code.instructions.md",
      sub: "Scoped rules — applyTo: **/src/main/java/**",
      items: [
        "Hard rules for framework-consuming Java code",
        "No controllers, CRUD services, security filters",
        "Named query, filter, processor, logging conventions",
        "Enforced only where the glob pattern matches",
      ],
    },
    {
      c: C.blue,
      t: "prompts/*.prompt.md",
      sub: "On-demand workflows — invoked explicitly",
      items: [
        "create / review-api-contract for the contract",
        "generate-crud / generate-sql-chain-function for code",
        "generate-cucumber-feature, review-generated-function",
        "Each prompt reads the contract, not the raw DR",
      ],
    },
  ];
  cols.forEach((col, i) => {
    const x = 0.4 + i * 4.24;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.12,
      w: 4.08,
      h: 3.55,
      fill: { color: C.card },
      line: { color: C.line },
      rectRadius: 0.07,
      shadow: { type: "outer", color: "1B2A4A", opacity: 0.08, blur: 8, offset: 2 },
    });
    s.addShape(pptx.ShapeType.rect, {
      x,
      y: 1.12,
      w: 4.08,
      h: 0.08,
      fill: { color: col.c },
      line: { color: col.c },
    });
    s.addText(col.t, {
      x: x + 0.2,
      y: 1.32,
      w: 3.68,
      h: 0.55,
      fontSize: 14.5,
      fontFace: "Consolas",
      color: C.navy,
      bold: true,
      margin: 0,
    });
    s.addText(col.sub, {
      x: x + 0.2,
      y: 1.86,
      w: 3.68,
      h: 0.3,
      fontSize: 11.5,
      fontFace: "Calibri",
      color: C.mute,
      italic: true,
      margin: 0,
    });
    col.items.forEach((it, j) => {
      const y = 2.28 + j * 0.6;
      s.addShape(pptx.ShapeType.ellipse, {
        x: x + 0.2,
        y: y + 0.06,
        w: 0.1,
        h: 0.1,
        fill: { color: col.c },
        line: { color: col.c },
      });
      s.addText(it, {
        x: x + 0.4,
        y,
        w: 3.5,
        h: 0.56,
        fontSize: 11.5,
        fontFace: "Calibri",
        color: C.body,
        margin: 0,
      });
    });
  });

  footerBanner(
    s,
    4.85,
    "Rule of thumb: instructions constrain how code is written; prompts drive what gets produced, step by step.",
    "copilot-instructions.md applies everywhere. main-source-code.instructions.md narrows to Java main source via applyTo. Prompts are invoked deliberately for one workflow step (contract, generation, review) and never substitute for either instructions file.",
  );
  s.addNotes(
    "Closing slide: this is the piece people usually confuse. Instructions are always-on guardrails (global or path-scoped); " +
      "prompts are opt-in, single-purpose workflows the developer or agent invokes explicitly, and they still operate inside the instruction guardrails.",
  );
}

await pptx.writeFile({ fileName: OUT });
console.log(`Wrote ${OUT}`);
