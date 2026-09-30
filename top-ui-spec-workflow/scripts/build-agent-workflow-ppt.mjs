/**
 * One-off generator for the leadership briefing deck.
 * Run: node scripts/build-agent-workflow-ppt.mjs
 */
import PptxGenJS from "pptxgenjs";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "docs", "Spec-Driven-UI-Agent-Operating-Model.pptx");

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
};

mkdirSync(dirname(OUT), { recursive: true });

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "TOPS CRM UI";
pptx.title = "Spec-Driven UI Delivery with AI Agents";
pptx.subject = "Leadership briefing — Phase 0 to Phase 2 operating model";

function chrome(slide, page, total = 3) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.08,
    fill: { color: C.red },
    line: { color: C.red },
  });
  slide.addText("TOPS CRM  ·  UI Delivery", {
    x: 0.45,
    y: 7.12,
    w: 8,
    h: 0.28,
    fontSize: 10,
    fontFace: "Calibri",
    color: C.mute,
    margin: 0,
  });
  slide.addText(`${page}  /  ${total}`, {
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

// ---------------------------------------------------------------------------
// Slide 1 — Why this model
// ---------------------------------------------------------------------------
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: C.navyDeep },
    line: { color: C.navyDeep },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.14,
    h: 7.5,
    fill: { color: C.red },
    line: { color: C.red },
  });

  s.addText("LEADERSHIP BRIEFING", {
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

  s.addText("Spec-Driven UI Delivery", {
    x: 0.7,
    y: 0.82,
    w: 12,
    h: 0.62,
    fontSize: 36,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    margin: 0,
  });

  s.addText("How the CRM UI team uses AI agents — with published requirements\nand people still deciding what gets built.", {
    x: 0.7,
    y: 1.5,
    w: 11.5,
    h: 0.7,
    fontSize: 18,
    fontFace: "Calibri",
    color: "C5CDD8",
    margin: 0,
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.7,
    y: 2.4,
    w: 11.95,
    h: 1.15,
    fill: { color: "1E2E4F" },
    line: { color: "2A3F68" },
    rectRadius: 0.06,
  });
  s.addText("Agents accelerate the work. They do not replace the Design Requirement, the component library, or developer accountability.", {
    x: 0.95,
    y: 2.58,
    w: 11.45,
    h: 0.8,
    fontSize: 16,
    fontFace: "Calibri",
    color: "FFFFFF",
    margin: 0,
  });

  const pillars = [
    {
      k: "01",
      t: "Faster, repeatable cycle",
      d: "One path from a published Design Requirement to a reviewed screen — the same way, every Function Key.",
    },
    {
      k: "02",
      t: "One look, one library",
      d: "Screens are composed from the approved CRM component set. No parallel kits. No one-off controls.",
    },
    {
      k: "03",
      t: "AI under control",
      d: "Humans sign off before contract and before code. Agents cannot invent rules, APIs, or validation.",
    },
  ];

  pillars.forEach((p, i) => {
    const x = 0.7 + i * 4.05;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 3.8,
      w: 3.88,
      h: 2.55,
      fill: { color: "1E2E4F" },
      line: { color: "2A3F68" },
      rectRadius: 0.06,
    });
    s.addText(p.k, {
      x: x + 0.22,
      y: 3.98,
      w: 3.4,
      h: 0.28,
      fontSize: 12,
      fontFace: "Calibri",
      color: C.red,
      bold: true,
      margin: 0,
    });
    s.addText(p.t, {
      x: x + 0.22,
      y: 4.32,
      w: 3.44,
      h: 0.55,
      fontSize: 16,
      fontFace: "Calibri",
      color: "FFFFFF",
      bold: true,
      margin: 0,
    });
    s.addText(p.d, {
      x: x + 0.22,
      y: 4.95,
      w: 3.44,
      h: 1.15,
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
  s.addText("1  /  3", {
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
    "Open with the problem we solved: AI can generate screens quickly, but without a published Design Requirement and human gates, quality and accountability disappear.\n\n" +
      "The one-line takeaway: agents speed the work; they do not invent the requirement.\n\n" +
      "Three pillars: (1) same path every Function Key, (2) one approved component library, (3) people sign off before contract and before code.",
  );
}

// ---------------------------------------------------------------------------
// Slide 2 — How the team uses agents
// ---------------------------------------------------------------------------
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: C.wash },
    line: { color: C.wash },
  });
  chrome(s, 2);

  s.addText("THE OPERATING MODEL", {
    x: 0.45,
    y: 0.28,
    w: 8,
    h: 0.22,
    fontSize: 11,
    fontFace: "Calibri",
    color: C.red,
    bold: true,
    charSpacing: 1.4,
    margin: 0,
  });
  s.addText("Three phases. Three agents. A person at every gate.", {
    x: 0.45,
    y: 0.52,
    w: 12.4,
    h: 0.42,
    fontSize: 26,
    fontFace: "Calibri",
    color: C.navy,
    bold: true,
    margin: 0,
  });

  const phases = [
    {
      n: "0",
      name: "Align",
      agent: "Analyst",
      does: "Fetch the published Design Requirement. Turn it into a task list the team can see.",
      gate: "Developer agrees the scope — or edits / rejects it.",
      out: "Agreed task list",
    },
    {
      n: "1",
      name: "Specify",
      agent: "Analyst → Architect",
      does: "Write a requirements contract. Map every field and action to the approved component library.",
      gate: "Developer accepts the map. No product screen is written yet.",
      out: "Contract + component map",
    },
    {
      n: "2",
      name: "Deliver",
      agent: "Architect → Reviewer",
      does: "Build one screen from the contract and map. Independent agent reviews against both.",
      gate: "Review must pass. Failures go back — they are not waived in chat.",
      out: "Screen + written verdict",
    },
  ];

  phases.forEach((p, i) => {
    const x = 0.4 + i * 4.28;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.12,
      w: 4.12,
      h: 4.55,
      fill: { color: C.card },
      line: { color: C.line },
      rectRadius: 0.07,
      shadow: { type: "outer", color: "1B2A4A", opacity: 0.08, blur: 10, offset: 2 },
    });
    s.addShape(pptx.ShapeType.rect, {
      x,
      y: 1.12,
      w: 4.12,
      h: 0.08,
      fill: { color: C.red },
      line: { color: C.red },
    });
    s.addText(`PHASE  ${p.n}`, {
      x: x + 0.22,
      y: 1.32,
      w: 3.7,
      h: 0.24,
      fontSize: 11,
      fontFace: "Calibri",
      color: C.red,
      bold: true,
      margin: 0,
    });
    s.addText(p.name, {
      x: x + 0.22,
      y: 1.56,
      w: 3.7,
      h: 0.4,
      fontSize: 24,
      fontFace: "Calibri",
      color: C.navy,
      bold: true,
      margin: 0,
    });
    s.addText(p.agent, {
      x: x + 0.22,
      y: 1.98,
      w: 3.7,
      h: 0.26,
      fontSize: 12,
      fontFace: "Calibri",
      color: C.mute,
      italic: true,
      margin: 0,
    });
    s.addText(p.does, {
      x: x + 0.22,
      y: 2.38,
      w: 3.7,
      h: 1.15,
      fontSize: 13,
      fontFace: "Calibri",
      color: C.body,
      margin: 0,
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.18,
      y: 3.62,
      w: 3.76,
      h: 1.22,
      fill: { color: "FFF4F4" },
      line: { color: "F3D0D3" },
      rectRadius: 0.05,
    });
    s.addText("HUMAN GATE", {
      x: x + 0.32,
      y: 3.72,
      w: 3.5,
      h: 0.22,
      fontSize: 10,
      fontFace: "Calibri",
      color: C.red,
      bold: true,
      margin: 0,
    });
    s.addText(p.gate, {
      x: x + 0.32,
      y: 3.96,
      w: 3.5,
      h: 0.78,
      fontSize: 12,
      fontFace: "Calibri",
      color: C.ink,
      margin: 0,
    });
    s.addText(p.out, {
      x: x + 0.22,
      y: 5.02,
      w: 3.7,
      h: 0.42,
      fontSize: 13,
      fontFace: "Calibri",
      color: C.navy,
      bold: true,
      margin: 0,
    });
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.4,
    y: 5.82,
    w: 12.54,
    h: 1.12,
    fill: { color: C.navy },
    line: { color: C.navy },
    rectRadius: 0.06,
  });
  s.addText("One Function Key per pass. Several mockups on a DR are separate deliveries — not one mixed build.", {
    x: 0.62,
    y: 5.96,
    w: 12.1,
    h: 0.32,
    fontSize: 14,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    margin: 0,
  });
  s.addText("If the published page changes, the team re-agrees the scope. Old sign-off does not carry forward. Agents read the contract — they do not go back to Confluence to improvise.", {
    x: 0.62,
    y: 6.3,
    w: 12.1,
    h: 0.48,
    fontSize: 13,
    fontFace: "Calibri",
    color: "C5CDD8",
    margin: 0,
  });
  s.addNotes(
    "Walk left to right. Spend most time on the red HUMAN GATE boxes — that is what leadership needs to hear.\n\n" +
      "Phase 0: Analyst fetches the published DR and produces a task list. Work does not start until a named developer agrees.\n\n" +
      "Phase 1: Analyst writes the contract. Architect maps fields to the approved library. Still no product screen.\n\n" +
      "Phase 2: Architect builds one screen. Reviewer writes a PASS / WARNING / FAIL. Failures go back; they are not waived in chat.\n\n" +
      "If asked about tools: Copilot custom agents or Cursor Agent, same gates in both.",
  );
}

