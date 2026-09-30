import assert from "node:assert/strict";
import test from "node:test";
import { extractUxDesignFromStorage } from "./requirement-ingest.mjs";

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