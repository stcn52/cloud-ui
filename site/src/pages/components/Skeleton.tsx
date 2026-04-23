import { Skeleton, Card, CardHead, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function SkeletonPage() {
  return (
    <article className="page">
      <h1>Skeleton</h1>
      <p>
        A shimmering placeholder for content that's still loading. Three shape variants —{' '}
        <code>text</code>, <code>circle</code>, <code>block</code> — plus direct <code>width</code>{' '}
        and <code>height</code> conveniences. Fall back to <code>style</code> for anything more
        custom.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Above-the-fold content you can render the layout for before the data lands. Skip for
        responses under ~200ms — a flash of skeletons is worse than nothing.
      </Banner>

      <h2>Text lines</h2>
      <p>
        <code>variant="text"</code> inherits the current line-height (<code>0.8em</code> tall by
        default) and stretches to 100% width unless you override.
      </p>
      <Demo
        code={`<Skeleton variant="text" width="40%" />
<Skeleton variant="text" width="70%" />
<Skeleton variant="text" width="60%" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 320 }}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </Demo>

      <h2>Circle (avatar)</h2>
      <p>
        <code>variant="circle"</code> with equal <code>width</code> + <code>height</code> for an
        avatar placeholder.
      </p>
      <Demo
        code={`<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
  <Skeleton variant="circle" width={32} height={32} />
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
    <Skeleton variant="text" width="30%" />
    <Skeleton variant="text" width="55%" />
  </div>
</div>`}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', width: 320 }}>
          <Skeleton variant="circle" width={32} height={32} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="55%" />
          </div>
        </div>
      </Demo>

      <h2>Block (thumbnail)</h2>
      <p>
        <code>variant="block"</code> is the default — a plain shimmering rectangle sized by{' '}
        <code>width</code>/<code>height</code>. Override <code>borderRadius</code> via{' '}
        <code>style</code> for rounded thumbnails.
      </p>
      <Demo
        code={`<Skeleton variant="block" width={240} height={120} style={{ borderRadius: 8 }} />`}
      >
        <Skeleton variant="block" width={240} height={120} style={{ borderRadius: 8 }} />
      </Demo>

      <h2>Card placeholder</h2>
      <Demo
        code={`<Card style={{ width: 320 }}>
  <CardHead title={<Skeleton variant="text" width={140} />} />
  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Skeleton variant="text" width="90%" />
    <Skeleton variant="text" width="75%" />
    <Skeleton variant="text" width="55%" />
  </div>
</Card>`}
      >
        <Card style={{ width: 320 }}>
          <CardHead title={<Skeleton variant="text" width={140} />} />
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="75%" />
            <Skeleton variant="text" width="55%" />
          </div>
        </Card>
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>variant</code></td><td><code>'text' | 'circle' | 'block'</code></td><td><code>'block'</code></td><td>Shape shortcut. <code>text</code> defaults to full width + <code>0.8em</code> tall; <code>circle</code> uses a round border.</td></tr>
          <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Convenience — applied to <code>style.width</code>.</td></tr>
          <tr><td><code>height</code></td><td><code>number | string</code></td><td>—</td><td>Convenience — applied to <code>style.height</code>.</td></tr>
          <tr><td><code>style</code></td><td><code>CSSProperties</code></td><td>—</td><td>Additional inline style (e.g. <code>borderRadius</code>). Merged under <code>width</code>/<code>height</code>.</td></tr>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Merged onto the root <code>span</code>.</td></tr>
          <tr><td>…<code>HTMLAttributes</code></td><td><code>HTMLAttributes&lt;HTMLSpanElement&gt;</code></td><td>—</td><td>All standard <code>span</code> attributes.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
