import { Input, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function InputPage() {
  return (
    <article className="page">
      <h1>Input</h1>
      <p>Single-line text input with consistent focus ring, error state, and optional prefix/suffix slots.</p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Any free-form single-line value: search, filter, label. Not for multi-line — use <code>Textarea</code>.
        Not for choosing from a fixed set — use <code>Select</code>, <code>Segmented</code>, or <code>Radio</code>.
      </Banner>

      <h2>Default</h2>
      <Demo code={`<Input placeholder="Search clusters…" />`}>
        <Input placeholder="Search clusters…" style={{ width: 280 }} />
      </Demo>

      <h2>With default value</h2>
      <Demo code={`<Input defaultValue="us-east-1" />`}>
        <Input defaultValue="us-east-1" style={{ width: 280 }} />
      </Demo>

      <h2>Disabled</h2>
      <Demo code={`<Input disabled value="read-only" />`}>
        <Input disabled value="read-only" style={{ width: 280 }} readOnly />
      </Demo>

      <h2>Prefix + suffix</h2>
      <Demo
        code={`<Input
  prefix="https://"
  suffix=".internal"
  placeholder="api-gateway"
/>`}
      >
        <Input prefix="https://" suffix=".internal" placeholder="api-gateway" style={{ width: 320 }} />
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value / defaultValue</code></td><td><code>string</code></td><td>—</td><td>Controlled or uncontrolled value.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(e: ChangeEvent) =&gt; void</code></td><td>—</td><td>Fires on every keystroke.</td></tr>
          <tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>Hint text when empty.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Standard disabled state.</td></tr>
          <tr><td><code>prefix</code></td><td><code>ReactNode</code></td><td>—</td><td>Inside the input, before the text.</td></tr>
          <tr><td><code>suffix</code></td><td><code>ReactNode</code></td><td>—</td><td>Inside the input, after the text.</td></tr>
          <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Error border treatment.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
