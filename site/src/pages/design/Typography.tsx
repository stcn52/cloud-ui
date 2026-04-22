import { Card } from '@stcn52/cloud-ui'

const sizes = [
  { name: '--text-xxs',  value: '10.5px' },
  { name: '--text-xs',   value: '11.5px' },
  { name: '--text-sm',   value: '12.5px' },
  { name: '--text-md',   value: '13px' },
  { name: '--text-lg',   value: '15px' },
  { name: '--text-xl',   value: '20px' },
  { name: '--text-2xl',  value: '28px' },
]

export default function Typography() {
  return (
    <article className="page">
      <h1>Typography</h1>
      <p>
        Two font stacks, seven sizes, tight letter-spacing. No fonts are bundled — the library
        defers to whatever you load (Inter and JetBrains Mono work best).
      </p>

      <h2>Font families</h2>
      <pre>{`--font-ui:   "Inter", system-ui, -apple-system, Helvetica, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, monospace;`}</pre>

      <h2>Scale</h2>
      <p>Sizes scale with density: <code>compact</code> shrinks every step, <code>comfortable</code> grows them. Toggle S / M / L in the top bar to preview.</p>

      <Card style={{ padding: 0, overflow: 'hidden', marginTop: 16 }}>
        {sizes.map((s, i) => (
          <div
            key={s.name}
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr 100px',
              alignItems: 'baseline',
              gap: 16,
              padding: '14px 20px',
              borderTop: i === 0 ? 'none' : '1px solid var(--color-line)',
            }}
          >
            <code style={{ fontSize: 12, background: 'transparent', border: 0, padding: 0, color: 'var(--color-text-muted)' }}>
              {s.name}
            </code>
            <div style={{ fontSize: `var(${s.name})`, color: 'var(--color-text)' }}>
              Latency holding steady at 42 ms
            </div>
            <code style={{ fontSize: 11, background: 'transparent', border: 0, padding: 0, color: 'var(--color-text-dim)', textAlign: 'right' }}>
              {s.value}
            </code>
          </div>
        ))}
      </Card>

      <h2>Tabular numerals</h2>
      <p>
        Apply <code>.num</code> (or <code>font-variant-numeric: tabular-nums</code>) to any container
        with numbers you'd like to align vertically — dashboards, tables, KPIs.
      </p>
      <pre>{`<div className="num">42.318 ms</div>`}</pre>

      <h2>Tracking</h2>
      <p>
        Body copy defaults to <code>letter-spacing: -0.003em</code> — a near-invisible tightening
        that Inter in particular benefits from.
      </p>
    </article>
  )
}
