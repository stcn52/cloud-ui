import { Switch, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function SwitchPage() {
  return (
    <article className="page">
      <h1>Switch</h1>
      <p>
        Toggle for an immediately-applied on/off setting. Thin wrapper over{' '}
        <code>&lt;input type="checkbox"&gt;</code> — all native props pass through; only the
        visual treatment changes.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        A single setting that takes effect the moment it flips — notifications, autoscale,
        maintenance mode. Not for form values submitted later — use <code>Checkbox</code>. Not for
        mutually exclusive modes — use <code>Segmented</code> or <code>Radio</code>.
      </Banner>

      <h2>Default</h2>
      <Demo
        code={`<Switch />
<Switch defaultChecked />`}
      >
        <Switch />
        <Switch defaultChecked />
      </Demo>

      <h2>With labels</h2>
      <Demo
        code={`<label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
  <Switch defaultChecked /> Enable autoscale
</label>
<label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
  <Switch /> Email alerts
</label>`}
      >
        <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          <Switch defaultChecked /> Enable autoscale
        </label>
        <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          <Switch /> Email alerts
        </label>
      </Demo>

      <h2>Disabled</h2>
      <Demo
        code={`<Switch disabled />
<Switch disabled defaultChecked />`}
      >
        <Switch disabled />
        <Switch disabled defaultChecked />
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>checked / defaultChecked</code></td><td><code>boolean</code></td><td>—</td><td>Controlled or uncontrolled on/off state.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(e: ChangeEvent) =&gt; void</code></td><td>—</td><td>Fires on toggle.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Standard disabled state.</td></tr>
          <tr><td><code>...rest</code></td><td><code>InputHTMLAttributes</code></td><td>—</td><td>All native checkbox props (<code>name</code>, <code>value</code>, etc.).</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
