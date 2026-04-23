import { Select, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function SelectPage() {
  return (
    <article className="page">
      <h1>Select</h1>
      <p>
        Styled native <code>&lt;select&gt;</code> with the library's border, focus ring, and
        disabled treatment. All native props and <code>&lt;option&gt;</code> children pass through.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Picking one value from a moderate, mostly-stable list (region, timezone, tier). Not for a
        handful of always-visible options — use <code>Radio</code> or <code>Segmented</code>. Not
        for searchable / grouped / multi-select — reach for a dedicated combobox component.
      </Banner>

      <h2>Default</h2>
      <Demo
        code={`<Select defaultValue="us-east-1">
  <option value="us-east-1">us-east-1</option>
  <option value="us-west-2">us-west-2</option>
  <option value="eu-west-1">eu-west-1</option>
</Select>`}
      >
        <Select defaultValue="us-east-1" style={{ width: 220 }}>
          <option value="us-east-1">us-east-1</option>
          <option value="us-west-2">us-west-2</option>
          <option value="eu-west-1">eu-west-1</option>
        </Select>
      </Demo>

      <h2>With placeholder</h2>
      <p>
        Add a disabled first option and set <code>defaultValue=""</code> to force an intentional
        choice.
      </p>
      <Demo
        code={`<Select defaultValue="">
  <option value="" disabled>Choose a tier…</option>
  <option value="free">Free</option>
  <option value="team">Team</option>
  <option value="enterprise">Enterprise</option>
</Select>`}
      >
        <Select defaultValue="" style={{ width: 220 }}>
          <option value="" disabled>Choose a tier…</option>
          <option value="free">Free</option>
          <option value="team">Team</option>
          <option value="enterprise">Enterprise</option>
        </Select>
      </Demo>

      <h2>Grouped options</h2>
      <Demo
        code={`<Select defaultValue="us-east-1">
  <optgroup label="Americas">
    <option value="us-east-1">us-east-1</option>
    <option value="us-west-2">us-west-2</option>
  </optgroup>
  <optgroup label="Europe">
    <option value="eu-west-1">eu-west-1</option>
    <option value="eu-central-1">eu-central-1</option>
  </optgroup>
</Select>`}
      >
        <Select defaultValue="us-east-1" style={{ width: 240 }}>
          <optgroup label="Americas">
            <option value="us-east-1">us-east-1</option>
            <option value="us-west-2">us-west-2</option>
          </optgroup>
          <optgroup label="Europe">
            <option value="eu-west-1">eu-west-1</option>
            <option value="eu-central-1">eu-central-1</option>
          </optgroup>
        </Select>
      </Demo>

      <h2>Disabled</h2>
      <Demo
        code={`<Select disabled defaultValue="us-east-1">
  <option value="us-east-1">us-east-1</option>
</Select>`}
      >
        <Select disabled defaultValue="us-east-1" style={{ width: 220 }}>
          <option value="us-east-1">us-east-1</option>
        </Select>
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value / defaultValue</code></td><td><code>string</code></td><td>—</td><td>Controlled or uncontrolled selected value.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(e: ChangeEvent) =&gt; void</code></td><td>—</td><td>Fires when the user picks a different option.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Standard disabled state.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td><code>&lt;option&gt;</code> / <code>&lt;optgroup&gt;</code> elements.</td></tr>
          <tr><td><code>...rest</code></td><td><code>SelectHTMLAttributes</code></td><td>—</td><td>All native <code>&lt;select&gt;</code> props (<code>name</code>, <code>required</code>, <code>multiple</code>, etc.).</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
