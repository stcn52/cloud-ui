import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { NxTable, type NxColumn } from './index'
import { Button } from '../Button'

const meta: Meta = {
  title: '11 · Tables/NxTable',
  parameters: {
    docs: { description: { component: 'Enterprise data table: column resize & pin, sort, per-column filters (text / select / range), global search, pagination, multi/single select with bulk actions, expandable rows, density switch, column show/hide, CSV export, optional localStorage persistence.' } },
  },
}

export default meta
type Story = StoryObj

/* ---- sample dataset ---- */
type Instance = {
  id: string
  name: string
  region: string
  status: 'running' | 'stopped' | 'error' | 'degraded'
  vcpus: number
  memGb: number
  cpuPct: number
  monthlyCost: number
  created: string
  owner: string
}

const REGIONS = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-northeast-1']
const STATUSES: Instance['status'][] = ['running', 'running', 'running', 'stopped', 'error', 'degraded']
const OWNERS = ['alex', 'bri', 'cal', 'dee', 'evan']

const rows: Instance[] = Array.from({ length: 140 }, (_, i) => {
  const r = (n: number) => (i * 2654435761 + n * 40503) % 997
  return {
    id: `i-${(i + 1).toString().padStart(4, '0')}`,
    name: `${['api', 'worker', 'web', 'cache', 'db'][r(1) % 5]}-${(r(2) % 90) + 10}`,
    region: REGIONS[r(3) % REGIONS.length],
    status: STATUSES[r(4) % STATUSES.length],
    vcpus: [2, 4, 8, 16, 32][r(5) % 5],
    memGb: [4, 8, 16, 32, 64, 128][r(6) % 6],
    cpuPct: r(7) % 100,
    monthlyCost: 12 + (r(8) % 400) + (r(9) % 100) / 100,
    created: new Date(2026, 0, 1 + (r(10) % 120), r(11) % 24, r(12) % 60).toISOString(),
    owner: OWNERS[r(13) % OWNERS.length],
  }
})

const columns: NxColumn<Instance>[] = [
  { key: 'name', label: 'Instance', type: 'text', width: 180, pinned: 'left', sortable: true, filterable: true, filterKind: 'text' },
  { key: 'region', label: 'Region', type: 'text', width: 150, sortable: true, filterable: true, filterKind: 'select', options: REGIONS },
  { key: 'status', label: 'Status', type: 'status', width: 110, sortable: true, filterable: true, filterKind: 'select', options: STATUSES },
  { key: 'vcpus', label: 'vCPUs', type: 'number', width: 90, align: 'right', sortable: true, filterable: true, filterKind: 'range' },
  { key: 'memGb', label: 'Memory (GB)', type: 'number', width: 120, align: 'right', sortable: true, filterable: true, filterKind: 'range' },
  { key: 'cpuPct', label: 'CPU', type: 'bar', width: 160, sortable: true },
  { key: 'monthlyCost', label: 'Monthly cost', type: 'money', width: 140, align: 'right', sortable: true, filterable: true, filterKind: 'range' },
  { key: 'created', label: 'Created', type: 'date', width: 160, sortable: true },
  { key: 'owner', label: 'Owner', type: 'text', width: 110, sortable: true, filterable: true, filterKind: 'text', pinned: 'right' },
]

export const FullFeatured: Story = {
  render: () => {
    const [sel, setSel] = useState<string[]>([])
    return (
      <div style={{ width: 980 }}>
        <NxTable<Instance>
          data={rows}
          columns={columns}
          getRowId={(r) => r.id}
          selectable="multi"
          selectedIds={sel}
          onSelectionChange={setSel}
          paginate
          pageSize={15}
          search
          renderExpanded={(r) => (
            <div className="text-sm text-text-muted grid grid-cols-2 gap-x-8 gap-y-1">
              <div><span className="text-text-dim">ID:</span> <code>{r.id}</code></div>
              <div><span className="text-text-dim">Owner:</span> @{r.owner}</div>
              <div><span className="text-text-dim">vCPUs / Mem:</span> {r.vcpus} / {r.memGb} GB</div>
              <div><span className="text-text-dim">Created:</span> {new Date(r.created).toLocaleString()}</div>
            </div>
          )}
          bulkActions={(picked) => (
            <>
              <Button size="xs" intent="ghost">Restart {picked.length}</Button>
              <Button size="xs" intent="danger">Terminate {picked.length}</Button>
            </>
          )}
          rowActions={(r) => (
            <button className="text-text-dim hover:text-text" aria-label={`Actions for ${r.name}`} onClick={() => alert(`Actions: ${r.name}`)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
            </button>
          )}
        />
      </div>
    )
  },
}

export const Minimal: Story = {
  parameters: { docs: { description: { story: 'No toolbar, no selection, no pagination — just a sortable grid.' } } },
  render: () => (
    <div style={{ width: 760 }}>
      <NxTable<Instance>
        data={rows.slice(0, 8)}
        columns={columns.filter((c) => ['name', 'region', 'status', 'vcpus', 'monthlyCost'].includes(c.key)).map((c) => ({ ...c, pinned: null }))}
        getRowId={(r) => r.id}
        showToolbar={false}
        paginate={false}
      />
    </div>
  ),
}

export const SingleSelectCompact: Story = {
  render: () => {
    const [sel, setSel] = useState<string[]>([])
    return (
      <div style={{ width: 820 }}>
        <NxTable<Instance>
          data={rows}
          columns={columns.map((c) => ({ ...c, pinned: c.key === 'name' ? 'left' : null }))}
          getRowId={(r) => r.id}
          selectable="single"
          selectedIds={sel}
          onSelectionChange={setSel}
          density="compact"
          pageSize={20}
          persistKey="nxtable-demo"
        />
        <p className="text-xs text-text-dim mt-2">Selected: {sel[0] ?? '(none)'} · UI state persists to <code>localStorage["nxtable:nxtable-demo"]</code>.</p>
      </div>
    )
  },
}
