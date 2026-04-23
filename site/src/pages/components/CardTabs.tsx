import { useState } from 'react'
import { CardTabs, CardTab, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const FileIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

function FileBrowserDemo() {
  const [files, setFiles] = useState([
    { id: 'a', label: 'auth.ts' },
    { id: 'b', label: 'router.ts' },
    { id: 'c', label: 'README.md' },
  ])
  const [active, setActive] = useState('a')
  const close = (id: string) => {
    setFiles((fs) => {
      const next = fs.filter((f) => f.id !== id)
      if (id === active && next.length) setActive(next[0].id)
      return next
    })
  }
  return (
    <div style={{ width: '100%', maxWidth: 520, background: 'var(--color-bg-sunk)', padding: '8px 8px 0', borderRadius: 6 }}>
      <CardTabs value={active} onChange={setActive}>
        {files.map((f) => (
          <CardTab
            key={f.id}
            id={f.id}
            closable
            icon={FileIcon}
            onClose={() => close(f.id)}
          >
            {f.label}
          </CardTab>
        ))}
      </CardTabs>
      <div
        style={{
          background: 'var(--color-bg-elev)',
          border: '1px solid var(--color-line)',
          borderTopLeftRadius: 0,
          padding: 16,
          fontSize: 13,
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono, monospace)',
          minHeight: 80,
        }}
      >
        {files.find((f) => f.id === active)?.label ?? '(no file open)'}
      </div>
    </div>
  )
}

function NoIconsDemo() {
  const [tab, setTab] = useState('t2')
  return (
    <div style={{ width: '100%', maxWidth: 420, background: 'var(--color-bg-sunk)', padding: '8px 8px 0', borderRadius: 6 }}>
      <CardTabs value={tab} onChange={setTab}>
        <CardTab id="t1">Inbox</CardTab>
        <CardTab id="t2">Drafts</CardTab>
        <CardTab id="t3">Archive</CardTab>
      </CardTabs>
    </div>
  )
}

function FixedSetDemo() {
  const [tab, setTab] = useState('main')
  return (
    <div style={{ width: '100%', maxWidth: 480, background: 'var(--color-bg-sunk)', padding: '8px 8px 0', borderRadius: 6 }}>
      <CardTabs value={tab} onChange={setTab}>
        <CardTab id="main" icon={FileIcon}>main.tf</CardTab>
        <CardTab id="vars" icon={FileIcon}>variables.tf</CardTab>
        <CardTab id="out" icon={FileIcon}>outputs.tf</CardTab>
      </CardTabs>
    </div>
  )
}

export default function CardTabsPage() {
  return (
    <article className="page">
      <h1>CardTabs</h1>
      <p>
        Chrome-style tabs with rounded top corners. The active tab blends into the surface below,
        so each tab owns a full panel — a browser or file editor feel. Controlled via{' '}
        <code>value</code> + <code>onChange</code>, same as <code>Tabs</code>.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Document or file browsers where each tab represents a distinct workspace users can open
        and close. For simple sectioning inside a card, use the underline-style <code>Tabs</code>.
      </Banner>

      <h2>File browser</h2>
      <p>
        The parent holds the active id and the tab list. Closing a tab removes it from state and
        reassigns <code>active</code> if needed.
      </p>
      <Demo
        code={`const [files, setFiles] = useState([...])
const [active, setActive] = useState('a')

<CardTabs value={active} onChange={setActive}>
  {files.map((f) => (
    <CardTab
      key={f.id}
      id={f.id}
      closable
      icon={<FileIcon />}
      onClose={() => close(f.id)}
    >
      {f.label}
    </CardTab>
  ))}
</CardTabs>`}
      >
        <FileBrowserDemo />
      </Demo>

      <h2>Without icons</h2>
      <p>The <code>icon</code> slot is optional — omit it for a plainer look.</p>
      <Demo
        code={`const [tab, setTab] = useState('t2')

<CardTabs value={tab} onChange={setTab}>
  <CardTab id="t1">Inbox</CardTab>
  <CardTab id="t2">Drafts</CardTab>
  <CardTab id="t3">Archive</CardTab>
</CardTabs>`}
      >
        <NoIconsDemo />
      </Demo>

      <h2>Non-closable</h2>
      <p>
        Leave <code>closable</code> off when tabs are a fixed set the user shouldn&apos;t be able to
        dismiss.
      </p>
      <Demo
        code={`<CardTabs value={tab} onChange={setTab}>
  <CardTab id="main" icon={<FileIcon />}>main.tf</CardTab>
  <CardTab id="vars" icon={<FileIcon />}>variables.tf</CardTab>
  <CardTab id="out"  icon={<FileIcon />}>outputs.tf</CardTab>
</CardTabs>`}
      >
        <FixedSetDemo />
      </Demo>

      <h2>CardTabs API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Currently active tab id. Required.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Fires with the new tab id. Required.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>A list of <code>&lt;CardTab&gt;</code> elements, and any trailing actions.</td></tr>
        </tbody>
      </Table>

      <h2>CardTab API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Matched against the parent's <code>value</code>. Required.</td></tr>
          <tr><td><code>closable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a trailing <code>×</code> button.</td></tr>
          <tr><td><code>onClose</code></td><td><code>(e: MouseEvent) =&gt; void</code></td><td>—</td><td>Fires when the <code>×</code> is clicked. Event propagation is stopped.</td></tr>
          <tr><td><code>icon</code></td><td><code>ReactNode</code></td><td>—</td><td>Leading icon rendered before the label.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Tab label content.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
