# Toyota TopsCRM Enterprise Framework

---

## Section 1: Developer Guide

### Quick Start

```bash
cd tops-crm-framework
npm install
npm run dev
```

App runs at `http://localhost:3000`

**Available Routes:**
- `/` — Dashboard
- `/activity-setup` — Activity Setup (sample screen with full form + table validation)
- `/demo` — Component showcase with all form & common components

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run mock:server` | Start mock API (json-server, port 3001) |
| `npm run test` | Run unit tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

### Folder Structure

```
tops-crm-framework/
├── src/
│   ├── app/                          # App-level wiring
│   │   ├── router/
│   │   │   └── index.tsx            # All routes (lazy-loaded)
│   │   └── providers/
│   │       └── AppProviders.tsx     # Redux + MUI Theme + Router wrapper
│   │
│   ├── hooks/                        # Shared reusable hooks
│   │   ├── useApi.ts               # API call hook with loading/error/retry
│   │   ├── useAsyncOperation.ts    # Generic async operation with retry
│   │   ├── useErrorHandler.ts      # Centralized error handling hook
│   │   ├── useFormErrorHandler.ts  # Server validation → react-hook-form mapping
│   │   ├── useNetworkStatus.ts     # Online/offline/slow connection detection
│   │   ├── useNotification.ts      # Toast notification dispatch
│   │   ├── usePermission.ts        # Permission check hook
│   │   ├── useTranslation.ts       # t('key') hook for i18n
│   │   └── index.ts
│   │
│   ├── services/                     # API & HTTP layer
│   │   ├── apiService.ts           # Single-point API (get, post, put, delete, upload)
│   │   ├── axios.ts                # Axios instance + JWT interceptors + refresh token
│   │   ├── endpoints.ts            # Centralized endpoint constants
│   │   └── index.ts
│   │
│   ├── store/                        # Redux store
│   │   ├── index.ts                 # Store config + typed hooks (useAppDispatch, useAppSelector)
│   │   ├── slices/
│   │   │   ├── authSlice.ts        # Auth state (user, tokens, login/logout)
│   │   │   ├── appSlice.ts         # UI state (sidebar toggle, notifications)
│   │   │   └── configSlice.ts      # API config (dealer, branch, user with fallbacks)
│   │   └── middleware/
│   │       └── errorMiddleware.ts   # Auto-catches rejected thunks + normalizes errors
│   │
│   ├── constants/                    # App-wide constants
│   │   ├── permissions.ts           # Permission string constants
│   │   ├── appDefaults.ts           # Static fallback values for API data
│   │   └── index.ts
│   │
│   ├── types/                        # Shared type definitions
│   │   └── index.ts                 # Common types, interfaces, enums
│   │
│   ├── utils/                        # Shared utility functions
│   │   └── index.ts                 # Formatters, validators, date utils
│   │
│   ├── core/                         # Framework engine (domain-specific infrastructure)
│   │   ├── crud/
│   │   │   ├── types.ts            # CrudConfig, FieldConfig types
│   │   │   ├── CrudListPage.tsx    # Config-driven list page
│   │   │   └── CrudFormPage.tsx    # Config-driven form page
│   │   ├── errors/
│   │   │   ├── types.ts            # AppError, ValidationError, ErrorCategory types
│   │   │   ├── errorService.ts     # Error normalization + classification
│   │   │   ├── loggingService.ts   # Error logging + export
│   │   │   ├── retryService.ts     # Retry with exponential backoff
│   │   │   ├── constants.ts        # Error codes, messages, HTTP mappings
│   │   │   ├── ErrorContext.tsx    # React error context provider
│   │   │   ├── GlobalErrorToast.tsx # App-level error toast
│   │   │   ├── NetworkStatusBanner.tsx # Offline/slow connection banner
│   │   │   └── index.ts
│   │   ├── theme/
│   │   │   ├── colors.ts           # Color palette (#EB0A1E primary, #58595B secondary)
│   │   │   ├── typography.ts       # Prompt (EN) / TH Sarabun New (TH) font hierarchy
│   │   │   ├── spacing.ts          # 8px grid + layout dimensions
│   │   │   ├── shadows.ts          # Box shadows
│   │   │   └── index.ts            # createTheme() with all MUI overrides
│   │   ├── languages/
│   │   │   ├── en.ts               # English translations
│   │   │   ├── th.ts               # Thai translations
│   │   │   └── index.ts            # translate() function
│   │   ├── auth/
│   │   │   └── RouteGuard.tsx      # Auth-gated route wrapper
│   │   ├── featureFlags/
│   │   │   ├── FeatureFlagContext.tsx
│   │   │   ├── FeatureGate.tsx     # Conditional feature rendering
│   │   │   └── types.ts
│   │   ├── manifest/
│   │   │   ├── types.ts            # ScreenManifest, ModuleManifest schemas
│   │   │   ├── moduleRegistry.ts   # All modules with routes, sidebar, permissions
│   │   │   ├── fieldRendererRegistry.ts # Field type → Component mapping
│   │   │   └── index.ts
│   │   └── pwa/
│   │       └── registerSW.ts       # Service worker registration
│   │
│   ├── components/                   # Reusable UI library
│   │   ├── common/                  # Shared UI components
│   │   │   ├── ActionButtons.tsx    # PrimaryButton, SaveButton, DeleteButton, etc.
│   │   │   ├── AlertDialog.tsx      # Success/Error/Warning modal
│   │   │   ├── Avatar.tsx           # User avatar with initials
│   │   │   ├── Badge.tsx            # Status chips (success/error/warning/info)
│   │   │   ├── Breadcrumb.tsx       # Breadcrumb navigation
│   │   │   ├── ConfirmDialog.tsx    # Yes/No confirmation modal
│   │   │   ├── Divider.tsx          # Divider with optional label
│   │   │   ├── EmptyState.tsx       # No data placeholder
│   │   │   ├── ErrorBoundary.tsx    # React error boundary
│   │   │   ├── ErrorState.tsx       # Error with retry
│   │   │   ├── InfoCard.tsx         # KPI card with trend
│   │   │   ├── LanguageSwitcher.tsx # EN/TH toggle with flag
│   │   │   ├── LoadingOverlay.tsx   # Full-screen loading
│   │   │   ├── PermissionWrapper.tsx# Permission-based UI gate
│   │   │   ├── ProgressBar.tsx      # Linear progress
│   │   │   ├── SkeletonLoader.tsx   # Loading skeletons (table/form/list)
│   │   │   ├── StatusIndicator.tsx  # Dot + label status
│   │   │   ├── Stepper.tsx          # Multi-step wizard
│   │   │   ├── SummaryCard.tsx      # Stats card with icon
│   │   │   ├── Tabs.tsx             # Tab navigation
│   │   │   ├── ToastNotification.tsx# Snackbar (maroon/orange/green per standard)
│   │   │   ├── Tooltip.tsx          # Styled tooltip
│   │   │   └── index.ts
│   │   ├── form/                    # 25 form components (React Hook Form integrated)
│   │   │   ├── FormTextField.tsx
│   │   │   ├── FormPasswordField.tsx
│   │   │   ├── FormTextArea.tsx
│   │   │   ├── FormEmailField.tsx
│   │   │   ├── FormPhoneField.tsx
│   │   │   ├── FormNumberField.tsx
│   │   │   ├── FormCurrencyField.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   ├── FormMultiSelect.tsx
│   │   │   ├── FormAutoComplete.tsx
│   │   │   ├── FormDatePicker.tsx
│   │   │   ├── FormDateRangePicker.tsx
│   │   │   ├── FormTimePicker.tsx
│   │   │   ├── FormRadioGroup.tsx
│   │   │   ├── FormCheckbox.tsx
│   │   │   ├── FormCheckboxGroup.tsx
│   │   │   ├── FormSwitch.tsx
│   │   │   ├── FormFileUpload.tsx
│   │   │   ├── FormImageUpload.tsx
│   │   │   ├── FormSearchField.tsx
│   │   │   ├── FormSlider.tsx
│   │   │   ├── FormRating.tsx
│   │   │   ├── FormColorPicker.tsx
│   │   │   ├── FormOtpInput.tsx
│   │   │   ├── FormUrlField.tsx
│   │   │   └── index.ts
│   │   ├── table/
│   │   │   └── DataTable.tsx        # Enterprise table (sort, filter, paginate, export, select)
│   │   └── layout/
│   │       ├── MainLayout.tsx       # Full page shell (topbar + header + sidebar + content)
│   │       ├── Sidebar.tsx          # Navigation with panel submenu
│   │       ├── Header.tsx           # Red header with search tabs + profile + language
│   │       ├── TopBar.tsx           # Dealer/branch info bar
│   │       ├── SectionCard.tsx      # Collapsible accordion section
│   │       ├── PageHeader.tsx       # Breadcrumbs + title + back button
│   │       ├── PageContainer.tsx    # Content wrapper with spacing
│   │       └── PageFooter.tsx       # Sticky footer with action buttons
│   │
│   ├── modules/                      # Feature modules (includes reference implementations)
│   │   ├── activity-setup/          # Activity Setup screen
│   │   │   ├── pages/
│   │   │   │   ├── ActivitySetupPage.tsx
│   │   │   │   └── TmtActivityCustomPage.tsx
│   │   │   └── components/
│   │   │       ├── ServiceRepairSection.tsx
│   │   │       └── ContactChannelSection.tsx
│   │   ├── customer/                # CRUD config example
│   │   ├── dashboard/               # Dashboard page
│   │   └── demo/                    # Component showcase + error handling demo
│   │
│   └── mocks/
│       ├── handlers.ts              # MSW request handlers
│       ├── browser.ts               # MSW browser setup
│       ├── server.ts                # MSW server setup (tests)
│       └── db.json                  # Mock API data (json-server)
│
├── package.json
├── vite.config.ts                   # Vite config + path aliases + API proxy
├── vitest.config.ts                 # Vitest config + path aliases + coverage
├── tsconfig.json                    # TypeScript config + path aliases
└── index.html                       # Entry HTML with Prompt font loaded
```

---

### How Components Work

#### Form Components

All form components connect to React Hook Form via `Controller`. Wrap your form in `FormProvider` and fields just work:

```tsx
import { useForm, FormProvider } from 'react-hook-form';
import { FormTextField, FormSelect } from '@components/form';

