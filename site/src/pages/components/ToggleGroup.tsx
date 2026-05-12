import { useState } from 'react'
import { ToggleGroup, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const RANGE_OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

const PERM_OPTIONS = [
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write' },
  { value: 'admin', label: 'Admin' },
]

const UNIT_OPTIONS = [
  { value: 's', label: 's' },
  { value: 'min', label: 'min' },
  { value: 'h', label: 'h' },
]

function DefaultToggleDemo() {
  const [v, setV] = useState('day')
  return <ToggleGroup value={v} onChange={setV} options={RANGE_OPTIONS} />
}

function AccentToggleDemo() {
  const [v, setV] = useState('write')
  return <ToggleGroup intent="accent" value={v} onChange={setV} options={PERM_OPTIONS} />
}

function UnitToggleDemo() {
  const [v, setV] = useState('s')
  return <ToggleGroup size="sm" value={v} onChange={setV} options={UNIT_OPTIONS} />
}

function DisabledOptionToggleDemo() {
  const [v, setV] = useState('read')
  return (
    <ToggleGroup
      value={v}
      onChange={setV}
      options={[
        { value: 'read', label: 'Read' },
        { value: 'write', label: 'Write' },
        { value: 'admin', label: 'Admin', disabled: true },
      ]}
    />
  )
}

export default function ToggleGroupPage() {
  return (
    <article className="page">
      <h1>ToggleGroup</h1>
      <p>
        A dense, low-chrome single-select — a tighter sibling of <code>Segmented</code>. Designed for
        toolbars, inline unit pickers (<code>s / min / h</code>), and chart range switchers where the
        control should sit quietly next to other content.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        2–5 mutually exclusive options inside a toolbar or alongside an input. For a more prominent
        page-level toggle use <code>Segmented</code>; for many options or long labels use{' '}
        <code>Select</code> or <code>Radio</code>.
      </Banner>

      <h2>Default</h2>
      <p>
        Options are an array of <code>{'{ value, label }'}</code>. Controlled via <code>value</code>{' '}
        + <code>onChange</code>; <code>value</code> is the string key of the active option.
      </p>
      <Demo
        code={`const [v, setV] = useState('day')

<ToggleGroup
  value={v}
  onChange={setV}
  options={[
    { value: 'day',   label: 'Day' },
    { value: 'week',  label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year',  label: 'Year' },
  ]}
/>`}
      >
        <DefaultToggleDemo />
      </Demo>

      <h2>Accent intent</h2>
      <p>
        <code>intent="accent"</code> tints the active item with the accent color instead of the
        neutral raised look — use it when the selection is meaningful state, not just a view filter.
      </p>
      <Demo
        code={`<ToggleGroup
  intent="accent"
  value={v}
  onChange={setV}
  options={[
    { value: 'read',  label: 'Read' },
    { value: 'write', label: 'Write' },
    { value: 'admin', label: 'Admin' },
  ]}
/>`}
      >
        <AccentToggleDemo />
      </Demo>

      <h2>Inline unit switcher</h2>
      <p>
        With <code>size="sm"</code> it shrinks enough to sit beside a number input as a unit picker.
      </p>
      <Demo
        code={`<ToggleGroup
  size="sm"
  value={v}
  onChange={setV}
  options={[
    { value: 's',   label: 's' },
    { value: 'min', label: 'min' },
    { value: 'h',   label: 'h' },
  ]}
/>`}
      >
        <UnitToggleDemo />
      </Demo>

      <h2>Disabled option</h2>
      <p>Mark individual options with <code>disabled</code> to keep them visible but unselectable.</p>
      <Demo
        code={`<ToggleGroup
  value={v}
  onChange={setV}
  options={[
    { value: 'read',  label: 'Read' },
    { value: 'write', label: 'Write' },
    { value: 'admin', label: 'Admin', disabled: true },
  ]}
/>`}
      >
        <DisabledOptionToggleDemo />
      </Demo>

      <h2>ToggleGroup API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>options</code></td><td><code>ToggleGroupOption[]</code></td><td>—</td><td>Array of <code>{'{ value, label, disabled? }'}</code>. Required.</td></tr>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Key of the currently selected option. Required.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Fires with the clicked option's <code>value</code>.</td></tr>
          <tr><td><code>intent</code></td><td><code>'default' | 'accent'</code></td><td><code>'default'</code></td><td>How the active item is highlighted.</td></tr>
          <tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>Control density. Omit to follow <code>ConfigProvider</code> density.</td></tr>
        </tbody>
      </Table>

      <h2>ToggleGroupOption</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Unique key. Required.</td></tr>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td>—</td><td>Display content. Required.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Per-option disabled state.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
