import { useState } from 'react'
import { Select, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const REGIONS = [
  { value: 'us-east-1', label: 'us-east-1' },
  { value: 'us-west-2', label: 'us-west-2' },
  { value: 'eu-west-1', label: 'eu-west-1' },
  { value: 'eu-central-1', label: 'eu-central-1' },
  { value: 'ap-southeast-1', label: 'ap-southeast-1' },
]

const ALL_REGIONS = [
  { value: 'us-east-1', label: 'us-east-1' },
  { value: 'us-east-2', label: 'us-east-2' },
  { value: 'us-west-1', label: 'us-west-1' },
  { value: 'us-west-2', label: 'us-west-2' },
  { value: 'ca-central-1', label: 'ca-central-1' },
  { value: 'eu-west-1', label: 'eu-west-1' },
  { value: 'eu-west-2', label: 'eu-west-2' },
  { value: 'eu-west-3', label: 'eu-west-3' },
  { value: 'eu-central-1', label: 'eu-central-1' },
  { value: 'eu-north-1', label: 'eu-north-1' },
  { value: 'ap-south-1', label: 'ap-south-1' },
  { value: 'ap-northeast-1', label: 'ap-northeast-1' },
  { value: 'ap-northeast-2', label: 'ap-northeast-2' },
  { value: 'ap-southeast-1', label: 'ap-southeast-1' },
  { value: 'ap-southeast-2', label: 'ap-southeast-2' },
  { value: 'sa-east-1', label: 'sa-east-1' },
]

const TIERS = [
  { value: 'free', label: 'Free' },
  { value: 'team', label: 'Team' },
  { value: 'enterprise', label: 'Enterprise (contact us)', disabled: true },
]

function BasicSelectDemo() {
  const [value, setValue] = useState('us-east-1')
  return (
    <div style={{ width: 220 }}>
      <Select
        options={REGIONS}
        value={value}
        onChange={setValue}
        aria-label="Region"
      />
    </div>
  )
}

function SearchableSelectDemo() {
  const [value, setValue] = useState<string | undefined>(undefined)
  return (
    <div style={{ width: 240 }}>
      <Select
        options={ALL_REGIONS}
        value={value}
        onChange={setValue}
        searchable
        placeholder="Pick a region…"
        aria-label="Region"
      />
    </div>
  )
}

function DisabledOptionDemo() {
  const [value, setValue] = useState('free')
  return (
    <div style={{ width: 260 }}>
      <Select
        options={TIERS}
        value={value}
        onChange={setValue}
        aria-label="Tier"
      />
    </div>
  )
}

function InvalidSelectDemo() {
  const [value, setValue] = useState<string | undefined>(undefined)
  return (
    <div style={{ width: 220 }}>
      <Select
        options={REGIONS}
        value={value}
        onChange={setValue}
        invalid
        placeholder="Required"
        aria-label="Region"
      />
    </div>
  )
}

export default function SelectPage() {
  return (
    <article className="page">
      <h1>Select</h1>
      <p>
        Custom combobox-style picker. Renders a portaled dropdown (no native <code>&lt;select&gt;</code>),
        supports keyboard navigation, optional filter input, and grouped / disabled options via a
        typed <code>options</code> array.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Picking one value from a moderate-to-long list (region, timezone, tier). For 2–4 always-visible
        choices use <code>Radio</code> or <code>Segmented</code>. For true multi-select reach for a
        dedicated combobox component.
      </Banner>

      <h2>Basic</h2>
      <p>
        Options are an array of <code>{'{ value, label }'}</code>. Controlled via{' '}
        <code>value</code> + <code>onChange</code>, or uncontrolled via <code>defaultValue</code>.
      </p>
      <Demo
        code={`const [value, setValue] = useState('us-east-1')

<Select
  options={[
    { value: 'us-east-1', label: 'us-east-1' },
    { value: 'us-west-2', label: 'us-west-2' },
    { value: 'eu-west-1', label: 'eu-west-1' },
  ]}
  value={value}
  onChange={setValue}
  aria-label="Region"
/>`}
      >
        <BasicSelectDemo />
      </Demo>

      <h2>Searchable</h2>
      <p>
        Set <code>searchable</code> to add a filter input at the top of the dropdown. Matching is
        case-insensitive substring search against each option's label.
      </p>
      <Demo
        code={`<Select
  options={ALL_REGIONS}
  value={value}
  onChange={setValue}
  searchable
  placeholder="Pick a region…"
/>`}
      >
        <SearchableSelectDemo />
      </Demo>

      <h2>Disabled option</h2>
      <p>
        Individual options can be disabled via the option object, independent of the control-level{' '}
        <code>disabled</code>.
      </p>
      <Demo
        code={`<Select
  options={[
    { value: 'free', label: 'Free' },
    { value: 'team', label: 'Team' },
    { value: 'enterprise', label: 'Enterprise (contact us)', disabled: true },
  ]}
  value={value}
  onChange={setValue}
/>`}
      >
        <DisabledOptionDemo />
      </Demo>

      <h2>Invalid</h2>
      <p>
        Pair with a form-level error message. The red border uses the same token as{' '}
        <code>Input</code>.
      </p>
      <Demo
        code={`<Select
  options={REGIONS}
  value={value}
  onChange={setValue}
  invalid
  placeholder="Required"
/>`}
      >
        <InvalidSelectDemo />
      </Demo>

      <h2>Sizes</h2>
      <Demo
        code={`<Select size="sm" options={REGIONS} defaultValue="us-east-1" />
<Select size="md" options={REGIONS} defaultValue="us-east-1" />`}
      >
        <div style={{ width: 200 }}>
          <Select size="sm" options={REGIONS} defaultValue="us-east-1" aria-label="Region sm" />
        </div>
        <div style={{ width: 200 }}>
          <Select size="md" options={REGIONS} defaultValue="us-east-1" aria-label="Region md" />
        </div>
      </Demo>

      <h2>Disabled</h2>
      <Demo
        code={`<Select disabled options={REGIONS} defaultValue="us-east-1" />`}
      >
        <div style={{ width: 220 }}>
          <Select disabled options={REGIONS} defaultValue="us-east-1" aria-label="Region disabled" />
        </div>
      </Demo>

      <h2>Select API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>options</code></td><td><code>SelectOption[]</code></td><td>—</td><td>Array of <code>{'{ value, label, disabled?, group? }'}</code>. Required.</td></tr>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Controlled selected value.</td></tr>
          <tr><td><code>defaultValue</code></td><td><code>string</code></td><td>—</td><td>Uncontrolled initial value.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Fires with the picked option's value.</td></tr>
          <tr><td><code>placeholder</code></td><td><code>ReactNode</code></td><td><code>'Select…'</code></td><td>Shown when nothing is selected.</td></tr>
          <tr><td><code>searchable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Adds a filter input in the dropdown.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Standard disabled state.</td></tr>
          <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Error border treatment.</td></tr>
          <tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>Control height and text size.</td></tr>
        </tbody>
      </Table>

      <h2>SelectOption</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Unique identifier. Required.</td></tr>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td>—</td><td>Display content. Required.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Per-option disabled state.</td></tr>
          <tr><td><code>group</code></td><td><code>string</code></td><td>—</td><td>Optional group heading for consecutive options.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
