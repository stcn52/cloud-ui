import { useState } from 'react'
import { NotificationCenter, type NotificationItem, Button, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const seed: NotificationItem[] = [
  { id: '1', group: 'Today', tone: 'err', title: 'Deploy failed — api-gateway', body: 'Build #4821 exited with code 1 during `pnpm build`.', time: '12m', read: false },
  { id: '2', group: 'Today', tone: 'ok', title: 'Migration completed', body: 'add_user_mfa_column applied to prod-db in 4.2s.', time: '1h', read: false },
  { id: '3', group: 'Today', tone: 'info', title: 'Bri Tanaka mentioned you', body: '"@alex can you review the rollback plan?"', time: '2h', read: true },
  { id: '4', group: 'Earlier', tone: 'warn', title: 'SLA at risk — #T-2', body: 'First response due in 30m.', time: 'Yesterday', read: true },
  { id: '5', group: 'Earlier', tone: 'neutral', title: 'Weekly usage report ready', time: 'Mon', read: true },
]

function NotificationCenterDemo() {
  const [items, setItems] = useState(seed)
  return (
    <NotificationCenter
      items={items}
      onMarkAllRead={() => setItems((xs) => xs.map((x) => ({ ...x, read: true })))}
      onItemClick={(it) => setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, read: true } : x)))}
      footer={<button style={{ fontSize: 12, color: 'var(--color-accent-ink)' }}>View all activity</button>}
    />
  )
}

function NotificationActionsDemo() {
  const [items, setItems] = useState<NotificationItem[]>([
    {
      id: 'a', tone: 'ok', title: 'Workspace "old-staging" deleted', time: 'just now', read: false,
      actions: <Button size="xs" intent="ghost">Undo</Button>,
    },
    {
      id: 'b', tone: 'info', title: 'New login from a new device', body: 'Chrome · macOS · 203.0.113.7', time: '5m', read: false,
      actions: <><Button size="xs" intent="ghost">This was me</Button><Button size="xs" intent="danger">Not me</Button></>,
    },
  ])
  return (
    <NotificationCenter
      items={items}
      onMarkAllRead={() => setItems((xs) => xs.map((x) => ({ ...x, read: true })))}
    />
  )
}

