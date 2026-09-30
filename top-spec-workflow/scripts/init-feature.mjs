import fs from "node:fs";
import path from "node:path";
import { specRoot } from "./lib/workspace.mjs";

const [storyId, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(" ").trim();
if (!storyId || !title) {
  console.error('Usage: npm run feature:init -- <STORY-ID> "<Feature Title>"');
  console.error("Prefer: npm run feature:fetch -- <FUNCTION_KEY> then grill agree, then the UI Requirement Analyst.");
  process.exit(1);
}
if (!/^[A-Za-z0-9._-]+$/.test(storyId)) {
  console.error("Story ID contains unsupported characters.");
  process.exit(1);
}

const root = path.join(specRoot, storyId);
fs.mkdirSync(root, { recursive: true });

function write(name, content) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) fs.writeFileSync(file, content);
}

write(
  "sources.md",
  `# ${storyId} Sources\n\n| Source ID | Type | Reference | Notes |\n|---|---|---|---|\n| | | | |\n`,
);
write(
  "feature.md",
  `# ${storyId} — ${title}\n\n## Summary\n\n_To be analyzed after grill agree. Do not write ui-contract.json until grill.json status is agreed._\n\nHappy path: \`npm run feature:fetch -- ${storyId}\` → review grill.md → \`npm run feature:grill -- ${storyId} --agree --by "<name>"\` → UI Requirement Analyst.\n\n## Sources\nSee \`sources.md\`.\n\n## Screen\n\n## Fields\n\n## Actions / Events\n\n## States\n\n## Permissions\n\n## Acceptance Criteria\n\n## Conflicts\n\n## Open Questions\n`,
);
write("review.md", `# ${storyId} UI Review\n\n_Not yet reviewed._\n`);

console.log(`[feature:init] Folder ready: specs/${storyId}`);
console.log("  Wrote sources.md, feature.md, review.md only.");
console.log("  Do not add ui-contract.json until grill.json is agreed (Analyst / analyze-ui-requirement).");
console.log("  Prefer: npm run feature:fetch -- <FUNCTION_KEY>");
