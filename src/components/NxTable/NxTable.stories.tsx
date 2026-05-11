import { StrictMode, useEffect, useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { NxTable, type NxColumn } from './index'
import type { NxSortState } from './types'
import { Button } from '../Button'
import { Pill } from '../Pill'
import { PopoverItem, PopoverSeparator } from '../Popover'

const meta: Meta = {
  title: '11 · Tables/NxTable',
  parameters: {
    docs: { description: { component: 'Enterprise data table: column resize & pin, sort, per-column filters (text / select / range), global search, pagination, multi/single select with bulk actions, expandable rows, density switch, column show/hide, CSV export, optional localStorage persistence. The stories below isolate one capability each; "Full featured" combines them.' } },
  },
}

export default meta
type Story = StoryObj

/* -------------------------------------------------------------------------- */
/* Sample dataset                                                              */
/* -------------------------------------------------------------------------- */

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

function makeRows(n: number): Instance[] {
  return Array.from({ length: n }, (_, i) => {
    const r = (k: number) => (i * 2654435761 + k * 40503) % 997
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
}
const rows = makeRows(140)
const fewRows = makeRows(8)

/** Build a column set; helper so each story can tweak `pinned` etc. without repeating the list. */
function cols(opts?: { pinName?: 'left' | null; pinOwner?: 'right' | null }): NxColumn<Instance>[] {
  return [
    { key: 'name', label: 'Instance', type: 'text', width: 180, pinned: opts?.pinName === undefined ? 'left' : opts.pinName, sortable: true, filterable: true, filterKind: 'text' },
    { key: 'region', label: 'Region', type: 'text', width: 150, sortable: true, filterable: true, filterKind: 'select', options: REGIONS },
    { key: 'status', label: 'Status', type: 'status', width: 110, sortable: true, filterable: true, filterKind: 'select', options: STATUSES },
    { key: 'vcpus', label: 'vCPUs', type: 'number', width: 90, align: 'right', sortable: true, filterable: true, filterKind: 'range' },
    { key: 'memGb', label: 'Memory (GB)', type: 'number', width: 120, align: 'right', sortable: true, filterable: true, filterKind: 'range' },
    { key: 'cpuPct', label: 'CPU', type: 'bar', width: 160, sortable: true },
    { key: 'monthlyCost', label: 'Monthly cost', type: 'money', width: 140, align: 'right', sortable: true, filterable: true, filterKind: 'range' },
    { key: 'created', label: 'Created', type: 'date', width: 160, sortable: true },
    { key: 'owner', label: 'Owner', type: 'text', width: 110, sortable: true, filterable: true, filterKind: 'text', pinned: opts?.pinOwner === undefined ? 'right' : opts.pinOwner },
  ]
}

const KebabBtn = ({ name }: { name: string }) => (
  <button className="text-text-dim hover:text-text" aria-label={`Actions for ${name}`} onClick={() => alert(`Actions: ${name}`)}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
  </button>
)

const ExpandedDetail = ({ r }: { r: Instance }) => (
  <div className="text-sm text-text-muted grid grid-cols-2 gap-x-8 gap-y-1">
    <div><span className="text-text-dim">ID:</span> <code>{r.id}</code></div>
    <div><span className="text-text-dim">Owner:</span> @{r.owner}</div>
    <div><span className="text-text-dim">vCPUs / Mem:</span> {r.vcpus} / {r.memGb} GB</div>
    <div><span className="text-text-dim">Created:</span> {new Date(r.created).toLocaleString()}</div>
  </div>
)

/* -------------------------------------------------------------------------- */
/* The combined showcase                                                       */
/* -------------------------------------------------------------------------- */

export const FullFeatured: Story = {
  parameters: { docs: { description: { story: 'Everything at once — selection + bulk actions, expandable rows, per-row menu, pinned first/last columns, search, per-column filters, sort, pagination, and (opted in here) the Columns + Export toolbar controls.' } } },
  render: () => {
    const [sel, setSel] = useState<string[]>([])
    return (
      <div style={{ width: 980 }}>
        <NxTable<Instance>
          data={rows}
          columns={cols()}
          getRowId={(r) => r.id}
          selectable="multi"
          selectedIds={sel}
          onSelectionChange={setSel}
          paginate
          pageSize={15}
          search
          showColumnControl
          showExport
          renderExpanded={(r) => <ExpandedDetail r={r} />}
          bulkActions={(picked) => (
            <>
              <Button size="xs" intent="ghost">Restart {picked.length}</Button>
              <Button size="xs" intent="danger">Terminate {picked.length}</Button>
            </>
          )}
          rowActions={(r) => <KebabBtn name={r.name} />}
        />
      </div>
    )
  },
}

/* -------------------------------------------------------------------------- */
/* One capability per story                                                    */
/* -------------------------------------------------------------------------- */

export const Minimal: Story = {
  parameters: { docs: { description: { story: 'No toolbar, no selection, no pagination — the smallest useful config.' } } },
  render: () => (
    <div style={{ width: 760 }}>
      <NxTable<Instance>
        data={fewRows}
        columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name', 'region', 'status', 'vcpus', 'monthlyCost'].includes(c.key))}
        getRowId={(r) => r.id}
        showToolbar={false}
        paginate={false}
      />
    </div>
  ),
}

export const SortingOnly: Story = {
  parameters: { docs: { description: { story: 'Click a header to cycle asc → desc → unsorted. Numbers, money, and dates sort by value; text sorts lexically.' } } },
  render: () => (
    <div style={{ width: 820 }}>
      <NxTable<Instance>
        data={fewRows}
        columns={cols({ pinName: null, pinOwner: null })}
        getRowId={(r) => r.id}
        showToolbar={false}
        paginate={false}
      />
    </div>
  ),
}

export const ColumnFilters: Story = {
  parameters: { docs: { description: { story: 'Click the funnel on a header. `region`/`status` are select filters, the numeric columns are range filters, `name`/`owner` are text "contains". "Clear filters" appears in the toolbar.' } } },
  render: () => (
    <div style={{ width: 880 }}>
      <NxTable<Instance>
        data={rows}
        columns={cols({ pinName: null, pinOwner: null })}
        getRowId={(r) => r.id}
        search={false}
        pageSize={12}
      />
    </div>
  ),
}

export const GlobalSearch: Story = {
  parameters: { docs: { description: { story: 'The toolbar search box matches the *rendered text* of every column (so it finds e.g. "us-east" or "running"). Pagination resets to page 1 on each keystroke.' } } },
  render: () => (
    <div style={{ width: 880 }}>
      <NxTable<Instance>
        data={rows}
        columns={cols({ pinName: null, pinOwner: null }).filter((c) => c.key !== 'cpuPct')}
        getRowId={(r) => r.id}
        pageSize={10}
      />
    </div>
  ),
}

export const ResizableColumns: Story = {
  parameters: { docs: { description: { story: 'Drag the right edge of any header. `minWidth` (set here to 80 on most columns) is respected.' } } },
  render: () => (
    <div style={{ width: 820 }}>
      <NxTable<Instance>
        data={fewRows}
        columns={cols({ pinName: null, pinOwner: null }).map((c) => ({ ...c, minWidth: 80 }))}
        getRowId={(r) => r.id}
        showToolbar={false}
        paginate={false}
      />
    </div>
  ),
}

export const PinnedColumns: Story = {
  parameters: { docs: { description: { story: '`pinned: "left"` on **Instance** and `"right"` on **Owner** — scroll horizontally and they stay put. The narrow viewport here forces the scroll.' } } },
  render: () => (
    <div style={{ width: 560 }}>
      <NxTable<Instance>
        data={fewRows}
        columns={cols()}
        getRowId={(r) => r.id}
        showToolbar={false}
        paginate={false}
      />
    </div>
  ),
}

export const MultiSelectWithBulkActions: Story = {
  parameters: { docs: { description: { story: 'The header checkbox toggles the current page; selecting ≥1 row reveals the bulk-action bar. Selection is controlled here so the count below stays in sync.' } } },
  render: () => {
    const [sel, setSel] = useState<string[]>(['i-0001', 'i-0003'])
    return (
      <div style={{ width: 880 }}>
        <NxTable<Instance>
          data={rows}
          columns={cols({ pinName: null, pinOwner: null })}
          getRowId={(r) => r.id}
          selectable="multi"
          selectedIds={sel}
          onSelectionChange={setSel}
          pageSize={10}
          bulkActions={(picked) => (
            <>
              <Button size="xs" intent="ghost">Tag {picked.length}</Button>
              <Button size="xs" intent="ghost">Restart {picked.length}</Button>
              <Button size="xs" intent="danger">Terminate {picked.length}</Button>
            </>
          )}
        />
        <p className="text-xs text-text-dim mt-2">{sel.length} selected: {sel.join(', ') || '(none)'}</p>
      </div>
    )
  },
}

export const SingleSelect: Story = {
  parameters: { docs: { description: { story: '`selectable="single"` swaps the checkboxes for radios — pick exactly one row.' } } },
  render: () => {
    const [sel, setSel] = useState<string[]>([])
    return (
      <div style={{ width: 760 }}>
        <NxTable<Instance>
          data={fewRows}
          columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name', 'region', 'status', 'monthlyCost'].includes(c.key))}
          getRowId={(r) => r.id}
          selectable="single"
          selectedIds={sel}
          onSelectionChange={setSel}
          showToolbar={false}
          paginate={false}
        />
        <p className="text-xs text-text-dim mt-2">Picked: {sel[0] ?? '(none)'}</p>
      </div>
    )
  },
}

export const ExpandableRows: Story = {
  parameters: { docs: { description: { story: 'Pass `renderExpanded` and an expander column appears. Click the caret (clicking the row itself does not toggle it).' } } },
  render: () => (
    <div style={{ width: 820 }}>
      <NxTable<Instance>
        data={fewRows}
        columns={cols({ pinName: null, pinOwner: null }).filter((c) => c.key !== 'cpuPct')}
        getRowId={(r) => r.id}
        showToolbar={false}
        paginate={false}
        renderExpanded={(r) => <ExpandedDetail r={r} />}
      />
    </div>
  ),
}

export const RowReorder: Story = {
  parameters: { docs: { description: { story: 'Pass `onRowReorder` and a drag-handle column is prepended — grab the ⠿ handle (pointer **or** keyboard: focus it, Space to pick up, arrows to move, Space to drop) and rows animate as you drag, with a floating overlay following the cursor. Powered by `@dnd-kit`. The callback receives an `NxRowReorderEvent` — `orderedIds` to re-render, plus `movedId` / `fromIndex` / `toIndex` / `beforeId` / `afterId` / `movedRow` for the backend (the "moved between X and Y" framing — see the **Row Reorder With Rank Key** story). NxTable does not reorder `data` itself. The handle is disabled while a sort is active or when pagination splits the rows across pages; `isRowDraggable` can lock individual rows.' } } },
  render: () => {
    const [data, setData] = useState<Instance[]>(() => fewRows.slice(0, 6))
    const [sel, setSel] = useState<string[]>([])
    const [last, setLast] = useState<string>('')
    return (
      <div style={{ width: 760 }}>
        <NxTable<Instance>
          data={data}
          columns={cols({ pinName: 'left', pinOwner: null }).filter((c) => ['name', 'region', 'status', 'vcpus', 'monthlyCost'].includes(c.key))}
          getRowId={(r) => r.id}
          selectable="multi"
          selectedIds={sel}
          onSelectionChange={setSel}
          showToolbar={false}
          paginate={false}
          onRowReorder={(e) => {
            setData((d) => {
              const byId = new Map(d.map((r) => [r.id, r]))
              return e.orderedIds.map((id) => byId.get(id)!).filter(Boolean)
            })
            setLast(`moved ${e.movedId}: #${e.fromIndex} → #${e.toIndex}  (after=${e.beforeId ?? '∅'}, before=${e.afterId ?? '∅'})`)
          }}
        />
        <p className="text-xs text-text-dim mt-2">Order: {data.map((r) => r.id).join(' → ')}</p>
        {last && <p className="text-xs text-text-dim mt-1">Last event: <code>{last}</code></p>}
        <p className="text-xs text-text-dim mt-1">(handle + checkbox + pinned “Instance” column all coexist — scroll horizontally to check the sticky layering)</p>
      </div>
    )
  },
}

export const RowReorderWithRankKey: Story = {
  parameters: { docs: { description: { story: 'The recommended backend pattern: each row carries a fractional `rank` string. On drop, derive the new rank from the *neighbours* (`beforeId` / `afterId`) and PATCH **only that one row** — no renumbering, no full-list write. Here `rankBetween` is a toy midpoint generator; in production use a library like `fractional-indexing` / LexoRank. Watch the "PATCH" log: only the moved row changes.' } } },
  render: () => {
    // toy fractional rank: midpoint of two strings (or step out past the ends)
    const rankBetween = (a: string | null, b: string | null): string => {
      const A = a ?? '', B = b ?? ''
      if (!A && !B) return 'm'
      if (!A) return String.fromCharCode(Math.max(98, B.charCodeAt(0) - 1)) // before B
      if (!B) return A + 'm' // after A
      // midpoint char if there's room, else extend
      const ca = A.charCodeAt(0), cb = B.charCodeAt(0)
      if (cb - ca > 1) return String.fromCharCode(Math.floor((ca + cb) / 2))
      return A + 'm'
    }
    type Ranked = Instance & { rank: string }
    const [rows0] = useState<Ranked[]>(() =>
      fewRows.slice(0, 6).map((r, i) => ({ ...r, rank: String.fromCharCode(100 + i * 4) })), // 'd','h','l','p','t','x'
    )
    const [data, setData] = useState<Ranked[]>(rows0)
    const [log, setLog] = useState<string[]>([])
    const sorted = useMemo(() => [...data].sort((a, b) => (a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0)), [data])
    return (
      <div style={{ width: 820 }}>
        <NxTable<Ranked>
          data={sorted}
          columns={[
            { key: 'rank', label: 'rank', type: 'text', width: 90 },
            ...cols({ pinName: null, pinOwner: null }).filter((c) => ['name', 'region', 'status', 'monthlyCost'].includes(c.key)),
          ] as NxColumn<Ranked>[]}
          getRowId={(r) => r.id}
          showToolbar={false}
          paginate={false}
          onRowReorder={(e) => {
            const before = e.beforeId ? sorted.find((r) => r.id === e.beforeId)?.rank ?? null : null
            const after = e.afterId ? sorted.find((r) => r.id === e.afterId)?.rank ?? null : null
            const newRank = rankBetween(before, after)
            // The "backend": persist a single row's new rank.
            setData((d) => d.map((r) => (r.id === e.movedId ? { ...r, rank: newRank } : r)))
            setLog((l) => [`PATCH /rows/${e.movedId} { rank: "${newRank}" }   (between "${before ?? '∅'}" and "${after ?? '∅'}")`, ...l].slice(0, 5))
          }}
        />
        <div className="text-xs text-text-dim mt-2 font-mono whitespace-pre-wrap">
          {log.length ? log.join('\n') : 'drag a row — only the moved row gets a PATCH'}
        </div>
      </div>
    )
  },
}

export const Density: Story = {
  parameters: { docs: { description: { story: 'Density trades vertical padding for rows-on-screen. By default NxTable **follows the global `ConfigProvider` size** (try the Storybook "size" toolbar control — compact / normal / comfortable — and every table follows). The `density` prop pins a density for one table regardless; the rows below are pinned to each value.' } } },
  render: () => (
    <div style={{ width: 820, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div className="text-xs uppercase tracking-[0.05em] text-text-dim mb-1">follows global size (no <code>density</code> prop)</div>
        <NxTable<Instance>
          data={fewRows.slice(0, 4)}
          columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name', 'region', 'status', 'vcpus', 'monthlyCost'].includes(c.key))}
          getRowId={(r) => r.id}
          showToolbar={false}
          paginate={false}
        />
      </div>
      {(['compact', 'normal', 'comfy'] as const).map((d) => (
        <div key={d}>
          <div className="text-xs uppercase tracking-[0.05em] text-text-dim mb-1">pinned: <code>density="{d}"</code></div>
          <NxTable<Instance>
            data={fewRows.slice(0, 4)}
            columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name', 'region', 'status', 'vcpus', 'monthlyCost'].includes(c.key))}
            getRowId={(r) => r.id}
            density={d}
            showToolbar={false}
            paginate={false}
          />
        </div>
      ))}
    </div>
  ),
}

export const ToolbarControls: Story = {
  parameters: { docs: { description: { story: 'Toolbar controls are opt-in. Defaults: `search` on, `showDensityControl` / `showColumnControl` / `showExport` all **off** — so out of the box the toolbar is just a search box (and density is driven globally via `ConfigProvider`). When `showToolbar` is on but every control is off, the bar hides itself entirely.' } } },
  render: () => (
    <div style={{ width: 880, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div className="text-xs uppercase tracking-[0.05em] text-text-dim mb-1">default — search box only</div>
        <NxTable<Instance> data={rows} columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name','region','status','vcpus'].includes(c.key))} getRowId={(r) => r.id} pageSize={6} />
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.05em] text-text-dim mb-1"><code>showColumnControl showExport</code> — opt in to the Columns + Export buttons</div>
        <NxTable<Instance> data={rows} columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name','region','status','vcpus'].includes(c.key))} getRowId={(r) => r.id} pageSize={6} showColumnControl showExport />
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.05em] text-text-dim mb-1"><code>showDensityControl</code> — opt in to the local density picker (overrides the global size for this table)</div>
        <NxTable<Instance> data={rows} columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name','region','status','vcpus'].includes(c.key))} getRowId={(r) => r.id} pageSize={6} showDensityControl />
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.05em] text-text-dim mb-1">everything on — search + density + Columns + Export</div>
        <NxTable<Instance> data={rows} columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name','region','status','vcpus'].includes(c.key))} getRowId={(r) => r.id} pageSize={6} showDensityControl showColumnControl showExport />
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.05em] text-text-dim mb-1"><code>search=false</code> + everything off → toolbar hidden entirely</div>
        <NxTable<Instance> data={rows} columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name','region','status','vcpus'].includes(c.key))} getRowId={(r) => r.id} pageSize={6} search={false} />
      </div>
    </div>
  ),
}

export const ColumnVisibilityAndExport: Story = {
  parameters: { docs: { description: { story: 'Opt in with `showColumnControl` + `showExport`. The "Columns" menu hides/shows columns (start with three already hidden); "Export CSV" downloads the *filtered & sorted* rows with the *visible* columns.' } } },
  render: () => (
    <div style={{ width: 880 }}>
      <NxTable<Instance>
        data={rows}
        columns={cols({ pinName: null, pinOwner: null }).map((c) => ({ ...c, hidden: ['memGb', 'cpuPct', 'created'].includes(c.key) }))}
        getRowId={(r) => r.id}
        pageSize={12}
        showColumnControl
        showExport
      />
    </div>
  ),
}

export const Pagination: Story = {
  parameters: { docs: { description: { story: 'Footer shows the range, total, page-size picker, and prev/next. Page resets when filters/search shrink the result set.' } } },
  render: () => (
    <div style={{ width: 820 }}>
      <NxTable<Instance>
        data={rows}
        columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name', 'region', 'status', 'vcpus', 'owner'].includes(c.key))}
        getRowId={(r) => r.id}
        search={false}
        pageSize={8}
        pageSizeOptions={[8, 16, 24]}
      />
    </div>
  ),
}

export const Persisted: Story = {
  parameters: { docs: { description: { story: 'With `persistKey`, sort / column filters / density / page size / hidden columns / column widths are written to `localStorage` and restored on remount. Change something, refresh the iframe — it sticks.' } } },
  render: () => (
    <div style={{ width: 880 }}>
      <NxTable<Instance>
        data={rows}
        columns={cols({ pinName: 'left', pinOwner: null })}
        getRowId={(r) => r.id}
        density="compact"
        pageSize={15}
        persistKey="nxtable-demo"
      />
      <p className="text-xs text-text-dim mt-2">Persisted under <code>localStorage["nxtable:nxtable-demo"]</code>.</p>
    </div>
  ),
}

export const CustomCellRenderers: Story = {
  parameters: { docs: { description: { story: 'Per-column `render` for fully custom cells, and `formatter` so search / sort / CSV still see plain text. Here `name` becomes a link-ish chip and `status` an icon + label.' } } },
  render: () => {
    const customCols: NxColumn<Instance>[] = [
      {
        key: 'name', label: 'Instance', width: 200, sortable: true, filterable: true, filterKind: 'text',
        render: (v) => <span className="font-mono text-accent-ink">{String(v)}</span>,
        formatter: (v) => String(v),
      },
      {
        key: 'status', label: 'Status', width: 140, sortable: true, filterable: true, filterKind: 'select', options: STATUSES,
        render: (v) => {
          const s = String(v)
          const tone = s === 'running' ? 'ok' : s === 'degraded' || s === 'stopped' ? 'warn' : 'err'
          return <span className="inline-flex items-center gap-1.5"><span className={`w-1.5 h-1.5 rounded-full bg-${tone}`} /><Pill size="xs" tone={tone as 'ok' | 'warn' | 'err'}>{s}</Pill></span>
        },
        formatter: (v) => String(v),
      },
      { key: 'cpuPct', label: 'CPU', type: 'bar', width: 180, sortable: true, barMax: 100 },
      {
        key: 'monthlyCost', label: 'Cost / mo', width: 140, align: 'right', sortable: true, filterable: true, filterKind: 'range',
        render: (v) => <span className={`tabular-nums ${Number(v) > 300 ? 'text-warn' : ''}`}>${(Number(v) || 0).toFixed(2)}</span>,
        formatter: (v) => `$${(Number(v) || 0).toFixed(2)}`,
      },
      { key: 'owner', label: 'Owner', width: 120, sortable: true, render: (v) => <>@{String(v)}</>, formatter: (v) => `@${v}` },
    ]
    return (
      <div style={{ width: 800 }}>
        <NxTable<Instance>
          data={rows}
          columns={customCols}
          getRowId={(r) => r.id}
          pageSize={10}
        />
      </div>
    )
  },
}

export const EmptyAndFiltered: Story = {
  parameters: { docs: { description: { story: 'Custom `emptyState`. The right-hand table starts with no data; the left starts with rows but a filter that matches nothing — both fall through to the empty slot.' } } },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <div style={{ width: 420 }}>
        <div className="text-xs text-text-dim mb-1">no data</div>
        <NxTable<Instance>
          data={[]}
          columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name', 'region', 'status'].includes(c.key))}
          getRowId={(r) => r.id}
          showToolbar={false}
          paginate={false}
          emptyState={<div className="text-text-dim">No instances yet. <span className="text-accent-ink underline cursor-pointer">Launch one →</span></div>}
        />
      </div>
      <div style={{ width: 420 }}>
        <div className="text-xs text-text-dim mb-1">data + a no-match filter (open the Region funnel)</div>
        <NxTable<Instance>
          data={fewRows}
          columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name', 'region', 'status'].includes(c.key))}
          getRowId={(r) => r.id}
          search={false}
          paginate={false}
          emptyState="Nothing matches these filters."
        />
      </div>
    </div>
  ),
}

export const ColumnManagerDialog: Story = {
  parameters: { docs: { description: { story: 'Set `columnManager="dialog"` and the toolbar "Columns" button opens a `Transfer` dialog: show/hide, **drag to reorder**, and drag into the "Frozen" group (= pin left, max 3). Order / visibility / pinning are tracked internally (and persisted with `persistKey`).' } } },
  render: () => (
    <div style={{ width: 980 }}>
      <NxTable<Instance>
        data={rows}
        columns={cols({ pinName: 'left', pinOwner: null })}
        getRowId={(r) => r.id}
        showColumnControl
        columnManager="dialog"
        pageSize={12}
        persistKey="nxtable-colmgr-demo"
      />
      <p className="text-xs text-text-dim mt-2">Click <strong>Columns</strong> in the toolbar. UI state persists to <code>localStorage["nxtable:nxtable-colmgr-demo"]</code>.</p>
    </div>
  ),
}

export const FillHeight: Story = {
  parameters: { docs: { description: { story: '`fillHeight` makes the toolbar pin to the top, pagination to the bottom, and the body scroll internally to fill the parent\'s height — the typical full-screen list-page layout. The parent must give NxTable a height (here a fixed-height flex column; in an app it\'d be `flex: 1` of the page shell with `min-height: 0`).' } } },
  render: () => (
    <div style={{ height: 460, display: 'flex', flexDirection: 'column', minHeight: 0, width: 920, border: '1px dashed var(--color-line)', padding: 8, borderRadius: 8 }}>
      <div className="text-xs text-text-dim mb-2 shrink-0">↓ a fixed-height flex column; NxTable below gets <code>flex: 1</code></div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <NxTable<Instance>
          data={rows}
          columns={cols()}
          getRowId={(r) => r.id}
          fillHeight
          className="flex-1"
          selectable="multi"
          pageSize={50}
          bulkActions={(p) => <Button size="xs" intent="danger">Terminate {p.length}</Button>}
        />
      </div>
    </div>
  ),
}

export const FillViewport: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: { description: { story: 'NxTable filling **100vh × 100vw** of the Storybook canvas — resize the browser window and the table layout adapts: scroll area grows/shrinks vertically (more/fewer rows visible), horizontal scrollbar appears when total column width exceeds the viewport, sticky header/columns stay anchored. The page shell here is the typical app layout: a flex column with a top app bar, then a `flex: 1` body that hosts the table with `fillHeight`.' } },
  },
  render: () => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <header style={{ height: 48, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-accent)', color: 'white', flexShrink: 0 }}>
        <strong>App bar</strong>
        <span className="text-xs opacity-80">Resize the browser — the table below adapts</span>
      </header>
      <div style={{ flex: 1, minHeight: 0, padding: 16, display: 'flex' }}>
        <NxTable<Instance>
          data={rows}
          columns={cols()}
          getRowId={(r) => r.id}
          fillHeight
          className="flex-1"
          selectable="multi"
          showColumnControl
          showExport
          pageSize={100}
          renderExpanded={(r) => <ExpandedDetail r={r} />}
          bulkActions={(p) => (
            <>
              <Button size="xs" intent="ghost">Restart {p.length}</Button>
              <Button size="xs" intent="danger">Terminate {p.length}</Button>
            </>
          )}
          rowActions={(r) => <KebabBtn name={r.name} />}
        />
      </div>
    </div>
  ),
}

