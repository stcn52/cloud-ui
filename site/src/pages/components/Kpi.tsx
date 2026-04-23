import { Kpi, Delta, Pill, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function KpiPage() {
  return (
    <article className="page">
      <h1>Kpi</h1>
      <p>
        A single-value metric tile: uppercase label, large tabular value, optional footer for a{' '}
        <code>Delta</code> or secondary context.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Dashboards, summary strips, the top of a resource detail page. One number per tile. Reach for{' '}
        <code>Card</code> when the content is richer than label + value + foot.
      </Banner>

      <h2>Single</h2>
      <Demo
        code={`<Kpi
  label="Requests / min"
  value="12,840"
  foot={<><Delta direction="up">+8.2%</Delta> vs 1h ago</>}
/>`}
      >
        <Kpi
          label="Requests / min"
          value="12,840"
          foot={<><Delta direction="up">+8.2%</Delta> vs 1h ago</>}
          style={{ width: 220 }}
        />
      </Demo>

      <h2>Four-up</h2>
      <Demo
        code={`<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
  <Kpi label="Requests / min" value="12,840"
    foot={<><Delta direction="up">+8.2%</Delta> vs 1h ago</>} />
  <Kpi label="p95 latency" value={<>184<span style={{ fontSize: 14 }}>ms</span></>}
    foot={<><Delta direction="down">−12ms</Delta> SLA: 250ms</>} />
  <Kpi label="Error rate" value={<>0.34<span style={{ fontSize: 14 }}>%</span></>}
    foot={<><Delta direction="up">+0.1%</Delta> last hour</>} />
  <Kpi label="Monthly spend" value="$2,480"
    foot={<Pill tone="info">62% of budget</Pill>} />
</div>`}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, width: '100%' }}>
          <Kpi
            label="Requests / min"
            value="12,840"
            foot={<><Delta direction="up">+8.2%</Delta> vs 1h ago</>}
          />
          <Kpi
            label="p95 latency"
            value={<>184<span style={{ fontSize: 14, color: 'var(--color-text-dim)' }}>ms</span></>}
            foot={<><Delta direction="down">−12ms</Delta> SLA: 250ms</>}
          />
          <Kpi
            label="Error rate"
            value={<>0.34<span style={{ fontSize: 14, color: 'var(--color-text-dim)' }}>%</span></>}
            foot={<><Delta direction="up">+0.1%</Delta> last hour</>}
          />
          <Kpi
            label="Monthly spend"
            value="$2,480"
            foot={<Pill tone="info">62% of budget</Pill>}
          />
        </div>
      </Demo>

      <h2>Label + value only</h2>
      <Demo
        code={`<Kpi label="Active sessions" value="1,204" />`}
      >
        <Kpi label="Active sessions" value="1,204" style={{ width: 220 }} />
      </Demo>

      <h2>Delta directions</h2>
      <Demo
        code={`<Delta direction="up">+8.2%</Delta>
<Delta direction="down">−12ms</Delta>`}
      >
        <Delta direction="up">+8.2%</Delta>
        <Delta direction="down">−12ms</Delta>
      </Demo>

      <h2>Kpi API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td>—</td><td>Uppercase caption above the value.</td></tr>
          <tr><td><code>value</code></td><td><code>ReactNode</code></td><td>—</td><td>Large tabular number / text.</td></tr>
          <tr><td><code>foot</code></td><td><code>ReactNode</code></td><td>—</td><td>Small row under the value — good for <code>Delta</code> or <code>Pill</code>.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Rendered after <code>foot</code>, for custom extensions.</td></tr>
        </tbody>
      </Table>

      <h2>Delta API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>direction</code></td><td><code>'up' | 'down'</code></td><td><code>'up'</code></td><td>Green for up, red for down. Semantics are yours — flip for "latency down = good".</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>The delta text (<code>+8.2%</code>, <code>−12ms</code>, …).</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
