process.env.UI_HOOK_RUNTIME = "kiro";
const agent = process.argv[2];
if (agent) process.env.UI_HOOK_AGENT = agent;
await import("./agent-pre-tool-use.mjs");
