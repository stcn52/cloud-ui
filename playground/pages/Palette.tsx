import { useEffect, useState } from 'react'
import { Button, CommandPalette, type CommandItem } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

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
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M4 12h16" />
        <path d="M14 6l6 6-6 6" />
      </svg>
    ),
  },
  {
    id: 'view-deploys',
    group: 'Actions',
    label: 'View all deployments',
    shortcut: 'G D',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M4 6h16v12H4z" />
      </svg>
    ),
  },
  {
    id: 'ingest-worker',
    group: 'Resources',
    label: 'ingest-worker · Degraded',
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="6" rx="1" />
        <rect x="3" y="14" width="18" height="6" rx="1" />
      </svg>
    ),
  },
  {
    id: 'primary-db',
    group: 'Resources',
    label: 'primary-db · Healthy',
    icon: (
      <svg viewBox="0 0 24 24">
        <ellipse cx="12" cy="5" rx="8" ry="2.5" />
        <path d="M4 5v14c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V5" />
      </svg>
    ),
  },
]

export function PalettePage() {
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
      <PageHeader
        kicker="05 · Overlays"
        title="Command palette"
        lede={
          <>
            <kbd>⌘</kbd>
            <kbd>K</kbd> opens the universal search. Fuzzy match across resources, actions, and settings.
          </>
        }
      />

      <div className="demo">
        <div className="demo-label">Trigger</div>
        <div className="demo-body">
          <Button onClick={() => setOpen(true)}>Open palette</Button>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
            …or press <kbd>⌘</kbd>
            <kbd>K</kbd>
          </span>
        </div>
      </div>

      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        placeholder="Search actions & resources…"
      />
    </>
  )
}
