import { StrictMode, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { NxTable, type NxColumn } from './index'
import { Button } from '../Button'
import { Pill } from '../Pill'

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
  parameters: { docs: { description: { story: 'Everything at once — selection + bulk actions, expandable rows, per-row menu, pinned first/last columns, search, per-column filters, sort, pagination.' } } },
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

export const DensitySwitch: Story = {
  parameters: { docs: { description: { story: 'The density control in the toolbar (or the `density` prop) trades vertical padding for rows-on-screen: compact / normal / comfortable.' } } },
  render: () => (
    <div style={{ width: 820, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['compact', 'normal', 'comfy'] as const).map((d) => (
        <div key={d}>
          <div className="text-xs uppercase tracking-[0.05em] text-text-dim mb-1">{d}</div>
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

export const ColumnVisibilityAndExport: Story = {
  parameters: { docs: { description: { story: 'The "Columns" menu hides/shows columns (start with three already hidden); "Export CSV" downloads the *filtered & sorted* rows with the *visible* columns.' } } },
  render: () => (
    <div style={{ width: 880 }}>
      <NxTable<Instance>
        data={rows}
        columns={cols({ pinName: null, pinOwner: null }).map((c) => ({ ...c, hidden: ['memGb', 'cpuPct', 'created'].includes(c.key) }))}
        getRowId={(r) => r.id}
        pageSize={12}
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
