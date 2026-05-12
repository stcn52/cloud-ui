import { Banner, Gauge, Table } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const healthBands = [
  { from: 0, color: 'var(--color-ok)' },
  { from: 70, color: 'var(--color-warn)' },
  { from: 90, color: 'var(--color-err)' },
]

export default function GaugePage() {
  return (
    <article className="page">
      <h1>Gauge</h1>
      <p>
        A radial arc that maps a single value onto a <code>[min, max]</code> domain. Optional
        threshold bands colour the arc and the value text by zone (healthy / warning / critical),
        and the sweep angle is configurable from a half-circle up to ¾ of a full turn.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        A single metric where the position within a range matters — CPU utilisation, disk usage,
        an SLO budget. For a part-to-whole breakdown use <code>Donut</code>; for a plain bar use{' '}
        <code>Progress</code>.
      </Banner>

      <h2>Basic with thresholds</h2>
      <p>
        Pass <code>thresholds</code> ordered by <code>from</code> ascending. The arc fills up to the
        value, banding by zone; the centre readout picks up the active band's colour.
      </p>
      <Demo
        code={`const healthBands = [
  { from: 0,  color: 'var(--color-ok)' },
  { from: 70, color: 'var(--color-warn)' },
  { from: 90, color: 'var(--color-err)' },
]

<Gauge value={64} thresholds={healthBands} caption="CPU utilisation" />`}
      >
        <Gauge value={64} thresholds={healthBands} caption="CPU utilisation" />
      </Demo>

      <h2>Across the bands</h2>
      <Demo
        code={`<Gauge value={38} thresholds={healthBands} caption="38% — healthy" />
<Gauge value={78} thresholds={healthBands} caption="78% — warning" />
<Gauge value={94} thresholds={healthBands} caption="94% — critical" />`}
      >
        <Gauge value={38} thresholds={healthBands} caption="38% — healthy" />
        <Gauge value={78} thresholds={healthBands} caption="78% — warning" />
        <Gauge value={94} thresholds={healthBands} caption="94% — critical" />
      </Demo>

      <h2>Flat arc &amp; sweep</h2>
      <p>
        Omit <code>thresholds</code> for a single accent arc. <code>sweep</code> controls the open
        angle — <code>180</code> for a half-circle, <code>270</code> for ¾, the default is{' '}
        <code>220</code>.
      </p>
      <Demo
        code={`<Gauge value={72} caption="Progress" />
<Gauge value={72} sweep={180} caption="Half-circle" />
<Gauge value={72} sweep={270} caption="¾ sweep" />`}
      >
        <Gauge value={72} caption="Progress" />
        <Gauge value={72} sweep={180} caption="Half-circle" />
        <Gauge value={72} sweep={270} caption="¾ sweep" />
      </Demo>

      <h2>Custom domain &amp; centre</h2>
      <p>
        Set <code>min</code> / <code>max</code> for non-percentage scales, and pass a <code>label</code>{' '}
        node for a custom centre. Set <code>label={'{false}'}</code> to hide it.
      </p>
      <Demo
        code={`<Gauge
  value={4.2}
  min={0}
  max={5}
  thresholds={[
    { from: 0,   color: 'var(--color-err)' },
    { from: 2.5, color: 'var(--color-warn)' },
    { from: 4,   color: 'var(--color-ok)' },
  ]}
  label={
    <div className="leading-tight">
      <div className="text-xl font-semibold tabular-nums">4.2</div>
      <div className="text-[10px] text-text-dim">/ 5.0</div>
    </div>
  }
  caption="Avg. rating"
/>`}
      >
        <Gauge
          value={4.2}
          min={0}
          max={5}
          thresholds={[
            { from: 0, color: 'var(--color-err)' },
            { from: 2.5, color: 'var(--color-warn)' },
            { from: 4, color: 'var(--color-ok)' },
          ]}
          label={
            <div className="leading-tight">
              <div className="text-xl font-semibold tabular-nums">4.2</div>
              <div className="text-[10px] text-text-dim">/ 5.0</div>
            </div>
          }
          caption="Avg. rating"
        />
      </Demo>

      <h2>Sizes</h2>
      <Demo
        code={`<Gauge value={55} size={88}  thickness={8}  thresholds={healthBands} />
<Gauge value={55} size={120}                thresholds={healthBands} />
<Gauge value={55} size={160} thickness={14} thresholds={healthBands} caption="Memory" />`}
      >
        <Gauge value={55} size={88} thickness={8} thresholds={healthBands} />
        <Gauge value={55} size={120} thresholds={healthBands} />
        <Gauge value={55} size={160} thickness={14} thresholds={healthBands} caption="Memory" />
      </Demo>

      <h2>Gauge API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>number</code></td><td>—</td><td>Reading, clamped to <code>[min, max]</code>. Required.</td></tr>
          <tr><td><code>min</code></td><td><code>number</code></td><td><code>0</code></td><td>Domain lower bound.</td></tr>
          <tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>Domain upper bound.</td></tr>
          <tr><td><code>size</code></td><td><code>number</code></td><td><code>140</code></td><td>Outer diameter in px.</td></tr>
          <tr><td><code>thickness</code></td><td><code>number</code></td><td><code>12</code></td><td>Arc stroke width in px.</td></tr>
          <tr><td><code>sweep</code></td><td><code>number</code></td><td><code>220</code></td><td>Arc sweep angle in degrees (180 = half-circle, 270 = ¾).</td></tr>
          <tr><td><code>thresholds</code></td><td><code>GaugeThreshold[]</code></td><td>—</td><td>Colour bands ordered by <code>from</code>. Omit for a flat accent arc.</td></tr>
          <tr><td><code>label</code></td><td><code>ReactNode | false</code></td><td>auto numeric</td><td>Centre content. <code>false</code> hides it; omit for the auto readout.</td></tr>
          <tr><td><code>caption</code></td><td><code>ReactNode</code></td><td>—</td><td>Small caption under the gauge.</td></tr>
        </tbody>
      </Table>

      <h2>GaugeThreshold</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>from</code></td><td><code>number</code></td><td>—</td><td>Value at which this band starts, in the <code>[min, max]</code> domain. Required.</td></tr>
          <tr><td><code>color</code></td><td><code>string</code></td><td>—</td><td>CSS colour for the band and, when active, the value text. Required.</td></tr>
          <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Optional band name.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
