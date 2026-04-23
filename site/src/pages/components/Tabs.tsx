import { useState } from 'react'
import { Tabs, Tab, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function TabsPage() {
  const [tab, setTab] = useState<'overview' | 'metrics' | 'logs'>('overview')
  const [openTabs, setOpenTabs] = useState([
    { id: 'a', label: 'auth.ts' },
    { id: 'b', label: 'router.ts' },
    { id: 'c', label: 'README.md' },
  ])
  const [active, setActive] = useState('a')

  const close = (id: string) => {
    setOpenTabs((ts) => {
      const next = ts.filter((t) => t.id !== id)
      if (id === active && next.length) setActive(next[0].id)
      return next
    })
  }

  return (
    <article className="page">
      <h1>Tabs</h1>
      <p>
        Horizontal underline-style tabs that split a panel into switchable sections. The parent{' '}
        <code>Tabs</code> renders the row; each <code>Tab</code> is an uncontrolled child — the
        consumer owns the <code>active</code> flag and click handler.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Swapping peer views of the same resource (Overview / Metrics / Logs). For a top-level nav
        across unrelated pages, use a proper nav. For a document-browser feel with a close button
        on each tab, prefer <code>CardTabs</code>.
      </Banner>

      <h2>Basic with panel</h2>
      <p>
        Drive <code>active</code> from state and render the matching panel below. Because{' '}
        <code>Tab</code> has no built-in state, you wire this yourself — which also means any
        routing library can take over.
      </p>
      <Demo
        code={`const [tab, setTab] = useState('overview')

<Tabs>
  <Tab active={tab === 'overview'} onClick={() => setTab('overview')}>Overview</Tab>
  <Tab active={tab === 'metrics'}  onClick={() => setTab('metrics')}>Metrics</Tab>
  <Tab active={tab === 'logs'}     onClick={() => setTab('logs')}>Logs</Tab>
</Tabs>

<div style={{ padding: 16 }}>
  {tab === 'overview' && <p>High-level summary…</p>}
  {tab === 'metrics'  && <p>Charts and counters…</p>}
  {tab === 'logs'     && <p>Streaming log output…</p>}
</div>`}
      >
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Tabs>
            <Tab active={tab === 'overview'} onClick={() => setTab('overview')}>Overview</Tab>
            <Tab active={tab === 'metrics'} onClick={() => setTab('metrics')}>Metrics</Tab>
            <Tab active={tab === 'logs'} onClick={() => setTab('logs')}>Logs</Tab>
          </Tabs>
          <div style={{ padding: 16, color: 'var(--color-text-muted)', fontSize: 14 }}>
            {tab === 'overview' && <p>High-level summary of this service.</p>}
            {tab === 'metrics' && <p>Charts and counters for the last 24h.</p>}
            {tab === 'logs' && <p>Streaming log output from all replicas.</p>}
          </div>
        </div>
      </Demo>

      <h2>Closable tabs</h2>
      <p>
        Pass <code>closable</code> to show a trailing <code>×</code> button. The{' '}
        <code>onClose</code> handler fires with a <code>MouseEvent</code> and is independent of{' '}
        <code>onClick</code> — click propagation is stopped for you.
      </p>
      <Demo
        code={`<Tabs>
  {openTabs.map((t) => (
    <Tab
      key={t.id}
      active={active === t.id}
      closable
      onClick={() => setActive(t.id)}
      onClose={() => close(t.id)}
    >
      {t.label}
    </Tab>
  ))}
</Tabs>`}
      >
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Tabs>
            {openTabs.map((t) => (
              <Tab
                key={t.id}
                active={active === t.id}
                closable
                onClick={() => setActive(t.id)}
                onClose={() => close(t.id)}
              >
                {t.label}
              </Tab>
            ))}
          </Tabs>
          {!openTabs.length && (
            <div style={{ padding: 16, color: 'var(--color-text-dim)', fontSize: 12 }}>
              (all tabs closed — refresh the page to reset)
            </div>
          )}
        </div>
      </Demo>

      <h2>Tabs API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>A list of <code>&lt;Tab&gt;</code> elements.</td></tr>
        </tbody>
      </Table>

      <h2>Tab API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>active</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether this tab is the selected one.</td></tr>
          <tr><td><code>onClick</code></td><td><code>(e: MouseEvent) =&gt; void</code></td><td>—</td><td>Fires when the tab body is clicked or Enter/Space pressed.</td></tr>
          <tr><td><code>closable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a trailing <code>×</code> button.</td></tr>
          <tr><td><code>onClose</code></td><td><code>(e: MouseEvent) =&gt; void</code></td><td>—</td><td>Fires when the <code>×</code> is clicked. Event propagation is stopped.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Tab label content.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
