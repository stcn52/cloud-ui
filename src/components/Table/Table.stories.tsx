import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  BulkBar,
  BulkBarButton,
  BulkBarSep,
  CaretButton,
  SortHeader,
  StatusCell,
  Table,
  TableBar,
  type SortDirection,
} from './index'
import { Avatar } from '../Avatar'
import { Checkbox } from '../Checkbox'
import { Pill } from '../Pill'
import { Skeleton } from '../Skeleton'

const meta = {
  title: '03 · Data display/Table',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

interface Row {
  name: string
  statusTone: 'ok' | 'warn' | 'err' | 'idle'
  statusLabel: string
  region: string
  version: string
  reqs: string
  p95: string
}
const rows: Row[] = [
  { name: 'api-gateway', statusTone: 'ok',   statusLabel: 'healthy',  region: 'us-east-1', version: 'v142', reqs: '14,218', p95: '124 ms' },
  { name: 'auth-service', statusTone: 'ok',  statusLabel: 'healthy',  region: 'us-east-1', version: 'v88',  reqs: '2,140',  p95: '86 ms'  },
  { name: 'ingest-worker', statusTone: 'warn', statusLabel: 'degraded', region: 'us-east-1', version: 'v204', reqs: '12,800', p95: '342 ms' },
  { name: 'mail-relay', statusTone: 'err', statusLabel: 'failing', region: 'us-east-1', version: 'v7', reqs: '—', p95: '—' },
]

export const ResourceList: Story = {
  render: () => (
    <Table>
      <thead>
        <tr>
          <th style={{ width: 24 }}><Checkbox /></th>
          <th>Service</th>
          <th>Status</th>
          <th>Region</th>
          <th>Version</th>
          <th className="right">Requests / 24 h</th>
          <th className="right">p95</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td><Checkbox /></td>
            <td><b>{r.name}</b></td>
            <td><StatusCell tone={r.statusTone}>{r.statusLabel}</StatusCell></td>
            <td className="mono">{r.region}</td>
            <td className="mono">{r.version}</td>
            <td className="right num">{r.reqs}</td>
            <td className="right num">{r.p95}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  ),
}

/* ─── Densities ────────────────────────────────────────────────────────── */
export const Densities: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          compact · 28 px
        </div>
        <Table density="compact">
          <thead>
            <tr><th>Time</th><th>Source</th><th>Message</th><th className="right">Latency</th></tr>
          </thead>
          <tbody>
            <tr><td className="mono">14:32:08.412</td><td className="mono">api-gateway</td><td>POST /v1/orders → 201</td><td className="right num">42 ms</td></tr>
            <tr><td className="mono">14:32:08.418</td><td className="mono">billing</td><td>charge.created · cus_8a71</td><td className="right num">88 ms</td></tr>
            <tr><td className="mono">14:32:08.501</td><td className="mono">api-gateway</td><td>GET /v1/me → 200</td><td className="right num">12 ms</td></tr>
          </tbody>
        </Table>
      </div>
      <div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          default · 34 px
        </div>
        <Table>
          <thead>
            <tr><th>Service</th><th>Region</th><th>Status</th><th className="right">Requests · 24 h</th></tr>
          </thead>
          <tbody>
            <tr><td><b>api-gateway</b></td><td>us-east-1</td><td><StatusCell tone="ok">healthy</StatusCell></td><td className="right num">14 218</td></tr>
            <tr><td><b>billing-worker</b></td><td>us-east-1</td><td><StatusCell tone="warn">degraded</StatusCell></td><td className="right num">2 401</td></tr>
            <tr><td><b>notify</b></td><td>eu-west-2</td><td><StatusCell tone="ok">healthy</StatusCell></td><td className="right num">5 880</td></tr>
          </tbody>
        </Table>
      </div>
      <div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          relaxed · 44 px
        </div>
        <Table density="relaxed">
          <thead>
            <tr><th>Invoice</th><th>Period</th><th>Status</th><th className="right">Amount</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <b>INV-2026-0042</b>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>PDF · 184 KB</span>
                </div>
              </td>
              <td>Apr 1–30, 2026</td>
              <td><StatusCell tone="ok">paid</StatusCell></td>
              <td className="right num">$ 4 218.00</td>
            </tr>
            <tr>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <b>INV-2026-0041</b>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>PDF · 192 KB</span>
                </div>
              </td>
              <td>Mar 1–31, 2026</td>
              <td><StatusCell tone="ok">paid</StatusCell></td>
              <td className="right num">$ 3 980.00</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  ),
}

