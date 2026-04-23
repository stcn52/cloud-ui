import { Skeleton, Card, CardHead, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function SkeletonPage() {
  return (
    <article className="page">
      <h1>Skeleton</h1>
      <p>
        A shimmering placeholder for content that's still loading. Size and shape are driven by{' '}
        <code>style</code> — use width, height, and <code>borderRadius</code> to approximate the
        real content.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Above-the-fold content you can render the layout for before the data lands. Skip for
        responses under ~200ms — a flash of skeletons is worse than nothing.
      </Banner>

      <h2>Lines</h2>
      <Demo
        code={`<Skeleton style={{ width: '40%', height: 14 }} />
<Skeleton style={{ width: '70%' }} />
<Skeleton style={{ width: '60%' }} />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 320 }}>
          <Skeleton style={{ width: '40%', height: 14 }} />
          <Skeleton style={{ width: '70%' }} />
          <Skeleton style={{ width: '60%' }} />
        </div>
      </Demo>

      <h2>Avatar + text row</h2>
      <Demo
        code={`<div style={{ display: 'flex', gap: 10 }}>
  <Skeleton style={{ width: 26, height: 26, borderRadius: '50%' }} />
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
    <Skeleton style={{ width: '30%' }} />
    <Skeleton style={{ width: '50%', height: 8 }} />
  </div>
</div>`}
      >
        <div style={{ display: 'flex', gap: 10, width: 320 }}>
          <Skeleton style={{ width: 26, height: 26, borderRadius: '50%' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
            <Skeleton style={{ width: '30%' }} />
            <Skeleton style={{ width: '50%', height: 8 }} />
          </div>
        </div>
      </Demo>

      <h2>Card placeholder</h2>
      <Demo
        code={`<Card style={{ width: 320 }}>
  <CardHead title={<Skeleton style={{ width: 140 }} />} />
  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Skeleton style={{ width: '90%' }} />
    <Skeleton style={{ width: '75%' }} />
    <Skeleton style={{ width: '55%' }} />
  </div>
</Card>`}
      >
        <Card style={{ width: 320 }}>
          <CardHead title={<Skeleton style={{ width: 140 }} />} />
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton style={{ width: '90%' }} />
            <Skeleton style={{ width: '75%' }} />
            <Skeleton style={{ width: '55%' }} />
          </div>
        </Card>
      </Demo>

      <h2>Block</h2>
      <Demo
        code={`<Skeleton style={{ width: 280, height: 96, borderRadius: 6 }} />`}
      >
        <Skeleton style={{ width: 280, height: 96, borderRadius: 6 }} />
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>style</code></td><td><code>CSSProperties</code></td><td>—</td><td>Drive shape via <code>width</code>, <code>height</code>, <code>borderRadius</code>.</td></tr>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Merged onto the root <code>span</code>.</td></tr>
          <tr><td>…<code>HTMLAttributes</code></td><td><code>HTMLAttributes&lt;HTMLSpanElement&gt;</code></td><td>—</td><td>All standard <code>span</code> attributes.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
