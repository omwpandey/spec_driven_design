import assert from "node:assert/strict";
import test from "node:test";
import { buildIdentification, extractUxDesignFromStorage, renderGrillMarkdown } from "./requirement-ingest.mjs";

test("extracts an image after a commented UX heading and Figma link heading", () => {
  const storage = [
    '<h1>Screen Flow</h1><ac:image><ri:attachment ri:filename="flow.png" /></ac:image>',
    '<h1><ac:inline-comment-marker ac:ref="comment">UX Desig</ac:inline-comment-marker>n</h1>',
    '<h1>Link: <a href="https://figma.example/design">Figma</a></h1>',
    '<ac:image><ri:attachment ri:filename="periodic-maintenance.png" /></ac:image>',
    '<h1>Item Description</h1><ac:image><ri:attachment ri:filename="item.png" /></ac:image>',
  ].join("");

  const ux = extractUxDesignFromStorage(storage);

  assert.equal(ux.found, true);
  assert.deepEqual(ux.screens.map((screen) => screen.image), ["periodic-maintenance.png"]);
  assert.deepEqual(ux.skippedOutside, ["flow.png", "item.png"]);
});

test("keeps validation rules once on the shared grill", () => {
  const markdown = [
    "# Validation Rules (Error Messages)",
    "",
    "| S. No. | Event | Cause | Type | Message ID | Display Message | Action |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    "| 1 | Save | No grid record selected | Error | N/A | Please select at least one enquiry call plan. | Retry Save. |",
    "",
    "### Pre-Submit Validations (Frontend Check)",
    "",
    "- Format Checking: Follow-up Date shall accept only a valid calendar date.",
    "- Duplicate Checking: N/A — not applicable to this screen.",
    "",
    "### Post-Submit Validations (Business Validations)",
    "",
    "- Master Data Check: System shall verify the selected destination staff exists.",
  ].join("\n");

  const identification = buildIdentification({
    functionKey: "WCRM020104",
    page: { id: "1", title: "[WCRM020104] Example", version: { number: 1 } },
    url: "https://example.test/pages/1",
    markdown,
    images: [],
    xlsx: { Item_Desc_: "Item_Desc_example.xlsx", API_Data_Map_Details_: "API_example.xlsx" },
    sheetIndex: [
      {
        name: "ui-components",
        rows: [
          ["Field_me-Eng", "Mandatory (Y/N)", "Section"],
          ["Assign Selected Customer To", "Y", "Action Section"],
          ["Group Name", "N", "Search Area"],
        ],
      },
      {
        name: "ui-events",
        rows: [
          ["Event_id", "Processing_Logic", "Error_Message"],
          ["EVT_006", "Validate selected rows and destination staff", "Please select a row."],
        ],
      },
    ],
    missing: ["DATA_MAP_*"],
    screens: [{ id: "UX-001", title: "Screen UX", image: "screen.png" }],
  });
  const validations = identification.identified.validations;
  assert.ok(validations.length >= 4);
  assert.equal(identification.identified.screens.length, 1);
  assert.equal(identification.identified.workbooks.Item_Desc_, "Item_Desc_example.xlsx");
  assert.equal(identification.identified.workbooks.API_Data_Map_Details_, "API_example.xlsx");
  assert.deepEqual(identification.identified.missing, ["DATA_MAP_*"]);
  assert.equal(validations.some((rule) => rule.rule === "Assign Selected Customer To is mandatory"), true);
  assert.equal(validations.some((rule) => /not applicable/i.test(rule.rule)), false);

  const grillMarkdown = renderGrillMarkdown(identification);
  const copies = grillMarkdown.split("Assign Selected Customer To is mandatory").length - 1;
  assert.equal(copies, 1);
  assert.match(grillMarkdown, /npm run feature:grill -- WCRM020104 --agree/);
});