/* ─── Cell vocabulary ──────────────────────────────────────────────────── */
export const CellVocabulary: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Identity (avatar + name + email), code/ID, status, mini-bar, range, money, timestamp, badges, hover-actions. Combine these — never invent a per-column layout.',
      },
    },
  },
  render: () => (
    <Table>
      <thead>
        <tr>
          <th>Identity</th>
          <th>Code / ID</th>
          <th>Status</th>
          <th>Mini bar</th>
          <th className="right">Money</th>
          <th>Badges</th>
          <th className="actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Avatar size="sm">MA</Avatar>
              <span style={{ display: 'inline-flex', flexDirection: 'column' }}>
                <b>Maya Aguirre</b>
                <span style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>maya@acme.io</span>
              </span>
            </span>
          </td>
          <td className="mono">cus_8a71</td>
          <td><StatusCell tone="ok">active</StatusCell></td>
          <td><TableBar value={78} /></td>
          <td className="right num">$ 1 420.00</td>
          <td>
            <span style={{ display: 'inline-flex', gap: 4 }}>
              <Pill>prod</Pill><Pill>us-east-1</Pill>
            </span>
          </td>
          <td className="actions">
            <span style={{ display: 'inline-flex', gap: 6 }}>
              <button className="text-xs px-2 py-0.5 rounded-xs border border-line bg-bg-elev text-text-muted hover:bg-bg-sunk cursor-pointer">Edit</button>
              <button className="text-xs px-1.5 py-0.5 rounded-xs border border-line bg-bg-elev text-text-muted hover:bg-bg-sunk cursor-pointer">⋯</button>
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Avatar size="sm">DT</Avatar>
              <span style={{ display: 'inline-flex', flexDirection: 'column' }}>
                <b>Daniela Torres</b>
                <span style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>dani@acme.io</span>
              </span>
            </span>
          </td>
          <td className="mono">cus_3f0e</td>
          <td><StatusCell tone="warn">past_due</StatusCell></td>
          <td><TableBar value={92} /></td>
          <td className="right num">$ 980.00</td>
          <td>
            <span style={{ display: 'inline-flex', gap: 4 }}>
              <Pill>prod</Pill><Pill>eu-west-1</Pill>
            </span>
          </td>
          <td className="actions">
            <span style={{ display: 'inline-flex', gap: 6 }}>
              <button className="text-xs px-2 py-0.5 rounded-xs border border-line bg-bg-elev text-text-muted hover:bg-bg-sunk cursor-pointer">Edit</button>
              <button className="text-xs px-1.5 py-0.5 rounded-xs border border-line bg-bg-elev text-text-muted hover:bg-bg-sunk cursor-pointer">⋯</button>
            </span>
          </td>
        </tr>
      </tbody>
    </Table>
  ),
}

/* ─── Sortable headers ─────────────────────────────────────────────────── */
type SortKey = 'service' | 'region' | 'cpu' | 'mem'
export const SortableHeaders: Story = {
  render: () => {
    const [sort, setSort] = useState<{ key: SortKey; dir: SortDirection }>({ key: 'cpu', dir: 'desc' })
    const cycle = (key: SortKey) => {
      setSort((prev) => {
        if (prev.key !== key) return { key, dir: 'desc' }
        if (prev.dir === 'desc') return { key, dir: 'asc' }
        if (prev.dir === 'asc')  return { key, dir: null }
        return { key, dir: 'desc' }
      })
    }
    const dirOf = (k: SortKey) => (sort.key === k ? sort.dir : null)

    return (
      <Table>
        <thead>
          <tr>
            <SortHeader direction={dirOf('service')} onSort={() => cycle('service')}>Service</SortHeader>
            <SortHeader direction={dirOf('region')} onSort={() => cycle('region')}>Region</SortHeader>
            <SortHeader direction={dirOf('cpu')} onSort={() => cycle('cpu')} className="right">CPU %</SortHeader>
            <SortHeader direction={dirOf('mem')} onSort={() => cycle('mem')} className="right">Mem</SortHeader>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><b>billing-worker</b></td><td>us-east-1</td><td className="right num">92 %</td><td className="right num">71 %</td><td><StatusCell tone="warn">degraded</StatusCell></td></tr>
          <tr><td><b>api-gateway</b></td><td>us-east-1</td><td className="right num">68 %</td><td className="right num">52 %</td><td><StatusCell tone="ok">healthy</StatusCell></td></tr>
          <tr><td><b>notify</b></td><td>eu-west-2</td><td className="right num">42 %</td><td className="right num">38 %</td><td><StatusCell tone="ok">healthy</StatusCell></td></tr>
          <tr><td><b>image-proc</b></td><td>ap-south-1</td><td className="right num">14 %</td><td className="right num">22 %</td><td><StatusCell tone="idle">idle</StatusCell></td></tr>
        </tbody>
      </Table>
    )
  },
}

