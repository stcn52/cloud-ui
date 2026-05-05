import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Avatar } from '../Avatar'
import { Field } from '../Input'
import { Input } from '../Input'
import { Popover, PopoverItem, PopoverSeparator } from './index'

const meta = {
  title: '05 · Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: { trigger: <Button>Open</Button>, content: null },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end'],
    },
    offset: { control: { type: 'number', min: 0, max: 24, step: 1 } },
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

/* ──────────────── Icons ──────────────── */

const iconDup = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)
const iconDeploy = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <polyline points="16 12 12 8 8 12" /><line x1="12" y1="16" x2="12" y2="8" /><circle cx="12" cy="12" r="10" />
  </svg>
)
const iconShare = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)
const iconRename = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
)
const iconTrash = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M6 6l1 14h10l1-14" />
  </svg>
)
const iconKebab = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="5" cy="12" r="1.2" /><circle cx="12" cy="12" r="1.2" /><circle cx="19" cy="12" r="1.2" />
  </svg>
)

/* ──────────────── Stories ──────────────── */

export const RowActions: Story = {
  render: () => (
    <Popover
      trigger={<Button iconOnly>{iconKebab}</Button>}
      content={
        <>
          <PopoverItem icon={iconDup} shortcut="⌘D">Duplicate</PopoverItem>
          <PopoverItem icon={iconDeploy} shortcut="⌘↵">Deploy</PopoverItem>
          <PopoverSeparator />
          <PopoverItem icon={iconTrash} shortcut="⌫" danger>Delete</PopoverItem>
        </>
      }
    />
  ),
}

export const TextTrigger: Story = {
  parameters: {
    docs: { description: { story: 'A primitive string is auto-wrapped in a `<span>` so the popover can attach the click handler.' } },
  },
  render: () => (
    <Popover
      trigger="Hover me"
      content={
        <>
          <PopoverItem>Profile</PopoverItem>
          <PopoverItem>Settings</PopoverItem>
          <PopoverSeparator />
          <PopoverItem danger>Sign out</PopoverItem>
        </>
      }
    />
  ),
}

export const Placements: Story = {
  parameters: {
    docs: { description: { story: 'Six placements: bottom-start (default) / bottom / bottom-end / top-start / top / top-end. The popover auto-clamps to the viewport.' } },
  },
  render: () => {
    const placements = ['top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end'] as const
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: '120px 24px', placeItems: 'center' }}>
        {placements.map((p) => (
          <Popover
            key={p}
            placement={p}
            trigger={<Button>{p}</Button>}
            content={
              <>
                <PopoverItem>Item one</PopoverItem>
                <PopoverItem>Item two</PopoverItem>
                <PopoverItem>Item three</PopoverItem>
              </>
            }
          />
        ))}
      </div>
    )
  },
}

export const WithSubmenu: Story = {
  parameters: {
    docs: { description: { story: 'Hovering an item with a `submenu` opens a nested panel to the right (auto-flips left at the edge).' } },
  },
  render: () => (
    <Popover
      trigger={<Button>File ▾</Button>}
      content={
        <>
          <PopoverItem icon={iconDup} shortcut="⌘N">New file</PopoverItem>
          <PopoverItem icon={iconRename} shortcut="F2">Rename…</PopoverItem>
          <PopoverItem
            icon={iconShare}
            submenu={
              <>
                <PopoverItem>Public link</PopoverItem>
                <PopoverItem>Email…</PopoverItem>
                <PopoverSeparator />
                <PopoverItem>Manage access…</PopoverItem>
              </>
            }
          >
            Share
          </PopoverItem>
          <PopoverSeparator />
          <PopoverItem icon={iconTrash} danger shortcut="⌫">Delete</PopoverItem>
        </>
      }
    />
  ),
}

export const UserMenu: Story = {
  parameters: {
    docs: { description: { story: 'A common pattern — header avatar opens a profile menu.' } },
  },
  render: () => (
    <Popover
      placement="bottom-end"
      trigger={
        <button style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 0 }}>
          <Avatar tone="azure" presence="ok">MA</Avatar>
        </button>
      }
      content={
        <>
          <div style={{ padding: '8px 10px 6px', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Maya Aguirre</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>maya@acme.io</span>
          </div>
          <PopoverSeparator />
          <PopoverItem shortcut="⌘,">Settings</PopoverItem>
          <PopoverItem>Billing</PopoverItem>
          <PopoverItem>Team members</PopoverItem>
          <PopoverSeparator />
          <PopoverItem shortcut="⌘K">Command palette</PopoverItem>
          <PopoverItem>Keyboard shortcuts</PopoverItem>
          <PopoverSeparator />
          <PopoverItem danger>Sign out</PopoverItem>
        </>
      }
    />
  ),
}

export const Controlled: Story = {
  parameters: {
    docs: { description: { story: 'Use `open` + `onOpenChange` for fully controlled state — useful when the popover content has its own form that should commit before closing.' } },
  },
  render: () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('api-gateway')
    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
        trigger={<Button>Edit name…</Button>}
        surface={false}
        content={
          <div
            style={{
              background: 'var(--color-bg-elev)',
              border: '1px solid var(--color-line)',
              borderRadius: 8,
              boxShadow: 'var(--shadow-md)',
              padding: 12,
              minWidth: 240,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <Field label="Service name">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              <Button size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button size="sm" intent="primary" onClick={() => setOpen(false)}>Save</Button>
            </div>
          </div>
        }
      />
    )
  },
}

export const CustomSurface: Story = {
  parameters: {
    docs: { description: { story: 'Pass `surface={false}` to drop the default panel chrome — useful for popovers with custom backgrounds (color pickers, mini charts, etc.).' } },
  },
  render: () => (
    <Popover
      trigger={<Button>Color</Button>}
      surface={false}
      content={
        <div style={{ background: 'var(--color-text)', color: 'var(--color-bg-elev)', padding: '8px 12px', borderRadius: 6, fontSize: 12 }}>
          Custom-styled popover content
        </div>
      }
    />
  ),
}

export const RichContent: Story = {
  parameters: {
    docs: { description: { story: 'Mix freeform content with `PopoverItem` rows.' } },
  },
  render: () => (
    <Popover
      trigger={<Button>What's new ▾</Button>}
      content={
        <>
          <div style={{ padding: '8px 10px 6px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Release 1.1.1</span>
            <span style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>
              Fixes a long-standing positioning bug in overlays. Tables now render
              in compact / default / relaxed densities and 18 new primitives are
              live.
            </span>
          </div>
          <PopoverSeparator />
          <PopoverItem>Read changelog</PopoverItem>
          <PopoverItem>Star on GitHub</PopoverItem>
        </>
      }
    />
  ),
}
