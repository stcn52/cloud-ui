import { useState } from 'react'
import { NumberStepper, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function BasicStepperDemo() {
  const [v, setV] = useState(3)
  return <NumberStepper value={v} onChange={setV} min={0} max={100} />
}

function StepStepperDemo() {
  const [v, setV] = useState(50)
  return <NumberStepper value={v} onChange={setV} min={0} max={200} step={10} />
}

function SizesStepperDemo() {
  const [v, setV] = useState(2)
  return (
    <>
      <NumberStepper size="sm" value={v} onChange={setV} />
      <NumberStepper size="md" value={v} onChange={setV} />
      <NumberStepper size="lg" value={v} onChange={setV} />
    </>
  )
}

export default function NumberStepperPage() {
  return (
    <article className="page">
      <h1>NumberStepper</h1>
      <p>
        A compact integer input with − / + buttons and a typeable field. Clamps to{' '}
        <code>min</code> / <code>max</code> and steps by <code>step</code>. Best for small bounded
        counts — replicas, retries, quantity.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Picking a small integer where ± nudging is natural (1–2 digit counts). For larger or
        continuous values use <code>Slider</code>; for free-form numeric entry use a plain numeric{' '}
        <code>Input</code>.
      </Banner>

      <h2>Basic</h2>
      <p>
        Controlled via <code>value</code> + <code>onChange</code>. The buttons disable automatically
        at the bounds.
      </p>
      <Demo
        code={`const [v, setV] = useState(3)

<NumberStepper value={v} onChange={setV} min={0} max={100} />`}
      >
        <BasicStepperDemo />
      </Demo>

      <h2>Custom step</h2>
      <p>
        <code>step</code> is the increment applied by each button press; the typed value is still
        clamped to <code>[min, max]</code> but not re-snapped to the step grid.
      </p>
      <Demo code={`<NumberStepper value={v} onChange={setV} min={0} max={200} step={10} />`}>
        <StepStepperDemo />
      </Demo>

      <h2>At bounds</h2>
      <p>The relevant button is disabled when the value reaches <code>min</code> or <code>max</code>.</p>
      <Demo
        code={`<NumberStepper value={0} min={0} max={100} onChange={() => {}} />
<NumberStepper value={100} min={0} max={100} onChange={() => {}} />`}
      >
        <NumberStepper value={0} min={0} max={100} onChange={() => {}} />
        <NumberStepper value={100} min={0} max={100} onChange={() => {}} />
      </Demo>

      <h2>Sizes</h2>
      <Demo
        code={`<NumberStepper size="sm" value={v} onChange={setV} />
<NumberStepper size="md" value={v} onChange={setV} />
<NumberStepper size="lg" value={v} onChange={setV} />`}
      >
        <SizesStepperDemo />
      </Demo>

      <h2>Disabled</h2>
      <Demo code={`<NumberStepper value={4} onChange={() => {}} disabled />`}>
        <NumberStepper value={4} onChange={() => {}} disabled />
      </Demo>

      <h2>NumberStepper API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>number</code></td><td>—</td><td>Current value. Required.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(value: number) =&gt; void</code></td><td>—</td><td>Fires with the next (already clamped) value.</td></tr>
          <tr><td><code>min</code></td><td><code>number</code></td><td><code>0</code></td><td>Lower bound, inclusive.</td></tr>
          <tr><td><code>max</code></td><td><code>number</code></td><td><code>Infinity</code></td><td>Upper bound, inclusive.</td></tr>
          <tr><td><code>step</code></td><td><code>number</code></td><td><code>1</code></td><td>Amount each − / + press changes the value.</td></tr>
          <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Control height and text size. Omit to follow <code>ConfigProvider</code> density.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the field and both buttons.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