export default function NotificationCenterPage() {
  return (
    <article className="page">
      <h1>NotificationCenter</h1>
      <p>
        A self-contained notifications panel — header with an unread count + "Mark all read", a
        scrollable list of items (leading tone dot or custom icon, title, optional body, relative
        time, per-item actions, unread marker), optional group headings, and an optional footer
        slot. It renders just the panel — drop it inside a <code>Popover</code> / <code>Dropdown</code>{' '}
        triggered by a bell button.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        An app-wide notification / activity inbox opened from the top bar. For a single transient
        message use <code>Toast</code>; for an inline page-level message use <code>Banner</code>.
      </Banner>

      <h2>Basic</h2>
      <p>
        Items are an array of <code>NotificationItem</code>. Consecutive items sharing a{' '}
        <code>group</code> collect under a heading. <code>onMarkAllRead</code> shows the link (only
        when there are unread items); <code>onItemClick</code> makes rows interactive; the{' '}
        <code>footer</code> slot takes e.g. a "View all" link.
      </p>
      <Demo
        code={`const [items, setItems] = useState(seed)

<NotificationCenter
  items={items}
  onMarkAllRead={() => setItems((xs) => xs.map((x) => ({ ...x, read: true })))}
  onItemClick={(it) => setItems((xs) => xs.map((x) => x.id === it.id ? { ...x, read: true } : x))}
  footer={<a className="text-xs text-accent-ink">View all activity</a>}
/>`}
      >
        <NotificationCenterDemo />
      </Demo>

      <h2>Per-item actions</h2>
      <p>
        Each item can render <code>actions</code> on the right — e.g. an "Undo" or a "This was me /
        Not me" pair. Use the <code>tone</code> field (or a custom <code>icon</code>) for the
        leading marker.
      </p>
      <Demo
        code={`<NotificationCenter items={[
  { id: 'a', tone: 'ok', title: 'Workspace "old-staging" deleted', time: 'just now', read: false,
    actions: <Button size="xs" intent="ghost">Undo</Button> },
  { id: 'b', tone: 'info', title: 'New login from a new device', body: 'Chrome · macOS · 203.0.113.7',
    time: '5m', read: false,
    actions: <><Button size="xs" intent="ghost">This was me</Button><Button size="xs" intent="danger">Not me</Button></> },
]} />`}
      >
        <NotificationActionsDemo />
      </Demo>

      <h2>Empty</h2>
      <p>
        With no items the panel falls through to <code>emptyState</code> (or a default "You're all
        caught up").
      </p>
      <Demo
        code={`<NotificationCenter items={[]} title="Inbox" />`}
      >
        <NotificationCenter items={[]} title="Inbox" />
      </Demo>

      <h2>NotificationCenter API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>items</code></td><td><code>NotificationItem[]</code></td><td>—</td><td>The notifications, in display order. Required.</td></tr>
          <tr><td><code>title</code></td><td><code>ReactNode</code></td><td><code>'Notifications'</code></td><td>Header title (the panel's <code>aria-label</code> uses it when it's a string).</td></tr>
          <tr><td><code>onMarkAllRead</code></td><td><code>() =&gt; void</code></td><td>—</td><td>When provided, a "Mark all read" link is shown (only while there are unread items).</td></tr>
          <tr><td><code>onItemClick</code></td><td><code>(item: NotificationItem) =&gt; void</code></td><td>—</td><td>When provided, rows become buttons (hover/keyboard activatable).</td></tr>
          <tr><td><code>footer</code></td><td><code>ReactNode</code></td><td>—</td><td>Footer slot — e.g. a "View all" link.</td></tr>
          <tr><td><code>emptyState</code></td><td><code>ReactNode</code></td><td>"You're all caught up."</td><td>Shown when <code>items</code> is empty.</td></tr>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Merged onto the root. Width/height are CSS vars (<code>--notif-w</code> ≈ 340px, <code>--notif-h</code> ≈ 440px).</td></tr>
          <tr><td>…<code>HTMLAttributes</code></td><td><code>HTMLAttributes&lt;HTMLDivElement&gt;</code></td><td>—</td><td>Remaining div attributes (minus <code>title</code>).</td></tr>
        </tbody>
      </Table>

      <h2>NotificationItem</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Unique identifier. Required.</td></tr>
          <tr><td><code>title</code></td><td><code>ReactNode</code></td><td>—</td><td>Headline. Required.</td></tr>
          <tr><td><code>body</code></td><td><code>ReactNode</code></td><td>—</td><td>Optional body line(s) (clamped to ~2 lines).</td></tr>
          <tr><td><code>time</code></td><td><code>ReactNode</code></td><td>—</td><td>Pre-formatted relative time, e.g. <code>"2h"</code> — the component does not format it.</td></tr>
          <tr><td><code>tone</code></td><td><code>'info' | 'ok' | 'warn' | 'err' | 'neutral'</code></td><td><code>'neutral'</code></td><td>Color of the leading dot.</td></tr>
          <tr><td><code>icon</code></td><td><code>ReactNode</code></td><td>—</td><td>Leading element (avatar/icon) — replaces the tone dot.</td></tr>
          <tr><td><code>read</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Read items are dimmed and drop the unread marker / tinted background.</td></tr>
          <tr><td><code>actions</code></td><td><code>ReactNode</code></td><td>—</td><td>Per-item action buttons rendered below the body.</td></tr>
          <tr><td><code>group</code></td><td><code>string</code></td><td>—</td><td>Bucket heading; consecutive items with the same group collect under it.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