const MyPage = () => {
  const methods = useForm({ defaultValues: { name: '' } });
  
  return (
    <FormProvider {...methods}>
      <FormTextField name="name" label={t('field_name')} required />
      <FormSelect name="status" label={t('status')} options={options} />
    </FormProvider>
  );
};
```

**Standards applied in every form component:**
- Mandatory label: red `#EB0A1E` with `*`
- Non-mandatory label: dark grey `#58595B`
- Fixed `minHeight: 20px` error container — no layout shift on validation
- Font: 14px Medium labels, 14px Regular inputs

#### Translation System

All static UI text comes from `src/core/languages/en.ts` and `th.ts`.

```tsx
import { useTranslation } from '@hooks';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <Button>{t('save_btn')}</Button>        // "Save" or "บันทึก"
    <Typography>{t('activity_name')}</Typography>
  );
};
```

**Rules:**
- Static UI labels/buttons/headers → always use `t('key')`
- API values (dealer name, user name, data from backend) → never translate, display as-is with fallback: `apiValue ?? APP_DEFAULTS.dealer.name`

#### API Service

Single point for all HTTP calls:

```tsx
import { apiService } from '@services';

const data = await apiService.get('/customers', { page: 1, pageSize: 10 });
await apiService.post('/customers', formData);
await apiService.put('/customers', '123', formData);
await apiService.delete('/customers', '123');
```

