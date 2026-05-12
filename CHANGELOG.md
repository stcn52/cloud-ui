# Changelog

All notable changes will be documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Story links below point at the live Storybook:
<https://stcn52.github.io/cloud-ui/storybook/>.

## [1.7.0] — 2026-05-12

Density propagation: every component that has a `size` prop now also follows the
global `ConfigProvider` density when you don't pass `size` explicitly. No visual
regression — `md` is the current look, and an explicit `size` prop still always
wins.

### Added

- **`useResolvedSize(explicitProp, byGlobalMap)`** — the hook behind it. An
  explicit `size` prop always wins; otherwise the control reads the active
  `ConfigProvider` density and maps `compact → sm`, `normal → md`,
  `comfortable → lg` (clamped to `md` for controls that have no `lg`). This
  release also lands the previously-uncommitted `useResolvedSize` hook itself
  plus its `index` export — it shipped in the published `dist` but had never been
  committed to git.
- **Per-component `<Name>Size` types are now exported** (`CheckboxSize`,
  `RadioSize`, `SwitchSize`, `TextareaSize`, `SliderSize`, `FileInputSize`,
  `TagInputSize`, `OtpInputSize`, `BadgeSize`, …).

### Changed

- **Now density-aware:**
  - Already wired before this release: `Button`, `Input`, `NxTable`.
  - Had a `size` prop, now also follow `ConfigProvider`: `Spinner`, `Badge`,
    `Avatar`, `ColorPicker`, `DateChip`, `NumberStepper`, `Pill`, `Rating`,
    `Segmented`, `ToggleGroup`.
  - Gained a `size` variant (`sm`/`md`/`lg`, `md` = current look) **and** follow
    `ConfigProvider`: `Checkbox`, `Radio`, `Switch`, `Textarea`, `Slider`,
    `FileInput`, `TagInput`, `OtpInput`. `Select` gained an `lg` size.
- **Unchanged** — content-driven or not density-relevant: `Card`, `Dialog`,
  `Drawer`, `Popover`, `Tabs`, `Pagination`, the charts (`Donut`, `Gauge`,
  `Sparkline`, `Progress`), `Divider`, `Kbd`, `Link`.

## [1.6.0] — 2026-05-12

`NxTable` row drag-reorder, `Input` `clearable`, and a batch of `NxTable`
layout / z-index fixes. No breaking changes.

### Added

