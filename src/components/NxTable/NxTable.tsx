import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'
import { Button } from '../Button'
import { Input } from '../Input'
import { Select } from '../Select'
import { Pill } from '../Pill'

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type NxColumnType = 'text' | 'number' | 'money' | 'status' | 'date' | 'bar' | 'custom'
export type NxFilterKind = 'text' | 'select' | 'range'
export type NxDensity = 'compact' | 'normal' | 'comfy'

export interface NxColumn<R = Record<string, unknown>> {
  key: string
  label: ReactNode
  type?: NxColumnType
  width?: number
  minWidth?: number
  pinned?: 'left' | 'right' | null
  sortable?: boolean
  filterable?: boolean
  filterKind?: NxFilterKind
  /** For `filterKind: 'select'`. */
  options?: string[]
  align?: 'left' | 'right' | 'center'
  hidden?: boolean
  /** Custom cell renderer. */
  render?: (value: unknown, row: R) => ReactNode
  /** Plain-text projection — used for global search, sorting, and CSV export. */
  formatter?: (value: unknown, row: R) => string
  /** For `type: 'bar'` — the value at which the bar is full. Default 100. */
  barMax?: number
}

export interface NxTableProps<R = Record<string, unknown>> {
  data: R[]
  columns: NxColumn<R>[]
  getRowId: (row: R) => string
  selectable?: 'multi' | 'single' | false
  /** Controlled selection (array of row ids). */
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  density?: NxDensity
  paginate?: boolean
  pageSize?: number
  /** Page-size choices in the footer. Default [10, 20, 50, 100]. */
  pageSizeOptions?: number[]
  /** Show the global search box. Default true. */
  search?: boolean
  /** Show the toolbar (search / density / column toggle / export). Default true. */
  showToolbar?: boolean
  /** Persist UI state (sort/filters/density/page-size/hidden cols/widths) to localStorage under this key. */
  persistKey?: string
  /** Render an expanded panel below a row. When provided, an expander column is added. */
  renderExpanded?: (row: R) => ReactNode
  /** Bulk actions shown when ≥1 row is selected; receives the selected rows. */
  bulkActions?: (rows: R[]) => ReactNode
  /** Per-row action menu trigger content (rendered in a trailing column). */
  rowActions?: (row: R) => ReactNode
  /** Row click handler. */
  onRowClick?: (row: R) => void
  /** Empty-state node. */
  emptyState?: ReactNode
  className?: string
}

/* -------------------------------------------------------------------------- */
/* Formatting helpers                                                          */
/* -------------------------------------------------------------------------- */

