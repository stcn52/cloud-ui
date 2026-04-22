import { Table, Button, toast, Banner } from '@stcn52/cloud-ui'

export default function Motion() {
  return (
    <article className="page">
      <h1>Motion</h1>
      <p>
        Motion is used sparingly — only to explain state changes the user can't otherwise see.
        Durations stay under 250 ms; easing is <code>ease-out</code> for enters, <code>ease-in</code> for exits.
      </p>

      <h2>Built-in keyframes</h2>

      <Table style={{ marginTop: 12 }}>
        <thead>
          <tr><th>Name</th><th>Duration</th><th>Used by</th></tr>
        </thead>
        <tbody>
          <tr><td><code>toastInRight</code></td>  <td>220 ms</td><td>Toaster at top-right / bottom-right</td></tr>
          <tr><td><code>toastInLeft</code></td>   <td>220 ms</td><td>Toaster at top-left / bottom-left</td></tr>
          <tr><td><code>toastInTop</code></td>    <td>220 ms</td><td>Toaster at top-center</td></tr>
          <tr><td><code>toastInBottom</code></td> <td>220 ms</td><td>Toaster at bottom-center</td></tr>
          <tr><td><code>toastOut</code></td>      <td>180 ms</td><td>Every toast exit (fade + scale)</td></tr>
          <tr><td><code>toastProgress</code></td> <td>configurable</td><td>Bar at the bottom of every non-sticky toast</td></tr>
          <tr><td><code>shimmer</code></td>       <td>1.6 s</td><td>Skeleton</td></tr>
          <tr><td><code>pulse</code></td>         <td>2 s</td><td>Dot state indicator</td></tr>
          <tr><td><code>spin</code></td>          <td>0.9 s</td><td>Button loading, Progress.Ring</td></tr>
        </tbody>
      </Table>

      <h2>Try it</h2>
      <p>These toasts fire at your current position (corner of the viewport).</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button onClick={() => toast.success('Deployed api-gateway@v143', { title: 'Deploy succeeded' })}>
          Success
        </Button>
        <Button intent="danger" onClick={() => toast.error('3 errors in auth-service', { title: 'Build failed' })}>
          Error
        </Button>
        <Button intent="outline" onClick={() => toast.warn('us-east-1 p95 > 400 ms', { title: 'High latency' })}>
          Warning
        </Button>
        <Button intent="subtle" onClick={() => toast.info('v1.8.0 is available', { title: 'Update ready' })}>
          Info
        </Button>
        <Button intent="ghost" onClick={() => toast('ak_••••71 copied')}>
          Neutral
        </Button>
      </div>

      <h2>Principles</h2>
      <Banner tone="neutral" title="Explain, don't decorate" style={{ marginBottom: 10 }}>
        Animation answers "what happened?" — not "can I be cute?".
      </Banner>
      <Banner tone="neutral" title="Hover pauses time-driven animations" style={{ marginBottom: 10 }}>
        Toast progress bars freeze on hover; the dismiss timer freezes with them.
      </Banner>
      <Banner tone="neutral" title="Short and linear beats long and springy" style={{ marginBottom: 10 }}>
        Linear 180 ms is more predictable than an overshooting 400 ms spring — especially when you
        trigger several in a row.
      </Banner>
      <Banner tone="neutral" title="Enter ≠ exit is fine">
        Enters say "something arrived"; exits say "something is no longer your concern" — they don't
        have to mirror.
      </Banner>
    </article>
  )
}
