import { Input, InputGroup, Affix, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function InputPage() {
  return (
    <article className="page">
      <h1>Input</h1>
      <p>
        Single-line text input with consistent border, focus ring, and optional error treatment.
        Thin wrapper over <code>&lt;input&gt;</code> — all native props pass through. Compose with{' '}
        <code>InputGroup</code> + <code>Affix</code> for prefix/suffix slots.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Any free-form single-line value: search, filter, label. Not for multi-line — use{' '}
        <code>Textarea</code>. Not for choosing from a fixed set — use <code>Select</code>,{' '}
        <code>Segmented</code>, or <code>Radio</code>.
      </Banner>

      <h2>Default</h2>
      <Demo code={`<Input placeholder="Search clusters…" />`}>
        <Input placeholder="Search clusters…" style={{ width: 280 }} />
      </Demo>

      <h2>Sizes</h2>
      <Demo
        code={`<Input size="sm" placeholder="sm" />
<Input size="md" placeholder="md" />
<Input size="lg" placeholder="lg" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
          <Input size="sm" placeholder="sm" />
          <Input size="md" placeholder="md" />
          <Input size="lg" placeholder="lg" />
        </div>
      </Demo>

      <h2>With default value</h2>
      <Demo code={`<Input defaultValue="us-east-1" />`}>
        <Input defaultValue="us-east-1" style={{ width: 280 }} />
      </Demo>

      <h2>Disabled</h2>
      <Demo code={`<Input disabled value="read-only" />`}>
        <Input disabled value="read-only" style={{ width: 280 }} readOnly />
      </Demo>

      <h2>Invalid</h2>
      <p>
        Pass <code>invalid</code> to switch the border and focus ring to the error color. Pair it
        with a helper message outside the field.
      </p>
      <Demo
        code={`<Input invalid defaultValue="not-an-email" />`}
      >
        <Input invalid defaultValue="not-an-email" style={{ width: 280 }} />
      </Demo>

      <h2>Mono / numeric</h2>
      <p>
        Flip <code>mono</code> for a monospaced value (tokens, ids) and <code>num</code> for{' '}
        tabular-nums alignment.
      </p>
      <Demo
        code={`<Input mono defaultValue="ak_live_9f2c11b67d51ce71" />
<Input num  defaultValue="12840" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
          <Input mono defaultValue="ak_live_9f2c11b67d51ce71" />
          <Input num defaultValue="12840" />
        </div>
      </Demo>

      <h2>Prefix + suffix (InputGroup)</h2>
      <p>
        For inline affixes, wrap in <code>InputGroup</code> with one or two <code>Affix</code>{' '}
        slots. The inner input loses its own border and inherits the group's.
      </p>
      <Demo
        code={`<InputGroup>
  <Affix>https://</Affix>
  <Input placeholder="api-gateway" />
  <Affix side="right">.internal</Affix>
</InputGroup>`}
      >
        <InputGroup style={{ width: 360 }}>
          <Affix>https://</Affix>
          <Input placeholder="api-gateway" />
          <Affix side="right">.internal</Affix>
        </InputGroup>
      </Demo>

      <h2>Input API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value / defaultValue</code></td><td><code>string</code></td><td>—</td><td>Controlled or uncontrolled value.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(e: ChangeEvent) =&gt; void</code></td><td>—</td><td>Fires on every keystroke.</td></tr>
          <tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>Hint text when empty.</td></tr>
          <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Control height.</td></tr>
          <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Error border + focus ring.</td></tr>
          <tr><td><code>mono</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Monospaced value.</td></tr>
          <tr><td><code>num</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Tabular numeric alignment.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Standard disabled state.</td></tr>
          <tr><td><code>...rest</code></td><td><code>InputHTMLAttributes</code></td><td>—</td><td>All native input props.</td></tr>
        </tbody>
      </Table>

      <h2>InputGroup + Affix API</h2>
      <Table>
        <thead>
          <tr><th>Component</th><th>Prop</th><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>InputGroup</code></td><td><code>children</code></td><td><code>ReactNode</code></td><td>Sequence of <code>Affix</code> + <code>Input</code> elements.</td></tr>
          <tr><td><code>Affix</code></td><td><code>side</code></td><td><code>'left' | 'right'</code></td><td>Which side the affix sits on — changes the border direction. Default <code>'left'</code>.</td></tr>
          <tr><td><code>Affix</code></td><td><code>children</code></td><td><code>ReactNode</code></td><td>Affix content (text, icon, <code>kbd</code>, …).</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
