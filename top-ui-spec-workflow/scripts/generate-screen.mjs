import fs from "node:fs";
import path from "node:path";
import { appRoot, specRoot } from "./lib/workspace.mjs";

const storyId = process.argv[2];
const force = process.argv.includes("--force");

if (!storyId) {
  console.error("Usage: npm run screen:generate -- <FUNCTION_KEY> [--force]");
  process.exit(1);
}

const contractFile = path.join(specRoot, storyId, "ui-contract.json");
const mapFile = path.join(specRoot, storyId, "component-map.json");
if (!fs.existsSync(contractFile) || !fs.existsSync(mapFile)) {
  console.error(`[screen:generate] Missing contract or component map for ${storyId}`);
  process.exit(1);
}

const contract = JSON.parse(fs.readFileSync(contractFile, "utf8"));
if (contract.feature?.id !== storyId) {
  console.error(`[screen:generate] feature.id must equal ${storyId}`);
  process.exit(1);
}

const title = contract.feature.title || storyId;
const route = contract.screen?.route;
const api = contract.screen?.api;
if (!route) {
  console.error(`[screen:generate] screen.route is required for ${storyId}`);
  process.exit(1);
}
if (!Array.isArray(api) || !api.length) {
  console.error(`[screen:generate] screen.api must contain at least one API definition for ${storyId}`);
  process.exit(1);
}
const pascalName = title
  .replace(/[^A-Za-z0-9]+/g, " ")
  .trim()
  .split(/\s+/)
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join("") || storyId;
const pageName = `${pascalName}Page`;
const styleBaseName = `${pascalName.charAt(0).toLowerCase()}${pascalName.slice(1)}`;
const styleFileName = `${styleBaseName}.styles`;
const styleExportName = `${styleBaseName}Styles`;
const moduleDir = path.join(appRoot, "src", "modules", storyId);
const pageFile = path.join(moduleDir, `${pageName}.tsx`);
const styleFile = path.join(moduleDir, `${styleFileName}.ts`);
const indexFile = path.join(moduleDir, "index.ts");
const serviceFile = path.join(appRoot, "src", "services", `${storyId}Service.ts`);
const generatedRoutesFile = path.join(appRoot, "src", "app", "router", "generatedRoutes.ts");
const generatedModulesFile = path.join(appRoot, "src", "core", "manifest", "generatedModuleRegistry.ts");
const generatedHandlersFile = path.join(appRoot, "src", "mocks", "generatedHandlers.ts");

if (!force && (fs.existsSync(pageFile) || fs.existsSync(styleFile) || fs.existsSync(indexFile) || fs.existsSync(serviceFile))) {
  console.error(`[screen:generate] Output already exists for ${storyId}; use --force to replace it.`);
  process.exit(1);
}

const sections = [...new Set((contract.fields ?? []).map((field) => field.section).filter(Boolean))];
const sectionMarkup = sections.length
  ? sections.map((section) => {
      const fields = (contract.fields ?? []).filter((field) => field.section === section);
      const fieldMarkup = fields.map((field) =>
        `        <Typography key="${field.id}" variant="body2">${field.label}</Typography>`,
      ).join("\n");
      return `      <SectionCard title="${escapeJsx(section)}" collapsible={false}>\n${fieldMarkup}\n      </SectionCard>`;
    }).join("\n")
  : "      <Typography variant=\"body2\">No fields are defined in the contract.</Typography>";

const pageSource = `import { PageContainer, PageHeader, SectionCard } from '@components/layout';
import { Box, Typography } from '@components/common';
import { ${styleExportName} } from './${styleFileName}';

const ${pageName} = () => {
  return (
    <PageContainer>
      <Box sx={${styleExportName}.page}>
        <PageHeader title="${escapeJsx(title)}" />
${sectionMarkup}
      </Box>
    </PageContainer>
  );
};

export default ${pageName};
`;

const styleSource = `import { colors } from '@core/theme';

export const ${styleExportName} = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    color: colors.text.primary,
  } as const,
};

export default ${styleExportName};
`;

const indexSource = `// [${storyId}] ${title}
export { default } from './${pageName}';
`;

const apiPathLines = api.map((definition) =>
  `  ${JSON.stringify(definition.id)}: ${JSON.stringify(stripApiPrefix(definition.path))},`
).join("\n");
const serviceSource = `import apiService from './apiService';

export const ${storyId}API_PATHS = {
${apiPathLines}
} as const;

function resolvePath(pathTemplate: string, params: Record<string, unknown> = {}) {
  return pathTemplate
    .replace(/\\{([^}]+)\\}/g, (_, key: string) => encodeURIComponent(String(params[key] ?? '')))
    .replace(/([?&][^=]+)=(&|$)/g, '$2')
    .replace(/[?&]$/, '');
}

export const ${storyId}Service = {
  request<T>(apiId: keyof typeof ${storyId}API_PATHS, params?: Record<string, unknown>, body?: unknown) {
    const path = resolvePath(${storyId}API_PATHS[apiId], params);
    const method = ${JSON.stringify(api.reduce((methods, definition) => ({ ...methods, [definition.id]: definition.method }), {}))}[apiId];
    if (method === 'POST') return apiService.post<T>(path, body);
    if (method === 'PUT') return apiService.put<T>(path, String(params?.id ?? ''), body);
    if (method === 'DELETE') return apiService.delete<T>(path, String(params?.id ?? ''));
    return apiService.get<T>(path, params);
  },
};

export default ${storyId}Service;
`;

