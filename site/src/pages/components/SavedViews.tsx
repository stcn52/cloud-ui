import { useState } from 'react'
import { Banner, FilterBar, FilterChip, SavedViews, Table } from '@stcn52/cloud-ui'
import type { ViewItem } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const baseViews: ViewItem[] = [
  { id: 'all', label: 'All', count: 248, locked: true },
  { id: 'production', label: 'Production', count: 42, locked: true },
  { id: 'failed-24h', label: 'Failed last 24 h', count: 2 },
  { id: 'mine', label: 'Owned by me', count: 7 },
  { id: 'team', label: 'My team', count: 14 },
  { id: 'high-cost', label: 'High cost', count: 38 },
]

function BasicSavedViewsDemo() {
  const [view, setView] = useState('production')
  return <SavedViews value={view} onChange={setView} views={baseViews} onAdd={() => {}} />
}

function NoAddSavedViewsDemo() {
  const [view, setView] = useState('all')
  return (
    <SavedViews
      value={view}
      onChange={setView}
      views={[
        { id: 'all', label: 'All', count: 248 },
        { id: 'open', label: 'Open', count: 12 },
        { id: 'closed', label: 'Closed', count: 236 },
      ]}
    />
  )
}

function DirtyStateSavedViewsDemo() {
  const [view, setView] = useState('production')
  return (
    <div style={{ width: '100%', border: '1px solid var(--color-line)', borderRadius: 10, background: 'var(--color-panel)' }}>
      <SavedViews value={view} onChange={setView} views={baseViews} onAdd={() => {}} />
      <div style={{ padding: 14, fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span>Filters from <b style={{ color: 'var(--color-text)' }}>Production</b>:</span>
        <FilterBar>
          <FilterChip variant="active" filterKey="env:" value="prod" />
          <FilterChip variant="active" filterKey="status:" value="running, degraded" />
        </FilterBar>
        <span style={{ flex: 1 }} />
        <span style={{ color: 'var(--color-text-dim)', fontSize: 11.5 }}>Modified · save changes</span>
        <button className="text-xs px-2 py-0.5 rounded-xs text-text-muted cursor-pointer bg-transparent border-0 hover:text-text">Discard</button>
        <button className="text-xs px-2 py-0.5 rounded-xs cursor-pointer bg-accent text-white border-0 hover:opacity-90">Save</button>
      </div>
    </div>
  )
}

export default function SavedViewsPage() {
  return (
    <article className="page">
      <h1>SavedViews</h1>
      <p>
        A row of named view tabs — "All / Production / Failed last 24 h …". Each tab shows a
        count badge, an optional lock icon for workspace-shared (read-only) views, and the active
        tab gets a subtle accent underline. A trailing <code>+ New view</code> action is added when{' '}
        <code>onAdd</code> is set. Purely visual; controlled via <code>value</code> + <code>onChange</code>.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Above a list page that has several recurring filter presets. For the editable filter set
        itself use <code>FilterChip</code> / <code>FilterBar</code>; for plain in-panel section
        switching use <code>MiniTabs</code> or <code>Tabs</code>.
      </Banner>

      <h2>Basic</h2>
      <p>
        Pass <code>views</code> as <code>{'{ id, label, count?, locked? }'}</code> objects. Locked
        views render a small padlock to signal they're shared and read-only.
      </p>
      <Demo
        code={`const [view, setView] = useState('production')

const views = [
  { id: 'all',        label: 'All',              count: 248, locked: true },
  { id: 'production', label: 'Production',       count: 42,  locked: true },
  { id: 'failed-24h', label: 'Failed last 24 h', count: 2 },
  { id: 'mine',       label: 'Owned by me',      count: 7 },
  { id: 'team',       label: 'My team',          count: 14 },
  { id: 'high-cost',  label: 'High cost',        count: 38 },
]

<SavedViews value={view} onChange={setView} views={views} onAdd={() => {}} />`}
      >
        <div style={{ width: '100%' }}>
          <BasicSavedViewsDemo />
        </div>
      </Demo>

      <h2>Without the add action</h2>
      <p>Omit <code>onAdd</code> to drop the trailing action — the component then reads as a plain tab strip.</p>
      <Demo
        code={`<SavedViews
  value={view}
  onChange={setView}
  views={[
    { id: 'all',    label: 'All',    count: 248 },
    { id: 'open',   label: 'Open',   count: 12 },
    { id: 'closed', label: 'Closed', count: 236 },
  ]}
/>`}
      >
        <div style={{ width: '100%' }}>
          <NoAddSavedViewsDemo />
        </div>
      </Demo>

      <h2>With a dirty-state banner</h2>
      <p>
        A view is "dirty" once the active filters drift from the saved set. Pair the tabs with a
        thin banner offering Discard / Save — the component itself stays stateless.
      </p>
      <Demo
        code={`<div className="panel">
  <SavedViews value={view} onChange={setView} views={views} onAdd={() => {}} />
  <div className="dirty-banner">
    Filters from <b>Production</b>: <FilterBar>…</FilterBar>
    <span style={{ flex: 1 }} />
    Modified · save changes
    <button>Discard</button>
    <button>Save</button>
  </div>
</div>`}
      >
        <DirtyStateSavedViewsDemo />
      </Demo>

      <h2>SavedViews API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>views</code></td><td><code>ViewItem[]</code></td><td>—</td><td>The tabs to render. Required.</td></tr>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>id of the active view. Required.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(id: string) =&gt; void</code></td><td>—</td><td>Fires with the clicked view's id. Required.</td></tr>
          <tr><td><code>onAdd</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Click handler for the trailing action. Omit to hide it.</td></tr>
          <tr><td><code>addLabel</code></td><td><code>ReactNode</code></td><td><code>'+ New view'</code></td><td>Label for the trailing action.</td></tr>
          <tr><td colSpan={4}>Plus all native <code>&lt;div&gt;</code> attributes (<code>className</code>, <code>style</code>, …). Renders <code>role="tablist"</code>.</td></tr>
        </tbody>
      </Table>

      <h2>ViewItem</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Unique id, matched against the parent <code>value</code>. Required.</td></tr>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td>—</td><td>Tab label. Required.</td></tr>
          <tr><td><code>count</code></td><td><code>ReactNode</code></td><td>—</td><td>Numeric badge. Omit for none.</td></tr>
          <tr><td><code>locked</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show the padlock — workspace-shared, read-only.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
