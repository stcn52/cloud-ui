import { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  BulkBar,
  BulkBarButton,
  BulkBarSep,
  Checkbox,
  FilterBar,
  FilterChip,
  Kpi,
  Progress,
  SavedViews,
  SortHeader,
  StatusCell,
  Table,
  TableBar,
  type SortDirection,
  type ViewItem,
} from '../..'

const meta: Meta = {
  title: '07 · Compositions/Tables & filters',
  parameters: {
    docs: {
      description: {
        component:
          'The full list-page pattern: KPI strip + saved views + filter chips + sortable headers + mini-bar cells + status pills + sticky bulk-action bar. Mirrors components/11-tables.html § "Full pattern" — the VPS instances reference layout.',
      },
    },
  },
}
export default meta
type Story = StoryObj

interface VpsRow {
  id: string
  name: string
  os: string
  spec: string
  region: string
  provider: string
  ip: string
  cpu: number | null
  mem: number | null
  status: 'running' | 'rebooting'
  price: number
}

const data: VpsRow[] = [
  { id: 'api-prod-01',    name: 'api-prod-01',    os: 'Ubuntu 24.04', spec: '8c · 16GB · 240GB', region: 'de-fra-1',    provider: 'Helix EU',    ip: '88.198.42.7',    cpu: 42,   mem: 68, status: 'running',   price: 118 },
  { id: 'db-replica-tk',  name: 'db-replica-tk',  os: 'Debian 12',    spec: '4c · 8GB · 120GB',  region: 'jp-tokyo-2',  provider: 'Sakura.io',   ip: '160.16.124.88',  cpu: null, mem: null, status: 'rebooting', price: 62 },
  { id: 'api-prod-02',    name: 'api-prod-02',    os: 'Ubuntu 24.04', spec: '8c · 16GB · 240GB', region: 'de-fra-1',    provider: 'Helix EU',    ip: '88.198.42.8',    cpu: 38,   mem: 62, status: 'running',   price: 118 },
  { id: 'redis-cache',    name: 'redis-cache',    os: 'Alpine 3.21',  spec: '2c · 4GB · 80GB',   region: 'sg1.fr2',     provider: 'NeonStack',   ip: '203.107.211.42', cpu: 12,   mem: 28, status: 'running',   price: 18  },
  { id: 'worker-eu-01',   name: 'worker-eu-01',   os: 'NixOS 25.05',  spec: '4c · 8GB · 160GB',  region: 'de-fra-1',    provider: 'Helix EU',    ip: '88.198.42.9',    cpu: 18,   mem: 34, status: 'running',   price: 84  },
  { id: 'staging-bgp',    name: 'staging-bgp',    os: 'Rocky 9',      spec: '2c · 4GB · 80GB',   region: 'cn-sha-bgp',  provider: 'Yulin IDC',   ip: '120.78.198.42',  cpu: 8,    mem: 22, status: 'running',   price: 48  },
  { id: 'db-primary',     name: 'db-primary',     os: 'Debian 12',    spec: '8c · 32GB · 480GB', region: 'jp-tokyo-2',  provider: 'Sakura.io',   ip: '160.16.124.89',  cpu: 52,   mem: 71, status: 'running',   price: 218 },
  { id: 'jump-host',      name: 'jump-host',      os: 'Alpine 3.21',  spec: '1c · 1GB · 25GB',   region: 'us-sjc-3',    provider: 'Ampera Bay',  ip: '23.236.62.147',  cpu: 2,    mem: 14, status: 'running',   price: 16  },
]

const views: ViewItem[] = [
  { id: 'all',     label: 'All',           count: 8, locked: true },
  { id: 'running', label: 'Running',       count: 7 },
  { id: 'issue',   label: 'Issues',        count: 1 },
  { id: 'helix',   label: 'Helix EU',      count: 4 },
  { id: 'sakura',  label: 'Sakura.io',     count: 2 },
]

