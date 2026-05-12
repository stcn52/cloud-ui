import { useState } from 'react'
import { Slider, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function SingleSliderDemo() {
  const [v, setV] = useState(50)
  return (
    <div style={{ width: 320 }}>
      <label style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>CPU limit · {v} %</label>
      <Slider value={v} onChange={(n) => setV(n as number)} ariaLabel="CPU limit" />
    </div>
  )
}

function MarksSliderDemo() {
  const [v, setV] = useState(24)
  return (
    <div style={{ width: 320 }}>
      <label style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Concurrency · {v}</label>
      <Slider
        value={v}
        onChange={(n) => setV(n as number)}
        marks={['0', '25', '50', '75', '100']}
        ariaLabel="Concurrency"
      />
    </div>
  )
}

function TicksSliderDemo() {
  const [v, setV] = useState(40)
  return (
    <div style={{ width: 320 }}>
      <Slider value={v} onChange={(n) => setV(n as number)} step={10} ticks ariaLabel="Replicas" />
    </div>
  )
}

function RangeSliderDemo() {
  const [v, setV] = useState<[number, number]>([18, 62])
  return (
    <div style={{ width: 320 }}>
      <label style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
        Latency window · {v[0] * 8} ms – {v[1] * 8} ms
      </label>
      <Slider value={v} onChange={(n) => setV(n as [number, number])} ariaLabel="Latency window" />
    </div>
  )
}

export default function SliderPage() {
  return (
    <article className="page">
      <h1>Slider</h1>
      <p>
        Drag-to-pick a number, or a numeric range, along a continuous track. Supports keyboard
        nudging (arrows / Home / End), visible tick marks, and labels under the track. Pass a number
        for a single thumb, or a <code>[lo, hi]</code> tuple for a range.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Choosing an approximate value where the exact number matters less than the relative position
        (CPU %, opacity, a price range). For a precise integer, use <code>NumberStepper</code> or a
        numeric <code>Input</code>; for 2–5 discrete choices use <code>Segmented</code>.
      </Banner>

      <h2>Single value</h2>
      <p>
        Controlled via <code>value</code> + <code>onChange</code>. The callback fires with the same
        shape you passed in — a number here.
      </p>
      <Demo
        code={`const [v, setV] = useState(50)

<Slider value={v} onChange={(n) => setV(n as number)} ariaLabel="CPU limit" />`}
      >
        <SingleSliderDemo />
      </Demo>

      <h2>Marks</h2>
      <p>
        Pass <code>marks</code> — an array of nodes rendered evenly spaced below the track. Purely
        decorative; they don't affect snapping.
      </p>
      <Demo
        code={`<Slider
  value={v}
  onChange={(n) => setV(n as number)}
  marks={['0', '25', '50', '75', '100']}
/>`}
      >
        <MarksSliderDemo />
      </Demo>

      <h2>Steps &amp; ticks</h2>
      <p>
        <code>step</code> controls snapping; <code>ticks</code> (boolean or an explicit array of
        positions) draws a notch at each stop.
      </p>
      <Demo code={`<Slider value={v} onChange={(n) => setV(n as number)} step={10} ticks />`}>
        <TicksSliderDemo />
      </Demo>

      <h2>Range</h2>
      <p>
        Pass <code>value</code> as <code>[lo, hi]</code> to get two thumbs. The lower thumb can't
        cross the upper one and vice-versa.
      </p>
      <Demo
        code={`const [v, setV] = useState<[number, number]>([18, 62])

<Slider value={v} onChange={(n) => setV(n as [number, number])} ariaLabel="Latency window" />`}
      >
        <RangeSliderDemo />
      </Demo>

      <h2>Sizes</h2>
      <Demo
        code={`<Slider size="sm" value={40} />
<Slider size="md" value={40} />
<Slider size="lg" value={40} />`}
      >
        <div style={{ width: 220 }}>
          <Slider size="sm" value={40} ariaLabel="sm" />
        </div>
        <div style={{ width: 220 }}>
          <Slider size="md" value={40} ariaLabel="md" />
        </div>
        <div style={{ width: 220 }}>
          <Slider size="lg" value={40} ariaLabel="lg" />
        </div>
      </Demo>

      <h2>Disabled</h2>
      <Demo code={`<Slider value={35} disabled />`}>
        <div style={{ width: 220 }}>
          <Slider value={35} disabled ariaLabel="disabled" />
        </div>
      </Demo>

      <h2>Slider API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>number | [number, number]</code></td><td>—</td><td>Current value. A number renders one thumb; a tuple renders a range. Required.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(value: number | [number, number]) =&gt; void</code></td><td>—</td><td>Fires with the next value, matching the shape of <code>value</code>.</td></tr>
          <tr><td><code>min</code></td><td><code>number</code></td><td><code>0</code></td><td>Lower bound, inclusive.</td></tr>
          <tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>Upper bound, inclusive.</td></tr>
          <tr><td><code>step</code></td><td><code>number</code></td><td><code>1</code></td><td>Snap increment.</td></tr>
          <tr><td><code>ticks</code></td><td><code>boolean | number[]</code></td><td><code>false</code></td><td><code>true</code> draws a notch at every step; an array places notches at the given values.</td></tr>
          <tr><td><code>marks</code></td><td><code>ReactNode[]</code></td><td>—</td><td>Labels rendered evenly below the track.</td></tr>
          <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Track / thumb scale. Omit to follow <code>ConfigProvider</code> density.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Dims the control and blocks interaction.</td></tr>
          <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>'value'</code></td><td>Accessible name for the thumb(s).</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
