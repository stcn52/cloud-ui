import { Checkbox, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function CheckboxPage() {
  return (
    <article className="page">
      <h1>Checkbox</h1>
      <p>
        Standard HTML checkbox with a consistent border, focus ring, and indeterminate state. Thin
        wrapper over <code>&lt;input type="checkbox"&gt;</code> — all native props pass through.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Independent boolean toggles (terms, visibility, filters) or selection in a list. Not for
        mutually exclusive choices — use <code>Radio</code>. Not for instantly-applied settings —
        prefer <code>Switch</code>.
      </Banner>

      <h2>Default</h2>
      <Demo
        code={`<Checkbox />
<Checkbox defaultChecked />`}
      >
        <Checkbox />
        <Checkbox defaultChecked />
      </Demo>

      <h2>With labels</h2>
      <Demo
        code={`<label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
  <Checkbox defaultChecked /> Enable autoscale
</label>
<label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
  <Checkbox /> Retain logs 30 days
</label>`}
      >
        <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          <Checkbox defaultChecked /> Enable autoscale
        </label>
        <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          <Checkbox /> Retain logs 30 days
        </label>
      </Demo>

      <h2>Indeterminate</h2>
      <p>
        Use for "select all" headers that reflect a partial selection. Visual only — the{' '}
        <code>checked</code> value is independent. The <code>indeterminate</code> prop is now
        synced via a ref callback, so changes apply immediately without an effect pass.
      </p>
      <Demo
        code={`<Checkbox indeterminate />`}
      >
        <Checkbox indeterminate />
      </Demo>

      <h2>Disabled</h2>
      <Demo
        code={`<Checkbox disabled />
<Checkbox disabled defaultChecked />`}
      >
        <Checkbox disabled />
        <Checkbox disabled defaultChecked />
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>checked / defaultChecked</code></td><td><code>boolean</code></td><td>—</td><td>Controlled or uncontrolled checked state.</td></tr>
          <tr><td><code>indeterminate</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the dash treatment. Ref-synced onto the DOM input.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(e: ChangeEvent) =&gt; void</code></td><td>—</td><td>Fires on toggle.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Standard disabled state.</td></tr>
          <tr><td><code>...rest</code></td><td><code>InputHTMLAttributes</code></td><td>—</td><td>All native checkbox props (<code>name</code>, <code>value</code>, <code>required</code>, etc.).</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
