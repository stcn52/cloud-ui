import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: '01 · Foundations/Overview',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`@stcn52/cloud-ui` is built on Tailwind v4 + `tailwind-variants`. All tokens are CSS variables declared in `@theme`, so consumers can override them via plain CSS.',
      },
    },
  },
}

export default meta
type Story = StoryObj

interface Swatch {
  token: string
  name: string
}
const neutrals: Swatch[] = [
  { token: 'bg', name: 'Canvas' },
  { token: 'bg-sunk', name: 'Sunk' },
  { token: 'panel', name: 'Panel' },
  { token: 'line', name: 'Line' },
  { token: 'text-muted', name: 'Muted' },
  { token: 'text', name: 'Text' },
]
const accents: Swatch[] = [
  { token: 'accent', name: 'Accent' },
  { token: 'accent-weak', name: 'Weak' },
  { token: 'ok', name: 'Success' },
  { token: 'warn', name: 'Warning' },
  { token: 'err', name: 'Error' },
  { token: 'info', name: 'Info' },
]

function Row({ swatches }: { swatches: Swatch[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
      {swatches.map((s) => (
        <div
          key={s.token}
          style={{ border: '1px solid var(--color-line)', borderRadius: 8, overflow: 'hidden', background: 'var(--color-bg-elev)' }}
        >
          <div style={{ height: 72, background: `var(--color-${s.token})` }} />
          <div style={{ padding: '8px 10px', fontSize: 11 }}>
            <div style={{ fontWeight: 600, fontSize: 12 }}>{s.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-text-dim)' }}>
              --color-{s.token}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const Color: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section>
        <h3>Neutrals</h3>
        <Row swatches={neutrals} />
      </section>
      <section>
        <h3>Accent & status</h3>
        <Row swatches={accents} />
      </section>
    </div>
  ),
}

interface TypeRow { label: string; sample: string; style: React.CSSProperties }
const typeRows: TypeRow[] = [
  { label: '2xl · Display', sample: 'Developers ship on cloud-ui', style: { fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' } },
  { label: 'xl · H1', sample: 'Services overview', style: { fontSize: 20, fontWeight: 600, letterSpacing: '-0.015em' } },
  { label: 'lg · H2', sample: 'Recent deployments', style: { fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' } },
  { label: 'md · Body', sample: "The request was rejected because it exceeded the plan's rate limit.", style: { fontSize: 13 } },
  { label: 'sm · UI', sample: 'Deploy to production', style: { fontSize: 12.5 } },
  { label: 'xs · Label', sample: 'Last deployed', style: { fontSize: 11.5, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 } },
]

export const Typography: Story = {
  render: () => (
    <div>
      {typeRows.map((r) => (
        <div
          key={r.label}
          style={{
            display: 'grid', gridTemplateColumns: '160px 1fr',
            gap: 20, padding: '14px 0',
            borderBottom: '1px solid var(--color-line)', alignItems: 'baseline',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {r.label}
          </span>
          <span style={r.style}>{r.sample}</span>
        </div>
      ))}
    </div>
  ),
}

const spacing = [
  ['--sp-1', 4], ['--sp-2', 8], ['--sp-3', 12], ['--sp-4', 16],
  ['--sp-5', 24], ['--sp-6', 32], ['--sp-7', 48], ['--sp-8', 64],
] as const

export const Spacing: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {spacing.map(([token, px]) => (
        <div
          key={token}
          style={{
            display: 'grid', gridTemplateColumns: '80px 1fr 120px',
            gap: 16, alignItems: 'center', padding: '8px 0',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-dim)' }}>{token}</span>
          <div
            style={{
              height: 14, width: px,
              background: 'var(--color-accent-weak)',
              borderRadius: 3,
              border: '1px solid color-mix(in oklch, var(--color-accent) 25%, transparent)',
            }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'right' }}>{px}px</span>
        </div>
      ))}
    </div>
  ),
}

const radius = [
  ['xs', 4, 'pills'],
  ['sm', 6, 'controls'],
  ['md', 8, 'cards'],
  ['lg', 12, 'modals'],
  ['xl', 16, 'feature'],
] as const

export const Radius: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
      {radius.map(([key, px, role]) => (
        <div key={key} style={{ width: 96, textAlign: 'center' }}>
          <div
            style={{
              height: 64, borderRadius: px,
              background: 'var(--color-accent-weak)',
              border: '1px solid color-mix(in oklch, var(--color-accent) 25%, transparent)',
            }}
          />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>
            --radius-{key}<br />{role}
          </div>
        </div>
      ))}
    </div>
  ),
}

const shadows = [
  ['xs', 'flat · hairline'],
  ['sm', 'cards, buttons'],
  ['md', 'dropdowns'],
  ['lg', 'modals, toasts'],
] as const

export const Elevation: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: 40 }}>
      {shadows.map(([key, role]) => (
        <div
          key={key}
          style={{
            background: 'var(--color-bg-elev)',
            border: '1px solid var(--color-line)',
            borderRadius: 8, padding: 20, textAlign: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-muted)',
            boxShadow: `var(--shadow-${key})`,
          }}
        >
          --shadow-{key}<br />{role}
        </div>
      ))}
    </div>
  ),
}
