import { useState } from 'react'
import { Tabs, Tab, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function BasicTabsDemo() {
  const [tab, setTab] = useState<'overview' | 'metrics' | 'logs'>('overview')
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <Tabs value={tab} onChange={(v) => setTab(v as 'overview' | 'metrics' | 'logs')}>
        <Tab id="overview">Overview</Tab>
        <Tab id="metrics">Metrics</Tab>
        <Tab id="logs">Logs</Tab>
      </Tabs>
      <div style={{ padding: 16, color: 'var(--color-text-muted)', fontSize: 14 }}>
        {tab === 'overview' && <p>High-level summary of this service.</p>}
        {tab === 'metrics' && <p>Charts and counters for the last 24h.</p>}
        {tab === 'logs' && <p>Streaming log output from all replicas.</p>}
      </div>
    </div>
  )
}

function ClosableTabsDemo() {
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
    <div style={{ width: '100%', maxWidth: 480 }}>
      <Tabs value={active} onChange={setActive}>
        {openTabs.map((t) => (
          <Tab key={t.id} id={t.id} closable onClose={() => close(t.id)}>
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
  )
}

function KeyboardTabsDemo() {
  const [tab, setTab] = useState('one')
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Tabs value={tab} onChange={setTab}>
        <Tab id="one">One</Tab>
        <Tab id="two">Two</Tab>
        <Tab id="three">Three</Tab>
      </Tabs>
      <div style={{ padding: 16, fontSize: 13, color: 'var(--color-text-muted)' }}>
        Focus a tab with <kbd>Tab</kbd> then activate with <kbd>Enter</kbd> or <kbd>Space</kbd>.
        Current: <code>{tab}</code>
      </div>
    </div>
  )
}

export default function TabsPage() {
  return (
    <article className="page">
      <h1>Tabs</h1>
      <p>
        Horizontal underline-style tabs that split a panel into switchable sections. The parent{' '}
        <code>Tabs</code> is <strong>forced controlled</strong> — pass <code>value</code> and{' '}
        <code>onChange</code>. Each <code>Tab</code> matches by <code>id</code>.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Swapping peer views of the same resource (Overview / Metrics / Logs). For a top-level nav
        across unrelated pages, use a proper nav. For a document-browser feel with a close button
        on each tab, prefer <code>CardTabs</code>.
      </Banner>

      <h2>Controlled basic</h2>
      <p>
        The parent owns <code>value</code>; clicking a tab fires <code>onChange</code> with that
        tab's <code>id</code>. No <code>active</code> or <code>onClick</code> on the child —
        activation is wired automatically through context.
      </p>
      <Demo
        code={`function BasicTabsDemo() {
  const [tab, setTab] = useState('overview')
  return (
    <Tabs value={tab} onChange={setTab}>
      <Tab id="overview">Overview</Tab>
      <Tab id="metrics">Metrics</Tab>
      <Tab id="logs">Logs</Tab>
    </Tabs>
  )
}`}
      >
        <BasicTabsDemo />
      </Demo>

      <h2>Closable tabs</h2>
      <p>
        Pass <code>closable</code> to show a trailing <code>×</code> button. The{' '}
        <code>onClose</code> handler fires with a <code>MouseEvent</code> — click propagation is
        stopped for you so the tab doesn't activate on close.
      </p>
      <Demo
        code={`const [tabs, setTabs] = useState([
  { id: 'a', label: 'auth.ts' },
  { id: 'b', label: 'router.ts' },
  { id: 'c', label: 'README.md' },
])
const [active, setActive] = useState('a')

<Tabs value={active} onChange={setActive}>
  {tabs.map((t) => (
    <Tab key={t.id} id={t.id} closable onClose={() => close(t.id)}>
      {t.label}
    </Tab>
  ))}
</Tabs>`}
      >
        <ClosableTabsDemo />
      </Demo>

      <h2>Keyboard activation</h2>
      <p>
        Each <code>Tab</code> is a <code>role="tab"</code> node. Only the active tab gets{' '}
        <code>tabIndex=0</code>, so tabbing in lands on the selected one; <kbd>Enter</kbd> or{' '}
        <kbd>Space</kbd> commits activation.
      </p>
      <Demo
        code={`<Tabs value={tab} onChange={setTab}>
  <Tab id="one">One</Tab>
  <Tab id="two">Two</Tab>
  <Tab id="three">Three</Tab>
</Tabs>`}
      >
        <KeyboardTabsDemo />
      </Demo>

      <h2>Tabs API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Currently active tab id. Required.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Fires with the new tab id on click or keyboard activation. Required.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>A list of <code>&lt;Tab&gt;</code> elements.</td></tr>
        </tbody>
      </Table>

      <h2>Tab API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Matched against the parent's <code>value</code>. Required.</td></tr>
          <tr><td><code>closable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a trailing <code>×</code> button.</td></tr>
          <tr><td><code>onClose</code></td><td><code>(e: MouseEvent) =&gt; void</code></td><td>—</td><td>Fires when the <code>×</code> is clicked. Event propagation is stopped.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Tab label content.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