// ---------------------------------------------------------------------------
// Slide 3 — What leadership gets
// ---------------------------------------------------------------------------
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: C.wash },
    line: { color: C.wash },
  });
  chrome(s, 3);

  s.addText("ACCOUNTABILITY", {
    x: 0.45,
    y: 0.28,
    w: 8,
    h: 0.22,
    fontSize: 11,
    fontFace: "Calibri",
    color: C.red,
    bold: true,
    charSpacing: 1.4,
    margin: 0,
  });
  s.addText("What this gives the organisation", {
    x: 0.45,
    y: 0.52,
    w: 12.4,
    h: 0.42,
    fontSize: 26,
    fontFace: "Calibri",
    color: C.navy,
    bold: true,
    margin: 0,
  });

  // Left card — prevents
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.4,
    y: 1.12,
    w: 6.15,
    h: 4.05,
    fill: { color: C.card },
    line: { color: C.line },
    rectRadius: 0.07,
  });
  s.addText("We stop", {
    x: 0.68,
    y: 1.32,
    w: 5.6,
    h: 0.36,
    fontSize: 18,
    fontFace: "Calibri",
    color: C.navy,
    bold: true,
    margin: 0,
  });

  const stops = [
    "Screens built from chat memory instead of the published Design Requirement",
    "Invented validation, APIs, permissions, or field rules",
    "Inconsistent UI and a second, unofficial component kit",
    "Skipping review, or shipping several screens in one unmanaged pass",
  ];
  stops.forEach((t, i) => {
    const y = 1.82 + i * 0.78;
    s.addShape(pptx.ShapeType.ellipse, {
      x: 0.72,
      y: y + 0.08,
      w: 0.16,
      h: 0.16,
      fill: { color: C.red },
      line: { color: C.red },
    });
    s.addText(t, {
      x: 1.05,
      y,
      w: 5.2,
      h: 0.7,
      fontSize: 14,
      fontFace: "Calibri",
      color: C.body,
      margin: 0,
    });
  });

  // Right card — delivers
  s.addShape(pptx.ShapeType.roundRect, {
    x: 6.75,
    y: 1.12,
    w: 6.18,
    h: 4.05,
    fill: { color: C.navy },
    line: { color: C.navy },
    rectRadius: 0.07,
  });
  s.addText("Leadership can expect", {
    x: 7.02,
    y: 1.32,
    w: 5.7,
    h: 0.36,
    fontSize: 18,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    margin: 0,
  });

  const gets = [
    { t: "Traceability", d: "Every screen ties back to a DR version and a named developer sign-off." },
    { t: "Quality gates", d: "Automated checks block the next phase if the previous one was skipped." },
    { t: "Reuse at scale", d: "New Function Keys consume the same library — delivery gets cheaper over time." },
    { t: "Audit-ready review", d: "A written PASS / WARNING / FAIL sits with the feature, not only in chat." },
  ];
  gets.forEach((g, i) => {
    const y = 1.8 + i * 0.8;
    s.addText(g.t, {
      x: 7.02,
      y,
      w: 5.7,
      h: 0.28,
      fontSize: 14,
      fontFace: "Calibri",
      color: C.gold,
      bold: true,
      margin: 0,
    });
    s.addText(g.d, {
      x: 7.02,
      y: y + 0.28,
      w: 5.7,
      h: 0.42,
      fontSize: 13,
      fontFace: "Calibri",
      color: "C5CDD8",
      margin: 0,
    });
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.4,
    y: 5.35,
    w: 12.54,
    h: 1.55,
    fill: { color: C.card },
    line: { color: C.line },
    rectRadius: 0.07,
  });
  s.addText("Ask of leadership", {
    x: 0.68,
    y: 5.5,
    w: 12,
    h: 0.28,
    fontSize: 13,
    fontFace: "Calibri",
    color: C.red,
    bold: true,
    margin: 0,
  });
  s.addText("Adopt this as the standard way CRM UI is delivered. Scope is agreed before work starts. Agents implement only what was agreed. Review is a phase, not an afterthought.", {
    x: 0.68,
    y: 5.84,
    w: 12,
    h: 0.8,
    fontSize: 16,
    fontFace: "Calibri",
    color: C.navy,
    margin: 0,
  });
  s.addNotes(
    "Close on accountability, not tooling.\n\n" +
      "Traceability: DR version + named sign-off sits with the feature.\n" +
      "Gates: the next phase cannot start if the previous one was skipped.\n" +
      "Reuse: every new Function Key consumes the same library — cost per screen should fall.\n\n" +
      "The ask: make this the standard operating model for CRM UI. Not a pilot, not optional for 'small' screens.",
  );
}

await pptx.writeFile({ fileName: OUT });
console.log(`Wrote ${OUT}`);
