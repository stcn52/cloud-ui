# Changelog

All notable changes will be documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] — 2026-04-23

First stable major. Acts on every friction point found while dogfooding the
library to build its own docs site (see [DOGFOOD.md](./DOGFOOD.md)). Six
breaking renames + fourteen additive improvements + two brand-new components.

### Breaking

- **`PipeStep` → `PipelineStep`.** Also `PipeStepProps → PipelineStepProps`,
  `PipeStatus → PipelineStepStatus`, `pipeStepStyles → pipelineStepStyles`.
  No alias kept — update imports.
- **`Breadcrumb` → `BreadcrumbItem`** + auto-leaf on the last child.
  `Breadcrumbs` still takes a `separator`. Explicit `leaf` prop still honored.
- **`Tabs` / `CardTabs` are now forced-controlled.** `value` + `onChange` on
  the parent are required. `Tab` / `CardTab` take `id` (not `active` / `onClick`).
  Internal `useContext`; rendering a tab without a parent throws.
- **`Pagination` naming/semantics.** `page` → `current`; `total` now means
  total **rows** (was total pages); `pageSize` (default 10) drives
  `totalPages = Math.ceil(total / pageSize)`. Migrating: `<Pagination page={p}
  total={20} />` → `<Pagination current={p} total={200} pageSize={10} />`.
- **`Select` rewritten.** No longer a native `<select>`. Now a combobox with
  `options: SelectOption[]`, `placeholder`, `onChange(value)`, optional
  `searchable`, `disabled`, `invalid`, `size`. Uses a portaled panel with
  keyboard navigation. Native `<option>` children no longer accepted.
- **`Dropdown.DropdownItem.submenu`** now accepts a ReactNode — hovering opens
  a real nested panel to the right (same mechanism as `PopoverItem.submenu`).
  `submenu={true}` still renders just the chevron affordance.

### Added (additive — no breaks)

- **`<Button as={…}>`** — polymorphic. `<Button as="a" href="…">` renders an
  `<a>` with button styles; `<Button as={Link} to="/x">` works with React
  Router. When rendered as a non-button, `disabled` is written as
  `aria-disabled` to stay valid HTML.
- **`invalid`** prop on `Input`, `Radio`, `Switch`, `Textarea` — err-colored
  border + focus ring. Unchecked Switch gets err-tinted track.
- **New `<RadioGroup>`** — `name` + `value` + `onChange` + `options` array or
  declarative `<Radio>` children. `orientation='vertical'|'horizontal'`,
  `invalid`, `disabled`.
- **`Checkbox.indeterminate`** now uses a ref callback (was useEffect). DOM
  property updates instantly without a post-render effect.
- **`Segmented`** gains `size='sm'|'md'` and proper generic inference from
  `options as const` — `V` narrows to a union of literal values.
- **`Tooltip`** gains `placement='top'|'bottom'|'left'|'right'` (default
  `top`) with collision detection (flip to opposite) + portaled positioning
  (escapes clipping). Arrow pointer repositions per side.
- **`Kpi.unit`** — optional small/dim slot alongside value for units
  (`<Kpi label="JS" value={36} unit="kB" />`).
- **`Skeleton.variant`** — `'text'` (full-width, 0.8em tall), `'circle'`
  (radius 999px), `'block'` (default). Also new `width` / `height` props.
- **`LogLine.level` default `'info'`** (was required).
- **`Banner.autoUnmount`** — when `true`, the × button self-unmounts the
  banner via internal state. `onDismiss` still fires if provided.
- **`Popover.trigger` widened to ReactNode.** Strings, numbers, booleans,
  fragments, and arrays auto-wrap in a `<span>` so primitive content works.
- **`CopyField`** extracts a plain-text string from children (recursively)
  when `value` is omitted — `<CopyField>pnpm add x</CopyField>` now copies.
- **`Tree.selectionMode='single'|'multiple'|'checkbox'`.** Multi-select via
  click; checkbox mode shows per-node checkboxes with cascading parent
  state (stores leaf ids only; parent check/indeterminate derived). New
  `onSelectedChange` callback with mode-aware value shape.
- **New `<DatePickerInput>`** — Input-styled trigger + Popover + DatePicker.
  `value: Date | null`, `format` tokens (`yyyy`/`MM`/`dd`), `clearable`,
  `invalid`, `size='sm'|'md'|'lg'`. `formatDate(d, format)` re-exported.

### Site

