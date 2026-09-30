# WCRM020104 Architecture Decision Records (ADRs)

## Format
Each decision records:
- **Decision ID**: ADR-NNN
- **Decision**: What was decided
- **Reason**: Why this decision was made
- **Rejected Alternative**: What was considered but not chosen
- **Impact**: Consequences and downstream effects

---

## ADR-001: Use Existing FormTextField Component

**Decision:**  
Reuse `src/components/form/FormTextField` for all text input fields.

**Reason:**
- Consistent UI/UX with existing application
- Built-in validation and error handling
- Accessible (labels, ARIA, etc.)
- Reduces code duplication
- Enterprise standard in this codebase

**Rejected Alternative:**
- Raw MUI `TextField` — breaks consistency, lacks validation wrapper
- Custom text input — duplicates existing functionality

**Impact:**
- Form faster to implement
- Guaranteed consistency with other screens
- No custom styling needed for text fields

---

## ADR-002: DataTable for List Display

**Decision:**  
If a list/table is needed, use `src/components/table/DataTable`.

**Reason:**
- Already supports pagination, sorting, filtering
- Configurable columns
- Used across all existing feature screens
- Row selection and actions built-in

**Rejected Alternative:**
- Raw MUI `Table` — no built-in features, more boilerplate
- Custom React table library — not in approved component catalog

**Impact:**
- Table features come for free
- Consistent with other screens
- Reduced implementation time

---

## ADR-003: Page Layout — PageHeader + Content

**Decision:**  
Use `PageHeader` (src/components/layout) for title/subtitle, then content in `Box`/`Stack`.

**Reason:**
- Standard layout pattern across the application
- Maintains visual hierarchy
- Navigation breadcrumbs integrated
- Responsive on all screen sizes

**Rejected Alternative:**
- Custom layout — inconsistent with app architecture
- MUI Grid directly — no semantic chrome

**Impact:**
- Page looks and feels native to the app
- No custom CSS needed
- Familiar to users and developers

---

## ADR-004: No Parallel UI Kit (src/comp)

**Decision:**  
Do NOT create new components under `src/comp`. Contribute to `src/components` instead.

**Reason:**
- Prevents fragmentation and duplication
- Single source of truth for UI components
- Team standards and governance
- Easier maintenance and testing
- `npm run ui:guard` blocks this pattern

**Rejected Alternative:**
- Create `src/comp/wcrm020104/` for feature-specific components — violates architecture

**Impact:**
- New shared components go through review
- Ensures reusability across features
- Keeps codebase clean and organized

---

## ADR-005: State Management via Redux

**Decision:**  
Use Redux (store/slices) for feature state, not local React state, if data persists across page navigations.

**Reason:**
- Existing application standard
- Time-travel debugging available
- Predictable state mutations
- Testable state logic

**Rejected Alternative:**
- Local React `useState` — loses state on page reload/navigation
- Context API — not used in this project

**Impact:**
- State is preserved and restorable
- Debuggable with Redux DevTools
- Consistent with other features

---

## Summary of Decisions
- **ADR-001**: Reuse FormTextField
- **ADR-002**: Use DataTable for lists
- **ADR-003**: Use PageHeader layout pattern
- **ADR-004**: No parallel UI kit
- **ADR-005**: Redux for persistent state

---

**Status**: Pending implementation confirmation.  
**Last Updated**: [date]