const fmtMoney = (v: unknown) => '$' + (Number(v) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtNumber = (v: unknown) => (Number(v) || 0).toLocaleString()
const fmtDate = (v: unknown) => {
  if (!v) return '—'
  const d = v instanceof Date ? v : new Date(v as string)
  if (isNaN(d.getTime())) return String(v)
  const Y = d.getFullYear(), M = String(d.getMonth() + 1).padStart(2, '0'), D = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0'), m = String(d.getMinutes()).padStart(2, '0')
  return `${Y}-${M}-${D} ${h}:${m}`
}
const statusTone = (v: string): React.ComponentProps<typeof Pill>['tone'] => {
  const s = v.toLowerCase()
  if (/(active|running|ok|healthy|success|done|paid)/.test(s)) return 'ok'
  if (/(idle|pending|warn|degraded|queued)/.test(s)) return 'warn'
  if (/(error|failed|down|stopped|overdue|critical)/.test(s)) return 'err'
  return 'neutral'
}

function cellText<R>(col: NxColumn<R>, row: R): string {
  const raw = (row as Record<string, unknown>)[col.key]
  if (col.formatter) return col.formatter(raw, row)
  switch (col.type) {
    case 'money': return fmtMoney(raw)
    case 'number': case 'bar': return fmtNumber(raw)
    case 'date': return fmtDate(raw)
    default: return raw == null ? '' : String(raw)
  }
}

function CellContent<R>({ col, row }: { col: NxColumn<R>; row: R }) {
  const raw = (row as Record<string, unknown>)[col.key]
  if (col.render) return <>{col.render(raw, row)}</>
  switch (col.type) {
    case 'status':
      return <Pill size="xs" tone={statusTone(String(raw ?? ''))}>{String(raw ?? '—')}</Pill>
    case 'bar': {
      const max = col.barMax ?? 100
      const pct = Math.max(0, Math.min(100, ((Number(raw) || 0) / max) * 100))
      return (
        <div className="flex items-center gap-2 min-w-[80px]">
          <div className="flex-1 h-1.5 rounded-full bg-bg-sunk overflow-hidden">
            <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-text-muted tabular-nums w-9 text-right">{Math.round(pct)}%</span>
        </div>
      )
    }
    case 'money': return <span className="tabular-nums">{fmtMoney(raw)}</span>
    case 'number': return <span className="tabular-nums">{fmtNumber(raw)}</span>
    case 'date': return <span className="text-text-muted">{fmtDate(raw)}</span>
    default: return <>{raw == null ? <span className="text-text-dim">—</span> : String(raw)}</>
  }
}

/* -------------------------------------------------------------------------- */
/* Persisted UI state                                                          */
/* -------------------------------------------------------------------------- */

interface UiState {
  sort: { key: string; dir: 'asc' | 'desc' } | null
  filters: Record<string, string>
  density: NxDensity
  pageSize: number
  hidden: string[]
  widths: Record<string, number>
}

function loadState(key: string | undefined): Partial<UiState> | null {
  if (!key || typeof localStorage === 'undefined') return null
  try { const raw = localStorage.getItem(`nxtable:${key}`); return raw ? JSON.parse(raw) : null } catch { return null }
}
function saveState(key: string | undefined, s: UiState) {
  if (!key || typeof localStorage === 'undefined') return
  try { localStorage.setItem(`nxtable:${key}`, JSON.stringify(s)) } catch { /* ignore */ }
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                      */
/* -------------------------------------------------------------------------- */

const rowPad: Record<NxDensity, string> = { compact: 'py-1', normal: 'py-1.5', comfy: 'py-2.5' }
const cellStyles = tv({
  base: 'px-3 align-middle text-sm text-text border-b border-line whitespace-nowrap overflow-hidden text-ellipsis',
})

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export function NxTable<R = Record<string, unknown>>({
  data,
  columns: columnsProp,
  getRowId,
  selectable = false,
  selectedIds,
  onSelectionChange,
  density: densityProp = 'normal',
  paginate = true,
  pageSize: pageSizeProp = 20,
  pageSizeOptions = [10, 20, 50, 100],
  search = true,
  showToolbar = true,
  persistKey,
  renderExpanded,
  bulkActions,
  rowActions,
  onRowClick,
  emptyState,
  className,
}: NxTableProps<R>) {
  const persisted = useMemo(() => loadState(persistKey), [persistKey])

  /* --- UI state --- */
  const [sort, setSort] = useState<UiState['sort']>(persisted?.sort ?? null)
  const [filters, setFilters] = useState<Record<string, string>>(persisted?.filters ?? {})
  const [density, setDensity] = useState<NxDensity>(persisted?.density ?? densityProp)
  const [pageSize, setPageSize] = useState<number>(persisted?.pageSize ?? pageSizeProp)
  const [page, setPage] = useState(0)
  const [hidden, setHidden] = useState<Set<string>>(new Set(persisted?.hidden ?? columnsProp.filter((c) => c.hidden).map((c) => c.key)))
  const [widths, setWidths] = useState<Record<string, number>>(persisted?.widths ?? {})
  const [q, setQ] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [openFilterCol, setOpenFilterCol] = useState<string | null>(null)
  const [colMenuOpen, setColMenuOpen] = useState(false)

  // Uncontrolled selection fallback.
  const [innerSel, setInnerSel] = useState<Set<string>>(new Set())
  const selSet = selectedIds !== undefined ? new Set(selectedIds) : innerSel
  const setSel = useCallback((next: Set<string>) => {
    if (selectedIds === undefined) setInnerSel(next)
    onSelectionChange?.([...next])
  }, [selectedIds, onSelectionChange])

  // Persist on change.
  useEffect(() => {
    saveState(persistKey, { sort, filters, density, pageSize, hidden: [...hidden], widths })
  }, [persistKey, sort, filters, density, pageSize, hidden, widths])

  /* --- columns (visible + width) --- */
  const columns = useMemo(
    () => columnsProp.filter((c) => !hidden.has(c.key)).map((c) => ({ ...c, width: widths[c.key] ?? c.width ?? 160 })),
    [columnsProp, hidden, widths],
  )
  const leftPinned = columns.filter((c) => c.pinned === 'left')
  const rightPinned = columns.filter((c) => c.pinned === 'right')
  const normalCols = columns.filter((c) => !c.pinned)
  const orderedCols = [...leftPinned, ...normalCols, ...rightPinned]

  /* --- filtering --- */
  const filtered = useMemo(() => {
    let rows = data
    // per-column filters
    for (const [key, fv] of Object.entries(filters)) {
      if (!fv) continue
      const col = columnsProp.find((c) => c.key === key)
      if (!col) continue
      if (col.filterKind === 'range') {
        const [loS, hiS] = fv.split('|')
        const lo = loS === '' ? -Infinity : Number(loS)
        const hi = hiS === '' ? Infinity : Number(hiS)
        rows = rows.filter((r) => { const n = Number((r as Record<string, unknown>)[key]); return !isNaN(n) && n >= lo && n <= hi })
      } else if (col.filterKind === 'select') {
        rows = rows.filter((r) => String((r as Record<string, unknown>)[key]) === fv)
      } else {
        const needle = fv.toLowerCase()
        rows = rows.filter((r) => cellText(col, r).toLowerCase().includes(needle))
      }
    }
    // global search
    if (search && q) {
      const needle = q.toLowerCase()
      rows = rows.filter((r) => columnsProp.some((c) => cellText(c, r).toLowerCase().includes(needle)))
    }
    return rows
  }, [data, filters, q, search, columnsProp])

  /* --- sorting --- */
  const sorted = useMemo(() => {
    if (!sort) return filtered
    const col = columnsProp.find((c) => c.key === sort.key)
    if (!col) return filtered
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sort.key]
      const bv = (b as Record<string, unknown>)[sort.key]
      let cmp: number
      if (col.type === 'number' || col.type === 'money' || col.type === 'bar') cmp = (Number(av) || 0) - (Number(bv) || 0)
      else if (col.type === 'date') cmp = new Date(av as string).getTime() - new Date(bv as string).getTime()
      else cmp = cellText(col, a).localeCompare(cellText(col, b))
      return cmp * dir
    })
  }, [filtered, sort, columnsProp])

  /* --- pagination --- */
  const pageCount = paginate ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1
  const safePage = Math.min(page, pageCount - 1)
  const visibleRows = paginate ? sorted.slice(safePage * pageSize, safePage * pageSize + pageSize) : sorted

  // reset page when filters/search shrink the set
  useEffect(() => { if (page > pageCount - 1) setPage(0) }, [pageCount, page])

  /* --- selection helpers --- */
  const allVisibleSelected = visibleRows.length > 0 && visibleRows.every((r) => selSet.has(getRowId(r)))
  const someVisibleSelected = visibleRows.some((r) => selSet.has(getRowId(r)))
  const toggleAll = () => {
    const next = new Set(selSet)
    if (allVisibleSelected) visibleRows.forEach((r) => next.delete(getRowId(r)))
    else visibleRows.forEach((r) => next.add(getRowId(r)))
    setSel(next)
  }
  const toggleRow = (row: R) => {
    const id = getRowId(row)
    if (selectable === 'single') { setSel(new Set(selSet.has(id) ? [] : [id])); return }
    const next = new Set(selSet)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSel(next)
  }
  const selectedRows = useMemo(() => data.filter((r) => selSet.has(getRowId(r))), [data, selSet, getRowId])

  /* --- sort toggle --- */
  const onSortClick = (key: string) => {
    setSort((s) => {
      if (!s || s.key !== key) return { key, dir: 'asc' }
      if (s.dir === 'asc') return { key, dir: 'desc' }
      return null
    })
  }

  /* --- column resize --- */
  const resizeRef = useRef<{ key: string; startX: number; startW: number } | null>(null)
  const onResizeStart = (e: React.MouseEvent, key: string, w: number) => {
    e.preventDefault(); e.stopPropagation()
    resizeRef.current = { key, startX: e.clientX, startW: w }
    const onMove = (ev: MouseEvent) => {
      const st = resizeRef.current
      if (!st) return
      const col = columnsProp.find((c) => c.key === st.key)
      const min = col?.minWidth ?? 60
      setWidths((m) => ({ ...m, [st.key]: Math.max(min, st.startW + (ev.clientX - st.startX)) }))
    }
    const onUp = () => { resizeRef.current = null; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  /* --- CSV export --- */
  const exportCsv = () => {
    const cols = orderedCols
    const esc = (s: string) => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    const header = cols.map((c) => esc(typeof c.label === 'string' ? c.label : c.key)).join(',')
    const lines = sorted.map((r) => cols.map((c) => esc(cellText(c, r))).join(','))
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${persistKey ?? 'table'}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  /* --- close popovers on outside click --- */
  useEffect(() => {
    if (!openFilterCol && !colMenuOpen) return
    const onDown = () => { setOpenFilterCol(null); setColMenuOpen(false) }
    // defer so the opening click doesn't immediately close it
    const t = setTimeout(() => document.addEventListener('click', onDown), 0)
    return () => { clearTimeout(t); document.removeEventListener('click', onDown) }
  }, [openFilterCol, colMenuOpen])

  const hasExpander = !!renderExpanded
  const colCount = orderedCols.length + (selectable ? 1 : 0) + (hasExpander ? 1 : 0) + (rowActions ? 1 : 0)
  const activeFilterCount = Object.values(filters).filter(Boolean).length

  /* ---------------------------------------------------------------- render -- */

  const stickyLeftOffset = (idx: number) => {
    let off = selectable ? 36 : 0
    if (hasExpander) off += 32
    for (let i = 0; i < idx; i++) off += leftPinned[i].width!
    return off
  }
  const stickyRightOffset = (idx: number) => {
    let off = rowActions ? 44 : 0
    for (let i = rightPinned.length - 1; i > idx; i--) off += rightPinned[i].width!
    return off
  }

  return (
    <div className={['flex flex-col border border-line rounded-md bg-bg-elev overflow-hidden', className].filter(Boolean).join(' ')}>
      {/* toolbar */}
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 px-3 py-2 border-b border-line">
          {search && (
            <div className="relative">
              <Input
                size="sm"
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(0) }}
                placeholder="Search…"
                style={{ width: 200, paddingLeft: 26 }}
              />
              <svg className="absolute left-2 top-1/2 -translate-y-1/2 text-text-dim" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          )}
          {activeFilterCount > 0 && (
            <Button size="xs" intent="ghost" className="whitespace-nowrap" onClick={() => setFilters({})}>Clear filters ({activeFilterCount})</Button>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Select
              size="sm"
              value={density}
              onChange={(v) => setDensity(v as NxDensity)}
              options={[{ value: 'compact', label: 'Compact' }, { value: 'normal', label: 'Normal' }, { value: 'comfy', label: 'Comfortable' }]}
            />
            <div className="relative">
              <Button size="sm" intent="default" className="whitespace-nowrap" onClick={(e) => { e.stopPropagation(); setColMenuOpen((o) => !o) }}>Columns</Button>
              {colMenuOpen && (
                <div className="absolute right-0 mt-1 z-[52] min-w-[180px] bg-bg-elev border border-line rounded-md shadow-md p-1" onClick={(e) => e.stopPropagation()}>
                  {columnsProp.map((c) => (
                    <label key={c.key} className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-xs hover:bg-bg-sunk cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!hidden.has(c.key)}
                        onChange={() => setHidden((h) => { const n = new Set(h); if (n.has(c.key)) n.delete(c.key); else n.add(c.key); return n })}
                      />
                      {c.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <Button size="sm" intent="ghost" className="whitespace-nowrap" onClick={exportCsv}>Export CSV</Button>
          </div>
        </div>
      )}

      {/* bulk-action bar */}
      {selectable && selSet.size > 0 && (
        <div className="flex items-center gap-3 px-3 py-2 bg-accent-weak text-accent-ink border-b border-line text-sm">
          <span className="font-medium">{selSet.size} selected</span>
          {bulkActions ? bulkActions(selectedRows) : null}
          <Button size="xs" intent="ghost" className="ml-auto" onClick={() => setSel(new Set())}>Clear</Button>
        </div>
      )}

      {/* table */}
      <div className="overflow-auto">
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            {selectable && <col style={{ width: 36 }} />}
            {hasExpander && <col style={{ width: 32 }} />}
            {orderedCols.map((c) => <col key={c.key} style={{ width: c.width }} />)}
            {rowActions && <col style={{ width: 44 }} />}
          </colgroup>
          <thead>
            <tr>
              {selectable && (
                <th className="px-3 py-2 sticky top-0 left-0 bg-bg-sunk z-30">
                  {selectable === 'multi' && (
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      ref={(el) => { if (el) el.indeterminate = !allVisibleSelected && someVisibleSelected }}
                      onChange={toggleAll}
                      aria-label="Select all on this page"
                    />
                  )}
                </th>
              )}
              {hasExpander && <th className="sticky top-0 bg-bg-sunk z-30" style={{ left: selectable ? 36 : 0 }} />}
              {orderedCols.map((c) => {
                const isLeft = c.pinned === 'left'
                const isRight = c.pinned === 'right'
                const leftIdx = leftPinned.findIndex((x) => x.key === c.key)
                const rightIdx = rightPinned.findIndex((x) => x.key === c.key)
                const sortState = sort?.key === c.key ? sort.dir : null
                return (
                  <th
                    key={c.key}
                    className={[
                      // Every header cell is sticky-top so it stays above body cells on
                      // both vertical and horizontal scroll; pinned ones also stick to the side.
                      'px-3 py-2 text-left text-[11px] uppercase tracking-[0.04em] font-medium text-text-muted select-none bg-bg-sunk sticky top-0',
                      isLeft || isRight ? 'z-30' : 'z-20',
                      c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : '',
                    ].filter(Boolean).join(' ')}
                    style={isLeft ? { left: stickyLeftOffset(leftIdx) } : isRight ? { right: stickyRightOffset(rightIdx) } : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {c.sortable ? (
                        <button type="button" className="inline-flex items-center gap-1 hover:text-text" onClick={() => onSortClick(c.key)}>
                          {c.label}
                          <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden className={sortState ? 'text-accent-ink' : 'text-text-dim'}>
                            {sortState === 'asc' ? <path d="M6 3l3 4H3z" fill="currentColor" />
                             : sortState === 'desc' ? <path d="M6 9L3 5h6z" fill="currentColor" />
                             : <path d="M6 3l2 2.5H4zM6 9L4 6.5h4z" fill="currentColor" opacity="0.5" />}
                          </svg>
                        </button>
                      ) : c.label}
                      {c.filterable && (
                        <button
                          type="button"
                          className={['inline-flex', filters[c.key] ? 'text-accent-ink' : 'text-text-dim hover:text-text'].join(' ')}
                          onClick={(e) => { e.stopPropagation(); setOpenFilterCol((k) => k === c.key ? null : c.key) }}
                          aria-label={`Filter ${typeof c.label === 'string' ? c.label : c.key}`}
                        >
                          <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
                            <path d="M2 3h10l-3.6 4.6V11l-2.8 1V7.6z" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}
                    </span>
                    {openFilterCol === c.key && (
                      <div className="absolute left-0 top-full mt-1 z-40 bg-bg-elev border border-line rounded-md shadow-md p-2 normal-case tracking-normal" onClick={(e) => e.stopPropagation()} style={{ minWidth: 180 }}>
                        {c.filterKind === 'select' && c.options ? (
                          <Select size="sm" value={filters[c.key] || undefined} onChange={(v) => { setFilters((f) => ({ ...f, [c.key]: (v as string) ?? '' })); setPage(0) }} options={[{ value: '', label: 'All' }, ...c.options.map((o) => ({ value: o, label: o }))]} placeholder="All" />
                        ) : c.filterKind === 'range' ? (
                          <div className="flex items-center gap-1">
                            <Input size="sm" type="number" placeholder="min" style={{ width: 70 }} value={(filters[c.key] ?? '|').split('|')[0]} onChange={(e) => { const hi = (filters[c.key] ?? '|').split('|')[1] ?? ''; setFilters((f) => ({ ...f, [c.key]: `${e.target.value}|${hi}` })); setPage(0) }} />
                            <span className="text-text-dim">–</span>
                            <Input size="sm" type="number" placeholder="max" style={{ width: 70 }} value={(filters[c.key] ?? '|').split('|')[1] ?? ''} onChange={(e) => { const lo = (filters[c.key] ?? '|').split('|')[0] ?? ''; setFilters((f) => ({ ...f, [c.key]: `${lo}|${e.target.value}` })); setPage(0) }} />
                          </div>
                        ) : (
                          <Input size="sm" autoFocus placeholder="contains…" value={filters[c.key] ?? ''} onChange={(e) => { setFilters((f) => ({ ...f, [c.key]: e.target.value })); setPage(0) }} style={{ width: 160 }} />
                        )}
                        <div className="flex justify-end mt-1.5">
                          <Button size="xs" intent="ghost" onClick={() => { setFilters((f) => { const n = { ...f }; delete n[c.key]; return n }); setOpenFilterCol(null) }}>Clear</Button>
                        </div>
                      </div>
                    )}
                    {/* resize handle */}
                    <span
                      role="separator"
                      aria-orientation="vertical"
                      onMouseDown={(e) => onResizeStart(e, c.key, c.width!)}
                      className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize hover:bg-accent/40"
                    />
                  </th>
                )
              })}
              {rowActions && <th className="sticky top-0 right-0 bg-bg-sunk z-30" />}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr><td colSpan={colCount} className="px-3 py-10 text-center text-sm text-text-dim">{emptyState ?? 'No rows match the current filters.'}</td></tr>
            ) : visibleRows.map((row) => {
              const id = getRowId(row)
              const isSel = selSet.has(id)
              const isExpanded = expanded.has(id)
              return (
                <FragmentRow key={id}>
                  <tr
                    className={[
                      onRowClick ? 'cursor-pointer' : '',
                      isSel ? 'bg-[color-mix(in_oklch,var(--color-accent)_8%,transparent)]' : 'hover:bg-bg-sunk',
                    ].filter(Boolean).join(' ')}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className={`${cellStyles()} ${rowPad[density]} sticky left-0 z-10 ${isSel ? 'bg-[color-mix(in_oklch,var(--color-accent)_8%,transparent)]' : 'bg-bg-elev'}`} onClick={(e) => { e.stopPropagation(); toggleRow(row) }}>
                        <input type={selectable === 'single' ? 'radio' : 'checkbox'} checked={isSel} onChange={() => toggleRow(row)} aria-label="Select row" />
                      </td>
                    )}
                    {hasExpander && (
                      <td className={`${cellStyles()} ${rowPad[density]}`} style={{ left: selectable ? 36 : 0 }} onClick={(e) => { e.stopPropagation(); setExpanded((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n }) }}>
                        <button type="button" aria-label={isExpanded ? 'Collapse' : 'Expand'} className="text-text-dim hover:text-text">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform .1s' }}>
                            <polyline points="9 6 15 12 9 18" />
                          </svg>
                        </button>
                      </td>
                    )}
                    {orderedCols.map((c) => {
                      const isLeft = c.pinned === 'left', isRight = c.pinned === 'right'
                      const leftIdx = leftPinned.findIndex((x) => x.key === c.key)
                      const rightIdx = rightPinned.findIndex((x) => x.key === c.key)
                      return (
                        <td
                          key={c.key}
                          className={[
                            cellStyles(), rowPad[density],
                            isLeft || isRight ? `sticky z-10 ${isSel ? 'bg-[color-mix(in_oklch,var(--color-accent)_8%,transparent)]' : 'bg-bg-elev'}` : '',
                            c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : '',
                          ].filter(Boolean).join(' ')}
                          style={isLeft ? { left: stickyLeftOffset(leftIdx) } : isRight ? { right: stickyRightOffset(rightIdx) } : undefined}
                          title={cellText(c, row)}
                        >
                          <CellContent col={c} row={row} />
                        </td>
                      )
                    })}
                    {rowActions && (
                      <td className={`${cellStyles()} ${rowPad[density]} sticky right-0 z-10 ${isSel ? 'bg-[color-mix(in_oklch,var(--color-accent)_8%,transparent)]' : 'bg-bg-elev'}`} onClick={(e) => e.stopPropagation()}>
                        {rowActions(row)}
                      </td>
                    )}
                  </tr>
                  {hasExpander && isExpanded && (
                    <tr>
                      <td colSpan={colCount} className="px-4 py-3 bg-bg-sunk border-b border-line">
                        {renderExpanded!(row)}
                      </td>
                    </tr>
                  )}
                </FragmentRow>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* footer / pagination */}
      {paginate && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 border-t border-line text-xs text-text-muted">
          <span className="whitespace-nowrap">{sorted.length === 0 ? '0' : `${safePage * pageSize + 1}–${Math.min(sorted.length, (safePage + 1) * pageSize)}`} of {sorted.length}</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="whitespace-nowrap">Rows per page</span>
            <Select size="sm" value={String(pageSize)} onChange={(v) => { setPageSize(Number(v)); setPage(0) }} options={pageSizeOptions.map((n) => ({ value: String(n), label: String(n) }))} />
            <div className="flex items-center gap-1.5 ml-1">
              <Button size="sm" intent="default" disabled={safePage === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</Button>
              <span className="tabular-nums whitespace-nowrap px-1">{safePage + 1} / {pageCount}</span>
              <Button size="sm" intent="default" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>Next</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// React fragments can't take a key on a <tr> pair cleanly without a wrapper; use a keyed Fragment.
function FragmentRow({ children }: { children: ReactNode }) {
  return <>{children}</>
}
