# Changelog

All notable changes will be documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
