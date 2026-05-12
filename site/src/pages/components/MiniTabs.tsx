import { useState } from 'react'
import { Banner, MiniTabs, Pill, Table } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function BasicMiniTabsDemo() {
  const [v, setV] = useState('overview')
  return (
    <MiniTabs
      value={v}
      onChange={setV}
      options={[
        { value: 'overview', label: 'Overview' },
        { value: 'logs', label: 'Logs' },
        { value: 'metrics', label: 'Metrics' },
        { value: 'settings', label: 'Settings' },
      ]}
    />
  )
}

function CountsMiniTabsDemo() {
  const [v, setV] = useState('pending')
  return (
    <MiniTabs
      value={v}
      onChange={setV}
      options={[
        { value: 'active', label: <>Active <Pill mono>12</Pill></> },
        { value: 'pending', label: <>Pending <Pill mono tone="info">3</Pill></> },
        { value: 'failed', label: <>Failed <Pill mono tone="err">1</Pill></> },
        { value: 'all', label: <>All <Pill mono>248</Pill></> },
      ]}
    />
  )
}

function PanelMiniTabsDemo() {
  const [v, setV] = useState('config')
  return (
    <div style={{ width: 360, border: '1px solid var(--color-line)', borderRadius: 10, background: 'var(--color-panel)', padding: 14 }}>
      <MiniTabs
        value={v}
        onChange={setV}
        options={[
          { value: 'config', label: 'Config' },
          { value: 'env', label: 'Env vars' },
          { value: 'secrets', label: 'Secrets' },
        ]}
      />
      <div style={{ paddingTop: 12, fontSize: 13, color: 'var(--color-text-muted)' }}>
        {v === 'config' && 'Build command, output directory, install command.'}
        {v === 'env' && '14 variables · scoped to production & preview.'}
        {v === 'secrets' && '3 secrets · last rotated 12 days ago.'}
      </div>
    </div>
  )
}

export default function MiniTabsPage() {
  return (
    <article className="page">
      <h1>MiniTabs</h1>
      <p>
        A dense, in-panel tab strip — for switching sections inside a card, drawer, or popover where
        the heavier page-level <code>Tabs</code> would be too big. Driven by a typed{' '}
        <code>options</code> array and controlled via <code>value</code> + <code>onChange</code>.
        The <code>value</code> type is generic, so a string-literal union flows through.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Sub-navigation within a contained surface. For the main content tabs of a page use{' '}
        <code>Tabs</code>; for a 2–4 option inline toggle use <code>Segmented</code>; for the named
        filter presets above a list use <code>SavedViews</code>.
      </Banner>

      <h2>Basic</h2>
      <p>Each option is <code>{'{ value, label }'}</code>. The active tab gets a bottom accent underline.</p>
      <Demo
        code={`const [v, setV] = useState('overview')

<MiniTabs
  value={v}
  onChange={setV}
  options={[
    { value: 'overview', label: 'Overview' },
    { value: 'logs',     label: 'Logs' },
    { value: 'metrics',  label: 'Metrics' },
    { value: 'settings', label: 'Settings' },
  ]}
/>`}
      >
        <BasicMiniTabsDemo />
      </Demo>

      <h2>With counts</h2>
      <p><code>label</code> is a <code>ReactNode</code>, so drop a <code>Pill</code> in for a count badge.</p>
      <Demo
        code={`<MiniTabs
  value={v}
  onChange={setV}
  options={[
    { value: 'active',  label: <>Active <Pill mono>12</Pill></> },
    { value: 'pending', label: <>Pending <Pill mono tone="info">3</Pill></> },
    { value: 'failed',  label: <>Failed <Pill mono tone="err">1</Pill></> },
    { value: 'all',     label: <>All <Pill mono>248</Pill></> },
  ]}
/>`}
      >
        <CountsMiniTabsDemo />
      </Demo>

      <h2>Inside a panel</h2>
      <p>Its natural habitat — a card with switchable sections.</p>
      <Demo
        code={`<div className="panel">
  <MiniTabs
    value={v}
    onChange={setV}
    options={[
      { value: 'config',  label: 'Config' },
      { value: 'env',     label: 'Env vars' },
      { value: 'secrets', label: 'Secrets' },
    ]}
  />
  <div className="panel-body">{/* section for v */}</div>
</div>`}
      >
        <PanelMiniTabsDemo />
      </Demo>

      <h2>MiniTabs API</h2>
      <p>Also accepts native <code>&lt;div&gt;</code> attributes (e.g. <code>className</code>, <code>style</code>). Renders <code>role="tablist"</code>.</p>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>options</code></td><td><code>readonly MiniTabOption[]</code></td><td>—</td><td>The tabs to render. Required.</td></tr>
          <tr><td><code>value</code></td><td><code>V (string)</code></td><td>—</td><td>Value of the active tab. Required.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(value: V) =&gt; void</code></td><td>—</td><td>Fires with the clicked tab's value.</td></tr>
        </tbody>
      </Table>

      <h2>MiniTabOption</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>V (string)</code></td><td>—</td><td>Unique value, matched against the parent <code>value</code>. Required.</td></tr>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td>—</td><td>Tab content. Required.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
