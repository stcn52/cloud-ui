import { useState } from 'react'
import { DatePickerInput, formatDate, Pill, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function DefaultDemo() {
  const [value, setValue] = useState<Date | null>(new Date(2025, 5, 12))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', width: 260 }}>
      <DatePickerInput value={value} onChange={setValue} />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        value = <Pill tone="info">{value ? formatDate(value, 'yyyy-MM-dd') : 'null'}</Pill>
      </div>
    </div>
  )
}

function ClearableDemo() {
  const [value, setValue] = useState<Date | null>(new Date(2025, 0, 15))
  return (
    <div style={{ width: 260 }}>
      <DatePickerInput clearable value={value} onChange={setValue} placeholder="Any date" />
    </div>
  )
}

function InvalidDemo() {
  const [value, setValue] = useState<Date | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 260 }}>
      <DatePickerInput invalid value={value} onChange={setValue} placeholder="Select a date" />
      <span style={{ color: 'var(--color-err)', fontSize: 12 }}>A date is required.</span>
    </div>
  )
}

function CustomFormatDemo() {
  const [value, setValue] = useState<Date | null>(new Date(2025, 6, 4))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', width: 260 }}>
      <DatePickerInput format="MM/dd/yyyy" value={value} onChange={setValue} />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        raw = <Pill tone="info">{value ? formatDate(value, 'yyyy-MM-dd') : 'null'}</Pill>
      </div>
    </div>
  )
}

export default function DatePickerInputPage() {
  return (
    <article className="page">
      <h1>DatePickerInput</h1>
      <p>
        An Input-styled trigger wired to a <code>Popover</code> and a <code>DatePicker</code>{' '}
        calendar. The trigger shows the formatted selection, opens the calendar on click or
        <kbd>Enter</kbd>/<kbd>Space</kbd>, and closes on selection. Controlled or uncontrolled.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Form fields that capture a single concrete day (due date, effective date, birthday).
        For a range, reach for a bare <code>DatePicker</code> in <code>mode="range"</code>.
        For relative presets ("last 7 days"), pair a <code>Segmented</code> with this input.
      </Banner>

      <h2>Default</h2>
      <Demo
        code={`const [value, setValue] = useState<Date | null>(new Date(2025, 5, 12))

<DatePickerInput value={value} onChange={setValue} />`}
      >
        <DefaultDemo />
      </Demo>

      <h2>Clearable</h2>
      <p>
        Pass <code>clearable</code> to swap the calendar icon for an inline × button once a date
        is selected. Clicking it fires <code>onChange(null)</code>.
      </p>
      <Demo
        code={`<DatePickerInput
  clearable
  value={value}
  onChange={setValue}
  placeholder="Any date"
/>`}
      >
        <ClearableDemo />
      </Demo>

      <h2>Invalid</h2>
      <Demo
        code={`<DatePickerInput
  invalid
  value={value}
  onChange={setValue}
  placeholder="Select a date"
/>`}
      >
        <InvalidDemo />
      </Demo>

      <h2>Custom format</h2>
      <p>
        <code>format</code> supports the tokens <code>yyyy</code>, <code>MM</code>, and{' '}
        <code>dd</code>. Any other characters are passed through verbatim. The value remains a
        native <code>Date</code> — only the display changes.
      </p>
      <Demo
        code={`<DatePickerInput
  format="MM/dd/yyyy"
  value={value}
  onChange={setValue}
/>`}
      >
        <CustomFormatDemo />
      </Demo>

      <h2>Disabled</h2>
      <p>
        When <code>disabled</code>, the trigger renders without a popover so it cannot open.
      </p>
      <Demo
        code={`<DatePickerInput
  disabled
  value={new Date(2025, 0, 1)}
  onChange={() => {}}
/>`}
      >
        <div style={{ width: 260 }}>
          <DatePickerInput disabled value={new Date(2025, 0, 1)} onChange={() => {}} />
        </div>
      </Demo>

      <h2>Sizes</h2>
      <Demo
        code={`<DatePickerInput size="sm" defaultValue={new Date(2025, 2, 3)} />
<DatePickerInput size="md" defaultValue={new Date(2025, 2, 3)} />
<DatePickerInput size="lg" defaultValue={new Date(2025, 2, 3)} />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 260 }}>
          <DatePickerInput size="sm" defaultValue={new Date(2025, 2, 3)} />
          <DatePickerInput size="md" defaultValue={new Date(2025, 2, 3)} />
          <DatePickerInput size="lg" defaultValue={new Date(2025, 2, 3)} />
        </div>
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>Date | null</code></td><td>—</td><td>Controlled selection.</td></tr>
          <tr><td><code>defaultValue</code></td><td><code>Date | null</code></td><td><code>null</code></td><td>Uncontrolled initial selection.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(date: Date | null) =&gt; void</code></td><td>—</td><td>Fires when the user picks a day or clears the input.</td></tr>
          <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'Select date'</code></td><td>Shown when no date is selected.</td></tr>
          <tr><td><code>format</code></td><td><code>string</code></td><td><code>'yyyy-MM-dd'</code></td><td>Display pattern. Tokens: <code>yyyy</code>, <code>MM</code>, <code>dd</code>.</td></tr>
          <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Trigger height — matches <code>Input</code> sizes.</td></tr>
          <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show an inline × button when a value is present.</td></tr>
          <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Error border treatment.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Renders the trigger read-only without a popover.</td></tr>
          <tr><td><code>calendarProps</code></td><td><code>Omit&lt;DatePickerProps, 'mode' | 'value' | 'defaultValue' | 'onChange'&gt;</code></td><td>—</td><td>Extra props forwarded to the underlying calendar (e.g. <code>defaultMonth</code>).</td></tr>
        </tbody>
      </Table>

      <h2>formatDate helper</h2>
      <p>
        The same tiny formatter used internally is re-exported so you can render the value
        elsewhere with the same pattern tokens.
      </p>
      <Table>
        <thead>
          <tr><th>Signature</th><th>Returns</th><th>Notes</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>formatDate(d: Date, format: string)</code></td>
            <td><code>string</code></td>
            <td>Supports <code>yyyy</code>, <code>MM</code>, <code>dd</code>. Any other runs of characters pass through verbatim.</td>
          </tr>
        </tbody>
      </Table>
    </article>
  )
}
