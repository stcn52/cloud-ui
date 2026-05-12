import { Banner, Donut, Table } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function DonutPage() {
  return (
    <article className="page">
      <h1>Donut</h1>
      <p>
        A ring chart for part-to-whole breakdowns — cost by service, instances by status. Segments
        are normalised against the sum (or an explicit <code>total</code>), colours cycle through the
        design-system palette, and an optional legend lists each slice with its percentage.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Showing how a single quantity divides into 2–6 categories. For a single progress value use{' '}
        <code>Gauge</code> or <code>Progress</code>; for a time series use <code>Sparkline</code>.
      </Banner>

      <h2>Basic</h2>
      <p>
        Pass a <code>segments</code> array of <code>{'{ value, label }'}</code>. The centre shows the
        auto sum, and a legend renders beside the ring.
      </p>
      <Demo
        code={`<Donut
  segments={[
    { value: 540, label: 'Compute' },
    { value: 220, label: 'Storage' },
    { value: 130, label: 'Egress' },
    { value: 60,  label: 'Other' },
  ]}
/>`}
      >
        <Donut
          segments={[
            { value: 540, label: 'Compute' },
            { value: 220, label: 'Storage' },
            { value: 130, label: 'Egress' },
            { value: 60, label: 'Other' },
          ]}
        />
      </Demo>

      <h2>With a total</h2>
      <p>
        Pass <code>total</code> to override the denominator — the auto centre then shows a percentage
        instead of the raw sum. Useful for a "used / capacity" ring.
      </p>
      <Demo
        code={`<Donut
  total={100}
  segments={[
    { value: 62, label: 'Used' },
    { value: 38, label: 'Free', color: 'var(--color-bg-sunk)' },
  ]}
  center={<span className="text-lg font-semibold tabular-nums">62%</span>}
/>`}
      >
        <Donut
          total={100}
          segments={[
            { value: 62, label: 'Used' },
            { value: 38, label: 'Free', color: 'var(--color-bg-sunk)' },
          ]}
          center={<span className="text-lg font-semibold tabular-nums">62%</span>}
        />
      </Demo>

      <h2>Status breakdown</h2>
      <p>
        Give each segment an explicit <code>color</code> to map to status semantics, and pass a
        custom <code>center</code> node for a richer readout.
      </p>
      <Demo
        code={`<Donut
  segments={[
    { value: 18, label: 'Running',  color: 'var(--color-ok)' },
    { value: 4,  label: 'Degraded', color: 'var(--color-warn)' },
    { value: 2,  label: 'Down',     color: 'var(--color-err)' },
    { value: 6,  label: 'Stopped',  color: 'var(--color-text-dim)' },
  ]}
  center={
    <div className="leading-tight">
      <div className="text-lg font-semibold tabular-nums">30</div>
      <div className="text-[10px] text-text-dim">services</div>
    </div>
  }
/>`}
      >
        <Donut
          segments={[
            { value: 18, label: 'Running', color: 'var(--color-ok)' },
            { value: 4, label: 'Degraded', color: 'var(--color-warn)' },
            { value: 2, label: 'Down', color: 'var(--color-err)' },
            { value: 6, label: 'Stopped', color: 'var(--color-text-dim)' },
          ]}
          center={
            <div className="leading-tight">
              <div className="text-lg font-semibold tabular-nums">30</div>
              <div className="text-[10px] text-text-dim">services</div>
            </div>
          }
        />
      </Demo>

      <h2>Compact, no legend</h2>
      <p>
        Drop the legend with <code>legend={'{false}'}</code> and tune <code>size</code> /{' '}
        <code>thickness</code> for an inline mini-ring. Pass <code>center={'{false}'}</code> to hide
        the centre entirely.
      </p>
      <Demo
        code={`<Donut size={72} thickness={9} legend={false}
  segments={[{ value: 3, label: 'ok' }, { value: 1, label: 'warn', color: 'var(--color-warn)' }]}
  center={<span className="text-xs font-semibold">4</span>}
/>
<Donut size={88} thickness={11} legend={false}
  segments={[{ value: 7, label: 'ok' }, { value: 2, label: 'err', color: 'var(--color-err)' }]}
/>
<Donut size={120} legend={false} center={false}
  segments={[{ value: 1, label: 'a' }, { value: 1, label: 'b' }, { value: 1, label: 'c' }]}
/>`}
      >
        <Donut
          size={72}
          thickness={9}
          legend={false}
          segments={[
            { value: 3, label: 'ok' },
            { value: 1, label: 'warn', color: 'var(--color-warn)' },
          ]}
          center={<span className="text-xs font-semibold">4</span>}
        />
        <Donut
          size={88}
          thickness={11}
          legend={false}
          segments={[
            { value: 7, label: 'ok' },
            { value: 2, label: 'err', color: 'var(--color-err)' },
          ]}
        />
        <Donut
          size={120}
          legend={false}
          center={false}
          segments={[
            { value: 1, label: 'a' },
            { value: 1, label: 'b' },
            { value: 1, label: 'c' },
          ]}
        />
      </Demo>

      <h2>Donut API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>segments</code></td><td><code>DonutSegment[]</code></td><td>—</td><td>Slices, normalised against their sum (or <code>total</code>). Required.</td></tr>
          <tr><td><code>size</code></td><td><code>number</code></td><td><code>120</code></td><td>Ring diameter in px.</td></tr>
          <tr><td><code>thickness</code></td><td><code>number</code></td><td><code>14</code></td><td>Ring stroke width in px.</td></tr>
          <tr><td><code>total</code></td><td><code>number</code></td><td>sum of values</td><td>Override the denominator — makes the auto centre show a percentage.</td></tr>
          <tr><td><code>center</code></td><td><code>ReactNode | false</code></td><td>auto sum / %</td><td>Centre content. <code>false</code> hides it; omit for the auto label.</td></tr>
          <tr><td><code>legend</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Render the legend list beside the ring.</td></tr>
          <tr><td><code>gap</code></td><td><code>number</code></td><td><code>2</code></td><td>Gap between segments, in degrees.</td></tr>
        </tbody>
      </Table>

      <h2>DonutSegment</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>number</code></td><td>—</td><td>Raw magnitude. Negative values are clamped to 0. Required.</td></tr>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td>—</td><td>Legend label. Required.</td></tr>
          <tr><td><code>color</code></td><td><code>string</code></td><td>palette cycle</td><td>CSS colour for the arc and legend swatch.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
