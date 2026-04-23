# Dogfood report

Findings from writing `stcn52.github.io/cloud-ui` — a full docs site built
entirely with `@stcn52/cloud-ui` itself. Top-level + sidebar + every page
renders through our own components. The site consumes the library the same
way any external user would.

This is **what hurt while consuming the API**, grouped by severity. Nothing
here is critical; every component ships and works. The list is the backlog
for future polish / a 0.4 / 1.0 cleanup pass.

---

## 🔴 High — friction that blocked or misled a consumer

### 1. `CommandPalette` takes `items` array, not children
```tsx
// what feels natural
<CommandPalette open={open} onClose={close}>
  <CommandItem id="a" onSelect={...}>Run build</CommandItem>
  <CommandItem id="b" group="Nav" onSelect={...}>Go home</CommandItem>
</CommandPalette>

// what's actually required
<CommandPalette open={open} onClose={close} items={[
  { id: 'a', label: 'Run build', onSelect: () => {} },
  { id: 'b', label: 'Go home', group: 'Nav', onSelect: () => {} },
]} />
```
Fix: either add a `children`-based variant or ship a `<CommandItem>` wrapper
that self-registers with a context.

### 2. `Breadcrumbs` / `Breadcrumb` naming is asymmetric + `leaf` is manual
```tsx
<Breadcrumbs>
  <Breadcrumb>Home</Breadcrumb>
  <Breadcrumb>Docs</Breadcrumb>
  <Breadcrumb leaf>Installation</Breadcrumb>  // must remember this
</Breadcrumbs>
```
Every other library calls this `BreadcrumbItem`, and auto-promotes the last
child to leaf. Both things would be a net quality-of-life improvement.

### 3. `Pipeline` / `PipeStep` names don't line up
Parent is `Pipeline`, child is `PipeStep` — not `PipelineStep`. First
attempt every time writes `<PipelineStep>` and gets a TS error.

### 4. `Tabs`, `Tab`, `CardTabs`, `CardTab` are all **uncontrolled**
There is no top-level `value` / `onChange`. Each tab manages `active` +
`onClick` itself. Consumers end up writing the same `useState('a')` pattern
over and over. We did it 5+ times on the docs site alone.

Proposed shape:
```tsx
<Tabs value={id} onChange={setId}>
  <Tab id="preview">Preview</Tab>
  <Tab id="code">Code</Tab>
</Tabs>
```
Keep the current uncontrolled style as a fallback.

### 5. `Tooltip` has no `placement` prop — hardcoded top-centered
`Tooltip` source positions the tip absolutely above the trigger. No `side`,
no `top/bottom/left/right`, no collision detection. When it doesn't fit,
the answer today is "use `Popover` instead".

### 6. `DatePicker` is a bare calendar — no input, no min/max, no format
The component is a standalone calendar grid. No text input, no
`min` / `max`, no `format` prop, no preset ranges. For 90% of use cases
(a labeled date field) the user has to wrap it in a `Popover` with their
own trigger. At minimum we need a "DatePickerInput" that combines the two.

---

## 🟡 Medium — awkward but workable

### 7. `Select` is a near-passthrough over native `<select>`
No `options` array, no placeholder, no search, no multi-select. Consumers
must use native `<option>` / `<optgroup>` children, and the `defaultValue=""`
placeholder trick. A richer select is on most teams' shortlist.

### 8. `Radio`, `Switch`, `Textarea` have **no library-level props**
Their type signatures are `InputHTMLAttributes` / `TextareaHTMLAttributes`
with nothing added. No `invalid`, `size`, `autosize`. No `<RadioGroup>` to
bind options to a single name. Adding even `invalid` to Input/Radio/Switch
would unify error styling across forms.

### 9. `Segmented` has no `size` prop
Input and Button ship `size='xs' | 'sm' | ...` — Segmented doesn't, and it
ends up visually inconsistent in density toggles / sub-nav contexts.

### 10. `Pagination` uses `page` + `total` (pages, not rows), no `pageSize`
Naming collides with some conventions — most libraries use `current` for
page and `total` for row count. Plus there's no built-in derived
`totalPages` computation.

### 11. `CopyField` wants both `value` and `children`
```tsx
<CopyField value="ak_0123" />                  // clipboard only, shows "ak_0123"
<CopyField value="ak_0123">ak_••••23</CopyField>   // mask display, real copy
<CopyField>plain text</CopyField>              // breaks — children isn't string
```
Third case doesn't copy. When `children` is a plain string, fall back to
using it for both.

### 12. `TagInput` silently dedupes + has no max
Duplicates are dropped silently, case-sensitive. `maxTags` has to be
enforced in the caller's `onChange`. `separator: ','` doesn't exist —
only `commitKeys: string[]`.

