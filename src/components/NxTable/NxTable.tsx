import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { restrictToVerticalAxis, restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { Input } from '../Input'
import { Radio } from '../Radio'
import { Select } from '../Select'
import { Spinner } from '../Spinner'
import { useSize } from '../../context/ConfigProvider'
import type { NxColumn, NxDensity, NxEditable, NxSortState, NxTableProps } from './types'
import { CellContent, cellText } from './format'
import { loadState, saveState } from './persist'
import { ColumnManagerDialog } from './ColumnManagerDialog'
import { useContextMenu } from '../ContextMenu'
import { CellEditor } from './CellEditor'

/* -------------------------------------------------------------------------- */
/* Styles / constants                                                          */
/* -------------------------------------------------------------------------- */

const rowPad: Record<NxDensity, string> = { compact: 'py-1', normal: 'py-1.5', comfy: 'py-2.5' }
const cellStyles = tv({
  base: 'px-3 align-middle text-sm text-text border-b border-line whitespace-nowrap overflow-hidden text-ellipsis',
})

// Module-level so the `<Select options>` reference is stable.
const DENSITY_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'normal', label: 'Normal' },
  { value: 'comfy', label: 'Comfortable' },
]

const ROW_SELECTED_BG = 'bg-[color-mix(in_oklch,var(--color-accent)_8%,transparent)]'

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
  isRowSelectable,

  density: densityProp,
  showDensityControl = false,
  showColumnControl = false,
  showExport = false,
  zebra = false,
  showToolbar = true,
  search = true,
  searchMode,
  searchQuery,
  onSearchChange,
  persistKey,

  paginate = true,
  pageSize: pageSizeProp = 20,
  pageSizeOptions = [10, 20, 50, 100],
  page: pageProp,
  onPageChange,
  onPageSizeChange,
  totalRows,

  manualPagination,
  manualSort,
  manualFilter,
  sort: sortProp,
  onSortChange,
  onFilterChange,

  renderExpanded,
  expandedIds,
  onExpandedChange,
  isRowExpandable,

  rowClassName,
  isRowDisabled,
  onRowClick,
  onCellEdit,

  bulkActions,
  rowActions,
  rowActionsOnHover = false,
  rowActionsColumn,
  rowContextMenu,
  selectOnContextMenu = false,

  summary,

  loading = false,
  loadingState,

  onColumnResize,
  onColumnReorder,

  onRowReorder,
  isRowDraggable,

  emptyState,
  fillHeight = false,
  stickyHeaderOffset = 0,
  columnManager = 'menu',
  className,
}: NxTableProps<R>) {
  const persisted = useMemo(() => loadState(persistKey), [persistKey])

  // `totalRows` set ⇒ caller already paginated server-side.
  const serverPaginated = totalRows !== undefined || !!manualPagination

  // Density: explicit `density` prop wins; else persisted; else follow the
  // global ConfigProvider size (`comfortable` → `comfy`).
  const globalSize = useSize()
  const sizeToDensity: Record<string, NxDensity> = { compact: 'compact', normal: 'normal', comfortable: 'comfy' }
  const initialDensity: NxDensity = densityProp ?? persisted?.density ?? sizeToDensity[globalSize] ?? 'normal'

  /* --- UI state (uncontrolled fallbacks; controlled values win) --- */
  const [innerSort, setInnerSort] = useState<NxSortState | null>(persisted?.sort ?? null)
  const sort = sortProp !== undefined ? sortProp : innerSort
  const [filters, setFiltersInner] = useState<Record<string, string>>(persisted?.filters ?? {})
  // When the toolbar density control is off and no `density`/persisted value, the
  // table simply mirrors the global size live (no local state needed); otherwise
  // it has its own state seeded once.
  const followsGlobalDensity = !showDensityControl && densityProp === undefined && persisted?.density === undefined
  const [innerDensity, setInnerDensity] = useState<NxDensity>(initialDensity)
  const density: NxDensity = followsGlobalDensity ? (sizeToDensity[globalSize] ?? 'normal') : innerDensity
  const setDensity = setInnerDensity
  const [innerPageSize, setInnerPageSize] = useState<number>(persisted?.pageSize ?? pageSizeProp)
  const pageSize = innerPageSize
  const [innerPage, setInnerPage] = useState(0)
  const page = pageProp !== undefined ? pageProp : innerPage
  const [hidden, setHidden] = useState<Set<string>>(new Set(persisted?.hidden ?? columnsProp.filter((c) => c.hidden).map((c) => c.key)))
  const [widths, setWidths] = useState<Record<string, number>>(persisted?.widths ?? {})
  const [colOrder, setColOrder] = useState<string[]>(persisted?.order ?? columnsProp.map((c) => c.key))
  const [colPins, setColPins] = useState<Record<string, 'left' | 'right' | null>>(persisted?.pins ?? {})
  const [innerQ, setInnerQ] = useState('')
  const q = searchQuery !== undefined ? searchQuery : innerQ // the *applied* query
  // 'live' (instant local filtering) by default; 'submit' for manualFilter
  // (don't refetch per keystroke) — overridable via `searchMode`.
  const resolvedSearchMode: 'live' | 'submit' = searchMode ?? (manualFilter ? 'submit' : 'live')
  // In 'submit' mode the box holds a separate draft that only flushes to
  // `q`/`onSearchChange` on Enter / blur / clicking the magnifier.
  const [searchDraft, setSearchDraft] = useState(q)
  // Re-seed the draft if the applied query changes externally (controlled).
  useEffect(() => { if (resolvedSearchMode === 'submit') setSearchDraft(q) }, [q, resolvedSearchMode])
  const searchBoxValue = resolvedSearchMode === 'live' ? q : searchDraft
  const [innerExpanded, setInnerExpanded] = useState<Set<string>>(new Set())
  const expandedSet = expandedIds !== undefined ? new Set(expandedIds) : innerExpanded
  const [openFilterCol, setOpenFilterCol] = useState<string | null>(null)
  const [colMenuOpen, setColMenuOpen] = useState(false)
  const [colDialogOpen, setColDialogOpen] = useState(false)

  // Uncontrolled selection fallback.
  const [innerSel, setInnerSel] = useState<Set<string>>(new Set())
  const selSet = selectedIds !== undefined ? new Set(selectedIds) : innerSel
  const setSel = useCallback((next: Set<string>) => {
    if (selectedIds === undefined) setInnerSel(next)
    onSelectionChange?.([...next])
  }, [selectedIds, onSelectionChange])

  /* --- setters that respect controlled mode + fire callbacks --- */
  const setSort = useCallback((next: NxSortState | null) => {
    if (sortProp === undefined) setInnerSort(next)
    onSortChange?.(next)
  }, [sortProp, onSortChange])
  const setPage = useCallback((next: number | ((p: number) => number)) => {
    const resolved = (p: number) => typeof next === 'function' ? next(p) : next
    if (pageProp === undefined) setInnerPage((p) => resolved(p))
    onPageChange?.(resolved(page))
  }, [pageProp, onPageChange, page])
  const setPageSize = useCallback((next: number) => {
    setInnerPageSize(next)
    onPageSizeChange?.(next)
  }, [onPageSizeChange])
  const setFilters = useCallback((upd: React.SetStateAction<Record<string, string>>) => {
    setFiltersInner((prev) => {
      const next = typeof upd === 'function' ? upd(prev) : upd
      onFilterChange?.(next)
      return next
    })
  }, [onFilterChange])
  const setQ = useCallback((next: string) => {
    if (searchQuery === undefined) setInnerQ(next)
    onSearchChange?.(next)
  }, [searchQuery, onSearchChange])
  const setExpanded = useCallback((upd: (s: Set<string>) => Set<string>) => {
    if (expandedIds === undefined) setInnerExpanded((s) => { const n = upd(s); return n })
    onExpandedChange?.([...upd(expandedSet)])
  }, [expandedIds, onExpandedChange, expandedSet])

  // Persist on change.
  useEffect(() => {
    saveState(persistKey, { sort, filters, density, pageSize, hidden: [...hidden], widths, order: colOrder, pins: colPins })
  }, [persistKey, sort, filters, density, pageSize, hidden, widths, colOrder, colPins])

  /* --- columns (visible, ordered, pin-resolved, width) --- */
  const columns = useMemo(() => {
    const byKey = new Map(columnsProp.map((c) => [c.key, c]))
    const orderedKeys = [
      ...colOrder.filter((k) => byKey.has(k)),
      ...columnsProp.map((c) => c.key).filter((k) => !colOrder.includes(k)),
    ]
    return orderedKeys
      .map((k) => byKey.get(k)!)
      .filter((c) => !hidden.has(c.key))
      .map((c) => {
        const pinOverride = colPins[c.key]
        const pinned = pinOverride === undefined ? (c.pinned ?? null) : pinOverride
        return { ...c, pinned, width: widths[c.key] ?? c.width ?? 160 }
      })
  }, [columnsProp, hidden, widths, colOrder, colPins])
  const leftPinned = columns.filter((c) => c.pinned === 'left')
  const rightPinned = columns.filter((c) => c.pinned === 'right')
  const normalCols = columns.filter((c) => !c.pinned)
  const orderedCols = [...leftPinned, ...normalCols, ...rightPinned]

  const pageSizeSelectOptions = useMemo(() => {
    // Always include the current page size so the Select trigger shows a value
    // even when `pageSize` (prop or persisted) isn't one of `pageSizeOptions`.
    const set = Array.from(new Set([...pageSizeOptions, pageSize])).sort((a, b) => a - b)
    return set.map((n) => ({ value: String(n), label: String(n) }))
  }, [pageSizeOptions, pageSize])
  const filterSelectOptions = useMemo(() => {
    const m: Record<string, { value: string; label: string }[]> = {}
    for (const c of columnsProp) {
      if (c.filterKind === 'select' && c.options) {
        m[c.key] = [{ value: '', label: 'All' }, ...c.options.map((o) => ({ value: o, label: o }))]
      }
    }
    return m
  }, [columnsProp])

  /* --- filtering (skipped in manualFilter mode) --- */
  const filtered = useMemo(() => {
    if (manualFilter) return data
    let rows = data
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
    if (search && q) {
      const needle = q.toLowerCase()
      rows = rows.filter((r) => columnsProp.some((c) => cellText(c, r).toLowerCase().includes(needle)))
    }
    return rows
  }, [data, filters, q, search, columnsProp, manualFilter])

  /* --- sorting (skipped in manualSort mode) --- */
  const sorted = useMemo(() => {
    if (manualSort || !sort) return filtered
    const col = columnsProp.find((c) => c.key === sort.key)
    if (!col) return filtered
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sort.key]
      const bv = (b as Record<string, unknown>)[sort.key]
      let cmp: number
      if (col.sortFn) cmp = col.sortFn(av, bv, a, b)
      else if (col.type === 'number' || col.type === 'money' || col.type === 'bar') cmp = (Number(av) || 0) - (Number(bv) || 0)
      else if (col.type === 'date') cmp = new Date(av as string).getTime() - new Date(bv as string).getTime()
      else cmp = cellText(col, a).localeCompare(cellText(col, b))
      return cmp * dir
    })
  }, [filtered, sort, columnsProp, manualSort])

  /* --- pagination --- */
  const totalCount = serverPaginated ? (totalRows ?? sorted.length) : sorted.length
  const pageCount = paginate ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1
  const safePage = Math.min(page, pageCount - 1)
  const visibleRows = paginate && !serverPaginated
    ? sorted.slice(safePage * pageSize, safePage * pageSize + pageSize)
    : sorted

  // Reset to page 0 when client-side filtering shrinks the set out from under the current page.
  useEffect(() => {
    if (!serverPaginated && pageProp === undefined && page > pageCount - 1) setInnerPage(0)
  }, [pageCount, page, serverPaginated, pageProp])

  /* --- row predicates --- */
  const rowSelectable = useCallback((r: R) => (isRowSelectable ? isRowSelectable(r) : true), [isRowSelectable])
  const rowDisabled = useCallback((r: R) => (isRowDisabled ? isRowDisabled(r) : false), [isRowDisabled])
  const rowExpandable = useCallback((r: R) => (isRowExpandable ? isRowExpandable(r) : true), [isRowExpandable])

  /* --- selection helpers --- */
  const selectableRows = useMemo(() => visibleRows.filter(rowSelectable), [visibleRows, rowSelectable])
  const allVisibleSelected = selectableRows.length > 0 && selectableRows.every((r) => selSet.has(getRowId(r)))
  const someVisibleSelected = selectableRows.some((r) => selSet.has(getRowId(r)))
  const toggleAll = () => {
    const next = new Set(selSet)
    if (allVisibleSelected) selectableRows.forEach((r) => next.delete(getRowId(r)))
    else selectableRows.forEach((r) => next.add(getRowId(r)))
    setSel(next)
  }
  const toggleRow = (row: R) => {
    if (!rowSelectable(row) || rowDisabled(row)) return
    const id = getRowId(row)
    if (selectable === 'single') { setSel(new Set(selSet.has(id) ? [] : [id])); return }
    const next = new Set(selSet)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSel(next)
  }
  const selectedRows = useMemo(() => data.filter((r) => selSet.has(getRowId(r))), [data, selSet, getRowId])

  /* --- row context menu --- */
  const [ctxRow, setCtxRow] = useState<R | null>(null)
  const ctxMenuNode = ctxRow != null && rowContextMenu
    ? rowContextMenu(ctxRow, { selected: selSet.has(getRowId(ctxRow)), selection: selectedRows })
    : null
  const ctxMenu = useContextMenu(ctxMenuNode)
  const openRowContextMenu = (row: R, e: React.MouseEvent) => {
    if (!rowContextMenu) return
    if (selectOnContextMenu && selectable && !selSet.has(getRowId(row)) && rowSelectable(row) && !rowDisabled(row)) {
      setSel(selectable === 'single' ? new Set([getRowId(row)]) : new Set(selSet).add(getRowId(row)))
    }
    setCtxRow(row)
    ctxMenu.open(e)
  }

  /* --- inline cell editing --- */
  const [editing, setEditing] = useState<{ rowId: string; key: string } | null>(null)
  // Ref to the currently-editing <td>, used as the editor's portal anchor so
  // the editor floats over the cell without affecting row height.
  const editingAnchorRef = useRef<HTMLTableCellElement | null>(null)
  const resolveEditable = useCallback((col: { key: string; editable?: NxColumn<R>['editable'] }, row: R): NxEditable<R> | null => {
    if (!col.editable || rowDisabled(row)) return null
    const e = typeof col.editable === 'function' ? col.editable(row) : col.editable
    return e === false ? null : (e as NxEditable<R>)
  }, [rowDisabled])
  const startEditing = (row: R, key: string) => {
    if (!onCellEdit) return // no point editing if there's nowhere to send it
    setEditing({ rowId: getRowId(row), key })
  }
  const commitEdit = (row: R, key: string, value: unknown) => {
    onCellEdit?.(row, key, value)
    setEditing(null)
  }
  const cancelEdit = () => setEditing(null)
  // Esc closes the editor (the inputs handle Enter/blur themselves).
  useEffect(() => {
    if (!editing) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setEditing(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [editing])
  // Resolve the row + column + editable config for the active edit (if any).
  const activeEdit = useMemo(() => {
    if (!editing) return null
    const row = visibleRows.find((r) => getRowId(r) === editing.rowId)
    if (!row) return null
    const col = orderedCols.find((c) => c.key === editing.key)
    if (!col) return null
    const cfg = resolveEditable(col, row)
    if (!cfg) return null
    return { row, col, cfg }
    // visibleRows churns reference each render but that's fine — useMemo just avoids the work, not a correctness issue.
  }, [editing, visibleRows, orderedCols, resolveEditable, getRowId])

  /* --- sort toggle --- */
  const onSortClick = (key: string) => {
    const next: NxSortState | null = !sort || sort.key !== key
      ? { key, dir: 'asc' }
      : sort.dir === 'asc' ? { key, dir: 'desc' } : null
    setSort(next)
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
    const onUp = () => {
      const st = resizeRef.current
      resizeRef.current = null
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      if (st) onColumnResize?.(st.key, widths[st.key] ?? st.startW)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  // Report reorder when colOrder changes (skip the initial render).
  const firstOrderRef = useRef(true)
  useEffect(() => {
    if (firstOrderRef.current) { firstOrderRef.current = false; return }
    onColumnReorder?.(colOrder)
  }, [colOrder, onColumnReorder])

  /* --- row drag-to-reorder (powered by @dnd-kit) --- */
  // Available only when the caller opted in, nothing is sorted, and pagination
  // isn't splitting the data across pages (you can only reorder what you see).
  const sortActive = !!sort
  const multiPage = paginate && pageCount > 1
  const rowReorderEnabled = !!onRowReorder && !sortActive && !multiPage
  const rowDraggable = useCallback(
    (r: R) => (isRowDraggable ? isRowDraggable(r) : !rowDisabled(r)),
    [isRowDraggable, rowDisabled],
  )
  const dndSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const visibleRowIds = useMemo(() => visibleRows.map(getRowId), [visibleRows, getRowId])
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const activeDragRow = activeDragId == null ? null : visibleRows.find((r) => getRowId(r) === activeDragId) ?? null
  const onDndDragStart = (e: DragStartEvent) => setActiveDragId(String(e.active.id))
  const onDndDragCancel = () => setActiveDragId(null)
  const onDndDragEnd = (e: DragEndEvent) => {
    setActiveDragId(null)
    const { active, over } = e
    if (!over || active.id === over.id) return
    const movedId = String(active.id)
    const fromIndex = visibleRowIds.indexOf(movedId)
    const toIndex = visibleRowIds.indexOf(String(over.id))
    if (fromIndex < 0 || toIndex < 0) return
    const orderedIds = arrayMove(visibleRowIds, fromIndex, toIndex)
    const pos = orderedIds.indexOf(movedId)
    const movedRow = visibleRows[fromIndex]
    onRowReorder!({
      movedId,
      movedRow,
      fromIndex,
      toIndex,
      beforeId: pos > 0 ? orderedIds[pos - 1] : null,
      afterId: pos < orderedIds.length - 1 ? orderedIds[pos + 1] : null,
      orderedIds,
    })
  }

  /* --- CSV export --- */
  const exportCsv = () => {
    const cols = orderedCols
    const esc = (s: string) => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    const header = cols.map((c) => esc(typeof c.label === 'string' ? c.label : c.key)).join(',')
    const lines = (serverPaginated ? visibleRows : sorted).map((r) => cols.map((c) => esc(cellText(c, r))).join(','))
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
    const t = setTimeout(() => document.addEventListener('click', onDown), 0)
    return () => { clearTimeout(t); document.removeEventListener('click', onDown) }
  }, [openFilterCol, colMenuOpen])

  const hasExpander = !!renderExpanded
  const hasRowDrag = rowReorderEnabled
  // `rowActions` only takes a trailing column when not anchored to a specific data column.
  const rowActionsTrailingColumn = !!rowActions && !rowActionsColumn
  const colCount = orderedCols.length + (hasRowDrag ? 1 : 0) + (selectable ? 1 : 0) + (hasExpander ? 1 : 0) + (rowActionsTrailingColumn ? 1 : 0)
  const activeFilterCount = Object.values(filters).filter(Boolean).length
  const stickyTop = stickyHeaderOffset || undefined
  // The toolbar renders only if requested *and* it has something in it.
  const toolbarVisible = showToolbar && (search || showDensityControl || showColumnControl || showExport)

  /* ---------------------------------------------------------------- render -- */

  const ROW_DRAG_W = 32
  const SELECT_COL_W = 44
  const EXPANDER_COL_W = 32
  const ROW_ACTIONS_COL_W = 44
  const stickyLeftOffset = (idx: number) => {
    let off = hasRowDrag ? ROW_DRAG_W : 0
    if (selectable) off += SELECT_COL_W
    if (hasExpander) off += EXPANDER_COL_W
    for (let i = 0; i < idx; i++) off += leftPinned[i].width!
    return off
  }
  // Left edge of the expander/selection columns (they sit after the drag handle).
  const selectColLeft = hasRowDrag ? ROW_DRAG_W : 0
  const expanderColLeft = selectColLeft + (selectable ? SELECT_COL_W : 0)
  // Total table width (sum of every column) — used to size the DragOverlay clone,
  // which is detached from the real <table>'s layout context.
  const totalTableWidth =
    (hasRowDrag ? ROW_DRAG_W : 0) +
    (selectable ? SELECT_COL_W : 0) +
    (hasExpander ? EXPANDER_COL_W : 0) +
    orderedCols.reduce((s, c) => s + (c.width ?? 160), 0) +
    (rowActionsTrailingColumn ? ROW_ACTIONS_COL_W : 0)
  const stickyRightOffset = (idx: number) => {
    let off = rowActionsTrailingColumn ? 44 : 0
    for (let i = rightPinned.length - 1; i > idx; i--) off += rightPinned[i].width!
    return off
  }

  const showEmpty = visibleRows.length === 0 && !(loading && data.length === 0)

  /* --- per-row renderer (reused for normal rows, sortable rows, and the drag overlay) --- */
  const renderRow = (row: R, ri: number, dnd?: RowDnd, overlay = false): ReactNode => {
    const id = getRowId(row)
    const isSel = selSet.has(id)
    const isExpanded = expandedSet.has(id)
    const disabledRow = rowDisabled(row)
    const stripe = zebra && ri % 2 === 1
    const isDragging = !!dnd?.isDragging
    const canDragRow = hasRowDrag && rowDraggable(row)
    const trStyle: CSSProperties | undefined = dnd
      ? { transform: dnd.transform, transition: dnd.transition }
      : undefined
    return (
      <FragmentRow key={overlay ? `${id}-overlay` : id}>
        <tr
          ref={dnd?.setNodeRef}
          style={trStyle}
          className={[
            'group',
            onRowClick && !disabledRow && !overlay ? 'cursor-pointer' : '',
            isSel ? ROW_SELECTED_BG : stripe ? 'bg-bg-sunk/40 hover:bg-bg-sunk' : 'hover:bg-bg-sunk',
            disabledRow ? 'opacity-50' : '',
            isDragging ? 'opacity-40' : '',
            overlay ? 'bg-bg-elev' : '',
            rowClassName?.(row) ?? '',
          ].filter(Boolean).join(' ')}
          onClick={overlay ? undefined : () => { if (!disabledRow) onRowClick?.(row) }}
          onContextMenu={!overlay && rowContextMenu ? (e) => { if (!disabledRow) openRowContextMenu(row, e) } : undefined}
        >
          {hasRowDrag && (
            <td
              className={`px-1 ${rowPad[density]} align-middle border-b border-line sticky left-0 z-20 ${isSel ? ROW_SELECTED_BG : 'bg-bg-elev'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <span
                ref={dnd?.setActivatorNodeRef}
                {...(canDragRow && dnd ? dnd.attributes : {})}
                {...(canDragRow && dnd ? dnd.listeners : {})}
                className={[
                  'inline-flex items-center justify-center w-full text-text-dim outline-none',
                  canDragRow ? 'cursor-grab active:cursor-grabbing hover:text-text touch-none' : 'opacity-30 cursor-not-allowed',
                ].join(' ')}
                aria-label={canDragRow ? 'Drag to reorder row' : undefined}
                aria-hidden={canDragRow ? undefined : true}
              >
                <svg width="10" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <circle cx="9" cy="5" r="1.7" /><circle cx="15" cy="5" r="1.7" />
                  <circle cx="9" cy="12" r="1.7" /><circle cx="15" cy="12" r="1.7" />
                  <circle cx="9" cy="19" r="1.7" /><circle cx="15" cy="19" r="1.7" />
                </svg>
              </span>
            </td>
          )}
          {selectable && (
            <td className={`px-3 ${rowPad[density]} align-middle border-b border-line sticky z-20 ${isSel ? ROW_SELECTED_BG : 'bg-bg-elev'}`} style={{ left: selectColLeft }} onClick={(e) => { e.stopPropagation(); if (!overlay) toggleRow(row) }}>
              {selectable === 'single' ? (
                <Radio
                  checked={isSel}
                  disabled={!rowSelectable(row) || disabledRow}
                  onChange={() => toggleRow(row)}
                  aria-label="Select row"
                />
              ) : (
                <Checkbox
                  checked={isSel}
                  disabled={!rowSelectable(row) || disabledRow}
                  onChange={() => toggleRow(row)}
                  aria-label="Select row"
                />
              )}
            </td>
          )}
          {hasExpander && (
            <td className={`px-3 ${rowPad[density]} align-middle border-b border-line sticky z-20 ${isSel ? ROW_SELECTED_BG : 'bg-bg-elev'}`} style={{ left: expanderColLeft }} onClick={(e) => { e.stopPropagation(); if (!overlay && rowExpandable(row)) setExpanded((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n }) }}>
              {rowExpandable(row) && (
                <button type="button" aria-label={isExpanded ? 'Collapse' : 'Expand'} className="text-text-dim hover:text-text">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform .1s' }}>
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </button>
              )}
            </td>
          )}
          {orderedCols.map((c) => {
            const isLeft = c.pinned === 'left', isRight = c.pinned === 'right'
            const leftIdx = leftPinned.findIndex((x) => x.key === c.key)
            const rightIdx = rightPinned.findIndex((x) => x.key === c.key)
            const editCfg = !overlay && onCellEdit ? resolveEditable(c, row) : null
            const isEditing = !overlay && editing != null && editing.rowId === id && editing.key === c.key
            const isInlineActionCell = !!rowActions && rowActionsColumn === c.key
            return (
              <td
                key={c.key}
                ref={isEditing ? (el) => { editingAnchorRef.current = el } : undefined}
                className={[
                  cellStyles(), rowPad[density],
                  isLeft || isRight ? `sticky z-10 ${isSel ? ROW_SELECTED_BG : 'bg-bg-elev'}` : '',
                  c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : '',
                  editCfg && !isEditing ? 'cursor-text' : '',
                  isInlineActionCell ? 'relative pr-12' : '',
                ].filter(Boolean).join(' ')}
                style={isLeft ? { left: stickyLeftOffset(leftIdx) } : isRight ? { right: stickyRightOffset(rightIdx) } : undefined}
                title={isEditing ? undefined : cellText(c, row)}
                onClick={editCfg ? (e) => { if (!isEditing) { e.stopPropagation(); startEditing(row, c.key) } } : undefined}
              >
                <CellContent col={c} row={row} />
                {isInlineActionCell && !overlay && (
                  <span
                    className={[
                      'absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 z-10',
                      // Subtle gradient backdrop so the buttons read on top of long cell content.
                      'pl-3 pr-1 py-0.5 rounded-sm',
                      isSel ? '' : 'bg-linear-to-l from-bg-elev via-bg-elev to-transparent',
                      rowActionsOnHover ? 'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-100' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {rowActions!(row)}
                  </span>
                )}
              </td>
            )
          })}
          {rowActionsTrailingColumn && (
            <td
              className={[
                cellStyles(), rowPad[density],
                'sticky right-0 z-10',
                isSel ? ROW_SELECTED_BG : 'bg-bg-elev',
                rowActionsOnHover && !overlay ? 'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-100' : '',
              ].filter(Boolean).join(' ')}
              onClick={(e) => e.stopPropagation()}
            >
              {!overlay && rowActions!(row)}
            </td>
          )}
        </tr>
        {hasExpander && isExpanded && !overlay && (
          <tr>
            <td colSpan={colCount} className="px-4 py-3 bg-bg-sunk border-b border-line">
              {renderExpanded!(row)}
            </td>
          </tr>
        )}
      </FragmentRow>
    )
  }

  return (
    <div className={['flex flex-col border border-line rounded-md bg-bg-elev overflow-hidden min-h-0 relative', fillHeight ? 'h-full' : '', className].filter(Boolean).join(' ')}>
      {/* toolbar */}
      {toolbarVisible && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 px-3 py-2 border-b border-line">
          {search && (() => {
            const submitMode = resolvedSearchMode === 'submit'
            const applySearch = (val: string) => { setQ(val); setPage(0) }
            return (
              <div className="relative" style={{ width: 240 }}>
                <Input
                  clearable
                  value={searchBoxValue}
                  onChange={(e) => {
                    if (submitMode) setSearchDraft(e.target.value)
                    else applySearch(e.target.value)
                  }}
                  onKeyDown={(e) => { if (submitMode && e.key === 'Enter') { e.preventDefault(); applySearch(searchDraft) } }}
                  onBlur={() => { if (submitMode && searchDraft !== q) applySearch(searchDraft) }}
                  onClear={() => applySearch('')}
                  placeholder={submitMode ? 'Search… (press Enter)' : 'Search…'}
                  aria-label="Search"
                  style={{ paddingLeft: 30 }}
                />
                <button
                  type="button"
                  aria-label="Search"
                  tabIndex={-1}
                  onClick={() => applySearch(searchBoxValue)}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-dim hover:text-text z-10"
                  style={{ cursor: submitMode ? 'pointer' : 'default', pointerEvents: submitMode ? 'auto' : 'none' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
            )
          })()}
          {activeFilterCount > 0 && (
            <Button size="xs" intent="ghost" className="whitespace-nowrap" onClick={() => setFilters({})}>Clear filters ({activeFilterCount})</Button>
          )}
          <div className="ml-auto flex items-center gap-2">
            {showDensityControl && (
              <Select
                aria-label="Row density"
                value={density}
                onChange={(v) => setDensity(v as NxDensity)}
                options={DENSITY_OPTIONS}
              />
            )}
            {showColumnControl && (
              <div className="relative">
                <Button
                  intent="default"
                  className="whitespace-nowrap"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (columnManager === 'dialog') setColDialogOpen(true)
                    else setColMenuOpen((o) => !o)
                  }}
                >
                  Columns
                </Button>
                {columnManager === 'menu' && colMenuOpen && (
                  <div className="absolute right-0 mt-1 z-[52] min-w-[180px] bg-bg-elev border border-line rounded-md shadow-md p-1" onClick={(e) => e.stopPropagation()}>
                    {columnsProp.map((c) => (
                      <label key={c.key} className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-xs hover:bg-bg-sunk cursor-pointer">
                        <Checkbox
                          checked={!hidden.has(c.key)}
                          onChange={() => setHidden((h) => { const n = new Set(h); if (n.has(c.key)) n.delete(c.key); else n.add(c.key); return n })}
                        />
                        {c.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {showExport && (
              <Button intent="ghost" className="whitespace-nowrap" onClick={exportCsv}>Export CSV</Button>
            )}
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
      <DndContext
        sensors={hasRowDrag ? dndSensors : undefined}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
        onDragStart={hasRowDrag ? onDndDragStart : undefined}
        onDragEnd={hasRowDrag ? onDndDragEnd : undefined}
        onDragCancel={hasRowDrag ? onDndDragCancel : undefined}
      >
      <div className={fillHeight ? 'overflow-auto flex-1 min-h-0' : 'overflow-auto'}>
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            {hasRowDrag && <col style={{ width: ROW_DRAG_W }} />}
            {selectable && <col style={{ width: SELECT_COL_W }} />}
            {hasExpander && <col style={{ width: EXPANDER_COL_W }} />}
            {orderedCols.map((c) => <col key={c.key} style={{ width: c.width }} />)}
            {rowActionsTrailingColumn && <col style={{ width: ROW_ACTIONS_COL_W }} />}
          </colgroup>
          <thead>
            <tr>
              {hasRowDrag && <th className="sticky left-0 bg-bg-sunk z-30" style={{ top: stickyTop }} />}
              {selectable && (
                <th className="px-3 py-2 text-left sticky bg-bg-sunk z-30" style={{ left: selectColLeft, top: stickyTop }}>
                  {selectable === 'multi' && (
                    <Checkbox
                      checked={allVisibleSelected}
                      disabled={selectableRows.length === 0}
                      indeterminate={!allVisibleSelected && someVisibleSelected}
                      onChange={toggleAll}
                      aria-label="Select all on this page"
                    />
                  )}
                </th>
              )}
              {hasExpander && <th className="sticky bg-bg-sunk z-30" style={{ left: expanderColLeft, top: stickyTop }} />}
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
                      'px-3 py-2 text-left text-[11px] uppercase tracking-[0.04em] font-medium text-text-muted select-none bg-bg-sunk sticky',
                      isLeft || isRight ? 'z-30' : 'z-20',
                      c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : '',
                    ].filter(Boolean).join(' ')}
                    style={{
                      top: stickyTop ?? 0,
                      ...(isLeft ? { left: stickyLeftOffset(leftIdx) } : isRight ? { right: stickyRightOffset(rightIdx) } : {}),
                    }}
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
                          <Select value={filters[c.key] || undefined} onChange={(v) => { setFilters((f) => ({ ...f, [c.key]: (v as string) ?? '' })); setPage(0) }} options={filterSelectOptions[c.key] ?? []} placeholder="All" />
                        ) : c.filterKind === 'range' ? (
                          <div className="flex items-center gap-1.5">
                            <Input type="number" placeholder="min" style={{ width: 90 }} value={(filters[c.key] ?? '|').split('|')[0]} onChange={(e) => { const hi = (filters[c.key] ?? '|').split('|')[1] ?? ''; setFilters((f) => ({ ...f, [c.key]: `${e.target.value}|${hi}` })); setPage(0) }} />
                            <span className="text-text-dim">–</span>
                            <Input type="number" placeholder="max" style={{ width: 90 }} value={(filters[c.key] ?? '|').split('|')[1] ?? ''} onChange={(e) => { const lo = (filters[c.key] ?? '|').split('|')[0] ?? ''; setFilters((f) => ({ ...f, [c.key]: `${lo}|${e.target.value}` })); setPage(0) }} />
                          </div>
                        ) : (
                          <Input autoFocus placeholder="contains…" value={filters[c.key] ?? ''} onChange={(e) => { setFilters((f) => ({ ...f, [c.key]: e.target.value })); setPage(0) }} style={{ width: 200 }} />
                        )}
                        <div className="flex justify-end mt-1.5">
                          <Button size="xs" intent="ghost" onClick={() => { setFilters((f) => { const n = { ...f }; delete n[c.key]; return n }); setOpenFilterCol(null) }}>Clear</Button>
                        </div>
                      </div>
                    )}
                    <span
                      role="separator"
                      aria-orientation="vertical"
                      onMouseDown={(e) => onResizeStart(e, c.key, c.width!)}
                      className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize hover:bg-accent/40"
                    />
                  </th>
                )
              })}
              {rowActionsTrailingColumn && <th className="sticky right-0 bg-bg-sunk z-30" style={{ top: stickyTop ?? 0 }} />}
            </tr>
          </thead>
          <tbody>
            {loading && data.length === 0 ? (
              <tr><td colSpan={colCount} className="px-3 py-12 text-center">{loadingState ?? <span className="inline-flex items-center gap-2 text-sm text-text-muted"><Spinner size="sm" /> Loading…</span>}</td></tr>
            ) : showEmpty ? (
              <tr><td colSpan={colCount} className="px-3 py-10 text-center text-sm text-text-dim">{emptyState ?? 'No rows match the current filters.'}</td></tr>
            ) : hasRowDrag ? (
              <SortableContext items={visibleRowIds} strategy={verticalListSortingStrategy}>
                {visibleRows.map((row, ri) => {
                  const id = getRowId(row)
                  return (
                    <SortableRow key={id} id={id} disabled={!rowDraggable(row)}>
                      {(dnd) => renderRow(row, ri, dnd)}
                    </SortableRow>
                  )
                })}
              </SortableContext>
            ) : (
              visibleRows.map((row, ri) => <FragmentRow key={getRowId(row)}>{renderRow(row, ri)}</FragmentRow>)
            )}
          </tbody>
          {summary && visibleRows.length > 0 && (
            <tfoot className="sticky bottom-0 z-20">
              <tr className="bg-bg-sunk">
                <td colSpan={colCount} className="px-3 py-2 text-sm text-text border-t border-line">
                  {summary(visibleRows)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {hasRowDrag && (
        <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
          {activeDragRow ? (
            <table className="border-collapse bg-bg-elev shadow-lg" style={{ tableLayout: 'fixed', width: totalTableWidth }}>
              <colgroup>
                {hasRowDrag && <col style={{ width: ROW_DRAG_W }} />}
                {selectable && <col style={{ width: SELECT_COL_W }} />}
                {hasExpander && <col style={{ width: EXPANDER_COL_W }} />}
                {orderedCols.map((c) => <col key={c.key} style={{ width: c.width }} />)}
                {rowActionsTrailingColumn && <col style={{ width: ROW_ACTIONS_COL_W }} />}
              </colgroup>
              <tbody>{renderRow(activeDragRow, 0, undefined, true)}</tbody>
            </table>
          ) : null}
        </DragOverlay>
      )}
      </DndContext>

      {/* footer / pagination */}
      {paginate && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 border-t border-line text-xs text-text-muted select-none">
          <span className="whitespace-nowrap">
            {totalCount === 0 ? '0' : `${safePage * pageSize + 1}–${Math.min(totalCount, (safePage + 1) * pageSize)}`} of {totalCount}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <span className="whitespace-nowrap">Rows per page</span>
            <Select value={String(pageSize)} onChange={(v) => { setPageSize(Number(v)); setPage(0) }} options={pageSizeSelectOptions} />
            <div className="flex items-center gap-1.5 ml-1">
              <Button intent="default" disabled={safePage === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</Button>
              <span className="tabular-nums whitespace-nowrap px-1">{safePage + 1} / {pageCount}</span>
              <Button intent="default" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>Next</Button>
            </div>
          </div>
        </div>
      )}

      {/* loading overlay (when there's already data on screen) */}
      {loading && data.length > 0 && (
        <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--color-bg-elev)_55%,transparent)] backdrop-blur-[1px] grid place-items-center z-40" aria-busy>
          <span className="inline-flex items-center gap-2 text-sm text-text-muted bg-bg-elev border border-line rounded-md px-3 py-1.5 shadow-sm">
            <Spinner size="sm" /> Loading…
          </span>
        </div>
      )}

      {columnManager === 'dialog' && (
        <ColumnManagerDialog
          open={colDialogOpen}
          onClose={() => setColDialogOpen(false)}
          allColumns={columnsProp}
          hidden={hidden}
          colOrder={colOrder}
          colPins={colPins}
          onApply={(next) => {
            setHidden(new Set(next.hidden))
            setColOrder(next.order)
            setColPins(next.pins)
            setColDialogOpen(false)
          }}
          onResetDefaults={() => {
            setHidden(new Set(columnsProp.filter((c) => c.hidden).map((c) => c.key)))
            setColOrder(columnsProp.map((c) => c.key))
            setColPins({})
            setColDialogOpen(false)
          }}
        />
      )}

      {rowContextMenu && ctxMenu.render()}

      {activeEdit && (
        <CellEditor
          editable={activeEdit.cfg}
          anchorRef={editingAnchorRef}
          args={{
            value: (activeEdit.row as Record<string, unknown>)[activeEdit.col.key],
            row: activeEdit.row,
            commit: (v) => commitEdit(activeEdit.row, activeEdit.col.key, v),
            cancel: cancelEdit,
          }}
        />
      )}
    </div>
  )
}

// React fragments can't take a key on a <tr> pair cleanly without a wrapper; use a keyed Fragment.
function FragmentRow({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/* -------------------------------------------------------------------------- */
/* Sortable row wrapper (render-prop so the row body stays in NxTable's scope)  */
/* -------------------------------------------------------------------------- */

type SortableState = ReturnType<typeof useSortable>
interface RowDnd {
  setNodeRef: SortableState['setNodeRef']
  setActivatorNodeRef: SortableState['setActivatorNodeRef']
  attributes: SortableState['attributes']
  listeners: SortableState['listeners']
  transform: string | undefined
  transition: string | undefined
  isDragging: boolean
}

function SortableRow({ id, disabled, children }: { id: string; disabled?: boolean; children: (dnd: RowDnd) => ReactNode }) {
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id, disabled })
  return children({
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform: CSS.Transform.toString(transform) ?? undefined,
    transition: transition ?? undefined,
    isDragging,
  })
}
