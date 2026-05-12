import { useState } from 'react'
import {
  NxTable,
  type NxColumn,
  type NxSortState,
  type NxRowReorderEvent,
  Button,
  Pill,
  Table,
  Banner,
} from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

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
const rows = makeRows(120)
const fewRows = makeRows(8)

function baseCols(pinName: 'left' | null = 'left', pinOwner: 'right' | null = 'right'): NxColumn<Instance>[] {
  return [
    { key: 'name', label: 'Instance', type: 'text', width: 180, pinned: pinName, sortable: true, filterable: true, filterKind: 'text' },
    { key: 'region', label: 'Region', type: 'text', width: 150, sortable: true, filterable: true, filterKind: 'select', options: REGIONS },
    { key: 'status', label: 'Status', type: 'status', width: 110, sortable: true, filterable: true, filterKind: 'select', options: STATUSES },
    { key: 'vcpus', label: 'vCPUs', type: 'number', width: 90, align: 'right', sortable: true, filterable: true, filterKind: 'range' },
    { key: 'memGb', label: 'Memory (GB)', type: 'number', width: 120, align: 'right', sortable: true, filterable: true, filterKind: 'range' },
    { key: 'cpuPct', label: 'CPU', type: 'bar', width: 160, sortable: true },
    { key: 'monthlyCost', label: 'Monthly cost', type: 'money', width: 140, align: 'right', sortable: true, filterable: true, filterKind: 'range' },
    { key: 'created', label: 'Created', type: 'date', width: 160, sortable: true },
    { key: 'owner', label: 'Owner', type: 'text', width: 110, sortable: true, filterable: true, filterKind: 'text', pinned: pinOwner },
  ]
}
const pick = (cols: NxColumn<Instance>[], keys: string[]) => cols.filter((c) => keys.includes(c.key))

const ExpandedDetail = ({ r }: { r: Instance }) => (
  <div style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 32px' }}>
    <div>ID: <code>{r.id}</code></div>
    <div>Owner: @{r.owner}</div>
    <div>vCPUs / Mem: {r.vcpus} / {r.memGb} GB</div>
    <div>Created: {new Date(r.created).toLocaleString()}</div>
  </div>
)

/* -------------------------------------------------------------------------- */
/* Demos                                                                       */
/* -------------------------------------------------------------------------- */

function MinimalNxDemo() {
  return (
    <div style={{ width: 720 }}>
      <NxTable<Instance>
        data={fewRows}
        columns={pick(baseCols(null, null), ['name', 'region', 'status', 'vcpus', 'monthlyCost'])}
        getRowId={(r) => r.id}
        showToolbar={false}
        paginate={false}
      />
    </div>
  )
}

function SearchSortFilterNxDemo() {
  return (
    <div style={{ width: 880 }}>
      <NxTable<Instance>
        data={rows}
        columns={pick(baseCols(null, null), ['name', 'region', 'status', 'vcpus', 'memGb', 'monthlyCost', 'owner'])}
        getRowId={(r) => r.id}
        pageSize={8}
      />
    </div>
  )
}

function PinnedNxDemo() {
  return (
    <div style={{ width: 560 }}>
      <NxTable<Instance>
        data={fewRows}
        columns={baseCols('left', 'right')}
        getRowId={(r) => r.id}
        showToolbar={false}
        paginate={false}
      />
    </div>
  )
}

function SelectionNxDemo() {
  const [sel, setSel] = useState<string[]>(['i-0001', 'i-0003'])
  return (
    <div style={{ width: 880 }}>
      <NxTable<Instance>
        data={rows}
        columns={pick(baseCols(null, null), ['name', 'region', 'status', 'vcpus', 'monthlyCost'])}
        getRowId={(r) => r.id}
        selectable="multi"
        selectedIds={sel}
        onSelectionChange={setSel}
        pageSize={8}
        bulkActions={(picked) => (
          <>
            <Button size="xs" intent="ghost">Restart {picked.length}</Button>
            <Button size="xs" intent="danger">Terminate {picked.length}</Button>
          </>
        )}
        rowActions={(r) => (
          <Button size="xs" intent="ghost" iconOnly aria-label={`Actions for ${r.name}`}>⋯</Button>
        )}
      />
      <p style={{ fontSize: 12, color: 'var(--color-text-dim)', marginTop: 8 }}>
        {sel.length} selected: {sel.join(', ') || '(none)'}
      </p>
    </div>
  )
}