#### CRUD Engine

Create full CRUD screens with just a config object:

```tsx
import { CrudConfig } from '@core/crud';

const vehicleConfig: CrudConfig = {
  resource: 'vehicles',
  endpoint: '/vehicles',
  title: 'Vehicle Management',
  fields: [
    { name: 'plate', label: 'Plate', type: 'text', required: true },
    { name: 'model', label: 'Model', type: 'select', options: [...] },
  ],
};

// List page with search + sort + paginate + delete:
<CrudListPage config={vehicleConfig} />

// Form page with validation + save:
<CrudFormPage config={vehicleConfig} mode="create" />
```

#### Adding a New Page

1. Create `src/modules/my-feature/pages/MyPage.tsx`
2. Add lazy import + route in `src/app/router/index.tsx`
3. Add sidebar menu item in `Sidebar.tsx` (use `labelKey` for translation)
4. Add translation keys to `src/core/languages/en.ts` and `th.ts`

#### Adding a New Form Component

1. Create `src/components/form/FormMyField.tsx`
2. Use `Controller` from `react-hook-form` + `useFormContext()`
3. Follow the standard pattern: label with mandatory color, fixed error height
4. Export from `src/components/form/index.ts`

#### Adding a New Hook

1. Create `src/hooks/useMyHook.ts`
2. Export from `src/hooks/index.ts`
3. Use `@hooks/useMyHook` or `@hooks` barrel import in consumers