- **`NxTable` row drag-reorder** — pass `onRowReorder` and a drag-handle column
  (`⠿`) is prepended. Works with pointer, keyboard (focus the handle, Space to
  pick up, arrows to move, Space to drop) and touch; rows animate as you drag and
  a floating `DragOverlay` clone follows the cursor. Powered by `@dnd-kit`
  (`@dnd-kit/core` + `sortable` + `modifiers` + `utilities` are now dependencies).
  The callback receives an **`NxRowReorderEvent`** —
  `{ orderedIds, movedId, fromIndex, toIndex, beforeId, afterId, movedRow }` — so
  a backend can persist the move with a single fractional-rank update ("moved
  between X and Y"); `NxTable` does **not** reorder `data` itself. The handle is
  disabled while a sort is active or when pagination splits the rows across
  pages, and `isRowDraggable` can lock individual rows.
  Stories: [Row reorder](https://stcn52.github.io/cloud-ui/storybook/?path=/story/11-·-tables-nxtable--row-reorder) ·
  [Row reorder with rank key](https://stcn52.github.io/cloud-ui/storybook/?path=/story/11-·-tables-nxtable--row-reorder-with-rank-key)
- **`Input` `clearable` prop** — shows a small `×` on the right whenever the
  field has a value; clicking it empties the input (controlled **and**
  uncontrolled) and refocuses. `onClear` fires alongside.
  Story: [Clearable](https://stcn52.github.io/cloud-ui/storybook/?path=/story/02-·-primitives-input--clearable)
- **More `NxTable` type exports** — `NxSortState`, `NxSortDir`,
  `NxRowReorderEvent`, `NxCellEditorArgs`, `NxEditable`.

### Fixed

- **`NxTable` header selection checkbox is now left-aligned** (was centered by
  the default `th` text-align); the select / expander cells use a clean class so
  there's no text-ellipsis `…` artifact, and the selection column widened
  36 → 44px so the 14px checkbox fits.
- **`NxTable` leading sticky columns** (drag / select / expander) bumped to
  `z-20` so they layer above pinned data columns (`z-10`); the body expander
  `td` is now genuinely `position: sticky` to match the header (the prior `left`
  style was a no-op without it).
- **`NxTable` `columnManager="dialog"`** — the `Transfer` dialog was 420px wide
  and its panes overflowed; it's now wide enough to fit them, and the
  "Available · N" count excludes already-shown columns.
- **`extras.css`** — `::-webkit-scrollbar-corner` is now transparent (was an
  opaque square where the two scrollbars meet).

## [1.5.0] — 2026-05-12

New `Transfer` component and a `Transfer`-powered column manager for `NxTable`.
No breaking changes — `NxTable`'s `columnManager` defaults to the existing
checkbox dropdown.

### Added — new component

- **`Transfer`** — dual-list "shuttle" picker. Left pane = available items
  (searchable), right pane = selected items (searchable), click to move between
  them; "Add all" / "Remove all". The right pane supports **drag-to-reorder**
  (`sortable`, default on) and optional **target groups** (`groups`) — each a
  labelled bucket, optionally with a `max` cap that rejects drops past it (e.g.
  a "Frozen (3)" group). Items can carry `icon` / `disabled` / `searchText`;
  controlled (`value` of `string | {key, group}` entries) or uncontrolled
  (`defaultValue`); `onResetDefaults` renders a "Restore defaults" link. This is
  the standard "configure fields / configure columns" UI.
  Stories: [Playground](https://stcn52.github.io/cloud-ui/storybook/?path=/story/06-·-advanced-transfer--playground) ·
  [With frozen group](https://stcn52.github.io/cloud-ui/storybook/?path=/story/06-·-advanced-transfer--with-frozen-group) ·
  [Not sortable](https://stcn52.github.io/cloud-ui/storybook/?path=/story/06-·-advanced-transfer--not-sortable) ·
  [In a dialog](https://stcn52.github.io/cloud-ui/storybook/?path=/story/06-·-advanced-transfer--in-a-dialog)

### Added — NxTable column manager

- **`NxTable` `columnManager` prop** — `'menu'` (default, the existing checkbox
  dropdown) or `'dialog'`. In `'dialog'` mode the toolbar "Columns" button opens
  a `Transfer` dialog where you can show/hide columns, **reorder** them by drag,
  and drag columns into a "Frozen" group (= `pinned: 'left'`, max 3). Column
  order and pinning are now tracked internally (and persisted under `persistKey`,
  which gained `order` / `pins` fields).
  Story: [Column manager dialog](https://stcn52.github.io/cloud-ui/storybook/?path=/story/11-·-tables-nxtable--column-manager-dialog)

## [1.4.1] — 2026-05-12

Bug-fix release. No API changes; `NxTable` gains an opt-in `fillHeight` prop.

### Fixed

- **`Select` could infinite-loop ("Maximum update depth exceeded") when its
  dropdown was open and `options`/`value` came from a non-memoized parent** —
  a very common caller pattern (e.g. `NxTable`'s per-column filter dropdown).
  The positioning effect listed `filtered` / `selectedSet` in its deps, both of
  which churn a new reference each render in that case, and it always wrote a
  fresh `panelStyle` object → render → effect → render… Now the effect only
  depends on `open` (plus a stable `useCallback`), reads `filtered`/`selectedSet`
  via refs, repositions on scroll/resize, and bails out of `setPanelStyle` /
  `setActiveIdx` when nothing changed. `NxTable` also memoizes the option arrays
  it feeds to its filter / density / page-size `Select`s.

### Added

- **`NxTable` `fillHeight` prop** — when set, the root becomes `h-full`, the
  toolbar pins to the top, pagination to the bottom, and the table body scrolls
  internally to fill the parent's height (the usual full-screen list-page
  layout). The parent must give NxTable a height (`height: 100%`, or `flex: 1`
  in a flex container with `min-height: 0`). The root now also carries
  `min-height: 0` so it shrinks correctly inside flex parents even without
  `fillHeight`.
  Stories: [Fill height](https://stcn52.github.io/cloud-ui/storybook/?path=/story/11-·-tables-nxtable--fill-height) ·
  [StrictMode + select filter (regression guard)](https://stcn52.github.io/cloud-ui/storybook/?path=/story/11-·-tables-nxtable--strict-mode-with-select-filter)

## [1.4.0] — 2026-05-08

Seven new components — `NxTable`, `JsonViewer`, `NotificationCenter`,
`QueryBuilder`, `Donut`, `Gauge`, `MentionPopover` — built from the refreshed
NextCli design handoff (`components/`), plus a follow-up dark-theme pass that
makes solid status fills (`Button danger/success/warning`, `Badge`, the
`FormSteps` check) legible again. No breaking changes — drop-in from 1.3.x.

### Added — data table

- **`NxTable`** — enterprise data table. Column resize & pin (left/right),
  sortable headers, per-column filters (text / select / range), global search,
  pagination with a page-size picker, multi/single row selection with a bulk
  action bar, expandable rows, density switch, column show/hide, CSV export,
  and optional `persistKey` to save UI state to `localStorage`. Cell `type`s:
  `text` / `number` / `money` / `status` / `date` / `bar` / `custom`, plus
  per-column `render` / `formatter`.
  Stories: [Full featured](https://stcn52.github.io/cloud-ui/storybook/?path=/story/11-·-tables-nxtable--full-featured) ·
  [Minimal](https://stcn52.github.io/cloud-ui/storybook/?path=/story/11-·-tables-nxtable--minimal) ·
  [Single-select compact](https://stcn52.github.io/cloud-ui/storybook/?path=/story/11-·-tables-nxtable--single-select-compact)

### Added — data display

- **`Donut`** — multi-segment ring chart with an auto or custom centre label
  and an optional legend; segments normalise against the sum or an explicit
  `total`.
  Stories: [Playground](https://stcn52.github.io/cloud-ui/storybook/?path=/story/03-·-data-display-donut--playground) ·
  [With total](https://stcn52.github.io/cloud-ui/storybook/?path=/story/03-·-data-display-donut--with-total) ·
  [No legend](https://stcn52.github.io/cloud-ui/storybook/?path=/story/03-·-data-display-donut--no-legend) ·
  [Status breakdown](https://stcn52.github.io/cloud-ui/storybook/?path=/story/03-·-data-display-donut--status-breakdown)
- **`Gauge`** — arc gauge with optional threshold bands; the value text picks
  up the active band's colour. Configurable `sweep`, `min`/`max`, custom
  centre, caption.
  Stories: [Playground](https://stcn52.github.io/cloud-ui/storybook/?path=/story/03-·-data-display-gauge--playground) ·
  [Thresholds](https://stcn52.github.io/cloud-ui/storybook/?path=/story/03-·-data-display-gauge--thresholds) ·
  [Flat arc](https://stcn52.github.io/cloud-ui/storybook/?path=/story/03-·-data-display-gauge--flat-arc) ·
  [Custom center](https://stcn52.github.io/cloud-ui/storybook/?path=/story/03-·-data-display-gauge--custom-center) ·
  [Sizes](https://stcn52.github.io/cloud-ui/storybook/?path=/story/03-·-data-display-gauge--sizes)

### Added — more

- **`JsonViewer`** — collapsible JSON tree. Parses strings (with a warning on
  invalid input), `defaultExpandDepth` (incl. `Infinity`), syntax colours that
  flip with the theme, optional copy button.
  Stories: [Playground](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-more-json-viewer--playground) ·
  [Fully expanded](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-more-json-viewer--fully-expanded) ·
  [From string](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-more-json-viewer--from-string) ·
  [Primitive](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-more-json-viewer--primitive)
- **`NotificationCenter`** — notification panel: grouped buckets, unread
  highlight + count, per-item `icon` / `tone` / `actions`, "mark all read",
  footer slot, empty state.
  Stories: [Default](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-more-notification-center--default) ·
  [With item actions](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-more-notification-center--with-item-actions) ·
  [Empty](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-more-notification-center--empty) ·
  [In a user menu](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-more-notification-center--in-a-user-menu)
- **`QueryBuilder`** — visual filter builder: per-rule field / operator / value
  (operators adapt to the field `type`), nested AND/OR groups up to `maxDepth`,
  add/remove rows & groups. Ships `queryToString(tree, fields)` for a readable
  expression and `emptyGroup()` helper.
  Stories: [Playground](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-more-query-builder--playground) ·
  [With nested groups](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-more-query-builder--with-nested-groups) ·
  [Flat only](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-more-query-builder--flat-only)
- **`MentionPopover`** — textarea with `@`-mention autocomplete: detects the
  active mention from the caret, filters items, keyboard navigation
  (↑/↓/Enter/Tab/Esc), inserts `@handle `. Configurable `trigger` char and
  filter; exposes a `MentionPopoverHandle` ref.
  Stories: [Playground](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-more-mention-popover--playground) ·
  [Custom trigger](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-more-mention-popover--custom-trigger) ·
  [Uncontrolled](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-more-mention-popover--uncontrolled)

### Changed — theme

- Dark tokens re-aligned with the design handoff's `components/tokens.css`:
  brighter text tiers, hairlines, and status hues so secondary text and
  `text-ok/warn/err/info` stay legible. New `--color-on-solid` token (white in
  light, near-black in dark) used by `Button` (primary/danger/success/warning),
  `FormSteps`, and `Badge` so text on *solid* status/accent fills stays
  readable now that the dark status hues are bright. Light theme unchanged.

## [1.3.0] — 2026-05-08

Three new components — `Accordion`, `Badge`, `PromptInput` — plus richer
`Select` options (grouping, per-row icon/description, a sticky footer slot) and
a dark-theme palette refresh tuned against the NextCli reference. No breaking
changes — drop-in upgrade from 1.2.x.

### Added — new components

- **`Accordion` + `AccordionItem`** — collapsible sections. `type="single"`
  (default, with `collapsible`) or `"multiple"`; controlled via `value` /
  `onValueChange` or uncontrolled via `defaultValue`. Each item header takes an
  `extra` slot for a count / `Pill` / `Badge`, and supports `disabled`.
  Stories: [Default](https://stcn52.github.io/cloud-ui/storybook/?path=/story/06-·-advanced-accordion--default) ·
  [Multiple](https://stcn52.github.io/cloud-ui/storybook/?path=/story/06-·-advanced-accordion--multiple) ·
  [Controlled](https://stcn52.github.io/cloud-ui/storybook/?path=/story/06-·-advanced-accordion--controlled)
- **`Badge`** — count / `max+` overflow / bare `dot` mode, six tones, two
  sizes. Renders standalone or, when given `children`, anchors to their
  top-right corner (icon buttons, avatars, …).
  Stories: [Playground](https://stcn52.github.io/cloud-ui/storybook/?path=/story/02-·-primitives-badge--playground) ·
  [Counts](https://stcn52.github.io/cloud-ui/storybook/?path=/story/02-·-primitives-badge--counts) ·
  [Tones](https://stcn52.github.io/cloud-ui/storybook/?path=/story/02-·-primitives-badge--tones) ·
  [Dot](https://stcn52.github.io/cloud-ui/storybook/?path=/story/02-·-primitives-badge--dot) ·
  [On icons](https://stcn52.github.io/cloud-ui/storybook/?path=/story/02-·-primitives-badge--on-icons)
- **`PromptInput`** — chat/composer input: auto-growing textarea (`minRows` /
  `maxRows`) inside a focus-ring shell, with `leading` / `trailing` toolbar
  slots for icon buttons, attachment chips, status text, and the send/stop
  button. `submitOn="enter"` (Enter sends, Shift+Enter newline) or
  `"cmd-enter"`. Controlled or uncontrolled; exposes a `PromptInputHandle` ref
  with `focus()` / `clear()` / `textarea`.
  Stories: [Playground](https://stcn52.github.io/cloud-ui/storybook/?path=/story/06-·-advanced-prompt-input--playground) ·
  [Queue composer](https://stcn52.github.io/cloud-ui/storybook/?path=/story/06-·-advanced-prompt-input--queue-composer) ·
  [Cmd+Enter](https://stcn52.github.io/cloud-ui/storybook/?path=/story/06-·-advanced-prompt-input--cmd-enter) ·
  [With mic](https://stcn52.github.io/cloud-ui/storybook/?path=/story/06-·-advanced-prompt-input--with-mic)

### Added — Select option enrichment

- `SelectOption.group` is now actually rendered — consecutive options sharing a
  `group` collect under an uppercase heading (the field existed since 1.0 but
  was inert). Works alongside `searchable` and `multiple`.
- `SelectOption.icon` — leading element on the option row (avatar, status dot,
  glyph); also shown in the trigger for the selected single value.
- `SelectOption.description` — trailing dim text on the option row (a role, a
  hint).
- New `Select.footer` slot — sticky element at the bottom of the panel, e.g. a
  persistent "+ Add new…" action.
- Stories: [Grouped](https://stcn52.github.io/cloud-ui/storybook/?path=/story/02-·-primitives-select--grouped) ·
  [Rich options](https://stcn52.github.io/cloud-ui/storybook/?path=/story/02-·-primitives-select--rich-options) ·
  [With footer](https://stcn52.github.io/cloud-ui/storybook/?path=/story/02-·-primitives-select--with-footer)

### Changed — dark theme

- Reworked `[data-theme="dark"]` tokens against `components/ui-kit-theme.html`:
  deeper page background with clearer elevation steps (`bg` / `bg-elev` /
  `bg-sunk` / `panel`), calmer hairlines, and — most importantly — explicit
  dark variants for `--color-ok/warn/err/info` so `text-ok/warn/err/info` stays
  legible on dark surfaces (the light-mode hues were too dim for foreground
  text). Also added a dark `--shadow-xs` / `--shadow-lg`. Light theme
  unchanged.

### Added — composition example

- **`07 · Compositions/Ticket detail`** — a support-ticket detail page built
  entirely from primitives (header strip, thread, reply box, metadata
  sidebar), doubling as a dark-mode contrast reference. Flip the Storybook
  theme toolbar to compare.
  [Story](https://stcn52.github.io/cloud-ui/storybook/?path=/story/07-·-compositions-ticket-detail--default)

## [1.2.0] — 2026-05-07

Form-validation primitives plus a multi-step form wrapper, on top of new
`Select` multi-select capabilities. Also extends `Locale` with a `form` block
so built-in validator messages localise via the existing toolbar locale toggle.
No breaking changes — drop-in upgrade from 1.1.x.

### Added — new primitives

- **`Form` + `useForm`** — headless form-state hook with field-level rules,
  cross-field `validate`, blur-then-onChange error display, `validateAll` /
  `validateFields(names)` / `submit`. `<FormField bind={form.field('x')}>`
  wires a control into the standard `<Field>` label/error layout and adapts
  both `(value) => …` and native `e.target.value/checked` event signatures.
  Built-in validators: `required`, `minLength`, `maxLength`, `pattern`,
  `email` — each `msg` accepts `string | (ctx) => string` for project copy or
  i18n integration; omit it to fall back to `Locale.form`.
- **`StepForm`** — multi-step wrapper around `FormSteps` with Back / Next /
  Finish navigation. Pair with `useForm` and per-step `fields: ['name', …]`
  for partial validation; the final step calls `form.submit()` so `onSubmit`
  fires once with the full values. Headless mode (per-step `validate()`) also
  supported for branched flows.

### Added — Select multi-select

- **`Select multiple`** — discriminated-union API: pass `multiple` to bind a
  `string[]` value. Selected entries render as removable chips inside the
  trigger; Backspace removes the last chip; `maxTagCount` collapses overflow
  into a `+N` chip.
- **`Select clearable`** — small `×` button clears the value(s); shared by
  single and multiple modes.
- The dropdown shows a checkbox per row in multi mode and stays open after
  each pick.

### Added — Locale

- New `Locale.form` block with built-in messages for `required`, `minLength`,
  `maxLength`, `pattern`, and `email.{format,fullwidth,whitespace}`. Both
  `en` and `zhCN` translated. `useForm` reads this through the existing
  `ConfigProvider` / `useLocale()`, so the Storybook locale toolbar (and any
  app-level provider) drives validator messages with no per-call boilerplate.
- `email` validator now distinguishes three failure reasons —
  `'format' | 'fullwidth' | 'whitespace'` — and surfaces the right one when
  the input contains full-width `＠` / `．` (a common IME slip-up) or stray
  whitespace.

## [1.1.1] — 2026-05-05

### Fixed

- **`Popover` / `Dropdown` / `Tooltip` / `Select` failed to position on first
  open.** The internal `Portal` mounted asynchronously via a `useState +
  useEffect` round-trip, so the panel ref was still `null` when the
  positioning `useLayoutEffect` ran. Subsequent layout effects didn't re-run,
  leaving panels stuck at `visibility: hidden`. `Portal` now mounts
  synchronously (SSR-safe via a `typeof document` guard).
  Affects every overlay that needs to read its panel rect on open. No API
  change.

## [1.1.0] — 2026-05-03

Eighteen new components driven by the **02-primitives** and **11-tables**
design handoffs. Plus three additive prop expansions on existing primitives.
No breaking changes — drop-in upgrade from 1.0.x.

### Added — new primitives (02-primitives handoff)

- **`Slider`** — single-thumb and dual-thumb range; keyboard-navigable
  (Arrow / Home / End); `min` / `max` / `step` / `ticks` / `marks` / `disabled`.
- **`NumberStepper`** — `−` / number / `+` with auto-disabled buttons at
  `min` / `max`; three sizes.
- **`OtpInput`** — 6-cell PIN input by default, with auto-advance on input,
  paste-fill, optional separator, and an `invalid` error state.
- **`ToggleGroup`** — denser pill-of-pills single-select; lighter chrome than
  `Segmented`. `default` and `accent` intents, two sizes.
- **`Spinner` / `DotsLoader` / `BarLoader`** — ring spinner (sm/md/lg/muted),
  thinking dots, indeterminate top-of-panel bar.
- **`Divider` / `DividerLabel`** — horizontal & vertical separators, plus
  the "or"-style labeled divider for auth screens.
- **`Link`** — `.lnk` inline link primitive with `default` / `muted` / `danger`
  intents and a `bare` variant (underline appears on hover only).
- **`CodeChip`** — inline mono token with `default` / `accent` / `err`.
  Used inline next to prose for command names, paths, identifiers.
- **`Rating`** — display + interactive star rating; supports halves; sm/md/lg.
- **`FileInput`** — button-style file picker with the filename to the right
  (the dropzone variant remains a separate composition pattern).
- **`MiniTabs`** — denser, in-panel underline tabs (the page-level `Tabs`
  remain heavier and unchanged).
- **`ColorSwatch` / `ColorPicker`** — single tile + a row of tiles plus an
  optional hex input. Defaults to the 8-tone NextCli brand palette; `round`,
  `lg`, `check` variants, and a `trailing` slot for "+ Add custom".
- **`DateChip`** — button-style date trigger for filter-bar popovers
  (paired with the existing `DatePicker`); `selected`, `noIcon`, `noCaret`.
- **`FormSteps`** — numbered stepper indicator. Auto-derives done/active/
  pending state from `current`; horizontal + vertical orientation.

### Added — new data-display components (11-tables handoff)

- **`FilterChip` / `FilterBar`** — the chip vocabulary for list-page filters:
  `plain` / `active` (key + value, dismissible) / `add` (dashed) / `invalid` /
  `count` (with badge). `FilterBar` is a thin flex wrapper.
- **`SavedViews`** — controlled view-tab strip with per-view `count` and
  `locked` (workspace-shared) icon, plus an `onAdd` slot for "+ New view".
- **`Sparkline`** — tiny inline trend chart. `line` / `area` / `bar` variants,
  five tones (accent / ok / warn / err / muted). No external dependency.

### Added — Table extensions (11-tables handoff)

- **`density`** prop on `Table` — `compact` (28 px) / `default` (34 px) /
  `relaxed` (44 px) row heights.
- **`SortHeader`** — three-state sort header (`none → desc → asc → none`)
  with auto-rotating chevron and `aria-sort`.
- **`TableBar`** — inline mini progress bar for cells like CPU %, memory %.
  Auto-tones at `≥85 → err` and `≥65 → warn`.
- **`StatusCell`** — dot + label, four tones (`ok` / `warn` / `err` / `idle`).
- **`CaretButton`** — expandable-row toggle with rotation animation.
- **`BulkBar` / `BulkBarButton` / `BulkBarSep`** — sticky bulk-action sheet
  for when ≥ 1 row is selected. Includes `danger` styling for delete actions.
- New utility classes baked into the `Table` base: `right`, `actions`,
  `num`, `mono`, plus a `tr.sel` selected-row state and hover-revealed
  action cells.

### Added — extensions to existing primitives

- **`Button`** — three new intents (`success`, `warning`, `link`) and a
  `fullWidth` prop. Loading-spinner colors picked per intent.
- **`Avatar`** — six brand gradient `tone`s (`azure` / `rose` / `amber` /
  `mint` / `violet` / `stone`); plus a `presence` prop that renders a status
  dot (`ok` / `warn` / `err` / `idle`) in the bottom-right corner with a
  surface-matching border. New `tone="none"` opt-out for custom backgrounds.
- **`Pill`** — new `xs` size (18 px) intended for inline table badges.
- **`Field`** — `required` (red `*`) and `optional` (dim suffix) label markers.

### Internal

- New `barLoader` keyframe in `extras.css`.
- 18 new Storybook story files; existing Button / Avatar / Pill / Table
  stories updated to showcase the new variants.

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
