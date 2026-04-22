import { Toast, Button, toast, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function ToastPage() {
  return (
    <article className="page">
      <h1>Toast</h1>
      <p>
        Transient notifications stacked in a corner of the viewport. Five tones, hover-to-pause,
        optional progress bar, and an imperative <code>toast()</code> API that works from anywhere in the tree.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Action feedback ("Deployed", "Copied") — brief, auto-dismissing. Not for errors the user must
        resolve before continuing — use a <code>Dialog</code> or inline message.
      </Banner>

      <h2>Tones</h2>
      <Demo
        code={`<Toast tone="ok"   title="Deployed">api-gateway@v143 · 2 regions</Toast>
<Toast tone="err"  title="Build failed">3 errors in auth-service</Toast>
<Toast tone="warn" title="High latency">us-east-1 p95 > 400 ms</Toast>
<Toast tone="info" title="Update ready">v1.8.0 is available</Toast>
<Toast>ak_••••71 copied</Toast>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 380 }}>
          <Toast tone="ok"   title="Deployed">api-gateway@v143 · 2 regions</Toast>
          <Toast tone="err"  title="Build failed">3 errors in auth-service</Toast>
          <Toast tone="warn" title="High latency">us-east-1 p95 &gt; 400 ms</Toast>
          <Toast tone="info" title="Update ready">v1.8.0 is available</Toast>
          <Toast>ak_••••71 copied</Toast>
        </div>
      </Demo>

      <h2>Imperative API</h2>
      <p>
        Mount <code>&lt;Toaster /&gt;</code> once near your app root. Then call <code>toast.*()</code> from anywhere.
        This page itself has a <code>&lt;Toaster /&gt;</code> — click the buttons below.
      </p>

      <Demo
        code={`toast.success('Deployed api-gateway@v143', { title: 'Deploy succeeded' })
toast.error('3 errors in auth-service')
toast.warn('us-east-1 p95 > 400 ms', { title: 'High latency' })
toast.info('v1.8.0 is available', { title: 'Update ready' })
toast('ak_••••71 copied')

toast.info('Sticky', { duration: Infinity })
toast.success('Progress…', { id: 'deploy' })
toast.dismiss()`}
      >
        <Button onClick={() => toast.success('Deployed api-gateway@v143', { title: 'Deploy succeeded' })}>
          success
        </Button>
        <Button intent="danger" onClick={() => toast.error('3 errors in auth-service', { title: 'Build failed' })}>
          error
        </Button>
        <Button intent="outline" onClick={() => toast.warn('us-east-1 p95 > 400 ms for 5 min', { title: 'High latency' })}>
          warn
        </Button>
        <Button intent="subtle" onClick={() => toast.info('v1.8.0 is available', { title: 'Update ready' })}>
          info
        </Button>
        <Button intent="ghost" onClick={() => toast('ak_••••71 copied')}>
          neutral
        </Button>
        <Button intent="outline" onClick={() => toast.info('Sticky', { title: 'Sticky', duration: Infinity })}>
          sticky
        </Button>
        <Button intent="ghost" onClick={() => toast.dismiss()}>
          dismiss all
        </Button>
      </Demo>

      <h2>Toast API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>tone</code></td><td><code>'neutral' | 'ok' | 'err' | 'warn' | 'info'</code></td><td><code>'neutral'</code></td><td>Color tone + default icon.</td></tr>
          <tr><td><code>title</code></td><td><code>ReactNode</code></td><td>—</td><td>Bold first line.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Muted description below the title.</td></tr>
          <tr><td><code>icon</code></td><td><code>ReactNode | boolean</code></td><td>—</td><td>Override or hide the tone icon.</td></tr>
          <tr><td><code>actions</code></td><td><code>ReactNode</code></td><td>—</td><td>Inline action slot.</td></tr>
          <tr><td><code>onClose</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Shows the × button and calls this on click.</td></tr>
        </tbody>
      </Table>

      <h2>toast() options</h2>
      <Table>
        <thead>
          <tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>title</code></td><td><code>ReactNode</code></td><td>—</td><td>Title line.</td></tr>
          <tr><td><code>duration</code></td><td><code>number</code></td><td><code>4000</code></td><td>ms before auto-dismiss. <code>Infinity</code> = sticky.</td></tr>
          <tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Re-using an id replaces the existing toast.</td></tr>
          <tr><td><code>icon</code></td><td><code>ReactNode | boolean</code></td><td>—</td><td>Same as Toast.icon.</td></tr>
          <tr><td><code>actions</code></td><td><code>ReactNode</code></td><td>—</td><td>Same as Toast.actions.</td></tr>
          <tr><td><code>onDismiss</code></td><td><code>(id: string) =&gt; void</code></td><td>—</td><td>Called once the toast has left the stack.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
