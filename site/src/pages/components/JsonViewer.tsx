import { JsonViewer, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const sample = {
  id: 'wks_4f2a',
  name: 'acme-staging',
  region: 'us-east-1',
  active: true,
  quota: { cpu: 32, memoryGb: 128, addons: ['logs', 'metrics', 'tracing'] },
  members: [
    { user: 'alex', role: 'owner', mfa: true },
    { user: 'bri', role: 'admin', mfa: false },
  ],
  meta: { createdAt: '2026-04-01T09:12:00Z', lastDeploy: null },
}

export default function JsonViewerPage() {
  return (
    <article className="page">
      <h1>JsonViewer</h1>
      <p>
        Read-only, collapsible JSON tree. Objects and arrays get an expand caret (with a{' '}
        <code>n keys</code> / <code>n items</code> hint when collapsed); leaves are syntax-colored
        using the design-system status palette, so dark mode just works. A "Copy" button copies the
        re-stringified JSON. Pass a value directly, or a JSON <em>string</em> — strings are parsed
        (invalid ones render as-is with a warning).
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Inspecting API responses, event payloads, config blobs, or webhook bodies in a debug panel.
        For editable JSON you need a different tool; for short snippets of code use a{' '}
        <code>&lt;pre&gt;</code> / <code>CodeChip</code>.
      </Banner>

      <h2>Basic</h2>
      <p>
        <code>defaultExpandDepth</code> controls how many levels open on mount — <code>1</code> by
        default (top level expanded, nested collapsed). Click any caret to toggle.
      </p>
      <Demo
        code={`<JsonViewer data={{
  id: 'wks_4f2a',
  name: 'acme-staging',
  active: true,
  quota: { cpu: 32, memoryGb: 128, addons: ['logs', 'metrics', 'tracing'] },
  members: [
    { user: 'alex', role: 'owner', mfa: true },
    { user: 'bri', role: 'admin', mfa: false },
  ],
  meta: { createdAt: '2026-04-01T09:12:00Z', lastDeploy: null },
}} />`}
      >
        <div style={{ width: 460 }}>
          <JsonViewer data={sample} />
        </div>
      </Demo>

      <h2>Fully expanded</h2>
      <p>
        Pass <code>defaultExpandDepth={'{Infinity}'}</code> to open everything (use{' '}
        <code>indent</code> to tighten or loosen the nesting step, in <code>ch</code>).
      </p>
      <Demo
        code={`<JsonViewer data={payload} defaultExpandDepth={Infinity} indent={2} />`}
      >
        <div style={{ width: 460 }}>
          <JsonViewer data={sample} defaultExpandDepth={Infinity} />
        </div>
      </Demo>

      <h2>From a JSON string</h2>
      <p>
        A <code>string</code> is parsed before rendering. If it isn't valid JSON, it's shown as a
        plain string with a small warning above it.
      </p>
      <Demo
        code={`<JsonViewer data='{"a":1,"b":[true,false,null],"c":{"nested":"yes"}}' />
<JsonViewer data='{ not really json' />`}
      >
        <div style={{ width: 460, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <JsonViewer data='{"a":1,"b":[true,false,null],"c":{"nested":"yes"}}' />
          <JsonViewer data='{ not really json' />
        </div>
      </Demo>

      <h2>Primitives</h2>
      <p>A bare number, string, boolean, or <code>null</code> renders as a single colored leaf.</p>
      <Demo
        code={`<JsonViewer data={42} copyable={false} />
<JsonViewer data="just a string" copyable={false} />
<JsonViewer data={null} copyable={false} />`}
      >
        <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <JsonViewer data={42} copyable={false} />
          <JsonViewer data="just a string" copyable={false} />
          <JsonViewer data={null} copyable={false} />
        </div>
      </Demo>

      <h2>JsonViewer API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>data</code></td><td><code>unknown</code></td><td>—</td><td>The value to render. A <code>string</code> is parsed; anything else is shown as-is. Required.</td></tr>
          <tr><td><code>defaultExpandDepth</code></td><td><code>number</code></td><td><code>1</code></td><td>Auto-expand nodes up to this depth. <code>Infinity</code> expands everything.</td></tr>
          <tr><td><code>copyable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show the "Copy" button (copies the re-stringified, pretty-printed JSON).</td></tr>
          <tr><td><code>indent</code></td><td><code>number</code></td><td><code>2</code></td><td>Indentation step per nesting level, in <code>ch</code>.</td></tr>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Merged onto the root <code>&lt;div&gt;</code>.</td></tr>
          <tr><td>…<code>HTMLAttributes</code></td><td><code>HTMLAttributes&lt;HTMLDivElement&gt;</code></td><td>—</td><td>Remaining div attributes (minus <code>children</code>).</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
