import { Radio, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function RadioPage() {
  return (
    <article className="page">
      <h1>Radio</h1>
      <p>
        Standard HTML radio button with consistent border, focus ring, and accent fill. Thin
        wrapper over <code>&lt;input type="radio"&gt;</code> — all native props pass through.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Mutually exclusive choices where all options should be visible — region, tier, visibility.
        Not for lots of options (&gt;5) — use <code>Select</code>. Not for compact inline pickers —
        use <code>Segmented</code>. Group radios via a shared <code>name</code>.
      </Banner>

      <h2>Default</h2>
      <Demo
        code={`<Radio name="demo-default" />
<Radio name="demo-default" defaultChecked />`}
      >
        <Radio name="demo-default" />
        <Radio name="demo-default" defaultChecked />
      </Demo>

      <h2>Grouped with labels</h2>
      <Demo
        code={`<label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
  <Radio name="region" value="us-east-1" defaultChecked /> us-east-1
</label>
<label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
  <Radio name="region" value="us-west-2" /> us-west-2
</label>
<label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
  <Radio name="region" value="eu-west-1" /> eu-west-1
</label>`}
      >
        <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          <Radio name="region" value="us-east-1" defaultChecked /> us-east-1
        </label>
        <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          <Radio name="region" value="us-west-2" /> us-west-2
        </label>
        <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          <Radio name="region" value="eu-west-1" /> eu-west-1
        </label>
      </Demo>

      <h2>Invalid</h2>
      <p>
        Pass <code>invalid</code> to switch the ring color to the error tone — useful when the
        group is required but nothing is chosen yet.
      </p>
      <Demo
        code={`<label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
  <Radio name="tier-invalid" invalid /> free
</label>
<label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
  <Radio name="tier-invalid" invalid /> pro
</label>`}
      >
        <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          <Radio name="tier-invalid" invalid /> free
        </label>
        <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          <Radio name="tier-invalid" invalid /> pro
        </label>
      </Demo>

      <h2>Disabled</h2>
      <Demo
        code={`<Radio disabled />
<Radio disabled defaultChecked />`}
      >
        <Radio disabled />
        <Radio disabled defaultChecked />
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Group identifier. Radios with the same <code>name</code> are mutually exclusive.</td></tr>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Value submitted when this radio is checked.</td></tr>
          <tr><td><code>checked / defaultChecked</code></td><td><code>boolean</code></td><td>—</td><td>Controlled or uncontrolled checked state.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(e: ChangeEvent) =&gt; void</code></td><td>—</td><td>Fires when selected.</td></tr>
          <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Error border + focus ring.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Standard disabled state.</td></tr>
          <tr><td><code>...rest</code></td><td><code>InputHTMLAttributes</code></td><td>—</td><td>All native radio props.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
