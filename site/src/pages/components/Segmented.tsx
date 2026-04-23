import { useState } from 'react'
import { Segmented, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function SegmentedPage() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light')
  const [range, setRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [plan, setPlan] = useState<'free' | 'pro' | 'team'>('pro')

  return (
    <article className="page">
      <h1>Segmented</h1>
      <p>
        A row of mutually-exclusive options sharing a single control. Think toggle buttons with a
        fixed, short label set — cheaper visually than a <code>Select</code> and more scannable
        than radios.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        2–5 options that fit horizontally and whose labels are short. For larger sets or long
        labels, use <code>Select</code>. For a binary on/off, use <code>Switch</code>.
      </Banner>

      <h2>Basic</h2>
      <p>
        Always controlled — pass <code>value</code> and an <code>onChange</code>. <code>options</code>
        is an array of <code>{'{ value, label }'}</code>.
      </p>
      <Demo
        code={`const [theme, setTheme] = useState('light')

<Segmented
  value={theme}
  onChange={setTheme}
  options={[
    { value: 'light', label: 'Light' },
    { value: 'dark',  label: 'Dark'  },
    { value: 'auto',  label: 'Auto'  },
  ]}
/>`}
      >
        <Segmented
          value={theme}
          onChange={setTheme}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto' },
          ]}
        />
      </Demo>

      <h2>Time-range selector</h2>
      <p>A common use: switching the window of a metrics chart.</p>
      <Demo
        code={`<Segmented
  value={range}
  onChange={setRange}
  options={[
    { value: '1h',  label: '1h'  },
    { value: '24h', label: '24h' },
    { value: '7d',  label: '7d'  },
    { value: '30d', label: '30d' },
  ]}
/>`}
      >
        <Segmented
          value={range}
          onChange={setRange}
          options={[
            { value: '1h', label: '1h' },
            { value: '24h', label: '24h' },
            { value: '7d', label: '7d' },
            { value: '30d', label: '30d' },
          ]}
        />
      </Demo>

      <h2>Disabled options</h2>
      <p>
        Mark any option with <code>disabled: true</code> to grey it out. The user can still see it
        as an available choice but cannot select it.
      </p>
      <Demo
        code={`<Segmented
  value={plan}
  onChange={setPlan}
  options={[
    { value: 'free', label: 'Free' },
    { value: 'pro',  label: 'Pro'  },
    { value: 'team', label: 'Team', disabled: true },
  ]}
/>`}
      >
        <Segmented
          value={plan}
          onChange={setPlan}
          options={[
            { value: 'free', label: 'Free' },
            { value: 'pro', label: 'Pro' },
            { value: 'team', label: 'Team', disabled: true },
          ]}
        />
      </Demo>

      <h2>Segmented API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Currently selected option. Required — Segmented is controlled.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Fires when the user picks a different option.</td></tr>
          <tr><td><code>options</code></td><td><code>SegmentedOption[]</code></td><td>—</td><td>The list of choices. Order is preserved.</td></tr>
        </tbody>
      </Table>

      <h2>SegmentedOption</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Unique key and the value surfaced to <code>onChange</code>.</td></tr>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td>—</td><td>Rendered button content.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Prevents selection; the button is greyed out.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