export const StrictModeWithSelectFilter: Story = {
  parameters: { docs: { description: { story: 'Regression guard for the "Maximum update depth exceeded" loop: rendered under `<StrictMode>` (double-mount), inside a `flex` height-constrained container, with a `filterKind: "select"` column and a non-memoized `columns` array — i.e. the exact host conditions that used to trip the loop in `Select`\'s positioning effect. Open the Status / Region funnels — no console spam.' } } },
  render: () => (
    <StrictMode>
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', minHeight: 0, width: 880 }}>
        <NxTable<Instance>
          data={rows}
          // Intentionally a fresh array every render — host code commonly does this.
          columns={[
            { key: 'name', label: 'Instance', type: 'text', width: 180, sortable: true, filterable: true, filterKind: 'text' },
            { key: 'region', label: 'Region', type: 'text', width: 150, sortable: true, filterable: true, filterKind: 'select', options: REGIONS },
            { key: 'status', label: 'Status', type: 'status', width: 120, sortable: true, filterable: true, filterKind: 'select', options: STATUSES },
            { key: 'vcpus', label: 'vCPUs', type: 'number', width: 100, align: 'right', sortable: true, filterable: true, filterKind: 'range' },
            { key: 'monthlyCost', label: 'Monthly cost', type: 'money', width: 150, align: 'right', sortable: true },
          ]}
          getRowId={(r) => String(r.id)}
          fillHeight
          className="flex-1"
          paginate
          persistKey="nxtable-strict-demo"
        />
      </div>
    </StrictMode>
  ),
}