export const VpsInstances: Story = {
  render: () => {
    const [view, setView] = useState('all')
    const [sort, setSort] = useState<{ key: 'cpu' | 'name' | 'price'; dir: SortDirection }>({ key: 'cpu', dir: 'desc' })
    const [picked, setPicked] = useState<Set<string>>(new Set())

    const cycle = (key: 'cpu' | 'name' | 'price') => {
      setSort((p) => {
        if (p.key !== key) return { key, dir: 'desc' }
        if (p.dir === 'desc') return { key, dir: 'asc' }
        if (p.dir === 'asc')  return { key, dir: null }
        return { key, dir: 'desc' }
      })
    }
    const dirOf = (k: 'cpu' | 'name' | 'price') => (sort.key === k ? sort.dir : null)

    const visible = useMemo(() => {
      let xs = data
      if (view === 'running') xs = xs.filter((x) => x.status === 'running')
      if (view === 'issue')   xs = xs.filter((x) => x.status !== 'running')
      if (view === 'helix')   xs = xs.filter((x) => x.provider === 'Helix EU')
      if (view === 'sakura')  xs = xs.filter((x) => x.provider === 'Sakura.io')
      if (sort.dir) {
        xs = [...xs].sort((a, b) => {
          const m = sort.dir === 'asc' ? 1 : -1
          if (sort.key === 'name')  return a.name.localeCompare(b.name) * m
          if (sort.key === 'price') return (a.price - b.price) * m
          // cpu — nulls last
          if (a.cpu == null && b.cpu == null) return 0
          if (a.cpu == null) return 1
          if (b.cpu == null) return -1
          return (a.cpu - b.cpu) * m
        })
      }
      return xs
    }, [view, sort])

    const allChecked = picked.size > 0 && picked.size === visible.length
    const someChecked = picked.size > 0 && !allChecked
    const toggleAll = () => setPicked(allChecked ? new Set() : new Set(visible.map((r) => r.id)))
    const toggle = (id: string) => setPicked((p) => {
      const next = new Set(p)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })

    const totalCost = visible.reduce((s, r) => s + r.price, 0)

    return (
      <div style={{ border: '1px solid var(--color-line)', borderRadius: 12, overflow: 'hidden', background: 'var(--color-bg)' }}>
        {/* Page head */}
        <div style={{ padding: '16px 22px 14px', borderBottom: '1px solid var(--color-line)', background: 'var(--color-panel)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>VPS 实例</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: 'var(--color-text-dim)' }}>
              <span><b style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>8</b> 实例</span>
              <Sep />
              <span>月支出 <b style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>¥846</b></span>
              <Sep />
              <span>平均 CPU <b style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>23 %</b></span>
              <Sep />
              <span>跨 <b style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>4</b> 家服务商</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="text-xs px-2 py-1 rounded-xs cursor-pointer border border-line bg-bg-elev text-text-muted hover:bg-bg-sunk">批量操作</button>
            <button className="text-xs px-2 py-1 rounded-xs cursor-pointer bg-accent text-white border-0 hover:opacity-90">+ 新建实例</button>
          </div>
        </div>

        <div style={{ padding: 14 }}>
          {/* KPI strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 12 }}>
            <Kpi label="运行中" value={<>7 <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--color-text-dim)', fontWeight: 400 }}>/ 8</span></>} />
            <Kpi label="月支出" value="¥846" />
            <Kpi label="平均 CPU" value="23 %" foot={<Progress value={23} />} />
            <Kpi label="总流量 30 d" value={<>12.4 <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--color-text-dim)', fontWeight: 400 }}>TB</span></>} />
          </div>

          {/* Saved views */}
          <SavedViews value={view} onChange={setView} views={views} onAdd={() => {}} addLabel="+ 新视图" />

          {/* Filter chip row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 2px', gap: 8, flexWrap: 'wrap' }}>
            <FilterBar>
              <span style={{ fontSize: 11, color: 'var(--color-text-dim)', marginRight: 2 }}>筛选:</span>
              <FilterChip variant="active" count={8}>全部</FilterChip>
              <FilterChip count={7}>运行</FilterChip>
              <FilterChip count={1}>异常</FilterChip>
              <FilterChip variant="add">+ 筛选</FilterChip>
            </FilterBar>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--color-text-dim)' }}>
              排序: <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>CPU 占用 ↓</span>
            </div>
          </div>

          {/* Table */}
          <Table>
            <thead>
              <tr>
                <th style={{ width: 28 }}>
                  <Checkbox checked={allChecked} indeterminate={someChecked} onChange={toggleAll} />
                </th>
                <SortHeader direction={dirOf('name')} onSort={() => cycle('name')}>实例</SortHeader>
                <th>规格</th>
                <th>区域 · 服务商</th>
                <th>公网 IP</th>
                <SortHeader direction={dirOf('cpu')} onSort={() => cycle('cpu')} className="right" style={{ width: 130 }}>CPU</SortHeader>
                <th className="right" style={{ width: 130 }}>内存</th>
                <th>状态</th>
                <SortHeader direction={dirOf('price')} onSort={() => cycle('price')} className="right">¥/月</SortHeader>
                <th style={{ width: 28 }}></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} className={picked.has(r.id) ? 'sel' : undefined}>
                  <td><Checkbox checked={picked.has(r.id)} onChange={() => toggle(r.id)} /></td>
                  <td>
                    <span style={{ display: 'inline-flex', flexDirection: 'column' }}>
                      <b>{r.name}</b>
                      <span style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>{r.os}</span>
                    </span>
                  </td>
                  <td className="mono">{r.spec}</td>
                  <td><span className="mono">{r.region}</span> · {r.provider}</td>
                  <td className="mono">{r.ip}</td>
                  <td className="right">
                    {r.cpu == null
                      ? <span className="num" style={{ color: 'var(--color-text-dim)' }}>—</span>
                      : <TableBar value={r.cpu} />}
                  </td>
                  <td className="right">
                    {r.mem == null
                      ? <span className="num" style={{ color: 'var(--color-text-dim)' }}>—</span>
                      : <TableBar value={r.mem} />}
                  </td>
                  <td>
                    {r.status === 'running'
                      ? <StatusCell tone="ok">running</StatusCell>
                      : <StatusCell tone="warn">rebooting</StatusCell>}
                  </td>
                  <td className="right num">¥{r.price}</td>
                  <td className="actions">
                    <button className="text-xs px-1.5 py-0.5 rounded-xs cursor-pointer border border-line bg-bg-elev text-text-muted hover:bg-bg-sunk">⋯</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 4px 2px', fontSize: 12, color: 'var(--color-text-muted)' }}>
            <span>{visible.length} 个实例 · {picked.size} 已选择</span>
            <span>月支出合计 <b style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>¥{totalCost.toFixed(2)}</b></span>
          </div>
        </div>

        {/* Sticky bulk bar */}
        {picked.size > 0 && (
          <div style={{ position: 'sticky', bottom: 12, padding: '0 14px 14px', display: 'flex', justifyContent: 'center' }}>
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

function Sep() {
  return <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--color-line-strong)' }} />
}