/* ─── Mini bars ────────────────────────────────────────────────────────── */
export const MiniBars: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Inline progress bar for cells like CPU %, memory %, quota usage. Tone auto-derives from value (≥85 err, ≥65 warn) — pass an explicit `tone` to override.',
      },
    },
  },
  render: () => (
    <Table>
      <thead>
        <tr>
          <th>Instance</th>
          <th className="right" style={{ width: 160 }}>CPU</th>
          <th className="right" style={{ width: 160 }}>Memory</th>
          <th className="right" style={{ width: 160 }}>Disk</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><b>api-prod-01</b></td><td><TableBar value={42} /></td><td><TableBar value={68} /></td><td><TableBar value={31} /></td></tr>
        <tr><td><b>db-primary</b></td><td><TableBar value={52} /></td><td><TableBar value={71} /></td><td><TableBar value={88} /></td></tr>
        <tr><td><b>redis-cache</b></td><td><TableBar value={12} /></td><td><TableBar value={28} /></td><td><TableBar value={14} /></td></tr>
        <tr><td><b>worker-eu-01</b></td><td><TableBar value={92} tone="err" /></td><td><TableBar value={34} /></td><td><TableBar value={22} /></td></tr>
      </tbody>
    </Table>
  ),
}

/* ─── Bulk select ──────────────────────────────────────────────────────── */
export const BulkSelect: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Header checkbox cycles indeterminate → all → none. When ≥ 1 row is selected, a sticky bulk-action bar appears at the bottom of the viewport.',
      },
    },
  },
  render: () => {
    const ids = ['api-gateway', 'billing-worker', 'notify', 'image-proc', 'auth-svc'] as const
    const [picked, setPicked] = useState<Set<string>>(new Set(['api-gateway', 'billing-worker', 'notify']))
    const allChecked = picked.size === ids.length
    const indeterminate = picked.size > 0 && !allChecked
    const toggleAll = () => setPicked(allChecked ? new Set() : new Set(ids))
    const toggle = (id: string) => setPicked((p) => {
      const next = new Set(p)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })

    return (
      <div style={{ position: 'relative' }}>
        <Table>
          <thead>
            <tr>
              <th style={{ width: 28 }}>
                <Checkbox checked={allChecked} indeterminate={indeterminate} onChange={toggleAll} />
              </th>
              <th>Service</th>
              <th>Region</th>
              <th>Status</th>
              <th className="right">Started</th>
            </tr>
          </thead>
          <tbody>
            {ids.map((id) => (
              <tr key={id} className={picked.has(id) ? 'sel' : undefined}>
                <td><Checkbox checked={picked.has(id)} onChange={() => toggle(id)} /></td>
                <td><b>{id}</b></td>
                <td>{id === 'image-proc' ? 'ap-south-1' : id === 'notify' ? 'eu-west-2' : 'us-east-1'}</td>
                <td>
                  <StatusCell tone={id === 'billing-worker' ? 'warn' : id === 'image-proc' ? 'idle' : 'ok'}>
                    {id === 'billing-worker' ? 'degraded' : id === 'image-proc' ? 'idle' : 'healthy'}
                  </StatusCell>
                </td>
                <td className="right num" style={{ color: 'var(--color-text-muted)' }}>
                  {id === 'api-gateway' ? '14:32' : id === 'billing-worker' ? '14:21' : id === 'notify' ? '14:18' : id === 'image-proc' ? '13:54' : '13:42'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {picked.size > 0 && (
          <div style={{ position: 'sticky', bottom: 12, marginTop: 12, display: 'flex', justifyContent: 'center' }}>
            <BulkBar count={picked.size}>
              <BulkBarButton>Tag</BulkBarButton>
              <BulkBarButton>Move</BulkBarButton>
              <BulkBarButton>Export</BulkBarButton>
              <BulkBarSep />
              <BulkBarButton danger>Delete</BulkBarButton>
              <BulkBarSep />
              <BulkBarButton onClick={() => setPicked(new Set())}>Cancel</BulkBarButton>
            </BulkBar>
          </div>
        )}
      </div>
    )
  },
}

/* ─── Expandable rows ──────────────────────────────────────────────────── */
export const ExpandableRows: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Click the caret to inline-reveal a sub-panel. Keep nesting to one level — deeper hierarchies belong in a tree.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState<Set<string>>(new Set(['/v1/orders/{id}']))
    const toggle = (path: string) => setOpen((p) => {
      const next = new Set(p)
      if (next.has(path)) next.delete(path); else next.add(path)
      return next
    })
    const endpoints = [
      { path: '/v1/orders',      method: 'POST', p99: '88 ms',  calls: '14 218' },
      { path: '/v1/orders/{id}', method: 'GET',  p99: '42 ms',  calls: '88 102' },
      { path: '/v1/me',          method: 'GET',  p99: '12 ms',  calls: '2 401'  },
      { path: '/v1/webhooks',    method: 'POST', p99: '128 ms', calls: '5 880'  },
    ]
    return (
      <Table>
        <thead>
          <tr>
            <th style={{ width: 28 }}></th>
            <th>Endpoint</th>
            <th>Method</th>
            <th>p99</th>
            <th className="right">Calls · 24 h</th>
          </tr>
        </thead>
        <tbody>
          {endpoints.flatMap((e) => {
            const isOpen = open.has(e.path)
            const row = (
              <tr key={e.path}>
                <td><CaretButton open={isOpen} onClick={() => toggle(e.path)} /></td>
                <td className="mono">{e.path}</td>
                <td><Pill>{e.method}</Pill></td>
                <td className="num">{e.p99}</td>
                <td className="right num">{e.calls}</td>
              </tr>
            )
            if (!isOpen) return [row]
            return [
              row,
              <tr key={`${e.path}-detail`}>
                <td colSpan={5} style={{ background: 'var(--color-bg-sunk)', padding: '14px 18px', height: 'auto' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Stat label="Median" value="12 ms" />
                    <Stat label="p95" value="38 ms" />
                    <Stat label="p99" value="42 ms" tone="warn" />
                    <Stat label="Error rate" value="0.04 %" tone="ok" />
                  </div>
                </td>
              </tr>,
            ]
          })}
        </tbody>
      </Table>
    )
  },
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'ok' | 'warn' }) {
  const color = tone === 'warn' ? 'var(--color-warn)' : tone === 'ok' ? 'var(--color-ok)' : 'var(--color-text)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span className="mono" style={{ fontSize: 10.5, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span className="num" style={{ fontSize: 14, fontWeight: 600, color }}>{value}</span>
    </div>
  )
}

/* ─── Loading skeleton ─────────────────────────────────────────────────── */
export const LoadingSkeleton: Story = {
  render: () => (
    <Table>
      <thead>
        <tr>
          <th>Service</th>
          <th>Region</th>
          <th>Status</th>
          <th className="right">CPU</th>
          <th className="right">Started</th>
        </tr>
      </thead>
      <tbody>
        {[120, 90, 140, 100, 110].map((w, i) => (
          <tr key={i}>
            <td><Skeleton width={w} /></td>
            <td><Skeleton width={70} /></td>
            <td><Skeleton width={60} /></td>
            <td className="right"><Skeleton width={36} /></td>
            <td className="right"><Skeleton width={60} /></td>
          </tr>
        ))}
      </tbody>
    </Table>
  ),
}
