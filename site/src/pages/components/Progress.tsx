import { Progress, Ring, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function ProgressPage() {
  return (
    <article className="page">
      <h1>Progress</h1>
      <p>
        Linear progress bar and a compact radial <code>Ring</code>. Three bar tones, four ring
        tones. Both accept <code>value</code> + optional <code>max</code>.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        A determinate share of something: deploy progress, disk usage, budget consumed. For
        indeterminate "busy" states use a spinner or <code>Button loading</code>. For step-by-step
        flows use <code>Pipeline</code>.
      </Banner>

      <h2>Linear</h2>
      <Demo
        code={`<Progress value={20} />
<Progress value={62} />
<Progress value={92} />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 280 }}>
          <Progress value={20} />
          <Progress value={62} />
          <Progress value={92} />
        </div>
      </Demo>

      <h2>Tones</h2>
      <Demo
        code={`<Progress value={62} tone="accent" />
<Progress value={78} tone="warn" />
<Progress value={96} tone="err" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 280 }}>
          <Progress value={62} tone="accent" />
          <Progress value={78} tone="warn" />
          <Progress value={96} tone="err" />
        </div>
      </Demo>

      <h2>Custom max</h2>
      <Demo
        code={`<Progress value={184} max={250} tone="warn" />
{/* 184 / 250 = 73.6% */}`}
      >
        <div style={{ width: 280 }}>
          <Progress value={184} max={250} tone="warn" />
        </div>
      </Demo>

      <h2>Ring</h2>
      <Demo
        code={`<Ring value={28} />
<Ring value={62} />
<Ring value={84} tone="warn" />
<Ring value={96} tone="err" />
<Ring value={100} tone="ok" />`}
      >
        <Ring value={28} />
        <Ring value={62} />
        <Ring value={84} tone="warn" />
        <Ring value={96} tone="err" />
        <Ring value={100} tone="ok" />
      </Demo>

      <h2>Ring with custom label</h2>
      <Demo
        code={`<Ring value={7} max={10}>7/10</Ring>
<Ring value={62}>OK</Ring>`}
      >
        <Ring value={7} max={10}>7/10</Ring>
        <Ring value={62}>OK</Ring>
      </Demo>

      <h2>Progress API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>number</code></td><td>—</td><td>Required. Clamped to <code>[0, max]</code>.</td></tr>
          <tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>Upper bound; the bar width is <code>value / max</code>.</td></tr>
          <tr><td><code>tone</code></td><td><code>'accent' | 'warn' | 'err'</code></td><td><code>'accent'</code></td><td>Fill color.</td></tr>
        </tbody>
      </Table>

      <h2>Ring API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>number</code></td><td>—</td><td>Required. Clamped to <code>[0, max]</code>.</td></tr>
          <tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>Upper bound for the conic fill.</td></tr>
          <tr><td><code>tone</code></td><td><code>'accent' | 'warn' | 'err' | 'ok'</code></td><td><code>'accent'</code></td><td>Fill color.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Center label. Defaults to <code>{'`${Math.round(pct)}%`'}</code>.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