- Docs site migrated to all new APIs. 34 component pages plus the new
  RadioGroup and DatePickerInput pages all reflect 1.0 signatures and demos.
  [stcn52.github.io/cloud-ui](https://stcn52.github.io/cloud-ui/)

### Bundle size (gzip)

- Library JS: ~32 kB (was 27 kB — mostly the new Select + DatePickerInput)
- Library CSS: 9.1 kB (unchanged)

### Migration guide

```diff
- import { PipeStep, Breadcrumb } from '@stcn52/cloud-ui'
+ import { PipelineStep, BreadcrumbItem } from '@stcn52/cloud-ui'

- <Tab active={t === current} onClick={() => setCurrent(t)}>{t}</Tab>
+ <Tab id={t}>{t}</Tab>
  // and wrap in <Tabs value={current} onChange={setCurrent}>

- <Pagination page={p} total={20} onChange={setPage} />
+ <Pagination current={p} total={200} pageSize={10} onChange={setPage} />

- <Select><option>A</option><option>B</option></Select>
+ <Select options={[{value:'A',label:'A'},{value:'B',label:'B'}]} onChange={...} />
```

## [0.3.0] — 2026-04-21

Toast gets the full sonner/react-hot-toast treatment: more tones, default
icons, a left color bar, optional title/description, slide-in + fade-out
animations, a hover-pausing progress bar, and an imperative API.

### Added

- **`warn` + `info` tones** on `Toast`, in addition to `neutral` / `ok` / `err`.
- **Default icons** — non-neutral tones render a built-in glyph automatically.
  Pass `icon={false}` to hide, `icon={<Custom />}` to override.
- **Color bar + two-row layout** — a 3 px tone-coloured bar runs along the
  left edge; `title` renders bold above the `children` description.
- **`top-center` / `bottom-center` positions** on `ToastStack`.
- **`Toaster` component + imperative `toast()` API** — mount one `<Toaster />`
  near the app root, then call:
  - `toast.success(msg, { title?, duration?, actions?, id?, icon?, onDismiss? })`
  - `toast.error(…)`, `toast.warn(…)`, `toast.info(…)`, `toast(…)` (neutral)
  - `toast.dismiss(id?)` — pass an id to close one, omit to close all
  - Re-using an `id` replaces the existing toast (useful for progress updates).
  - `duration` defaults to 4000 ms; pass `Infinity` for a sticky toast.
- **Slide-in / fade-out animations** — enter animation direction matches the
  `Toaster` position (right edge slides in from the right, etc.); leave is a
  fade + scale-down.
- **Hover-pause + progress bar** — the thin bar at the bottom depletes as the
  toast ages; hovering pauses both the bar and the auto-dismiss timer,
  resuming on mouse-leave.

### Bundle size (gzip)

- JS: ~35.7 kB (+2.1 kB vs 0.2.1 — `Toaster` + default icons)
- CSS: ~9.0 kB (+0.5 kB — new keyframes, color-bar utilities)

## [0.2.1] — 2026-04-21

### Fixed

- **`useContextMenu`** — right-click on a second target while the menu was
  already open caused a close/re-open flash because the `mousedown` listener
  fired on button 2. The listener now ignores right-button mousedowns.
- **`PopoverItem` submenu** — the 200 ms close timer leaked when the item
  unmounted mid-delay (e.g. parent popover closes). Added a cleanup effect
  that clears the pending timeout on unmount.
- **`Tab`** — all tabs had `tabIndex={0}`, so Tab-key navigation cycled
  through every tab instead of focusing the active one. Non-active tabs now
  use `tabIndex={-1}` per the WAI-ARIA tabs pattern.

### Docs

- `useContextMenu` JSDoc notes that inline JSX `menu` works but `useMemo` is
  recommended for large menus to avoid re-mounting the portal subtree.

## [0.2.0] — 2026-04-21

### Added

- **`useContextMenu(menu)`** hook — returns `{ open, close, render }`. Attach
  `open` to `onContextMenu` on any number of targets; call `render()` once.
  Menu DOM is shared across targets (doesn't duplicate). Auto-closes on
  outside click, ESC, scroll, or resize; clamps to viewport bounds.
- **`Tab` closable + `onClose`** — set `closable` to render a trailing `×`;
  `onClose` fires when it's clicked (stops propagation so the tab body's
  `onClick` stays independent).
- **`PopoverItem` `submenu`** — pass a `ReactNode` to open a right-side nested
  panel on hover. Uses a Portal with 200 ms close delay so the cursor can
  cross into the submenu.
- **`08 · Layouts/File manager`** story — full Baota-style file manager
  implementation demonstrating closable tabs, 18-item context menu with
  nested "upload to cloud" submenu, tabbed properties dialog, and content-
  search dialog. Non-exported reference.

### Bundle size (gzip)

- JS: ~33.6 kB (+0.9 kB vs 0.1.0)
- CSS: 8.5 kB (unchanged)

## [0.1.0] — 2026-04-21

Initial release.

### Added

- **40 components** in six categories (Foundations, Primitives, Data display,
  Navigation, Overlays, Advanced controls).
- **`ConfigProvider`** with `theme` (`light`/`dark`), `size`
  (`compact`/`normal`/`comfortable`), and `locale` props.
- **Bundled locales**: `en`, `zhCN`. Pagination, CommandPalette, CopyField,
  Banner, Toast, Pill, TagInput, and DatePicker read their default strings
  from the active locale.
- **Tailwind v4** as the styling foundation — all tokens live in `@theme`,
  all component classes are generated utilities via `tailwind-variants`.
- Density-aware utilities: `[data-size="compact"]` and
  `[data-size="comfortable"]` rescale `--spacing` and `--text-*`, so heights,
  padding, gaps, and text sizes all respond automatically.
- **Dual build**: ESM (`dist/index.js`) + CJS (`dist/index.cjs`) +
  rolled-up `.d.ts` + single CSS bundle (`dist/styles.css`).
- **Storybook 10** with theme / size / locale toolbar controls for live
  previews of every component.

### Bundle size (gzip)

- JS: ~33 kB (includes `tailwind-variants` + `tailwind-merge`)
- CSS: ~8.5 kB (Tailwind utilities only — no preflight bloat)