#### Table Validation (Inline + Save)

Tables with editable rows validate:
- **On blur/change**: immediate inline feedback (red border + error icon with tooltip)
- **On Save click**: validates ALL rows, shows error dialog popup, blocks save

Use `forwardRef` + `useImperativeHandle` to expose `validateAllRows()` to parent:

```tsx
// In table component:
export interface MyTableRef { validateAllRows: () => boolean; }
const MyTable = forwardRef<MyTableRef>((_, ref) => {
  useImperativeHandle(ref, () => ({ validateAllRows }));
});

// In parent page:
const tableRef = useRef<MyTableRef>(null);
const handleSave = () => {
  const tableValid = tableRef.current?.validateAllRows() ?? true;
  methods.handleSubmit((data) => { if (!tableValid) return; /* save */ })();
};
```

---

### Path Aliases

| Alias | Maps to |
|-------|---------|
| `@/*` | `src/*` |
| `@hooks/*` | `src/hooks/*` |
| `@services/*` | `src/services/*` |
| `@store/*` | `src/store/*` |
| `@constants/*` | `src/constants/*` |
| `@types/*` | `src/types/*` |
| `@utils/*` | `src/utils/*` |
| `@components/*` | `src/components/*` |
| `@core/*` | `src/core/*` |
| `@modules/*` | `src/modules/*` |
| `@app/*` | `src/app/*` |

---

### Technology Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 19 + TypeScript |
| Component Library | MUI v6 |
| State Management | Redux Toolkit |
| Routing | React Router v7 (lazy loading) |
| Forms | React Hook Form + Yup |
| HTTP | Axios (interceptors + JWT refresh) |
| Build | Vite 6 |
| i18n | Custom hook-based (EN/TH) |
| Font | Prompt (EN), TH Sarabun New (TH) |

---

## Section 1.5: Testing Guide

### Testing Tech Stack

| Tool | Purpose |
|------|---------|
| **Vitest 2.x** | Test runner and assertion framework (Vite-native, fast HMR-based execution) |
| **jsdom 30** | Browser environment simulation for DOM testing |
| **@testing-library/react 16** | Component rendering and DOM queries (role-based, accessible selectors) |
| **@testing-library/jest-dom 6** | Custom DOM matchers (`toBeInTheDocument`, `toHaveTextContent`, etc.) |
| **@testing-library/user-event 14** | Realistic user interaction simulation (click, type, tab) |
| **MSW 2.x** | API mocking via Service Worker interception (for API service tests) |
| **@vitest/coverage-v8** | Code coverage reporting (V8-based, supports Istanbul-compatible thresholds) |

---

### Test Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests once (`vitest run`) |
| `npm run test:watch` | Run tests in watch mode (re-runs on file change) |
| `npm run test:coverage` | Run tests with code coverage report |

---

### Test Structure

Tests are co-located with source code using `__tests__/` directories:

