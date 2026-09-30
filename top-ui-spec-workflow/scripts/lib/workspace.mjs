import fs from "node:fs";
import path from "node:path";

export const workflowRoot = process.cwd();
const sharedSpecRoot = path.resolve(workflowRoot, "..", "top-spec-workflow", "specs");

export const appRoot = path.resolve(process.env.TOP_UI_APP_ROOT ?? workflowRoot);
export const specRoot = path.resolve(
  process.env.TOP_UI_SPEC_ROOT ?? (fs.existsSync(sharedSpecRoot) ? sharedSpecRoot : path.join(workflowRoot, "specs")),
);

export function specPath(...parts) {
  return path.join(specRoot, ...parts);
}
