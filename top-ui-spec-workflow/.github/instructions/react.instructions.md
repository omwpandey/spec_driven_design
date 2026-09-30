---
applyTo: "**/*.{ts,tsx,js,jsx}"
---

# React Engineering

Follow repository conventions before generic React preferences.

- Keep state near its consumer.
- Use established state/query/service abstractions.
- Keep significant business logic out of JSX.
- Do not introduce duplicate libraries.
- Use established styling/tokens.
- Preserve accessibility behavior of shared components.
- Avoid unnecessary effects and memoization.
- Preserve backward compatibility when changing shared components.

## React / Frontend naming (S&G §5)

Apply when creating or renaming frontend files. Do not invent APIs, validation, or copy.

### File names

| Type | Convention | Example |
|---|---|---|
| Generated page | PascalCase + `Page.tsx` | `ViewCustomerInformationPage.tsx` |
| Shared component | PascalCase.tsx | `DataTable.tsx` |
| Hook | `use{Feature}.ts` | `useCallPlanAllocation.ts` |
| Feature service (only if existing `apiService` is not enough) | camelCase + `Service.ts` | `callPlanAllocationService.ts` |
| Types | camelCase + `.types.ts` | `callPlanAllocation.types.ts` |
| Constants file | camelCase.ts | `screenIds.ts` |
| Test | `{Component}.test.tsx` | `ViewCustomerInformationPage.test.tsx` |

Existing pages stay as-is. Generated feature pages use the `Page` suffix and a default-exported PascalCase function component.

### Folder placement

Generated pages go under the Function Key (screen ID):

```text
src/modules/<FUNCTION_KEY>/
  XxxPage.tsx
  XxxPage.test.tsx
  Xxx.styles.ts
  index.ts
  components/          # screen-local only
```

- Shared reusable UI stays in `src/components` `form/`, `common/`, `layout/`, `table/`. Do not add pages to `COMPONENT_CATALOG.md`.
- Do not create `src/comp` or a second component kit.
- Shared hooks: `src/hooks/use{Feature}.ts`
- Feature types: next to the page, or `src/types/{feature}.types.ts`
- Do not add CSS modules. Style through catalog / MUI layout wrappers and theme tokens.

### Identifiers

- Components: PascalCase
- Functions and variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Event handlers: `handle{Event}` (`handleSearch`, `handleSave`)
- Booleans: `is` / `has` / `should` (`isLoading`, `hasError`, `shouldConfirm`)
- Screen IDs: Function Key from the contract (`WCRM020104`). Use the existing generated/module registry convention; do not invent IDs.

### API calls

When the contract lists a screen-specific API, use the existing `useApi` / `apiService` / `ENDPOINTS` abstraction and the contract path. Do not invent a second HTTP client or alter the endpoint semantics.

