import { useState } from 'react'
import { Banner, Button, Table } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function BannerPage() {
  return (
    <article className="page">
      <h1>Banner</h1>
      <p>
        Inline status message for a region of the UI. Five tones, an optional title, a dismiss
        button, and a slot for inline actions.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Calling attention to state that affects a whole section — a stale cache, a failing region,
        an upgrade ready to apply. For transient feedback (after a click), use a <code>Toast</code>.
        For blocking confirmation, use a <code>Dialog</code>.
      </Banner>

      <h2>Tones</h2>
      <Demo
        code={`<Banner tone="neutral" title="Neutral">No news.</Banner>
<Banner tone="info"    title="Info">Deploy scheduled for 18:00 UTC.</Banner>
<Banner tone="ok"      title="All good">All services healthy.</Banner>
<Banner tone="warn"    title="Heads up">us-east-1 p95 over 400 ms.</Banner>
<Banner tone="err"     title="Down">auth-service is returning 5xx.</Banner>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 480 }}>
          <Banner tone="neutral" title="Neutral">No news.</Banner>
          <Banner tone="info" title="Info">Deploy scheduled for 18:00 UTC.</Banner>
          <Banner tone="ok" title="All good">All services healthy.</Banner>
          <Banner tone="warn" title="Heads up">us-east-1 p95 over 400 ms.</Banner>
          <Banner tone="err" title="Down">auth-service is returning 5xx.</Banner>
        </div>
      </Demo>

      <h2>Title only</h2>
      <p>Skip <code>children</code> for a one-line banner.</p>
      <Demo
        code={`<Banner tone="info" title="Read-only mode — a migration is in progress." />`}
      >
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Banner tone="info" title="Read-only mode — a migration is in progress." />
        </div>
      </Demo>

      <h2>Dismissible</h2>
      <p>
        Pass an <code>onDismiss</code> handler to render the close button. The banner is controlled
        — you decide when to unmount it.
      </p>
      <DismissDemo />

      <h2>With actions</h2>
      <Demo
        code={`<Banner
  tone="warn"
  title="Update available"
  actions={<Button size="xs" intent="outline">Update</Button>}
>
  v1.8.0 brings faster builds and a smaller bundle.
</Banner>`}
      >
        <div style={{ width: '100%', maxWidth: 520 }}>
          <Banner
            tone="warn"
            title="Update available"
            actions={<Button size="xs" intent="outline">Update</Button>}
          >
            v1.8.0 brings faster builds and a smaller bundle.
          </Banner>
        </div>
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>tone</code></td><td><code>'neutral' | 'info' | 'ok' | 'warn' | 'err'</code></td><td><code>'neutral'</code></td><td>Color + border role.</td></tr>
          <tr><td><code>title</code></td><td><code>ReactNode</code></td><td>—</td><td>Bold first line. Optional.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Body text below the title.</td></tr>
          <tr><td><code>icon</code></td><td><code>ReactNode</code></td><td>—</td><td>Leading icon slot.</td></tr>
          <tr><td><code>actions</code></td><td><code>ReactNode</code></td><td>—</td><td>Trailing action slot (rendered before the dismiss button).</td></tr>
          <tr><td><code>onDismiss</code></td><td><code>() =&gt; void</code></td><td>—</td><td>When provided, shows a × button that calls this.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}

function DismissDemo() {
  const [visible, setVisible] = useState(true)
  return (
    <Demo
      code={`const [visible, setVisible] = useState(true)

{visible && (
  <Banner
    tone="info"
    title="Welcome"
    onDismiss={() => setVisible(false)}
  >
    This banner goes away when you click ×.
  </Banner>
)}`}
    >
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {visible ? (
          <Banner tone="info" title="Welcome" onDismiss={() => setVisible(false)}>
            This banner goes away when you click ×.
          </Banner>
        ) : (
          <Button size="sm" intent="outline" onClick={() => setVisible(true)}>
            Bring it back
          </Button>
        )}
      </div>
    </Demo>
  )
}
