import { Spinner, DotsLoader, BarLoader, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function SpinnerPage() {
  return (
    <article className="page">
      <h1>Spinner</h1>
      <p>
        Indeterminate loading indicators. <code>Spinner</code> is a spinning ring for inline "working
        on it" states; <code>DotsLoader</code> is three pulsing dots for "thinking…" / "typing…";{' '}
        <code>BarLoader</code> is a slim indeterminate bar for the top of a panel.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Showing that something is in progress when you can't estimate how long it'll take. If you
        know the percentage, use a determinate <code>Progress</code> bar. For full-section loading,
        prefer <code>Skeleton</code> placeholders over a lone spinner.
      </Banner>

      <h2>Ring</h2>
      <p>
        Three sizes, plus a <code>muted</code> variant that drops the accent color — handy inline
        next to muted text.
      </p>
      <Demo
        code={`<Spinner size="sm" />
<Spinner />
<Spinner size="lg" />
<Spinner muted />

<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
  <Spinner size="sm" /> Connecting to db-primary…
</span>`}
      >
        <Spinner size="sm" />
        <Spinner />
        <Spinner size="lg" />
        <Spinner muted />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
          <Spinner size="sm" />
          Connecting to <span className="mono">db-primary</span>…
        </span>
      </Demo>

      <h2>DotsLoader</h2>
      <p>Three staggered pulsing dots. No size variants — it's meant to sit inline in a sentence.</p>
      <Demo
        code={`<DotsLoader />

<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
  Marco is typing <DotsLoader />
</span>`}
      >
        <DotsLoader />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
          Marco is typing <DotsLoader />
        </span>
      </Demo>

      <h2>BarLoader</h2>
      <p>A full-width, 2px indeterminate bar. Park it at the top of a card or panel that's loading.</p>
      <Demo
        code={`<BarLoader />

<span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
  <Spinner size="sm" /> Indexing 14 218 logs…
</span>`}
      >
        <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BarLoader />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--color-text-muted)' }}>
            <Spinner size="sm" />
            Indexing 14 218 logs…
          </span>
        </div>
      </Demo>

      <h2>Spinner API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Diameter of the ring. Omit to follow <code>ConfigProvider</code> density.</td></tr>
          <tr><td><code>muted</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Uses neutral colors instead of the accent — for low-emphasis inline use.</td></tr>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Extra classes; merged onto the <code>&lt;span&gt;</code>.</td></tr>
        </tbody>
      </Table>

      <h2>DotsLoader API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Extra classes. Otherwise accepts the standard <code>&lt;span&gt;</code> attributes.</td></tr>
        </tbody>
      </Table>

      <h2>BarLoader API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Extra classes. Otherwise accepts the standard <code>&lt;div&gt;</code> attributes; rendered as <code>role="progressbar"</code>.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
