# Changelog

All notable changes will be documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
