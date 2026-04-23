import { Card, CardHead, CardFoot, Pill, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function CardPage() {
  return (
    <article className="page">
      <h1>Card</h1>
      <p>
        A bordered, elevated surface for grouping related content. Compose with the optional{' '}
        <code>CardHead</code> and <code>CardFoot</code> subcomponents.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Wrapping a block of related content that needs to feel like one unit — a metric summary, a
        resource row, a panel. Not for a page-wide section — use a plain <code>&lt;section&gt;</code>.
      </Banner>

      <h2>Plain</h2>
      <Demo
        code={`<Card style={{ width: 320 }}>
  <div style={{ padding: 16, fontSize: 13 }}>
    A plain card. No head, no foot — just a bordered surface.
  </div>
</Card>`}
      >
        <Card style={{ width: 320 }}>
          <div style={{ padding: 16, fontSize: 13 }}>
            A plain card. No head, no foot — just a bordered surface.
          </div>
        </Card>
      </Demo>

      <h2>With head + foot</h2>
      <Demo
        code={`<Card style={{ width: 360 }}>
  <CardHead title="api-gateway" sub="v142 · us-east-1" />
  <div style={{ padding: 16, fontSize: 13 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>Requests/min</span>
      <span className="mono">8,420</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
      <span>p95 latency</span>
      <span className="mono">124ms</span>
    </div>
  </div>
  <CardFoot>
    <Pill tone="ok" dot>Healthy</Pill>
    <span style={{ marginLeft: 'auto' }}>Last check 4s ago</span>
  </CardFoot>
</Card>`}
      >
        <Card style={{ width: 360 }}>
          <CardHead title="api-gateway" sub="v142 · us-east-1" />
          <div style={{ padding: 16, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Requests/min</span>
              <span className="mono" style={{ fontVariantNumeric: 'tabular-nums' }}>8,420</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>p95 latency</span>
              <span className="mono" style={{ fontVariantNumeric: 'tabular-nums' }}>124ms</span>
            </div>
          </div>
          <CardFoot>
            <Pill tone="ok" dot>Healthy</Pill>
            <span style={{ marginLeft: 'auto' }}>Last check 4s ago</span>
          </CardFoot>
        </Card>
      </Demo>

      <h2>Head-only</h2>
      <Demo
        code={`<Card style={{ width: 360 }}>
  <CardHead title="Recent events" sub="24h" />
  <div style={{ padding: 16, fontSize: 13, color: 'var(--color-text-muted)' }}>
    No events in the selected window.
  </div>
</Card>`}
      >
        <Card style={{ width: 360 }}>
          <CardHead title="Recent events" sub="24h" />
          <div style={{ padding: 16, fontSize: 13, color: 'var(--color-text-muted)' }}>
            No events in the selected window.
          </div>
        </Card>
      </Demo>

      <h2>Card API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Card contents. Typically a <code>CardHead</code>, a body, and a <code>CardFoot</code>.</td></tr>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Merged onto the root <code>div</code>.</td></tr>
          <tr><td>…<code>HTMLAttributes</code></td><td><code>HTMLAttributes&lt;HTMLDivElement&gt;</code></td><td>—</td><td>All standard <code>div</code> props (<code>style</code>, <code>id</code>, <code>onClick</code>, …).</td></tr>
        </tbody>
      </Table>

      <h2>CardHead API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>title</code></td><td><code>ReactNode</code></td><td>—</td><td>Leading bold title.</td></tr>
          <tr><td><code>sub</code></td><td><code>ReactNode</code></td><td>—</td><td>Trailing monospace subtitle, right-aligned.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Rendered between <code>title</code> and <code>sub</code>.</td></tr>
        </tbody>
      </Table>

      <h2>CardFoot API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Footer contents. Flex row, small muted text.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
