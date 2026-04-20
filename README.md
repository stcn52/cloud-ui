# @stcn52/cloud-ui

React + TypeScript component library built on Tailwind v4. 40 components
across six categories: primitives, data display, navigation, overlays,
advanced controls, plus foundations. Calm, dense, operator-first visual
language — cool neutrals with a single azure accent.

## Install

```bash
pnpm add @stcn52/cloud-ui
# or
npm install @stcn52/cloud-ui
```

Peer deps: `react ^18`, `react-dom ^18`.

## Quick start

```tsx
import '@stcn52/cloud-ui/styles.css'
import { Button, Input, Field } from '@stcn52/cloud-ui'

export function App() {
  return (
    <div>
      <Field label="Service name">
        <Input placeholder="api-gateway" />
      </Field>
      <Button intent="primary">Deploy</Button>
    </div>
  )
}
```

## ConfigProvider — theme, size, locale

Wrap your app (or a subtree) to control theme, density, and i18n:

```tsx
import { ConfigProvider, zhCN } from '@stcn52/cloud-ui'

<ConfigProvider theme="dark" size="compact" locale={zhCN}>
  <App />
</ConfigProvider>
```

| Prop      | Values                                | Default |
| --------- | ------------------------------------- | ------- |
| `theme`   | `'light'` \| `'dark'`                 | `light` |
| `size`    | `'compact'` \| `'normal'` \| `'comfortable'` | `normal` |
| `locale`  | `Locale` object (bundled: `en`, `zhCN`) | `en`  |
| `target`  | `'wrapper'` \| `'body'`               | `wrapper` |

The provider writes `data-theme` and `data-size` to its wrapping element (or
`document.body` if `target='body'`). All components respond automatically via
CSS variables.

### Custom locale

The bundled locales cover UI strings used by `Pagination`, `CommandPalette`,
`CopyField`, `Banner`, `Toast`, `Pill`, `TagInput`, and `DatePicker`. You can
supply your own:

```ts
import type { Locale } from '@stcn52/cloud-ui'

const ja: Locale = {
  code: 'ja',
  pagination: { prev: '‹ 前へ', next: '次へ ›' },
  commandPalette: { placeholder: '検索…', empty: '該当なし', escape: 'esc' },
  // …
}
```

## Available components

**01 · Foundations** — Color, Typography, Spacing, Radius, Elevation (docs
only, no runtime components).

**02 · Primitives** — `Button`, `ButtonGroup`, `Input`, `InputGroup`, `Affix`,
`Field`, `Checkbox`, `CheckRow`, `Radio`, `RadioRow`, `Switch`, `Select`,
`Textarea`, `Pill`, `Dot`, `Avatar`, `AvatarStack`, `Kbd`.

**03 · Data display** — `Card`, `CardHead`, `CardFoot`, `Kpi`, `Delta`,
`Table`, `Progress`, `Ring`, `Skeleton`, `Pipeline`, `PipeStep`, `LogLine`.

**04 · Navigation** — `Tabs`, `Tab`, `Segmented`, `Breadcrumbs`, `Breadcrumb`,
`Pagination`.

**05 · Overlays** — `Banner`, `Tooltip`, `Toast`, `ToastStack`, `Empty`,
`Dialog`, `DialogHead`, `DialogBody`, `DialogFoot`, `Drawer`, `DrawerHead`,
`DrawerBody`, `DrawerFoot`, `Popover`, `PopoverItem`, `PopoverSeparator`,
`CommandPalette`.

**06 · Advanced** — `Dropdown`, `DropdownItem`, `DropdownGroup`,
`DropdownSeparator`, `DropdownSearch`, `Tree`, `Cascader`, `DatePicker`,
`TagInput`, `CopyField`.

## Theming via CSS variables

Every token is a CSS variable — override in your own stylesheet:

```css
:root {
  --color-accent:      oklch(0.65 0.16 140);  /* switch to green */
  --color-accent-weak: oklch(0.95 0.04 140);
  --color-accent-ink:  oklch(0.36 0.10 140);
}
```

Full token list: run Storybook (`pnpm dev`) → **01 · Foundations/Overview**.

## Development

```bash
pnpm install
pnpm dev              # Storybook on :6006
pnpm build            # dist/{index.js, index.cjs, index.d.ts, styles.css}
pnpm build-storybook  # static Storybook in storybook-static/
pnpm typecheck        # tsc -b && stories typecheck
```

## License

MIT
