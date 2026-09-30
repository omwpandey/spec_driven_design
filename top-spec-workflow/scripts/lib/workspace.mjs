import path from "node:path";

export const workflowRoot = process.cwd();
const defaultSpecRoot = path.join(workflowRoot, "specs");

export const specRoot = path.resolve(
  process.env.TOP_SPEC_ROOT ?? process.env.TOP_UI_SPEC_ROOT ?? defaultSpecRoot,
);

export function specPath(...parts) {
  return path.join(specRoot, ...parts);
}
