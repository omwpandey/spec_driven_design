import { spawnSync } from "node:child_process";

let input = "";
for await (const chunk of process.stdin) input += chunk;

let payload = {};
try {
  payload = input.trim() ? JSON.parse(input) : {};
} catch {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const text = JSON.stringify({
  ...(payload.tool_input ?? payload.toolInput ?? {}),
  file_path: payload.file_path ?? payload.filePath ?? "",
  path: payload.path ?? "",
});
const touchesUi =
  /\.(tsx|jsx)\b/i.test(text) ||
  /src[\\/](demoModules|modules|pages|features|components[\\/]screens)[\\/]/i.test(text);

if (!touchesUi) {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const cmd = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(cmd, ["run", "ui:guard"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
});

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
if (output) process.stderr.write(output);

if (result.status) {
  const message =
    "UI governance failed. Replace raw MUI Button/TextField/Select/Table/IconButton/Dialog with src/components wrappers, or add a documented allowFiles exception.";
  console.log(
    JSON.stringify({
      continue: true,
      additional_context: message,
      systemMessage: message,
    }),
  );
  // Exit 2 signals block/fail to Copilot PostToolUse; Cursor postToolUse still gets additional_context.
  process.exit(2);
}

console.log(JSON.stringify({ continue: true }));