fs.mkdirSync(moduleDir, { recursive: true });
fs.writeFileSync(pageFile, pageSource);
fs.writeFileSync(styleFile, styleSource);
fs.writeFileSync(indexFile, indexSource);
fs.writeFileSync(serviceFile, serviceSource);
writeGeneratedRoute(route, storyId, pageName, generatedRoutesFile);
writeGeneratedModule(route, storyId, pageName, generatedModulesFile, title);
writeGeneratedHandlers(api, generatedHandlersFile);
console.log(`[screen:generate] Wrote ${path.relative(appRoot, pageFile)}`);
console.log(`[screen:generate] Wrote ${path.relative(appRoot, styleFile)}`);
console.log(`[screen:generate] Wrote ${path.relative(appRoot, indexFile)}`);
console.log(`[screen:generate] Wrote ${path.relative(appRoot, serviceFile)}`);
console.log(`[screen:generate] Registered route /${route}`);
console.log(`[screen:generate] Wrote mock handlers for ${api.length} API(s)`);
console.log(`[screen:generate] Tests are not generated by this workflow.`);

function escapeJsx(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[character]);
}

function stripApiPrefix(value) {
  const normalized = String(value).replace(/^\/api(?=\/|$)/, "");
  if (normalized.includes("/api/")) throw new Error(`API path must not contain /api more than once: ${value}`);
  return normalized || "/";
}

function writeGeneratedRoute(routePath, id, componentName, file) {
  const entries = readGeneratedEntries(file, "routes");
  entries[id] = { route: routePath, componentName };
  const imports = Object.entries(entries).map(([key, entry]) =>
    `const ${entry.componentName}_${key} = lazy(() => import('@modules/${key}/${entry.componentName}'));`
  ).join("\n");
  const routes = Object.entries(entries).map(([key, entry]) =>
    `  { id: '${key}', path: '${entry.route}', component: ${entry.componentName}_${key} },`
  ).join("\n");
  fs.writeFileSync(file, `import { lazy } from 'react';\n\n${imports}\n\nexport const generatedRoutes = [\n${routes}\n];\n`);
}

function writeGeneratedModule(routePath, id, componentName, file, title) {
  const entries = readGeneratedEntries(file, "modules");
  entries[id] = { route: routePath, componentName, title };
  const modules = Object.entries(entries).map(([key, entry]) => `  {\n    id: '${key}',\n    path: '${entry.route}',\n    labelKey: 'screen_${key}',\n    icon: 'Description',\n    showInSidebar: false,\n    children: [{ id: '${key}-main', path: '', labelKey: 'screen_${key}', component: '@modules/${key}/${entry.componentName}' }],\n  },`).join("\n");
  fs.writeFileSync(file, `import type { ModuleManifest } from './types';\n\nexport const generatedModuleRegistry: ModuleManifest[] = [\n${modules}\n];\n`);
}

function writeGeneratedHandlers(apiDefinitions, file) {
  const handlers = apiDefinitions.map((definition) => {
    const method = String(definition.method).toLowerCase();
    const pathValue = stripApiPrefix(definition.path);
    const response = JSON.stringify(definition.mockResponse ?? { success: true, data: {} }, null, 2);
    return `  http.${method}(\`\${BASE_URL}${pathValue}\`, async () => HttpResponse.json(${response})),`;
  }).join("\n");
  fs.writeFileSync(file, `import { http, HttpResponse } from 'msw';\n\nconst BASE_URL = '/api';\n\nexport const generatedHandlers = [\n${handlers}\n];\n`);
}

function readGeneratedEntries(file, kind) {
  if (!fs.existsSync(file)) return {};
  const source = fs.readFileSync(file, "utf8");
  const entries = {};
  const pattern = kind === "routes"
    ? /\{ id: '([^']+)', path: '([^']+)', component: ([A-Za-z0-9_]+) \}/g
    : /id: '([^']+)'[\s\S]*?path: '([^']+)'[\s\S]*?component: '@modules\/[^/]+\/([^']+)'/g;
  for (const match of source.matchAll(pattern)) {
    entries[match[1]] = { route: match[2], componentName: kind === "routes" ? match[3].replace(new RegExp(`_${match[1]}$`), "") : match[3] };
  }
  return entries;
}
