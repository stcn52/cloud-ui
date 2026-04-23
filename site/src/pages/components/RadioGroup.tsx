import { useState } from 'react'
import { RadioGroup, Radio, Pill, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const REGIONS = [
  { value: 'us-east-1', label: 'us-east-1' },
  { value: 'us-west-2', label: 'us-west-2' },
  { value: 'eu-west-1', label: 'eu-west-1' },
]

const PLANS = [
  { value: 'hobby', label: 'Hobby' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
]

function BasicDemo() {
  const [value, setValue] = useState('us-east-1')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <RadioGroup name="region" value={value} onChange={setValue} options={REGIONS} />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        value = <Pill tone="info">{value}</Pill>
      </div>
    </div>
  )
}

function HorizontalDemo() {
  const [value, setValue] = useState('pro')
  return (
    <RadioGroup
      name="plan"
      orientation="horizontal"
      value={value}
      onChange={setValue}
      options={PLANS}
    />
  )
}

function InvalidDemo() {
  const [value, setValue] = useState('')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <RadioGroup name="tos" invalid value={value} onChange={setValue} options={[
        { value: 'accept', label: 'I accept the terms' },
        { value: 'decline', label: 'I decline' },
      ]} />
      <span style={{ color: 'var(--color-err)', fontSize: 12 }}>
        You must choose before continuing.
      </span>
    </div>
  )
}

function DeclarativeDemo() {
  const [value, setValue] = useState('email')
  return (
    <RadioGroup name="notify" value={value} onChange={setValue}>
      <Radio value="email" label="Email digest" />
      <Radio value="push" label="Push notifications" />
      <Radio value="none" label="Don't notify me" />
    </RadioGroup>
  )
}

export default function RadioGroupPage() {
  return (
    <article className="page">
      <h1>RadioGroup</h1>
      <p>
        A set of <code>&lt;Radio&gt;</code>s sharing a <code>name</code> and bound to a single
        controlled value. Renders either from an <code>options</code> array or declarative
        <code> &lt;Radio&gt;</code> children.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Exactly one choice from a small fixed set (2-5 items). For longer lists or searchable
        sets, use <code>Select</code>. For an on/off toggle, use <code>Switch</code>. Never leave
        a RadioGroup with zero options selectable — prefer hiding the group entirely.
      </Banner>

      <h2>Basic (vertical)</h2>
      <Demo
        code={`const [value, setValue] = useState('us-east-1')

<RadioGroup
  name="region"
  value={value}
  onChange={setValue}
  options={[
    { value: 'us-east-1', label: 'us-east-1' },
    { value: 'us-west-2', label: 'us-west-2' },
    { value: 'eu-west-1', label: 'eu-west-1' },
  ]}
/>`}
      >
        <BasicDemo />
      </Demo>

      <h2>Horizontal</h2>
      <p>
        Use <code>orientation="horizontal"</code> when the options are short and the group sits
        on a form row. The container flex-wraps on narrow widths.
      </p>
      <Demo
        code={`<RadioGroup
  name="plan"
  orientation="horizontal"
  value={value}
  onChange={setValue}
  options={[
    { value: 'hobby', label: 'Hobby' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise' },
  ]}
/>`}
      >
        <HorizontalDemo />
      </Demo>

      <h2>Invalid</h2>
      <p>
        Pass <code>invalid</code> to render every radio with the error border treatment. Pair it
        with an inline error message below the group.
      </p>
      <Demo
        code={`<RadioGroup name="tos" invalid value={value} onChange={setValue} options={[
  { value: 'accept',  label: 'I accept the terms' },
  { value: 'decline', label: 'I decline' },
]} />`}
      >
        <InvalidDemo />
      </Demo>

      <h2>Disabled option</h2>
      <p>
        Disable the whole group via <code>disabled</code> on <code>RadioGroup</code>, or a single
        option via <code>disabled: true</code> on that option.
      </p>
      <Demo
        code={`<RadioGroup
  name="tier"
  defaultValue="free"
  options={[
    { value: 'free', label: 'Free' },
    { value: 'team', label: 'Team' },
    { value: 'ent',  label: 'Enterprise (contact sales)', disabled: true },
  ]}
/>`}
      >
        <RadioGroup
          name="tier"
          defaultValue="free"
          options={[
            { value: 'free', label: 'Free' },
            { value: 'team', label: 'Team' },
            { value: 'ent', label: 'Enterprise (contact sales)', disabled: true },
          ]}
        />
      </Demo>

      <h2>Declarative children</h2>
      <p>
        Skip the options array and render <code>&lt;Radio&gt;</code>s directly. RadioGroup clones
        each child, wires the shared <code>name</code>, forwards <code>checked</code>/
        <code>onChange</code>, and wraps it in a <code>RadioRow</code> when you pass
        <code> label</code>.
      </p>
      <Demo
        code={`<RadioGroup name="notify" value={value} onChange={setValue}>
  <Radio value="email" label="Email digest" />
  <Radio value="push"  label="Push notifications" />
  <Radio value="none"  label="Don't notify me" />
</RadioGroup>`}
      >
        <DeclarativeDemo />
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Shared form name applied to every radio in the group.</td></tr>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Controlled value. The option/child with a matching <code>value</code> is checked.</td></tr>
          <tr><td><code>defaultValue</code></td><td><code>string</code></td><td>—</td><td>Uncontrolled initial value.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Fires with the new value when the user picks an option.</td></tr>
          <tr><td><code>options</code></td><td><code>RadioGroupOption[]</code></td><td>—</td><td>Array form: <code>{`{ value, label?, disabled? }`}</code>. Takes precedence over <code>children</code>.</td></tr>
          <tr><td><code>orientation</code></td><td><code>'vertical' | 'horizontal'</code></td><td><code>'vertical'</code></td><td>Stacking direction. Horizontal wraps on narrow widths.</td></tr>
          <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Error border treatment on every radio.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables every radio in the group.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Alternative to <code>options</code>: declarative <code>&lt;Radio&gt;</code> children.</td></tr>
        </tbody>
      </Table>

      <Banner tone="warn" title="API quirk" style={{ margin: '16px 0' }}>
        <code>options</code> and <code>children</code> are mutually exclusive — if both are
        passed, <code>options</code> wins and <code>children</code> is ignored.
      </Banner>
    </article>
  )
}
