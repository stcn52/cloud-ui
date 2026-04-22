import { Button, Input, Card, ConfigProvider, Pill, Table } from '@stcn52/cloud-ui'
import type { Size } from '@stcn52/cloud-ui'

const sizes: Size[] = ['compact', 'normal', 'comfortable']

export default function Density() {
  return (
    <article className="page">
      <h1>Density</h1>
      <p>
        Density is a single attribute on a wrapper — <code>data-size="compact" | "normal" | "comfortable"</code>.
        It rescales <code>--spacing</code> (every padding, gap, and control height) and <code>--text-*</code>
        (every text size). All 37 components respond automatically.
      </p>

      <h2>Side-by-side</h2>
      <p>Each column below is wrapped in its own <code>ConfigProvider</code>. All three densities can coexist on the same page.</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          marginTop: 16,
        }}
      >
        {sizes.map((s) => (
          <ConfigProvider key={s} size={s}>
            <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {s}
                </div>
                <Pill tone="neutral">data-size="{s}"</Pill>
              </div>
              <Button intent="primary">Deploy</Button>
              <Input placeholder="Search clusters…" />
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                us-east-1 · p95 42 ms
              </div>
            </Card>
          </ConfigProvider>
        ))}
      </div>

      <h2>When to pick each</h2>
      <Table style={{ marginTop: 12 }}>
        <thead>
          <tr><th>Size</th><th>Use for</th></tr>
        </thead>
        <tbody>
          <tr><td><code>compact</code></td><td>Consoles, admin panels, dense tabular data. More signal per pixel.</td></tr>
          <tr><td><code>normal</code></td><td>Default. Dashboards, configuration UIs, data apps.</td></tr>
          <tr><td><code>comfortable</code></td><td>Marketing surfaces, mobile-first views, onboarding flows.</td></tr>
        </tbody>
      </Table>

      <h2>API</h2>
      <pre>{`// Globally
<ConfigProvider size="compact">
  <App />
</ConfigProvider>

// Scoped
<ConfigProvider size="compact">
  <DensePanel />
</ConfigProvider>`}</pre>
    </article>
  )
}