```
src/
├── tests/
│   ├── setup.ts                    # Global test setup (DOM mocks, router mock)
│   └── test-utils.tsx              # Custom render helpers (providers, form context)
│
├── store/__tests__/
│   ├── appSlice.test.ts            # UI state slice (sidebar, loading, notifications)
│   ├── authSlice.test.ts           # Auth state slice (login, logout, tokens)
│   ├── configSlice.test.ts         # API config slice (dealer, branch, user)
│   └── errorMiddleware.test.ts     # Redux error middleware
│
├── hooks/__tests__/
│   ├── useApi.test.ts              # API hook with loading/error/retry
│   ├── useAsyncOperation.test.ts   # Async operation hook
│   ├── useErrorHandler.test.ts     # Error handler hook
│   ├── useFormErrorHandler.test.ts # Form validation error hook
│   ├── useNetworkStatus.test.ts    # Network detection hook
│   ├── useNotification.test.ts     # Notification dispatch hook
│   ├── usePermission.test.ts       # Permission check hook
│   └── useTranslation.test.ts      # Translation hook
│
├── services/__tests__/
│   └── apiService.test.ts          # HTTP service (get, post, put, delete, upload)
│
├── core/languages/__tests__/
│   └── translate.test.ts           # i18n translation function
│
├── components/
│   ├── form/__tests__/             # 19 form component tests
│   │   ├── FormTextField.test.tsx
│   │   ├── FormPasswordField.test.tsx
│   │   ├── FormTextArea.test.tsx
│   │   ├── FormEmailField.test.tsx
│   │   ├── FormNumberField.test.tsx
│   │   ├── FormCurrencyField.test.tsx
│   │   ├── FormSelect.test.tsx
│   │   ├── FormMultiSelect.test.tsx
│   │   ├── FormDatePicker.test.tsx
│   │   ├── FormTimePicker.test.tsx
│   │   ├── FormRadioGroup.test.tsx
│   │   ├── FormCheckbox.test.tsx
│   │   ├── FormCheckboxGroup.test.tsx
│   │   ├── FormSwitch.test.tsx
│   │   ├── FormFileUpload.test.tsx
│   │   ├── FormSearchField.test.tsx
│   │   ├── FormSlider.test.tsx
│   │   ├── FormColorPicker.test.tsx
│   │   └── FormUrlField.test.tsx
│   │
│   ├── common/__tests__/           # 16 common component tests
│   │   ├── ActionButtons.test.tsx
│   │   ├── AlertDialog.test.tsx
│   │   ├── Avatar.test.tsx
│   │   ├── Badge.test.tsx
│   │   ├── Breadcrumb.test.tsx
│   │   ├── ConfirmDialog.test.tsx
│   │   ├── Divider.test.tsx
│   │   ├── EmptyState.test.tsx
│   │   ├── ErrorState.test.tsx
│   │   ├── InfoCard.test.tsx
│   │   ├── MessagePreviewDialog.test.tsx
│   │   ├── ProgressBar.test.tsx
│   │   ├── SetTemplateDialog.test.tsx
│   │   ├── StatusIndicator.test.tsx
│   │   ├── SummaryCard.test.tsx
│   │   └── Tabs.test.tsx
│   │
│   ├── layout/__tests__/           # 3 layout component tests
│   │   ├── TopBar.test.tsx
│   │   ├── SectionCard.test.tsx
│   │   └── PageHeader.test.tsx
│   │
│   └── table/__tests__/            # 1 table component test
│       └── DataTable.test.tsx
│
└── modules/
    ├── activity-setup/__tests__/   # 5 activity setup tests
    ├── customer/__tests__/         # Customer module tests
    └── demo/__tests__/             # Demo page tests
```

**Total test files: 70**

---

### Test Configuration (vitest.config.ts)

- **Environment:** jsdom (browser simulation)
- **Globals:** enabled (`describe`, `it`, `expect` available without imports)
- **CSS:** processed during tests
- **Setup file:** `src/tests/setup.ts` (mocks `matchMedia`, `IntersectionObserver`, `scrollTo`, `URL.createObjectURL`, and `react-router-dom`)
- **Path aliases:** same as app (`@/`, `@hooks/`, `@services/`, `@store/`, `@constants/`, `@types/`, `@utils/`, `@core/`, `@components/`, `@modules/`, `@app/`)

#### Coverage Thresholds

| Metric | Minimum |
|--------|---------|
| Statements | 85% |
| Branches | 70% |
| Functions | 85% |
| Lines | 85% |

Coverage is collected for:
- `src/components/form/**/*.tsx`
- `src/components/common/**/*.tsx`
- `src/components/layout/**/*.tsx`
- `src/components/table/**/*.tsx`
- `src/hooks/**/*.ts`
- `src/services/apiService.ts`
- `src/store/slices/**/*.ts`
- `src/core/languages/**/*.ts`

---

### Test Utilities (`src/tests/test-utils.tsx`)

Custom render helpers that wrap components with all required providers:

| Helper | Use For |
|--------|---------|
| `renderWithProviders(ui)` | Components that need Redux store + MUI Theme |
| `renderFormComponent(ui, defaultValues)` | Form components that need `FormProvider` + store + theme |
| `createTestStore()` | Creating an isolated Redux store for test assertions |

#### Example Usage

```tsx
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormTextField from '../FormTextField';

describe('FormTextField', () => {
  it('renders with label', () => {
    renderFormComponent(<FormTextField name="email" label="Email" />, { email: '' });
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('shows asterisk for required field', () => {
    renderFormComponent(<FormTextField name="email" label="Email" required />, { email: '' });
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
```

---

### Testing Conventions

