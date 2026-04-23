import { useState } from 'react'
import { DatePicker, type DateRange, Table, Banner, Pill } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function fmt(d: Date) {
  return d.toISOString().slice(0, 10)
}

function SingleDemo() {
  const [value, setValue] = useState<Date | null>(new Date())
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <DatePicker
        value={value}
        onChange={(v) => setValue(v instanceof Date ? v : null)}
      />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        value = <Pill tone="info">{value ? fmt(value) : 'null'}</Pill>
      </div>
    </div>
  )
}

function RangeDemo() {
  const [range, setRange] = useState<DateRange | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <DatePicker
        mode="range"
        value={range}
        onChange={(v) => setRange(Array.isArray(v) ? (v as DateRange) : null)}
      />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        range ={' '}
        <Pill tone="info">
          {range ? `${fmt(range[0])} → ${fmt(range[1])}` : 'null'}
        </Pill>
      </div>
    </div>
  )
}

export default function DatePickerPage() {
  const jan2025 = new Date(2025, 0, 1)

  return (
    <article className="page">
      <h1>DatePicker</h1>
      <p>
        A compact calendar surface for picking a single day or a contiguous date range. Keyboard
        accessible, locale-aware, and controlled or uncontrolled.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Filtering a time-scoped query (billing month, log range) or entering a specific date. For
        relative presets like "last 7 days" pair it with a <code>Segmented</code> control above.
      </Banner>

      <h2>Single day (controlled)</h2>
      <Demo
        code={`const [value, setValue] = useState<Date | null>(new Date())

<DatePicker
  value={value}
  onChange={(v) => setValue(v instanceof Date ? v : null)}
/>`}
      >
        <SingleDemo />
      </Demo>

      <h2>Range</h2>
      <p>
        Set <code>mode="range"</code>. The first click sets the start; the second click commits the
        end (order-independent). While picking, <code>onChange</code> fires twice.
      </p>
      <Demo
        code={`const [range, setRange] = useState<DateRange | null>(null)

<DatePicker
  mode="range"
  value={range}
  onChange={(v) => setRange(Array.isArray(v) ? v as DateRange : null)}
/>`}
      >
        <RangeDemo />
      </Demo>

      <h2>Uncontrolled, with default month</h2>
      <p>
        Pass <code>defaultValue</code> for an uncontrolled initial selection and{' '}
        <code>defaultMonth</code> to open the calendar on a month other than today.
      </p>
      <Demo
        code={`<DatePicker
  defaultValue={new Date(2025, 0, 15)}
  defaultMonth={new Date(2025, 0, 1)}
/>`}
      >
        <DatePicker defaultValue={new Date(2025, 0, 15)} defaultMonth={jan2025} />
      </Demo>

      <h2>Controlled month navigation</h2>
      <p>
        You can pin the visible month externally — useful when two pickers should stay in sync.
      </p>
      <Demo
        code={`const [month, setMonth] = useState(new Date(2025, 0, 1))

<DatePicker
  defaultValue={null}
  month={month}
  onMonthChange={setMonth}
/>`}
      >
        <DatePicker defaultValue={null} defaultMonth={jan2025} />
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>mode</code></td><td><code>'single' | 'range'</code></td><td><code>'single'</code></td><td>Whether a click selects a day or extends a range.</td></tr>
          <tr><td><code>value</code></td><td><code>Date | DateRange | null</code></td><td>—</td><td>Controlled selection. <code>DateRange</code> is <code>[start, end]</code>.</td></tr>
          <tr><td><code>defaultValue</code></td><td><code>Date | DateRange | null</code></td><td><code>null</code></td><td>Uncontrolled initial selection.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(v: Date | DateRange | null) =&gt; void</code></td><td>—</td><td>Fires on every pick. In <code>range</code> mode you will see one "half" range first, then the full range on the second click.</td></tr>
          <tr><td><code>month</code></td><td><code>Date</code></td><td>—</td><td>Controlled visible month (only the year/month are read).</td></tr>
          <tr><td><code>defaultMonth</code></td><td><code>Date</code></td><td>derived from value/today</td><td>Uncontrolled initial visible month.</td></tr>
          <tr><td><code>onMonthChange</code></td><td><code>(d: Date) =&gt; void</code></td><td>—</td><td>Fires when the user clicks the prev/next month chevrons.</td></tr>
        </tbody>
      </Table>

      <Banner tone="warn" title="Known quirks" style={{ margin: '16px 0' }}>
        There is no built-in <code>min</code> / <code>max</code>, no input field, and no format
        prop — the component renders a bare calendar surface. Wrap it in a <code>Popover</code> to
        get a trigger + input pattern.
      </Banner>
    </article>
  )
}