/* -------------------------------------------------------------------------- */
/* Async / loading                                                             */
/* -------------------------------------------------------------------------- */

export const Loading: Story = {
  parameters: { docs: { description: { story: '`loading` shows a centered spinner when there\'s no data yet, and a dimmed overlay (with a small "Loading…" chip) when there already are rows on screen — toggle the button.' } } },
  render: () => {
    const [loading, setLoading] = useState(true)
    const [shown, setShown] = useState<Instance[]>([])
    useEffect(() => {
      const t = setTimeout(() => { setShown(rows.slice(0, 12)); setLoading(false) }, 1200)
      return () => clearTimeout(t)
    }, [])
    return (
      <div style={{ width: 880, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button size="sm" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1200) }}>Refresh (1.2s)</Button>
        <NxTable<Instance>
          data={shown}
          columns={cols({ pinName: null, pinOwner: null })}
          getRowId={(r) => r.id}
          loading={loading}
          paginate={false}
          showToolbar={false}
        />
      </div>
    )
  },
}

/* -------------------------------------------------------------------------- */
/* Server-side: controlled page + manual sort/filter + totalRows               */
/* -------------------------------------------------------------------------- */

export const ServerSide: Story = {
  parameters: { docs: { description: { story: 'Server-style: `data` holds only the current page, `totalRows` is the grand total, `page`/`onPageChange` are controlled, and `manualSort`/`manualFilter` mean NxTable just *reports* intent. With `manualFilter` set, the search box defaults to **`searchMode="submit"`** — it keeps a draft and only fires `onSearchChange` on Enter / blur / clicking the magnifier (no refetch per keystroke). The "fetch" here is `setTimeout` — watch the spinner only flash when you submit, not while typing.' } } },
  render: () => {
    const PAGE = 10
    const [page, setPage] = useState(0)
    const [sort, setSort] = useState<NxSortState | null>({ key: 'name', dir: 'asc' })
    const [filters, setFilters] = useState<Record<string, string>>({})
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [pageRows, setPageRows] = useState<Instance[]>([])
    const [total, setTotal] = useState(0)

    // "Server query": search → filter → sort → slice. Memo so the effect deps are stable.
    const result = useMemo(() => {
      let r = rows
      if (query) {
        const n = query.toLowerCase()
        r = r.filter((x) => Object.values(x).some((v) => String(v).toLowerCase().includes(n)))
      }
      for (const [k, v] of Object.entries(filters)) {
        if (!v) continue
        r = r.filter((x) => String((x as Record<string, unknown>)[k]) === v)
      }
      if (sort) {
        const dir = sort.dir === 'asc' ? 1 : -1
        r = [...r].sort((a, b) => String((a as Record<string, unknown>)[sort.key]).localeCompare(String((b as Record<string, unknown>)[sort.key])) * dir
          || (Number((a as Record<string, unknown>)[sort.key]) - Number((b as Record<string, unknown>)[sort.key])) * dir)
      }
      return { total: r.length, slice: r.slice(page * PAGE, page * PAGE + PAGE) }
    }, [page, sort, filters, query])

    useEffect(() => {
      setLoading(true)
      const t = setTimeout(() => { setPageRows(result.slice); setTotal(result.total); setLoading(false) }, 500)
      return () => clearTimeout(t)
    }, [result])

    return (
      <div style={{ width: 880 }}>
        <NxTable<Instance>
          data={pageRows}
          columns={cols({ pinName: null, pinOwner: null }).filter((c) => c.key !== 'cpuPct' && c.key !== 'created')}
          getRowId={(r) => r.id}
          totalRows={total}
          page={page}
          onPageChange={setPage}
          pageSize={PAGE}
          manualSort
          sort={sort}
          onSortChange={(s) => { setSort(s); setPage(0) }}
          manualFilter
          onFilterChange={(f) => { setFilters(f); setPage(0) }}
          searchQuery={query}
          onSearchChange={(qq) => { setQuery(qq); setPage(0) }}
          loading={loading}
        />
        <p className="text-xs text-text-dim mt-2">page {page + 1} · total {total} · q "{query}" · sort {sort ? `${sort.key} ${sort.dir}` : 'none'} · filters {JSON.stringify(filters)}</p>
      </div>
    )
  },
}

