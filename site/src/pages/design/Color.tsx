import { Card, Banner } from '@stcn52/cloud-ui'
import type { ReactNode } from 'react'

interface TokenEntry {
  name: string
  cssVar: string
  value: string
  note?: string
}

const surface: TokenEntry[] = [
  { name: 'bg',          cssVar: '--color-bg',          value: 'oklch(0.995 0.004 240)', note: 'Page background' },
  { name: 'bg-elev',     cssVar: '--color-bg-elev',     value: 'oklch(1 0 0)',           note: 'Cards, panels' },
  { name: 'bg-sunk',     cssVar: '--color-bg-sunk',     value: 'oklch(0.975 0.006 240)', note: 'Subtle inset' },
  { name: 'panel',       cssVar: '--color-panel',       value: 'oklch(0.985 0.005 240)' },
  { name: 'line',        cssVar: '--color-line',        value: 'oklch(0.92 0.008 240)',  note: 'Default border' },
  { name: 'line-strong', cssVar: '--color-line-strong', value: 'oklch(0.86 0.01 240)' },
  { name: 'text',        cssVar: '--color-text',        value: 'oklch(0.22 0.02 250)',   note: 'Primary text' },
  { name: 'text-muted',  cssVar: '--color-text-muted',  value: 'oklch(0.52 0.015 250)',  note: 'Labels, helper' },
  { name: 'text-dim',    cssVar: '--color-text-dim',    value: 'oklch(0.68 0.012 250)',  note: 'Metadata' },
]

const accent: TokenEntry[] = [
  { name: 'accent',      cssVar: '--color-accent',      value: 'oklch(0.62 0.14 230)',   note: 'Primary action' },
  { name: 'accent-weak', cssVar: '--color-accent-weak', value: 'oklch(0.95 0.04 230)',   note: 'Active tab, hover' },
  { name: 'accent-ink',  cssVar: '--color-accent-ink',  value: 'oklch(0.36 0.10 230)',   note: 'Accent text on weak bg' },
]

const status: TokenEntry[] = [
  { name: 'ok',   cssVar: '--color-ok',   value: 'oklch(0.66 0.13 155)', note: 'Success' },
  { name: 'warn', cssVar: '--color-warn', value: 'oklch(0.76 0.14 75)',  note: 'Warning' },
  { name: 'err',  cssVar: '--color-err',  value: 'oklch(0.62 0.18 22)',  note: 'Error' },
  { name: 'info', cssVar: '--color-info', value: 'oklch(0.62 0.14 230)', note: 'Informational' },
]

function Swatch({ token }: { token: TokenEntry }) {
  return (
    <Card style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{
          height: 52,
          borderRadius: 6,
          background: `var(${token.cssVar})`,
          border: '1px solid color-mix(in oklch, var(--color-line) 70%, transparent)',
        }}
      />
      <div style={{ fontWeight: 600, fontSize: 13 }}>{token.name}</div>
      <code style={{ fontSize: 11, background: 'transparent', border: 0, padding: 0, color: 'var(--color-text-muted)' }}>
        {token.cssVar}
      </code>
      <code style={{ fontSize: 11, background: 'transparent', border: 0, padding: 0, color: 'var(--color-text-dim)' }}>
        {token.value}
      </code>
      {token.note && (
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{token.note}</div>
      )}
    </Card>
  )
}

function Section({ title, tokens, intro }: { title: string; tokens: TokenEntry[]; intro?: ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
          marginTop: 16,
        }}
      >
        {tokens.map((t) => (
          <Swatch key={t.name} token={t} />
        ))}
      </div>
    </section>
  )
}

export default function Color() {
  return (
    <article className="page">
      <h1>Color</h1>
      <p>
        Every color is defined in <strong>oklch</strong> — a perceptual color space that keeps hue
        consistent as you change lightness. Each token has a hand-tuned dark-mode counterpart.
      </p>

      <Banner tone="info" title="Try it" style={{ margin: '20px 0' }}>
        Flip the ☀ / ☾ toggle in the top bar to see every swatch swap to its dark counterpart.
      </Banner>

      <Section
        title="Surface & text"
        intro="Neutrals that carry ~80% of every screen."
        tokens={surface}
      />

      <Section
        title="Accent"
        intro="The single brand hue. Used for primary actions, focus rings, and the active-state background."
        tokens={accent}
      />

      <Section
        title="Status"
        intro="Four colors carry every positive / negative / neutral signal the library emits — Toast, Banner, Pill, Progress, LogLine all share them."
        tokens={status}
      />
    </article>
  )
}