### 13. `Checkbox.indeterminate` is imperative
`indeterminate` is applied in a `useEffect` that pokes the DOM. It's
visual-only — `checked` stays independent — and the source comment has to
explain it, which it shouldn't have to.

### 14. `Popover` trigger must be a valid single ReactElement
Throws if you pass a fragment or a raw string. That's fine once you know
it, but the error is only thrown at render time. Either accept any ReactNode
(wrap in a `<span>` internally) or at least TS-narrow the prop.

### 15. `Tree` has no multi-select / checkbox variant
Single-select only. Checkbox trees are the #1 ask for any file / perm UI.

### 16. `DialogHead.danger` tints the icon but not the footer buttons
You still have to pass `intent="danger"` to the confirm button. Make
`DialogHead.danger` propagate via context to the footer's primary action.

### 17. `Drawer backdrop={false}` + `closeOnBackdrop={true}`
If you turn the backdrop off and leave the default close-on-backdrop
behavior, there's nothing to click to close it. Runtime shows an open drawer
the user can't dismiss without the × button.

### 18. `Dropdown.DropdownItem.submenu` is cosmetic only
Renders the `›` chevron but doesn't wire up the actual nested menu. Real
submenus live in `Popover` / `PopoverItem`. Either wire `Dropdown.submenu`
to a real nested popover or rename it to `submenuAffordance`.

---

## 🟢 Low — API polish candidates

### 19. `Segmented<V extends string>` doesn't infer V from options
```tsx
const opts = [{value: 'light', label: '☀'}, {value: 'dark', label: '☾'}] as const
<Segmented options={opts} value={theme} onChange={(v) => ...} />
// `v` is string, not 'light' | 'dark'
```
Consumers cast every time. Fixable with tighter generic constraints.

### 20. No library-level **NavLink** / **Link** component
Our docs site uses `<Button intent="ghost" onClick={() => navigate(...)}>`
for nav links. Works, but breaks right-click, cmd-click, middle-click.
Adding `<Button as="a" href="...">` (render-as pattern, Radix-style) would
fix this everywhere.

### 21. `Kpi` doesn't separate number from unit
```tsx
<Kpi label="JS (gzip)" value="36 kB" />
// all one size; "36" and "kB" would ideally render at different weights
```
Add `unit` slot.

### 22. `LogLine.level` is required
No default. Most log lines are `info`. Would expect `info` as default.

### 23. `Table` ships no subcomponents
Just the wrapper. Writing `<thead><tr><th>...` every time is verbose,
but arguably intentional for flexibility. Consider optional
`Table.Row`, `Table.Cell` — both optional.

### 24. `Skeleton` has no variant API
Shape is 100% `style={{ width, height, borderRadius }}`. A couple of
variant shortcuts (`variant="text" | "circle" | "block"`) would spare
repetitive styling.

### 25. Dropdown submenu and Popover submenu use different mechanisms
Same UX, different paths. Consolidate.

---

## What went *well*

Worth naming, because dogfooding also validated a lot of decisions:

- **Single-flip theming.** `data-theme="dark"` on `<html>` swaps the whole
  palette. Zero per-component dark overrides needed.
- **Density axis.** `data-size` does exactly what it promises — three
  `ConfigProvider`s on a single page scale independently.
- **Tokens are CSS variables.** Arbitrary tokens can be used anywhere
  (inline styles, custom CSS, third-party embeds) without a runtime lib.
- **Single stylesheet.** Site imports `@stcn52/cloud-ui/styles.css` and
  that's it. No per-component CSS, no tree-shake config.
- **`Toast` / `Toaster`** is probably the most polished component in the
  library — `useSyncExternalStore`, hover-pause, progress bar, sticky via
  `duration: Infinity`, id-replace for progress updates. No friction points
  at all.
- **`Pipeline` + `PipeStep`** reads very clearly once you get past the
  naming — the auto-inserted connectors are a nice touch.
- **`Breadcrumbs` separator customization** — letting `separator` be any
  ReactNode is a small nice detail.

---

## Suggested versioning

- **0.4.0 (minor, additive)** — add `size` to Segmented, `invalid` to form
  primitives, `TabsControl` / `CommandPalette` children API as new opt-in
  surfaces. No breaks.
- **0.5.0 (minor, additive)** — `DatePickerInput` composite, `TreeMulti`,
  `as` prop on Button/Link.
- **1.0.0 (breaking)** — rename `PipeStep → PipelineStep`, `Breadcrumb →
  BreadcrumbItem`, unify Dropdown/Popover submenu mechanism, auto-leaf on
  last Breadcrumb, controlled `<Tabs value>` becomes default.