function ExpandableNxDemo() {
  return (
    <div style={{ width: 820 }}>
      <NxTable<Instance>
        data={fewRows}
        columns={pick(baseCols(null, null), ['name', 'region', 'status', 'vcpus', 'monthlyCost'])}
        getRowId={(r) => r.id}
        showToolbar={false}
        paginate={false}
        renderExpanded={(r) => <ExpandedDetail r={r} />}
      />
    </div>
  )
}

function InlineEditNxDemo() {
  const [data, setData] = useState<Instance[]>(() => fewRows.slice(0, 6))
  const [log, setLog] = useState('(click an editable cell)')
  return (
    <div style={{ width: 820, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <NxTable<Instance>
        data={data}
        getRowId={(r) => r.id}
        showToolbar={false}
        paginate={false}
        isRowDisabled={(r) => r.status === 'error'}
        onCellEdit={(row, key, value) => {
          setData((d) => d.map((x) => (x.id === row.id ? { ...x, [key]: value } : x)))
          setLog(`${row.id}.${key} = ${JSON.stringify(value)}`)
        }}
        columns={[
          { key: 'id', label: 'Instance', width: 120 },
          { key: 'region', label: 'Region', width: 160, editable: { type: 'select', options: REGIONS.map((v) => ({ value: v, label: v })) } },
          {
            key: 'status', label: 'Status', width: 130,
            render: (v) => <Pill size="xs" tone={v === 'running' ? 'ok' : v === 'error' ? 'err' : 'warn'}>{String(v)}</Pill>,
            formatter: (v) => String(v),
            editable: { type: 'select', options: ['running', 'stopped', 'error', 'degraded'].map((v) => ({ value: v, label: v })) },
          },
          { key: 'vcpus', label: 'vCPUs', width: 90, align: 'right', editable: { type: 'number' } },
          { key: 'owner', label: 'Owner', width: 140, render: (v) => <>@{String(v)}</>, formatter: (v) => `@${v}`, editable: { type: 'text' } },
        ]}
      />
      <p style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>last edit: <strong>{log}</strong> · <code>error</code> rows are read-only</p>
    </div>
  )
}

function RowReorderNxDemo() {
  const [data, setData] = useState<Instance[]>(() => fewRows.slice(0, 6))
  const [last, setLast] = useState('')
  return (
    <div style={{ width: 720, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <NxTable<Instance>
        data={data}
        columns={pick(baseCols('left', null), ['name', 'region', 'status', 'vcpus', 'monthlyCost'])}
        getRowId={(r) => r.id}
        showToolbar={false}
        paginate={false}
        onRowReorder={(e: NxRowReorderEvent<Instance>) => {
          setData((d) => {
            const byId = new Map(d.map((r) => [r.id, r]))
            return e.orderedIds.map((id) => byId.get(id)!).filter(Boolean)
          })
          setLast(`moved ${e.movedId}: #${e.fromIndex} → #${e.toIndex}  (after=${e.beforeId ?? '∅'}, before=${e.afterId ?? '∅'})`)
        }}
      />
      <p style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>order: {data.map((r) => r.id).join(' → ')}</p>
      {last && <p style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>last event: <code>{last}</code></p>}
    </div>
  )
}

function ServerSideNxDemo() {
  const PAGE = 8
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<NxSortState | null>({ key: 'name', dir: 'asc' })
  const [query, setQuery] = useState('')
  // synchronous "server" for the demo — in a real app this is a fetch
  let r = query ? rows.filter((x) => Object.values(x).some((v) => String(v).toLowerCase().includes(query.toLowerCase()))) : rows
  if (sort) {
    const dir = sort.dir === 'asc' ? 1 : -1
    r = [...r].sort((a, b) => String((a as Record<string, unknown>)[sort.key]).localeCompare(String((b as Record<string, unknown>)[sort.key])) * dir)
  }
  const total = r.length
  const pageRows = r.slice(page * PAGE, page * PAGE + PAGE)
  return (
    <div style={{ width: 860, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <NxTable<Instance>
        data={pageRows}
        columns={pick(baseCols(null, null), ['name', 'region', 'status', 'vcpus', 'monthlyCost', 'owner'])}
        getRowId={(r) => r.id}
        totalRows={total}
        page={page}
        onPageChange={setPage}
        pageSize={PAGE}
        manualSort
        sort={sort}
        onSortChange={(s) => { setSort(s); setPage(0) }}
        manualFilter
        searchQuery={query}
        onSearchChange={(qq) => { setQuery(qq); setPage(0) }}
      />
      <p style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>
        page {page + 1} · total {total} · q "{query}" · sort {sort ? `${sort.key} ${sort.dir}` : 'none'}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function NxTablePage() {
  return (
    <article className="page">
      <h1>NxTable</h1>
      <p>
        The enterprise data grid: column resize &amp; pin, sort, per-column filters (text / select /
        range), global search, pagination, multi/single row selection with bulk actions, expandable
        rows, inline cell editing, row drag-reorder, density switch, column show/hide (or a{' '}
        <code>Transfer</code>-powered column-manager dialog), CSV export, sticky footer summary,
        loading overlay, server-side hooks, and optional <code>localStorage</code> persistence —
        all driven by a typed <code>columns</code> array and a <code>getRowId</code> function. It's
        generic over your row type: <code>&lt;NxTable&lt;MyRow&gt; …&gt;</code>.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Any non-trivial list page — resources, work items, users, events — where you want sort /
        filter / select / paginate out of the box. For a static table you style yourself, use the
        thin <code>Table</code> wrapper instead. NxTable does <strong>not</strong> mutate{' '}
        <code>data</code> in the server-side modes (<code>manualSort</code> / <code>manualFilter</code>{' '}
        / <code>manualPagination</code> / <code>onRowReorder</code> / <code>onCellEdit</code>) — it
        reports intent and you update your state.
      </Banner>

      <h2>Minimal</h2>
      <p>
        The smallest useful config — just <code>data</code>, <code>columns</code>, <code>getRowId</code>.
        Column <code>type</code> drives the cell rendering &amp; sort: <code>number</code> /{' '}
        <code>money</code> / <code>date</code> sort by value and right-align nicely;{' '}
        <code>status</code> renders a <code>Pill</code>; <code>bar</code> renders a mini progress
        bar (cap via <code>barMax</code>); <code>text</code> sorts lexically.
      </p>
      <Demo
        code={`const columns: NxColumn<Instance>[] = [
  { key: 'name', label: 'Instance', type: 'text', width: 180 },
  { key: 'region', label: 'Region', type: 'text', width: 150 },
  { key: 'status', label: 'Status', type: 'status', width: 110 },
  { key: 'vcpus', label: 'vCPUs', type: 'number', width: 90, align: 'right' },
  { key: 'monthlyCost', label: 'Monthly cost', type: 'money', width: 140, align: 'right' },
]

<NxTable<Instance>
  data={rows}
  columns={columns}
  getRowId={(r) => r.id}
  showToolbar={false}
  paginate={false}
/>`}
      >
        <MinimalNxDemo />
      </Demo>

      <h2>Search · sort · per-column filters · pagination</h2>
      <p>
        Mark columns <code>sortable</code> (click a header to cycle asc → desc → none) and{' '}
        <code>filterable</code> with a <code>filterKind</code> — <code>'text'</code> ("contains"),{' '}
        <code>'select'</code> (needs <code>options</code>), or <code>'range'</code> (min/max). The
        toolbar search box matches the rendered text of every column; pagination is on by default
        (<code>pageSize</code> / <code>pageSizeOptions</code>) and resets to page 1 as the result
        set shrinks. A "Clear filters" link appears when any column filter is active.
      </p>
      <Demo
        code={`<NxTable<Instance>
  data={rows}
  columns={[
    { key: 'name', label: 'Instance', type: 'text', width: 180, sortable: true, filterable: true, filterKind: 'text' },
    { key: 'region', label: 'Region', type: 'text', width: 150, sortable: true, filterable: true, filterKind: 'select', options: REGIONS },
    { key: 'status', label: 'Status', type: 'status', width: 110, sortable: true, filterable: true, filterKind: 'select', options: STATUSES },
    { key: 'vcpus', label: 'vCPUs', type: 'number', width: 90, align: 'right', sortable: true, filterable: true, filterKind: 'range' },
    { key: 'monthlyCost', label: 'Monthly cost', type: 'money', width: 140, align: 'right', sortable: true, filterable: true, filterKind: 'range' },
  ]}
  getRowId={(r) => r.id}
  pageSize={8}
/>`}
      >
        <SearchSortFilterNxDemo />
      </Demo>

      <h2>Pinned &amp; resizable columns</h2>
      <p>
        <code>pinned: 'left' | 'right'</code> freezes a column while the rest scroll horizontally
        (pin layers stack and sit above the body, and play nicely with the selection / drag-handle
        columns). Drag the right edge of any header to resize — <code>minWidth</code> is respected,
        and <code>onColumnResize</code> / <code>onColumnReorder</code> fire if you want to persist
        widths/order yourself. The narrow viewport here forces the scroll.
      </p>
      <Demo
        code={`<NxTable<Instance>
  data={rows}
  columns={[
    { key: 'name', label: 'Instance', width: 180, pinned: 'left', sortable: true },
    { key: 'region', label: 'Region', width: 150, minWidth: 80 },
    { key: 'status', label: 'Status', type: 'status', width: 110 },
    { key: 'vcpus', label: 'vCPUs', type: 'number', width: 90, align: 'right' },
    { key: 'cpuPct', label: 'CPU', type: 'bar', width: 160 },
    { key: 'monthlyCost', label: 'Monthly cost', type: 'money', width: 140, align: 'right' },
    { key: 'owner', label: 'Owner', width: 110, pinned: 'right' },
  ]}
  getRowId={(r) => r.id}
  showToolbar={false}
  paginate={false}
/>`}
      >
        <PinnedNxDemo />
      </Demo>

      <h2>Selection · bulk actions · row actions</h2>
      <p>
        <code>selectable="multi"</code> adds a checkbox column (header checkbox toggles the current
        page) — <code>"single"</code> swaps it for radios. <code>selectedIds</code> /{' '}
        <code>onSelectionChange</code> control it; <code>isRowSelectable</code> disables a row's
        box. <code>bulkActions(rows)</code> renders an action bar when ≥1 row is selected;{' '}
        <code>rowActions(row)</code> renders a per-row trailing menu (use{' '}
        <code>rowActionsOnHover</code> + <code>rowActionsColumn</code> to float them inside a cell's
        right edge, Linear/PingCode-style). <code>onRowClick</code> handles a plain row click;{' '}
        <code>rowContextMenu</code> wires a right-click menu.
      </p>
      <Demo
        code={`const [sel, setSel] = useState<string[]>([])

<NxTable<Instance>
  data={rows}
  columns={columns}
  getRowId={(r) => r.id}
  selectable="multi"
  selectedIds={sel}
  onSelectionChange={setSel}
  bulkActions={(picked) => <>
    <Button size="xs" intent="ghost">Restart {picked.length}</Button>
    <Button size="xs" intent="danger">Terminate {picked.length}</Button>
  </>}
  rowActions={(r) => <Button size="xs" intent="ghost" iconOnly aria-label={'Actions for ' + r.name}>⋯</Button>}
/>`}
      >
        <SelectionNxDemo />
      </Demo>

      <h2>Expandable rows</h2>
      <p>
        Pass <code>renderExpanded(row)</code> and an expander column appears — clicking the caret
        toggles a panel below the row (clicking the row itself does not). Control it with{' '}
        <code>expandedIds</code> / <code>onExpandedChange</code>; <code>isRowExpandable</code> hides
        the caret per row.
      </p>
      <Demo
        code={`<NxTable<Instance>
  data={rows}
  columns={columns}
  getRowId={(r) => r.id}
  renderExpanded={(r) => <InstanceDetail r={r} />}
/>`}
      >
        <ExpandableNxDemo />
      </Demo>

      <h2>Inline cell editing</h2>
      <p>
        Add <code>editable</code> to a column to make its cells edit-in-place on click. Built-in
        editors: <code>{"{ type: 'text' | 'number' }"}</code>, <code>{"{ type: 'date' }"}</code>,{' '}
        <code>{"{ type: 'select', options: [...] }"}</code> — or supply{' '}
        <code>{"{ render: (args) => ReactNode }"}</code> for a custom editor (<code>args</code>{' '}
        carries <code>value</code>, <code>row</code>, <code>commit(next)</code>,{' '}
        <code>cancel()</code>). Enter / blur commits, Esc cancels, the select editor commits on
        change. Committing fires <code>onCellEdit(row, key, value)</code> — apply it to your data.{' '}
        <code>editable</code> may be a function for per-row control (return <code>false</code> to
        disable a cell); rows flagged by <code>isRowDisabled</code> are never editable.
      </p>
      <Demo
        code={`<NxTable<Instance>
  data={data}
  getRowId={(r) => r.id}
  isRowDisabled={(r) => r.status === 'error'}
  onCellEdit={(row, key, value) =>
    setData((d) => d.map((x) => x.id === row.id ? { ...x, [key]: value } : x))}
  columns={[
    { key: 'id', label: 'Instance', width: 120 },
    { key: 'region', label: 'Region', width: 160, editable: { type: 'select', options: REGIONS.map((v) => ({ value: v, label: v })) } },
    { key: 'status', label: 'Status', width: 130, render: (v) => <Pill size="xs">{String(v)}</Pill>, formatter: (v) => String(v),
      editable: { type: 'select', options: STATUSES.map((v) => ({ value: v, label: v })) } },
    { key: 'vcpus', label: 'vCPUs', width: 90, align: 'right', editable: { type: 'number' } },
    { key: 'owner', label: 'Owner', width: 140, render: (v) => <>@{String(v)}</>, formatter: (v) => '@' + v, editable: { type: 'text' } },
  ]}
/>`}
      >
        <InlineEditNxDemo />
      </Demo>

      <h2>Row drag-reorder</h2>
      <p>
        Pass <code>onRowReorder</code> and a drag-handle column is prepended (powered by{' '}
        <code>@dnd-kit</code> — pointer, touch, and keyboard: focus the handle, Space to pick up,
        arrows to move, Space to drop). The callback gets an <code>NxRowReorderEvent</code>:{' '}
        <code>orderedIds</code> for the new full order to re-render, plus the local move —{' '}
        <code>movedId</code> / <code>movedRow</code> / <code>fromIndex</code> / <code>toIndex</code>{' '}
        / <code>beforeId</code> / <code>afterId</code> — so a backend keyed on a fractional rank /
        LexoRank can persist with a single-row update instead of renumbering. NxTable does not
        reorder <code>data</code> itself. The handle is disabled while a sort is active or when
        pagination splits rows across pages; <code>isRowDraggable</code> can lock individual rows.
      </p>
      <Demo
        code={`<NxTable<Instance>
  data={data}
  columns={columns}
  getRowId={(r) => r.id}
  onRowReorder={(e) => {
    // re-render in the new order…
    setData((d) => {
      const byId = new Map(d.map((r) => [r.id, r]))
      return e.orderedIds.map((id) => byId.get(id)!)
    })
    // …and PATCH only the moved row's rank, derived from its neighbours
    api.patchRank(e.movedId, rankBetween(e.beforeId, e.afterId))
  }}
/>`}
      >
        <RowReorderNxDemo />
      </Demo>

      <h2>Toolbar controls · columns · export · density · persistence</h2>
      <p>
        The toolbar is opt-in beyond search: <code>showColumnControl</code> adds a "Columns" button
        (a checkbox menu, or — with <code>columnManager="dialog"</code> — a <code>Transfer</code>{' '}
        dialog that also reorders &amp; pins columns to a "Frozen" group); <code>showExport</code>{' '}
        adds "Export CSV" (downloads the filtered &amp; sorted rows, visible columns only);{' '}
        <code>showDensityControl</code> adds a local density picker. When every toolbar control is
        off, the bar hides itself. Density (<code>compact</code> / <code>normal</code> /{' '}
        <code>comfy</code>) follows the global <code>ConfigProvider</code> <code>size</code> unless
        you pin it with the <code>density</code> prop. Pass <code>persistKey</code> and sort /
        filters / density / page size / hidden columns / widths / order / pins are written to{' '}
        <code>localStorage["nxtable:&lt;key&gt;"]</code> and restored on remount. Use{' '}
        <code>fillHeight</code> for the full-screen list-page layout (toolbar pinned top, pagination
        pinned bottom, body scrolls internally — the parent must give it a height).
      </p>
      <Demo
        code={`<NxTable<Instance>
  data={rows}
  columns={columns}
  getRowId={(r) => r.id}
  showColumnControl
  columnManager="dialog"     // Transfer-powered column picker (show/hide + reorder + freeze)
  showExport
  showDensityControl
  pageSize={15}
  persistKey="instances"      // localStorage["nxtable:instances"]
  fillHeight                  // full-height list-page layout
/>`}
      >
        <SearchSortFilterNxDemo />
      </Demo>

      <h2>Server-side (manual sort / filter / pagination)</h2>
      <p>
        For backend-driven tables: set <code>totalRows</code> (then <code>data</code> is treated as
        the current page only — implies <code>manualPagination</code>), control{' '}
        <code>page</code> / <code>onPageChange</code>, and turn on <code>manualSort</code> /{' '}
        <code>manualFilter</code> so NxTable just <em>reports</em> intent via{' '}
        <code>onSortChange</code> / <code>onFilterChange</code> / <code>onSearchChange</code>. When{' '}
        <code>manualFilter</code> is set the search box defaults to <code>searchMode="submit"</code>{' '}
        (a draft that only fires on Enter / blur / clicking the magnifier — no refetch per
        keystroke). <code>loading</code> shows a dimmed body + spinner overlay.
      </p>
      <Demo
        code={`<NxTable<Instance>
  data={pageRows}            // just this page
  columns={columns}
  getRowId={(r) => r.id}
  totalRows={total}
  page={page}
  onPageChange={setPage}
  pageSize={20}
  manualSort
  sort={sort}
  onSortChange={(s) => { setSort(s); setPage(0); refetch() }}
  manualFilter
  onFilterChange={(f) => { setFilters(f); setPage(0); refetch() }}
  searchQuery={query}
  onSearchChange={(q) => { setQuery(q); setPage(0); refetch() }}
  loading={loading}
/>`}
      >
        <ServerSideNxDemo />
      </Demo>

      <h2>NxTable API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>data</code></td><td><code>R[]</code></td><td>—</td><td>Rows. In server-side modes, the <em>current page</em> only. Required.</td></tr>
          <tr><td><code>columns</code></td><td><code>NxColumn&lt;R&gt;[]</code></td><td>—</td><td>Column definitions (see below). Required.</td></tr>
          <tr><td><code>getRowId</code></td><td><code>(row: R) =&gt; string</code></td><td>—</td><td>Stable id for each row — used as key and for selection / expansion / reorder. Required.</td></tr>
          <tr><td><code>selectable</code></td><td><code>'multi' | 'single' | false</code></td><td><code>false</code></td><td>Add a checkbox (<code>'multi'</code>) or radio (<code>'single'</code>) column.</td></tr>
          <tr><td><code>selectedIds</code> / <code>onSelectionChange</code></td><td><code>string[]</code> / <code>(ids) =&gt; void</code></td><td>—</td><td>Controlled selection.</td></tr>
          <tr><td><code>isRowSelectable</code></td><td><code>(row: R) =&gt; boolean</code></td><td>—</td><td>Return <code>false</code> to disable a row's checkbox/radio (also excluded from "select all").</td></tr>
          <tr><td><code>density</code></td><td><code>'compact' | 'normal' | 'comfy'</code></td><td>follows <code>ConfigProvider</code></td><td>Pin a row density for this table regardless of the global size.</td></tr>
          <tr><td><code>showDensityControl</code> / <code>showColumnControl</code> / <code>showExport</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Opt-in toolbar controls.</td></tr>
          <tr><td><code>showToolbar</code> / <code>search</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show the toolbar / the global search box. The toolbar auto-hides when every control inside it is off.</td></tr>
          <tr><td><code>searchMode</code></td><td><code>'live' | 'submit'</code></td><td><code>'live'</code> (<code>'submit'</code> when <code>manualFilter</code>)</td><td>Report search on every keystroke vs. only on Enter / blur / magnifier click.</td></tr>
          <tr><td><code>searchQuery</code> / <code>onSearchChange</code></td><td><code>string</code> / <code>(q) =&gt; void</code></td><td>—</td><td>Controlled (applied) global-search query.</td></tr>
          <tr><td><code>zebra</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Striped rows.</td></tr>
          <tr><td><code>persistKey</code></td><td><code>string</code></td><td>—</td><td>Persist UI state (sort / filters / density / page size / hidden cols / widths / order / pins) to <code>localStorage</code> under this key.</td></tr>
          <tr><td><code>paginate</code> / <code>pageSize</code> / <code>pageSizeOptions</code></td><td><code>boolean</code> / <code>number</code> / <code>number[]</code></td><td><code>true</code> / <code>20</code> / <code>[10,20,50,100]</code></td><td>Footer pagination.</td></tr>
          <tr><td><code>page</code> / <code>onPageChange</code> / <code>onPageSizeChange</code></td><td><code>number</code> / <code>(n) =&gt; void</code></td><td>—</td><td>Controlled current page (0-based) / page size.</td></tr>
          <tr><td><code>totalRows</code></td><td><code>number</code></td><td>—</td><td>Grand total for server-side pagination; <code>data</code> is then the current page only. Implies <code>manualPagination</code>.</td></tr>
          <tr><td><code>manualPagination</code> / <code>manualSort</code> / <code>manualFilter</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Don't paginate / sort / filter <code>data</code> internally — only report intent.</td></tr>
          <tr><td><code>sort</code> / <code>onSortChange</code></td><td><code>NxSortState | null</code> / <code>(next) =&gt; void</code></td><td>—</td><td>Controlled sort; click cycles asc → desc → null.</td></tr>
          <tr><td><code>onFilterChange</code></td><td><code>(filters: Record&lt;string,string&gt;) =&gt; void</code></td><td>—</td><td>Fires when per-column filters change (<code>columnKey → value</code>).</td></tr>
          <tr><td><code>renderExpanded</code></td><td><code>(row: R) =&gt; ReactNode</code></td><td>—</td><td>Render an expanded panel below a row (adds an expander column).</td></tr>
          <tr><td><code>expandedIds</code> / <code>onExpandedChange</code> / <code>isRowExpandable</code></td><td><code>string[]</code> / <code>(ids) =&gt; void</code> / <code>(row) =&gt; boolean</code></td><td>—</td><td>Controlled expansion / hide the caret for a row.</td></tr>
          <tr><td><code>rowClassName</code></td><td><code>(row: R) =&gt; string | undefined</code></td><td>—</td><td>Extra class(es) on a row's <code>&lt;tr&gt;</code>.</td></tr>
          <tr><td><code>isRowDisabled</code></td><td><code>(row: R) =&gt; boolean</code></td><td>—</td><td>Grey out a row and make it non-interactive (no click, no select, no edit, no drag).</td></tr>
          <tr><td><code>onRowClick</code></td><td><code>(row: R) =&gt; void</code></td><td>—</td><td>Row click handler.</td></tr>
          <tr><td><code>onCellEdit</code></td><td><code>(row: R, key: string, value: unknown) =&gt; void</code></td><td>—</td><td>Fires when an inline-editable cell commits a new value.</td></tr>
          <tr><td><code>bulkActions</code></td><td><code>(rows: R[]) =&gt; ReactNode</code></td><td>—</td><td>Action bar shown when ≥1 row is selected.</td></tr>
          <tr><td><code>rowActions</code> / <code>rowActionsOnHover</code> / <code>rowActionsColumn</code></td><td><code>(row: R) =&gt; ReactNode</code> / <code>boolean</code> / <code>string</code></td><td>— / <code>false</code> / —</td><td>Per-row action menu (trailing column, or floated inside the named column's right edge; optionally hover-only).</td></tr>
          <tr><td><code>rowContextMenu</code> / <code>selectOnContextMenu</code></td><td><code>(row, ctx) =&gt; ReactNode</code> / <code>boolean</code></td><td>— / <code>false</code></td><td>Right-click menu (<code>ctx = {'{ selected, selection }'}</code>); optionally select an unselected row on right-click.</td></tr>
          <tr><td><code>summary</code></td><td><code>(rowsInView: R[]) =&gt; ReactNode</code></td><td>—</td><td>Sticky footer summary row (totals, counts, …).</td></tr>
          <tr><td><code>loading</code> / <code>loadingState</code></td><td><code>boolean</code> / <code>ReactNode</code></td><td><code>false</code> / spinner row</td><td>Loading overlay (dimmed body + spinner); custom node when there's no data yet.</td></tr>
          <tr><td><code>onColumnResize</code> / <code>onColumnReorder</code></td><td><code>(key, width) =&gt; void</code> / <code>(orderedKeys) =&gt; void</code></td><td>—</td><td>For persisting column widths / order externally.</td></tr>
          <tr><td><code>onRowReorder</code> / <code>isRowDraggable</code></td><td><code>(event: NxRowReorderEvent&lt;R&gt;) =&gt; void</code> / <code>(row) =&gt; boolean</code></td><td>—</td><td>Enable drag-to-reorder rows (adds a handle column); lock individual rows. NxTable doesn't reorder <code>data</code> itself — apply <code>orderedIds</code>.</td></tr>
          <tr><td><code>emptyState</code></td><td><code>ReactNode</code></td><td>—</td><td>Node shown when there are no rows (also after a no-match filter).</td></tr>
          <tr><td><code>fillHeight</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Stretch to fill the parent's height (toolbar pinned top, pagination bottom, body scrolls). The parent must give NxTable a height.</td></tr>
          <tr><td><code>stickyHeaderOffset</code></td><td><code>number</code></td><td><code>0</code></td><td>Offset (px) for the sticky header — use below a fixed app bar.</td></tr>
          <tr><td><code>columnManager</code></td><td><code>'menu' | 'dialog'</code></td><td><code>'menu'</code></td><td><code>'menu'</code> — a checkbox dropdown; <code>'dialog'</code> — a <code>Transfer</code> dialog (show/hide + reorder + pin to a "Frozen" group). Needs <code>showColumnControl</code>.</td></tr>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Merged onto the root.</td></tr>
        </tbody>
      </Table>

      <h2>NxColumn</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>key</code></td><td><code>string</code></td><td>—</td><td>Property on the row object. Required.</td></tr>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td>—</td><td>Header content. Required.</td></tr>
          <tr><td><code>type</code></td><td><code>'text' | 'number' | 'money' | 'status' | 'date' | 'bar' | 'custom'</code></td><td><code>'text'</code></td><td>Drives default cell rendering, alignment, and type-based sort.</td></tr>
          <tr><td><code>width</code> / <code>minWidth</code></td><td><code>number</code></td><td>—</td><td>Column width / lower bound when resizing.</td></tr>
          <tr><td><code>pinned</code></td><td><code>'left' | 'right' | null</code></td><td><code>null</code></td><td>Freeze the column to a side.</td></tr>
          <tr><td><code>sortable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Header click cycles asc → desc → none.</td></tr>
          <tr><td><code>filterable</code> / <code>filterKind</code></td><td><code>boolean</code> / <code>'text' | 'select' | 'range'</code></td><td><code>false</code> / —</td><td>Add a header filter — text "contains", a select (needs <code>options</code>), or a numeric range.</td></tr>
          <tr><td><code>options</code></td><td><code>string[]</code></td><td>—</td><td>Choices for <code>filterKind: 'select'</code>.</td></tr>
          <tr><td><code>align</code></td><td><code>'left' | 'right' | 'center'</code></td><td>by <code>type</code></td><td>Cell text alignment.</td></tr>
          <tr><td><code>hidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Start the column hidden (toggle via the Columns control).</td></tr>
          <tr><td><code>render</code></td><td><code>(value, row) =&gt; ReactNode</code></td><td>—</td><td>Custom cell renderer.</td></tr>
          <tr><td><code>formatter</code></td><td><code>(value, row) =&gt; string</code></td><td>—</td><td>Plain-text projection — used for global search, sorting, and CSV export (pair it with <code>render</code>).</td></tr>
          <tr><td><code>barMax</code></td><td><code>number</code></td><td><code>100</code></td><td>For <code>type: 'bar'</code> — the value at which the bar is full.</td></tr>
          <tr><td><code>sortFn</code></td><td><code>(a, b, rowA, rowB) =&gt; number</code></td><td>—</td><td>Custom client-side sort comparator (overrides the type default).</td></tr>
          <tr><td><code>editable</code></td><td><code>NxEditable&lt;R&gt; | ((row: R) =&gt; NxEditable&lt;R&gt; | false)</code></td><td>—</td><td>Make cells inline-editable. See <code>NxEditable</code> below; a function gives per-row control (<code>false</code> ⇒ that cell isn't editable).</td></tr>
        </tbody>
      </Table>

      <h2>NxEditable</h2>
      <Table>
        <thead>
          <tr><th>Variant</th><th>Shape</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td>text / number</td><td><code>{"{ type: 'text' | 'number' }"}</code></td><td>An <code>Input</code> editor; commits on Enter / blur.</td></tr>
          <tr><td>date</td><td><code>{"{ type: 'date' }"}</code></td><td>A date <code>Input</code> editor.</td></tr>
          <tr><td>select</td><td><code>{"{ type: 'select', options: { value: string; label: ReactNode }[] }"}</code></td><td>A <code>Select</code> editor; commits immediately on change.</td></tr>
          <tr><td>custom</td><td><code>{"{ render: (args: NxCellEditorArgs<R>) => ReactNode }"}</code></td><td>Your own editor — <code>args</code> = <code>{"{ value, row, commit(next), cancel() }"}</code>.</td></tr>
        </tbody>
      </Table>

      <h2>NxRowReorderEvent</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>movedId</code> / <code>movedRow</code></td><td><code>string</code> / <code>R</code></td><td>The dragged row's id / the row itself (same reference as in <code>data</code>).</td></tr>
          <tr><td><code>fromIndex</code> / <code>toIndex</code></td><td><code>number</code></td><td>Index before the drag / index it landed at (within the visible rows).</td></tr>
          <tr><td><code>beforeId</code> / <code>afterId</code></td><td><code>string | null</code></td><td>Id of the row now immediately above / below the moved row (<code>null</code> at the ends) — derive a fractional rank from these to PATCH a single row.</td></tr>
          <tr><td><code>orderedIds</code></td><td><code>string[]</code></td><td>The full new id order (visible rows), with <code>movedId</code> in its new spot — use it to re-render.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
