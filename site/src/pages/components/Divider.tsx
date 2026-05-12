import { Divider, DividerLabel, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function DividerPage() {
  return (
    <article className="page">
      <h1>Divider</h1>
      <p>
        A hairline rule for separating content. <code>Divider</code> renders horizontally (an{' '}
        <code>&lt;hr&gt;</code>) or vertically; <code>DividerLabel</code> is the "or"-style separator
        with text centered between two lines.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Visually grouping list items, menu sections, or inline metadata. Don't reach for it where
        whitespace or a <code>Card</code> boundary already does the job — too many rules add noise.
      </Banner>

      <h2>Horizontal</h2>
      <p>The default. Drop it between stacked rows; it carries its own small vertical margin.</p>
      <Demo
        code={`<div>Account</div>
<Divider />
<div>Settings</div>
<Divider />
<div>Sign out</div>`}
      >
        <div style={{ width: 320 }}>
          <div style={{ fontSize: 13, padding: '4px 0' }}>Account</div>
          <Divider />
          <div style={{ fontSize: 13, padding: '4px 0' }}>Settings</div>
          <Divider />
          <div style={{ fontSize: 13, padding: '4px 0' }}>Sign out</div>
        </div>
      </Demo>

      <h2>Vertical</h2>
      <p>
        Pass <code>orientation="vertical"</code> inside a flex row to separate inline items — it
        stretches to the row's height.
      </p>
      <Demo
        code={`<div style={{ display: 'flex', alignItems: 'center' }}>
  <span>Maya Patel</span>
  <Divider orientation="vertical" />
  <span>Operator</span>
  <Divider orientation="vertical" />
  <span>us-east-1</span>
</div>`}
      >
        <div style={{ display: 'flex', alignItems: 'center', height: 22, fontSize: 12, color: 'var(--color-text-muted)' }}>
          <span>Maya Patel</span>
          <Divider orientation="vertical" />
          <span>Operator</span>
          <Divider orientation="vertical" />
          <span className="mono">us-east-1</span>
        </div>
      </Demo>

      <h2>With label</h2>
      <p>
        <code>DividerLabel</code> centers its children between two rules — the classic "or continue
        with" separator on auth forms.
      </p>
      <Demo code={`<DividerLabel>or continue with</DividerLabel>`}>
        <div style={{ width: 320 }}>
          <DividerLabel>or continue with</DividerLabel>
        </div>
      </Demo>

      <h2>Divider API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Horizontal renders an <code>&lt;hr&gt;</code>; vertical renders a <code>&lt;span&gt;</code> that stretches to its flex parent.</td></tr>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Extra classes — handy to override the default margins.</td></tr>
        </tbody>
      </Table>

      <h2>DividerLabel API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Text shown between the two rules (rendered uppercase).</td></tr>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Extra classes; merged onto the wrapper.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
