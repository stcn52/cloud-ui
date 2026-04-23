import { Textarea, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function TextareaPage() {
  return (
    <article className="page">
      <h1>Textarea</h1>
      <p>
        Multi-line text input with the same border, focus ring, and disabled treatment as{' '}
        <code>Input</code>. Thin wrapper over <code>&lt;textarea&gt;</code> — all native props
        pass through, and users can drag-resize vertically.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Free-form multi-line text: descriptions, notes, YAML snippets, commit messages. Not for
        single-line values — use <code>Input</code>. For very large code/config editors prefer a
        dedicated editor component.
      </Banner>

      <h2>Default</h2>
      <Demo
        code={`<Textarea placeholder="Describe what changed…" />`}
      >
        <Textarea placeholder="Describe what changed…" style={{ width: 360 }} />
      </Demo>

      <h2>With default value</h2>
      <Demo
        code={`<Textarea defaultValue={\`version: 2
services:
  api:
    image: api-gateway:v143\`} rows={6} />`}
      >
        <Textarea
          defaultValue={`version: 2
services:
  api:
    image: api-gateway:v143`}
          rows={6}
          style={{ width: 360, fontFamily: 'var(--font-mono)' }}
        />
      </Demo>

      <h2>Disabled</h2>
      <Demo
        code={`<Textarea disabled value="This value is read-only." />`}
      >
        <Textarea disabled value="This value is read-only." readOnly style={{ width: 360 }} />
      </Demo>

      <h2>Rows</h2>
      <p>
        Use the native <code>rows</code> attribute for initial height. Users can drag the
        bottom-right corner to resize vertically.
      </p>
      <Demo
        code={`<Textarea rows={2} placeholder="2 rows" />
<Textarea rows={6} placeholder="6 rows" />`}
      >
        <Textarea rows={2} placeholder="2 rows" style={{ width: 320 }} />
        <Textarea rows={6} placeholder="6 rows" style={{ width: 320 }} />
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value / defaultValue</code></td><td><code>string</code></td><td>—</td><td>Controlled or uncontrolled value.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(e: ChangeEvent) =&gt; void</code></td><td>—</td><td>Fires on every keystroke.</td></tr>
          <tr><td><code>rows</code></td><td><code>number</code></td><td>—</td><td>Initial visible row count. Min height is still enforced by the component.</td></tr>
          <tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>Hint text when empty.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Standard disabled state.</td></tr>
          <tr><td><code>...rest</code></td><td><code>TextareaHTMLAttributes</code></td><td>—</td><td>All native <code>&lt;textarea&gt;</code> props (<code>name</code>, <code>maxLength</code>, <code>readOnly</code>, etc.).</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
