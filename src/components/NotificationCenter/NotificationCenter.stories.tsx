import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotificationCenter, type NotificationItem } from './index'
import { Button } from '../Button'
import { Badge } from '../Badge'

const meta = {
  title: '07 · More/Notification center',
  component: NotificationCenter,
  tags: ['autodocs'],
  args: { items: [] },
} satisfies Meta<typeof NotificationCenter>

export default meta
type Story = StoryObj<typeof meta>

const seed: NotificationItem[] = [
  { id: '1', group: 'Today', tone: 'err',  title: 'Deploy failed — api-gateway', body: 'Build #4821 exited with code 1 during `pnpm build`.', time: '12m', read: false },
  { id: '2', group: 'Today', tone: 'ok',   title: 'Migration completed', body: 'add_user_mfa_column applied to prod-db in 4.2s.', time: '1h', read: false },
  { id: '3', group: 'Today', tone: 'info', title: 'Bri Tanaka mentioned you', body: '“@alex can you review the rollback plan?”', time: '2h', read: true },
  { id: '4', group: 'Earlier', tone: 'warn', title: 'SLA at risk — #T-2',  body: 'First response due in 30m.', time: 'Yesterday', read: true },
  { id: '5', group: 'Earlier', tone: 'neutral', title: 'Weekly usage report ready', time: 'Mon', read: true },
]

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState(seed)
    return (
      <NotificationCenter
        items={items}
        onMarkAllRead={() => setItems((xs) => xs.map((x) => ({ ...x, read: true })))}
        onItemClick={(it) => setItems((xs) => xs.map((x) => x.id === it.id ? { ...x, read: true } : x))}
        footer={<button className="text-xs text-accent-ink hover:underline">View all activity</button>}
      />
    )
  },
}

export const WithItemActions: Story = {
  render: () => {
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
    return <NotificationCenter items={items} onMarkAllRead={() => setItems((xs) => xs.map((x) => ({ ...x, read: true })))} />
  },
}

export const Empty: Story = {
  render: () => <NotificationCenter items={[]} title="Inbox" />,
}

export const InAUserMenu: Story = {
  parameters: { docs: { description: { story: 'Pair with `Badge` on a trigger button; the panel itself is just `NotificationCenter`.' } } },
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <Badge count={2}>
          <Button size="sm" iconOnly aria-label="Notifications" onClick={() => setOpen((o) => !o)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </Button>
        </Badge>
        {open && <NotificationCenter items={seed} onMarkAllRead={() => {}} />}
      </div>
    )
  },
}
