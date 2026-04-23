import { Pill, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function PillPage() {
  return (
    <article className="page">
      <h1>Pill</h1>
      <p>
        Compact status and metadata badge. Six tones, two sizes, optional dot, optional monospace,
        optional remove button for tag-list patterns.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Short labels: status ("Running", "Failed"), versions, counts, tags. Not for primary
        actions — use <code>Button</code>. Not for long-form messaging — use <code>Banner</code>.
      </Banner>

      <h2>Tones</h2>
      <Demo
        code={`<Pill tone="neutral">Draft</Pill>
<Pill tone="ok">Running</Pill>
<Pill tone="warn">Degraded</Pill>
<Pill tone="err">Failed</Pill>
<Pill tone="info">New</Pill>
<Pill tone="solid">v1.8.0</Pill>`}
      >
        <Pill tone="neutral">Draft</Pill>
        <Pill tone="ok">Running</Pill>
        <Pill tone="warn">Degraded</Pill>
        <Pill tone="err">Failed</Pill>
        <Pill tone="info">New</Pill>
        <Pill tone="solid">v1.8.0</Pill>
      </Demo>

      <h2>With dot</h2>
      <Demo
        code={`<Pill tone="ok" dot>Healthy</Pill>
<Pill tone="warn" dot>Degraded</Pill>
<Pill tone="err" dot>Down</Pill>`}
      >
        <Pill tone="ok" dot>Healthy</Pill>
        <Pill tone="warn" dot>Degraded</Pill>
        <Pill tone="err" dot>Down</Pill>
      </Demo>

      <h2>Sizes</h2>
      <Demo
        code={`<Pill size="md">md</Pill>
<Pill size="lg">lg</Pill>`}
      >
        <Pill size="md">md</Pill>
        <Pill size="lg">lg</Pill>
      </Demo>

      <h2>Monospace</h2>
      <p>Use for IDs, hashes, versions, and other fixed-width tokens.</p>
      <Demo
        code={`<Pill mono>ak_••••71</Pill>
<Pill mono tone="info">7f3a9c2</Pill>`}
      >
        <Pill mono>ak_••••71</Pill>
        <Pill mono tone="info">7f3a9c2</Pill>
      </Demo>

      <h2>Removable</h2>
      <p>
        Adds a trailing × button. Pair with filter or tag-input patterns. The label is pulled from
        the current locale via <code>ConfigProvider</code>.
      </p>
      <Demo
        code={`<Pill onRemove={() => {}}>us-east-1</Pill>
<Pill tone="info" onRemove={() => {}}>prod</Pill>`}
      >
        <Pill onRemove={() => {}}>us-east-1</Pill>
        <Pill tone="info" onRemove={() => {}}>prod</Pill>
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>tone</code></td><td><code>'neutral' | 'ok' | 'warn' | 'err' | 'info' | 'solid'</code></td><td><code>'neutral'</code></td><td>Color tone.</td></tr>
          <tr><td><code>size</code></td><td><code>'md' | 'lg'</code></td><td><code>'md'</code></td><td>Height and text size.</td></tr>
          <tr><td><code>mono</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Use monospace font — for IDs, hashes, versions.</td></tr>
          <tr><td><code>dot</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a leading status dot in the current tone color.</td></tr>
          <tr><td><code>dotColor</code></td><td><code>string</code></td><td>—</td><td>Override the dot color (any CSS color).</td></tr>
          <tr><td><code>onRemove</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Shows a trailing × button and calls this on click.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>The pill label.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
