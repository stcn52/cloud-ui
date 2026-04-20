import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { CommandPalette, type CommandItem } from './index'

const meta = {
  title: '05 · Overlays/Command palette',
  component: CommandPalette,
  tags: ['autodocs'],
  args: { open: false, items: [] },
} satisfies Meta<typeof CommandPalette>

export default meta
type Story = StoryObj<typeof meta>

const items: CommandItem[] = [
  {
    id: 'deploy-api',
    group: 'Actions',
    label: 'Deploy api-gateway to production',
    shortcut: '⌘↵',
    icon: (
      <svg viewBox="0 0 24 24">
        <polyline points="16 12 12 8 8 12" />
        <line x1="12" y1="16" x2="12" y2="8" />
      </svg>
    ),
  },
  {
    id: 'deploy-auth',
    group: 'Actions',
    label: 'Deploy auth-service to production',
  },
  {
    id: 'view-deploys',
    group: 'Actions',
    label: 'View all deployments',
    shortcut: 'G D',
  },
  {
    id: 'ingest-worker',
    group: 'Resources',
    label: 'ingest-worker · Degraded',
  },
  {
    id: 'primary-db',
    group: 'Resources',
    label: 'primary-db · Healthy',
  },
]

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault()
          setOpen((o) => !o)
        }
      }
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }, [])
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open palette</Button>
        <span style={{ marginLeft: 12, color: 'var(--color-text-muted)', fontSize: 12 }}>
          …or press <kbd>⌘</kbd><kbd>K</kbd>
        </span>
        <CommandPalette open={open} onClose={() => setOpen(false)} items={items} />
      </>
    )
  },
}
