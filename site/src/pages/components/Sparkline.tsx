import { Banner, Sparkline, Table } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const trend = [16, 14, 17, 12, 15, 10, 12, 7, 9, 4, 6]

export default function SparklinePage() {
  return (
    <article className="page">
      <h1>Sparkline</h1>
      <p>
        A tiny, axis-less chart for inline trends — request volume next to a KPI, latency in a
        table row, error rate in a card header. Renders a <code>line</code>, <code>area</code>, or{' '}
        <code>bar</code> SVG sized to fit the surrounding text, with a colour <code>tone</code>{' '}
        drawn from the design-system palette.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        A space-constrained "shape of the data" cue, not a chart users read precise values from.
        For a part-to-whole split use <code>Donut</code>; for a single bounded value use{' '}
        <code>Gauge</code> or <code>Progress</code>.
      </Banner>

      <h2>Variants</h2>
      <p>
        <code>data</code> is a plain <code>number[]</code> with at least two points. <code>tone</code>{' '}
        sets the stroke colour (the <code>area</code> fill uses a fading gradient of the same
        colour).
      </p>
      <Demo
        code={`<Sparkline data={trend} variant="line" />
<Sparkline data={trend} variant="area" />
<Sparkline data={trend} variant="bar" />
<Sparkline data={[4, 6, 8, 7, 10, 12, 11, 14, 13, 16, 18]} tone="err" variant="line" />`}
      >
        <Sparkline data={trend} variant="line" />
        <Sparkline data={trend} variant="area" />
        <Sparkline data={trend} variant="bar" />
        <Sparkline data={[4, 6, 8, 7, 10, 12, 11, 14, 13, 16, 18]} tone="err" variant="line" />
      </Demo>

      <h2>Tones</h2>
      <Demo
        code={`<Sparkline data={trend} tone="accent" />
<Sparkline data={trend} tone="ok" />
<Sparkline data={trend} tone="warn" />
<Sparkline data={trend} tone="err" />
<Sparkline data={trend} tone="muted" />`}
      >
        <Sparkline data={trend} tone="accent" />
        <Sparkline data={trend} tone="ok" />
        <Sparkline data={trend} tone="warn" />
        <Sparkline data={trend} tone="err" />
        <Sparkline data={trend} tone="muted" />
      </Demo>

      <h2>Sizing</h2>
      <p>
        <code>width</code> / <code>height</code> are plain pixel sizes; <code>strokeWidth</code>{' '}
        controls the line weight. The SVG uses <code>preserveAspectRatio="none"</code> so it
        stretches to whatever box you give it.
      </p>
      <Demo
        code={`<Sparkline data={trend} width={48}  height={16} />
<Sparkline data={trend} width={80}  height={22} />
<Sparkline data={trend} width={160} height={40} strokeWidth={2} />`}
      >
        <Sparkline data={trend} width={48} height={16} />
        <Sparkline data={trend} width={80} height={22} />
        <Sparkline data={trend} width={160} height={40} strokeWidth={2} />
      </Demo>

      <h2>Inline KPI</h2>
      <p>Drop it next to a number for a compact metric card.</p>
      <Demo
        code={`<span className="kpi-chip">
  <span>
    <span className="kpi-label">Requests · 24 h</span>
    <span className="kpi-value">14.2 K</span>
  </span>
  <Sparkline data={series} variant="area" width={80} height={28} />
  <span className="kpi-delta">+12 %</span>
</span>`}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            border: '1px solid var(--color-line)',
            borderRadius: 8,
            background: 'var(--color-bg-elev)',
          }}
        >
          <span style={{ display: 'inline-flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 10.5,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-text-dim)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Requests · 24 h
            </span>
            <span style={{ fontSize: 18, fontWeight: 600 }}>14.2 K</span>
          </span>
          <Sparkline data={trend.map((n) => 24 - n)} variant="area" width={80} height={28} />
          <span style={{ color: 'var(--color-ok)', fontSize: 12, alignSelf: 'flex-end' }}>+12 %</span>
        </span>
      </Demo>

      <h2>Sparkline API</h2>
      <p>Also accepts native <code>&lt;svg&gt;</code> attributes (e.g. <code>style</code>, <code>aria-label</code>). Returns <code>null</code> when <code>data</code> has fewer than two points.</p>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>data</code></td><td><code>number[]</code></td><td>—</td><td>The series — at least 2 points. Required.</td></tr>
          <tr><td><code>variant</code></td><td><code>'line' | 'area' | 'bar'</code></td><td><code>'line'</code></td><td>Render style.</td></tr>
          <tr><td><code>tone</code></td><td><code>'accent' | 'ok' | 'warn' | 'err' | 'muted'</code></td><td><code>'accent'</code></td><td>Colour role.</td></tr>
          <tr><td><code>width</code></td><td><code>number</code></td><td><code>80</code></td><td>SVG width in px.</td></tr>
          <tr><td><code>height</code></td><td><code>number</code></td><td><code>22</code></td><td>SVG height in px.</td></tr>
          <tr><td><code>strokeWidth</code></td><td><code>number</code></td><td><code>1.5</code></td><td>Line weight (line / area variants).</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