1. **File placement:** Tests live in `__tests__/` folders next to the source they test
2. **Naming:** `<ComponentName>.test.tsx` for components, `<module>.test.ts` for non-JSX
3. **Queries:** Prefer accessible queries — `getByRole`, `getByLabelText`, `getByText` (follow Testing Library priority)
4. **Assertions:** Use `@testing-library/jest-dom` matchers for DOM state checks
5. **Mocking:** Use `vi.fn()` / `vi.mock()` from Vitest; API calls mocked via MSW handlers
6. **Form components:** Always wrap with `renderFormComponent` to provide `FormProvider` context
7. **Redux-connected components:** Use `renderWithProviders` to supply the test store
8. **No snapshot tests:** Tests use behavioral assertions, not snapshots

---

### Adding a New Test

1. Create `src/<path>/__tests__/<Component>.test.tsx`
2. Import the component and the appropriate render helper
3. Write `describe/it` blocks testing rendering, user interaction, and edge cases
4. Run `npm run test` to verify
5. Run `npm run test:coverage` to confirm thresholds are met

---

---

## Section 1.6: Framework Architecture (300+ Screens)

### Module Manifest (Single Source of Truth)

All routes, sidebar items, permissions, and breadcrumbs are driven from a **single module registry** at `src/core/manifest/moduleRegistry.ts`. This eliminates navigation-to-route mismatches.

```
src/core/manifest/
├── types.ts                    # ScreenManifest, ModuleManifest, FieldRendererType schemas
├── moduleRegistry.ts           # All modules with routes, sidebar, permissions
├── fieldRendererRegistry.ts    # Field type → Component + Schema builder mapping
└── index.ts                    # Public exports
```

**Key utilities:**
| Function | Purpose |
|----------|---------|
| `getSidebarItems()` | Generate sidebar menu from registry |
| `getRouteConfigs()` | Generate flat route list for router |
| `validateRouteIntegrity()` | Dev-mode check for orphan sidebar paths |
| `getFieldRenderer(type)` | Get component + schema for any field type |
| `buildSchemaFromFields(fields)` | Auto-build Yup schema from screen fields |

---

### Field Renderer Registry

Replaces the hardcoded `switch` in `CrudFormPage`. Maps all 25 field types to their components + validation schema builders:

| Field Type | Component | Schema |
|-----------|-----------|--------|
| `text` | FormTextField | string |
| `password` | FormPasswordField | string |
| `email` | FormEmailField | string + email() |
| `url` | FormUrlField | string + url() |
| `phone` | FormPhoneField | string |
| `textarea` | FormTextArea | string |
| `search` | FormSearchField | string |
| `otp` | FormOtpInput | string |
| `number` | FormNumberField | number |
| `currency` | FormCurrencyField | number |
| `slider` | FormSlider | number |
| `rating` | FormRating | number |
| `date` | FormDatePicker | string |
| `dateRange` | FormDateRangePicker | string |
| `time` | FormTimePicker | string |
| `select` | FormSelect | string |
| `multiSelect` | FormMultiSelect | array |
| `autoComplete` | FormAutoComplete | string |
| `radio` | FormRadioGroup | string |
| `checkbox` | FormCheckbox | boolean |
| `checkboxGroup` | FormCheckboxGroup | array |
| `switch` | FormSwitch | boolean |
| `file` | FormFileUpload | array |
| `image` | FormImageUpload | mixed |
| `color` | FormColorPicker | string |

**Adding a custom field type:**
```ts
import { registerFieldRenderer } from '@core/manifest';

registerFieldRenderer('richText', {
  component: FormRichTextEditor,
  buildSchema: (field) => yup.string().required(...),
});
```

---

### Permission Enforcement

Permissions are enforced at **three levels**:

1. **Route-level**: Module manifest declares required permission; CRUD pages check before rendering
2. **Action-level**: Create/Edit/Delete buttons only render if user has the corresponding permission from `CrudConfig.permissions`
3. **Component-level**: `<PermissionWrapper permission="CUSTOMER_DELETE">` gates any UI element

---

### CRUD Engine Improvements

| Feature | Before | After |
|---------|--------|-------|
| Sort | Not wired to API | Sends `sortField`/`sortOrder` params |
| Search | Not wired to API | Sends `search` param, resets page |
| Permissions | Declared but ignored | Enforced on view/create/edit/delete |
| Form fields | 5 types via switch | 25 types via registry |
| Table row keys | Array index (unstable) | `row.id` or `getRowId()` prop |
| Loading state | Prop exists, not rendered | Loading overlay in table |
| Delete dialog | Generic MUI | TOPSCRM standard red popup |

