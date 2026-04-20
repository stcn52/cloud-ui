import { Tree, type TreeNode } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

const orgIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const projIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4" />
  </svg>
)
const svcIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="4" width="18" height="6" rx="1" />
    <rect x="3" y="14" width="18" height="6" rx="1" />
  </svg>
)
const dbIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <ellipse cx="12" cy="5" rx="8" ry="2.5" />
    <path d="M4 5v14c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V5" />
  </svg>
)
const tableIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="4" y="4" width="16" height="16" rx="1" />
  </svg>
)

const data: TreeNode[] = [
  {
    id: 'linden',
    label: 'Linden Labs',
    icon: orgIcon,
    meta: '3 projects',
    children: [
      {
        id: 'api-platform',
        label: 'api-platform',
        icon: projIcon,
        meta: '8 services',
        children: [
          { id: 'api-gateway', label: 'api-gateway', icon: svcIcon, meta: <span style={{ color: 'var(--accent-ink)' }}>v142</span> },
          { id: 'auth-service', label: 'auth-service', icon: svcIcon, meta: 'v88' },
          { id: 'ingest-worker', label: 'ingest-worker', icon: svcIcon, meta: 'v204' },
          {
            id: 'postgres-primary',
            label: 'postgres-primary',
            icon: dbIcon,
            children: [
              { id: 'users_db', label: 'users_db', icon: tableIcon, meta: '12 GB' },
              { id: 'events_db', label: 'events_db', icon: tableIcon, meta: '84 GB' },
            ],
          },
        ],
      },
      { id: 'billing', label: 'billing', icon: projIcon, meta: '4 services', children: [] },
      { id: 'analytics', label: 'analytics', icon: projIcon, meta: '6 services', children: [] },
    ],
  },
]

export function TreePage() {
  return (
    <>
      <PageHeader
        kicker="06 · Advanced"
        title="Tree"
        lede="Resource tree for workspace → project → service. 14px indent per level, dashed guide lines, monospace meta."
      />

      <div className="demo">
        <div className="demo-label">Resource tree</div>
        <div className="demo-body plain" style={{ padding: 16 }}>
          <div style={{ width: 420 }}>
            <Tree
              data={data}
              defaultExpanded={['linden', 'api-platform', 'postgres-primary']}
              defaultSelected="api-gateway"
            />
          </div>
        </div>
      </div>
    </>
  )
}