export const SearchModes: Story = {
  parameters: { docs: { description: { story: '`searchMode="live"` (default for client-side) filters on every keystroke. `searchMode="submit"` keeps a draft and only applies on Enter / blur / clicking the magnifier — the right choice when the search hits a server. (With `manualFilter` set, `submit` is the implicit default.)' } } },
  render: () => {
    const [liveQ, setLiveQ] = useState('')
    const [submitQ, setSubmitQ] = useState('')
    return (
      <div style={{ width: 880, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div className="text-xs uppercase tracking-[0.05em] text-text-dim mb-1"><code>searchMode="live"</code> — filters as you type · applied q: "{liveQ}"</div>
          <NxTable<Instance>
            data={rows}
            columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name','region','status','vcpus'].includes(c.key))}
            getRowId={(r) => r.id}
            pageSize={6}
            searchMode="live"
            onSearchChange={setLiveQ}
          />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.05em] text-text-dim mb-1"><code>searchMode="submit"</code> — type, then press Enter (or blur / click 🔍) · applied q: "{submitQ}"</div>
          <NxTable<Instance>
            data={rows}
            columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name','region','status','vcpus'].includes(c.key))}
            getRowId={(r) => r.id}
            pageSize={6}
            searchMode="submit"
            onSearchChange={setSubmitQ}
          />
        </div>
      </div>
    )
  },
}

/* -------------------------------------------------------------------------- */
/* Controlled expanded rows                                                     */
/* -------------------------------------------------------------------------- */

export const ControlledExpanded: Story = {
  parameters: { docs: { description: { story: '`expandedIds` / `onExpandedChange` give external control over which rows are open — here with "Expand all" / "Collapse all" buttons. `isRowExpandable` hides the caret for `stopped` instances.' } } },
  render: () => {
    const visible = rows.slice(0, 10)
    const [open, setOpen] = useState<string[]>([visible[1].id])
    return (
      <div style={{ width: 880, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="flex gap-2">
          <Button size="xs" onClick={() => setOpen(visible.filter((r) => r.status !== 'stopped').map((r) => r.id))}>Expand all</Button>
          <Button size="xs" intent="ghost" onClick={() => setOpen([])}>Collapse all</Button>
        </div>
        <NxTable<Instance>
          data={visible}
          columns={cols({ pinName: null, pinOwner: null }).filter((c) => c.key !== 'cpuPct')}
          getRowId={(r) => r.id}
          paginate={false}
          showToolbar={false}
          expandedIds={open}
          onExpandedChange={setOpen}
          isRowExpandable={(r) => r.status !== 'stopped'}
          renderExpanded={(r) => <ExpandedDetail r={r} />}
        />
        <p className="text-xs text-text-dim">open: {open.join(', ') || '(none)'}</p>
      </div>
    )
  },
}

/* -------------------------------------------------------------------------- */
/* Per-row state: disabled / not-selectable / rowClassName                      */
/* -------------------------------------------------------------------------- */

export const RowStates: Story = {
  parameters: { docs: { description: { story: '`isRowDisabled` greys a row and blocks its click/select; `isRowSelectable` keeps a row clickable but disables only its checkbox (and excludes it from "select all"); `rowClassName` adds per-row classes (here a left accent border for `error` rows).' } } },
  render: () => {
    const [sel, setSel] = useState<string[]>([])
    const visible = rows.slice(0, 12)
    return (
      <div style={{ width: 880, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <NxTable<Instance>
          data={visible}
          columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name', 'region', 'status', 'vcpus', 'monthlyCost'].includes(c.key))}
          getRowId={(r) => r.id}
          selectable="multi"
          selectedIds={sel}
          onSelectionChange={setSel}
          paginate={false}
          showToolbar={false}
          onRowClick={(r) => alert(`Clicked ${r.name}`)}
          isRowDisabled={(r) => r.status === 'stopped'}
          isRowSelectable={(r) => r.status !== 'error'}
          rowClassName={(r) => (r.status === 'error' ? 'shadow-[inset_3px_0_0_var(--color-err)]' : undefined)}
        />
        <p className="text-xs text-text-dim">stopped rows are disabled · error rows aren\'t selectable · error rows have a red edge · selected: {sel.length}</p>
      </div>
    )
  },
}

/* -------------------------------------------------------------------------- */
/* Zebra stripes                                                                */
/* -------------------------------------------------------------------------- */

export const Zebra: Story = {
  parameters: { docs: { description: { story: '`zebra` alternates row backgrounds — easier to track wide rows.' } } },
  render: () => (
    <div style={{ width: 880 }}>
      <NxTable<Instance>
        data={rows}
        columns={cols({ pinName: null, pinOwner: null })}
        getRowId={(r) => r.id}
        zebra
        pageSize={12}
      />
    </div>
  ),
}

/* -------------------------------------------------------------------------- */
/* Summary / footer row                                                         */
/* -------------------------------------------------------------------------- */

export const SummaryRow: Story = {
  parameters: { docs: { description: { story: '`summary` renders a sticky footer row below the body — totals, counts, anything. It receives the rows currently in view (the current page).' } } },
  render: () => (
    <div style={{ width: 880 }}>
      <NxTable<Instance>
        data={rows}
        columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name', 'region', 'status', 'vcpus', 'memGb', 'monthlyCost'].includes(c.key))}
        getRowId={(r) => r.id}
        pageSize={10}
        summary={(view) => {
          const cpu = view.reduce((a, r) => a + r.vcpus, 0)
          const mem = view.reduce((a, r) => a + r.memGb, 0)
          const cost = view.reduce((a, r) => a + r.monthlyCost, 0)
          return (
            <div className="flex items-center gap-6 text-xs">
              <span className="text-text-muted">{view.length} rows on this page</span>
              <span className="ml-auto">Σ vCPUs <strong className="tabular-nums">{cpu}</strong></span>
              <span>Σ Memory <strong className="tabular-nums">{mem} GB</strong></span>
              <span>Σ Cost <strong className="tabular-nums">${cost.toFixed(2)}</strong></span>
            </div>
          )
        }}
      />
    </div>
  ),
}

/* -------------------------------------------------------------------------- */
/* Sticky header below a fixed app bar                                          */
/* -------------------------------------------------------------------------- */

export const StickyHeaderOffset: Story = {
  parameters: { docs: { description: { story: 'When NxTable sits below a fixed app bar, pass `stickyHeaderOffset` so the sticky header parks below it instead of under it. Scroll the table — the header stops at 48px from the top of the scroll area.' } } },
  render: () => (
    <div style={{ width: 880, height: 360, overflow: 'auto', position: 'relative', border: '1px solid var(--color-line)', borderRadius: 8 }}>
      <div style={{ position: 'sticky', top: 0, height: 48, zIndex: 50, background: 'var(--color-accent)', color: 'white', display: 'flex', alignItems: 'center', padding: '0 16px', fontWeight: 600 }}>
        Fixed app bar (48px)
      </div>
      <NxTable<Instance>
        data={rows}
        columns={cols({ pinName: 'left', pinOwner: null })}
        getRowId={(r) => r.id}
        stickyHeaderOffset={48}
        paginate={false}
        showToolbar={false}
      />
    </div>
  ),
}

/* -------------------------------------------------------------------------- */
/* Custom column sort comparator                                                */
/* -------------------------------------------------------------------------- */

export const CustomSortFn: Story = {
  parameters: { docs: { description: { story: '`column.sortFn` overrides the type-based sort. Here `name` sorts by the *numeric suffix* (api-9 before api-58), not lexically.' } } },
  render: () => (
    <div style={{ width: 760 }}>
      <NxTable<Instance>
        data={rows.slice(0, 12)}
        columns={[
          {
            key: 'name', label: 'Instance (sorts by #)', type: 'text', width: 220, sortable: true,
            sortFn: (a, b) => {
              const n = (s: unknown) => Number(String(s).match(/\d+$/)?.[0] ?? 0)
              return n(a) - n(b)
            },
          },
          ...cols({ pinName: null, pinOwner: null }).filter((c) => ['region', 'status', 'vcpus'].includes(c.key)),
        ]}
        getRowId={(r) => r.id}
        paginate={false}
        showToolbar={false}
      />
    </div>
  ),
}

/* -------------------------------------------------------------------------- */
/* Row context (right-click) menu                                              */
/* -------------------------------------------------------------------------- */

const I_COPY = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
const I_VIEW = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
const I_RESTART = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" /></svg>
const I_TRASH = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>

export const RowContextMenu: Story = {
  parameters: { docs: { description: { story: 'Right-click any row → `rowContextMenu(row, ctx)` renders a `useContextMenu` surface (built from `PopoverItem` / `PopoverSeparator`). `ctx` carries `{ selected, selection }` so the menu can act on the right-clicked row or the whole selection. With `selectOnContextMenu`, right-clicking an un-selected row selects it first (file-manager behaviour) — try right-clicking around with some rows already checked.' } } },
  render: () => {
    const [sel, setSel] = useState<string[]>([])
    const [log, setLog] = useState<string>('(right-click a row)')
    return (
      <div style={{ width: 920, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <NxTable<Instance>
          data={rows}
          columns={cols({ pinName: null, pinOwner: null }).filter((c) => ['name','region','status','vcpus','monthlyCost'].includes(c.key))}
          getRowId={(r) => r.id}
          selectable="multi"
          selectedIds={sel}
          onSelectionChange={setSel}
          selectOnContextMenu
          pageSize={10}
          rowContextMenu={(row, ctx) => (
            <>
              <PopoverItem icon={I_COPY} onClick={() => { void navigator.clipboard?.writeText(row.id); setLog(`Copied id ${row.id}`) }}>Copy ID</PopoverItem>
              <PopoverItem icon={I_VIEW} onClick={() => setLog(`Open ${row.name}`)}>View details</PopoverItem>
              <PopoverSeparator />
              <PopoverItem icon={I_RESTART} onClick={() => setLog(ctx.selection.length > 1 ? `Restart ${ctx.selection.length} selected` : `Restart ${row.name}`)}>
                {ctx.selection.length > 1 ? `Restart ${ctx.selection.length} selected` : 'Restart'}
              </PopoverItem>
              <PopoverSeparator />
              <PopoverItem icon={I_TRASH} danger onClick={() => setLog(ctx.selection.length > 1 ? `Terminate ${ctx.selection.length} selected` : `Terminate ${row.name}`)}>
                {ctx.selection.length > 1 ? `Terminate ${ctx.selection.length} selected` : 'Terminate'}
              </PopoverItem>
            </>
          )}
        />
        <p className="text-xs text-text-dim">last action: <strong>{log}</strong> · selected: {sel.length}</p>
      </div>
    )
  },
}

/* -------------------------------------------------------------------------- */
/* Inline cell editing                                                         */
/* -------------------------------------------------------------------------- */

const PRIORITY_OPTS = [
  { value: 'highest', label: <Pill size="xs" tone="err">Highest</Pill> },
  { value: 'higher',  label: <Pill size="xs" tone="warn">Higher</Pill> },
  { value: 'normal',  label: <Pill size="xs" tone="warn">Normal</Pill> },
  { value: 'lower',   label: <Pill size="xs" tone="info">Lower</Pill> },
  { value: 'lowest',  label: <Pill size="xs" tone="ok">Lowest</Pill> },
]
const PRIORITY_TONE: Record<string, 'err' | 'warn' | 'info' | 'ok'> = {
  highest: 'err', higher: 'warn', normal: 'warn', lower: 'info', lowest: 'ok',
}

type Story2 = {
  id: string
  title: string
  status: 'open' | 'in_progress' | 'done' | 'closed'
  priority: 'highest' | 'higher' | 'normal' | 'lower' | 'lowest'
  owner: string
  points: number
  due: string
}

const STORY_ROWS: Story2[] = Array.from({ length: 16 }, (_, i) => {
  const r = (k: number) => (i * 2654435761 + k * 40503) % 997
  return {
    id: `DEMO-${54 - i}`,
    title: ['Discount management', 'Product inventory management', 'Product details management', 'User role permission management', 'User auditing', 'User query', 'Apply for after-sales', 'View shipping information', 'Alipay payment', 'WeChat payment'][r(1) % 10],
    status: (['open', 'in_progress', 'done', 'closed'] as const)[r(2) % 4],
    priority: (['highest', 'higher', 'normal', 'lower', 'lowest'] as const)[r(3) % 5],
    owner: ['', 'alex', 'bri', 'cal', 'dee'][r(4) % 5],
    points: [1, 2, 3, 5, 8][r(5) % 5],
    due: new Date(2026, 0, 1 + (r(6) % 90)).toISOString().slice(0, 10),
  }
})

export const InlineCellEditing: Story = {
  parameters: { docs: { description: { story: 'Click an editable cell to edit it in place. `NxColumn.editable` supports built-in `text` / `number` / `select` / `date` editors (Title / Points / Priority+Status / Due), or a custom `render` (the Owner column uses a tiny "people picker"-style menu). Enter / blur commits, Esc cancels, the select editor commits on change. `onCellEdit(row, key, value)` fires — wire it to update your data. `editable` can be a function for per-row control (here `closed` rows can\'t be edited).' } } },
  render: () => {
    const [data, setData] = useState<Story2[]>(STORY_ROWS)
    const [log, setLog] = useState('(edit a cell)')
    const set = (id: string, key: keyof Story2, value: unknown) => {
      setData((d) => d.map((r) => r.id === id ? { ...r, [key]: value } : r))
      setLog(`${id}.${key} = ${JSON.stringify(value)}`)
    }
    return (
      <div style={{ width: 940, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <NxTable<Story2>
          data={data}
          getRowId={(r) => r.id}
          pageSize={10}
          isRowDisabled={(r) => r.status === 'closed'}
          onCellEdit={(row, key, value) => set(row.id, key as keyof Story2, value)}
          columns={[
            { key: 'id', label: '编号', width: 110 },
            { key: 'title', label: '标题', width: 280, editable: { type: 'text' } },
            {
              key: 'status', label: '状态', width: 130,
              render: (v) => {
                const s = String(v)
                const tone = s === 'done' ? 'ok' : s === 'closed' ? 'neutral' : s === 'in_progress' ? 'warn' : 'info'
                const txt = s === 'done' ? '已完成' : s === 'closed' ? '关闭' : s === 'in_progress' ? '进行中' : '打开'
                return <Pill size="xs" tone={tone as 'ok' | 'neutral' | 'warn' | 'info'}>{txt}</Pill>
              },
              formatter: (v) => String(v),
              editable: { type: 'select', options: [
                { value: 'open', label: '打开' },
                { value: 'in_progress', label: '进行中' },
                { value: 'done', label: '已完成' },
                { value: 'closed', label: '关闭' },
              ]},
            },
            {
              key: 'priority', label: '优先级', width: 130,
              render: (v) => <Pill size="xs" tone={PRIORITY_TONE[String(v)] ?? 'neutral'}>{String(v)}</Pill>,
              formatter: (v) => String(v),
              editable: { type: 'select', options: PRIORITY_OPTS },
            },
            {
              key: 'owner', label: '负责人', width: 160,
              render: (v) => v ? <span>@{String(v)}</span> : <span className="text-text-dim">未指派</span>,
              formatter: (v) => v ? `@${v}` : '',
              // Custom editor — a mini "people picker" menu.
              editable: {
                render: ({ value, commit, cancel }) => (
                  <div className="bg-bg-elev border border-line rounded-md shadow-md p-1 min-w-[160px]" style={{ position: 'relative', zIndex: 50 }}>
                    <div className="text-[10px] uppercase tracking-[0.05em] text-text-dim px-2 py-1">成员</div>
                    {['', 'alex', 'bri', 'cal', 'dee'].map((u) => (
                      <button
                        key={u || '_none'}
                        type="button"
                        className={['flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-xs hover:bg-bg-sunk', u === value ? 'text-accent-ink font-medium' : ''].join(' ')}
                        onClick={() => commit(u)}
                      >
                        {u ? <span className="w-4 h-4 rounded-full grid place-items-center text-[9px] font-semibold bg-accent-weak text-accent-ink">{u[0].toUpperCase()}</span> : <span className="w-4 h-4" />}
                        {u ? `@${u}` : '未指派'}
                      </button>
                    ))}
                    <button type="button" className="text-xs text-text-dim hover:text-text px-2 py-1" onMouseDown={(e) => e.preventDefault()} onClick={cancel}>取消</button>
                  </div>
                ),
              },
            },
            { key: 'points', label: '故事点', width: 90, align: 'right', editable: { type: 'number' } },
            { key: 'due', label: '截止', type: 'date', width: 140, editable: { type: 'date' } },
          ]}
        />
        <p className="text-xs text-text-dim">last edit: <strong>{log}</strong> · <code>closed</code> rows are read-only</p>
      </div>
    )
  },
}

/* -------------------------------------------------------------------------- */
/* Hover-only row actions (the PingCode "row reveals ✎ / ⋮ on hover" pattern)  */
/* -------------------------------------------------------------------------- */

const I_PENCIL = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden><path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
const I_KEBAB = <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>

export const RowActionsOnHover: Story = {
  parameters: { docs: { description: { story: '`rowActionsOnHover` + `rowActionsColumn="title"` — the action buttons float **inside the title cell\'s right edge** (PingCode / Linear / Notion pattern), revealed on row hover. They don\'t take a column of their own and they don\'t change row height. Click the title cell directly to edit it inline.' } } },
  render: () => {
    const [data, setData] = useState<Story2[]>(STORY_ROWS)
    return (
      <div style={{ width: 920 }}>
        <NxTable<Story2>
          data={data}
          getRowId={(r) => r.id}
          pageSize={10}
          onCellEdit={(row, key, value) => setData((d) => d.map((r) => r.id === row.id ? { ...r, [key]: value } : r))}
          columns={[
            { key: 'id', label: '编号', width: 110 },
            { key: 'title', label: '标题', width: 360, editable: { type: 'text' } },
            {
              key: 'status', label: '状态', width: 130,
              render: (v) => {
                const s = String(v)
                const tone = s === 'done' ? 'ok' : s === 'closed' ? 'neutral' : s === 'in_progress' ? 'warn' : 'info'
                const txt = s === 'done' ? '已完成' : s === 'closed' ? '关闭' : s === 'in_progress' ? '进行中' : '打开'
                return <Pill size="xs" tone={tone as 'ok' | 'neutral' | 'warn' | 'info'}>{txt}</Pill>
              },
              formatter: (v) => String(v),
            },
            { key: 'owner', label: '负责人', width: 130, render: (v) => v ? <span>@{String(v)}</span> : <span className="text-text-dim">未指派</span>, formatter: (v) => v ? `@${v}` : '' },
            { key: 'due', label: '截止', type: 'date', width: 140 },
          ]}
          rowActionsOnHover
          rowActionsColumn="title"
          rowActions={(r) => (
            <span className="inline-flex items-center gap-1">
              <button
                type="button"
                aria-label={`Edit ${r.id}`}
                className="inline-grid place-items-center w-6 h-6 rounded-xs text-text-dim hover:text-text hover:bg-bg-sunk"
                title="编辑"
                onClick={() => alert(`Edit ${r.id}`)}
              >
                {I_PENCIL}
              </button>
              <button
                type="button"
                aria-label={`More for ${r.id}`}
                className="inline-grid place-items-center w-6 h-6 rounded-xs text-text-dim hover:text-text hover:bg-bg-sunk"
                title="更多"
                onClick={() => alert(`More for ${r.id}`)}
              >
                {I_KEBAB}
              </button>
            </span>
          )}
        />
        <p className="text-xs text-text-dim mt-2">Hover any row to reveal the action buttons · click the title cell to edit it inline</p>
      </div>
    )
  },
}