---

### Language State (Single Source)

Language is managed **only** in `configSlice.language`. The duplication in `appSlice` has been removed. Use:

```ts
import { useAppSelector } from '@store/index';
const language = useAppSelector((state) => state.config.language);
```

---

### Screen Generation (Future)

The `ScreenManifest` schema in `src/core/manifest/types.ts` defines a complete screen layout:
- Metadata (route, breadcrumbs, permissions)
- Sections (form, table, summary, custom)
- Fields with conditional visibility
- API endpoints
- Footer actions with confirm dialogs

This enables future `npm run generate:screen` CLI to produce fully typed config files, route registrations, and translation stubs from JSON/YAML metadata.

---

---

## Section 2: System User Guide

### Overview

Toyota TopsCRM is a Customer Relationship Management system for Toyota dealerships. The interface provides tools for managing customer activities, service follow-ups, appointments, and communications.

---

### Screen Layout

The application has 4 main areas:

| Area | Description |
|------|-------------|
| **Top Bar** (red) | Shows dealer name, branch, date/time |
| **Header** (red) | Search tabs (Plate/Mobile/Phone/Name/VIN), global search, language switch, profile |
| **Sidebar** (left, white) | Navigation menu with expandable submenus |
| **Content Area** | Main workspace with forms, tables, and data |

---

### Navigation

- Click any menu item in the sidebar to navigate
- Items with `>` arrow have submenus — click to open a panel to the right
- Click anywhere outside the submenu panel to close it
- The active page is highlighted in pink/red in the sidebar

---

### Language Switching

1. Click the **flag icon** in the header (between search and profile)
2. A dropdown appears with **EN** and **TH** options
3. Click your preferred language
4. All labels, buttons, menu items, and messages instantly switch language
5. Data from the system (names, IDs, numbers) stays unchanged

---

### Activity Setup Screen

This is the main configuration screen for customer activities.

#### Sections:

1. **Activity Type** — Select the type of maintenance activity (radio buttons). Summary cards show vehicle/customer counts.

2. **Activity Setup** — Fill in Activity ID, Name, Description, Customer Type, Heijunka Days, Suppress Days.

3. **Service & Repair Inspection** — Table showing repair codes and descriptions. Use "Select Range" dropdown to filter by mileage range. Check/uncheck items.

4. **Contact Channel Details** — Editable table for communication channels.
   - Click **+ Add** to add a new row
   - Select Contact Process and Channel from dropdowns
   - Enter Activity Day (number of days before/after)
   - Click the delete icon to remove a row
   - Errors show as red borders with tooltip icons on hover

#### Footer Buttons:
- **Delete Activity** — Opens confirmation dialog
- **Assign Follow-up Staff** — Assigns staff to the activity
- **Save** — Validates all fields + table, then saves

---

### Validation

When you click **Save**:
- Required fields with empty values show red error text below the field
- Table rows with missing/invalid data show:
  - Red border on the invalid cell
  - Red error icon (!) — hover to see the message
  - An error popup listing all issues
- Fix all errors and click Save again

**Rules:**
- Mandatory fields have red labels with `*`
- Non-mandatory fields have grey labels
- Numbers display in US format: 1,000.00

---

### Delete Confirmation

When you click "Delete Activity":
- A popup asks: *"Deletion of this record would delete and no plan would be generated. Do you want to continue for deletion?"*
- Click **Yes** to delete, **No** to cancel

---

### Notifications

| Color | Meaning |
|-------|---------|
| Maroon | Error |
| Orange | Warning |
| Green | Success |
| Blue | Information |

Notifications appear in the top-right corner and auto-dismiss after 10 seconds. Click a long notification to see the full message.

---

### Profile Menu

Click your name/avatar in the header to access:
- My Profile
- Change Password
- Notifications
- Settings
- Logout

---

### Responsive Behavior

- On tablets/mobile: sidebar becomes a slide-out drawer (tap hamburger menu)
- Search tabs hide on very small screens
- Tables scroll horizontally on narrow screens
- Content padding adjusts automatically

---

### Keyboard Accessibility

- All interactive elements are reachable via Tab key
- Dialogs trap focus
- Escape key closes non-destructive dialogs
- Minimum touch target: 44px height on mobile
