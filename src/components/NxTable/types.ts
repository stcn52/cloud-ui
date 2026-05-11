import type { ReactNode } from 'react'

export type NxColumnType = 'text' | 'number' | 'money' | 'status' | 'date' | 'bar' | 'custom'
export type NxFilterKind = 'text' | 'select' | 'range'
export type NxDensity = 'compact' | 'normal' | 'comfy'
export type NxSortDir = 'asc' | 'desc'
export interface NxSortState { key: string; dir: NxSortDir }

/**
 * Payload for a row drag-reorder. Carries both the full new order (for the UI to
 * re-render) and the *local* move (for a backend to persist cheaply): a backend
 * keyed on fractional/lexorank only needs `beforeId`/`afterId` to compute the
 * new key for `movedId` — no need to renumber the whole list.
 */
export interface NxRowReorderEvent<R = Record<string, unknown>> {
  /** The dragged row's id. */
  movedId: string
  /** The dragged row (same reference as in `data`). */
  movedRow: R
  /** Index of the row before the drag (within the visible rows). */
  fromIndex: number
  /** Index the row landed at (within the visible rows). */
  toIndex: number
  /** Id of the row now immediately *above* the moved row — `null` if it's first. */
  beforeId: string | null
  /** Id of the row now immediately *below* the moved row — `null` if it's last. */
  afterId: string | null
  /** The full new id order (visible rows), with `movedId` in its new spot. */
  orderedIds: string[]
}

/** Args handed to a custom inline-cell editor. */
export interface NxCellEditorArgs<R = Record<string, unknown>> {
  value: unknown
  row: R
  /** Commit the new value (closes the editor and fires `onCellEdit`). */
  commit: (next: unknown) => void
  /** Discard and close the editor. */
  cancel: () => void
}

/**
 * Inline-edit config for a column. Either a built-in editor type, or a custom
 * `render`. Pass a function for per-row control (return `false` to disable).
 */
export type NxEditable<R = Record<string, unknown>> =
  | { type: 'text' | 'number' }
  | { type: 'select'; options: { value: string; label: ReactNode }[] }
  | { type: 'date' }
  | { render: (args: NxCellEditorArgs<R>) => ReactNode }

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
  /**
   * Custom sort comparator for this column. Receives raw cell values. Overrides
   * the type-based default. Only used in client-side sort mode.
   */
  sortFn?: (a: unknown, b: unknown, rowA: R, rowB: R) => number
  /**
   * Make this column's cells inline-editable. Clicking a cell opens an editor in
   * place; committing fires `NxTableProps.onCellEdit(row, key, value)`. A
   * function form gives per-row control (`false` ⇒ that cell isn't editable).
   * Disabled rows (`isRowDisabled`) are never editable.
   */
  editable?: NxEditable<R> | ((row: R) => NxEditable<R> | false)
}

export interface NxTableProps<R = Record<string, unknown>> {
  data: R[]
  columns: NxColumn<R>[]
  getRowId: (row: R) => string

  /* --- selection --- */
  selectable?: 'multi' | 'single' | false
  /** Controlled selection (array of row ids). */
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  /** Return `false` to disable selection for a row (its checkbox/radio is disabled and it's excluded from "select all"). */
  isRowSelectable?: (row: R) => boolean

  /* --- density / chrome --- */
  /**
   * Row density. When omitted, NxTable follows the global `ConfigProvider`
   * `size` (`compact` / `normal` / `comfortable`, mapped to `compact` / `normal`
   * / `comfy`). Pass this to pin a density for *this* table regardless of the
   * provider.
   */
  density?: NxDensity
  /**
   * Show the density picker in the toolbar (a local override of the global
   * density, just for this table). Default `false` — most apps drive density
   * globally via `ConfigProvider`.
   */
  showDensityControl?: boolean
  /** Show the "Columns" toolbar control. Default `false` — opt in when you want column show/hide (or `columnManager="dialog"`). */
  showColumnControl?: boolean
  /** Show the "Export CSV" toolbar button. Default `false` — opt in per table. */
  showExport?: boolean
  /** Striped (zebra) rows. Default false. */
  zebra?: boolean
  /** Show the toolbar at all. Default true. With only `search` on by default, the toolbar shows just the search box; it auto-hides when every control inside it is off. */
  showToolbar?: boolean
  /** Show the global search box. Default true. */
  search?: boolean
  /**
   * When the search box reports its value:
   * - `'live'` (default for client-side) — on every keystroke (instant local filtering).
   * - `'submit'` — only on Enter / blur / clicking the magnifier. The box keeps a
   *   local draft until then; the × clear button submits an empty value immediately.
   * When `manualFilter` is set, this defaults to `'submit'` (don't refetch per keystroke).
   */
  searchMode?: 'live' | 'submit'
  /** Controlled global-search query (the *applied* query, not the draft). */
  searchQuery?: string
  onSearchChange?: (query: string) => void
  /** Persist UI state (sort/filters/density/page-size/hidden cols/widths/order/pins) to localStorage under this key. */
  persistKey?: string

  /* --- pagination --- */
  paginate?: boolean
  pageSize?: number
  /** Page-size choices in the footer. Default [10, 20, 50, 100]. */
  pageSizeOptions?: number[]
  /** Controlled current page (0-based). */
  page?: number
  onPageChange?: (page: number) => void
  /** Controlled page size. */
  onPageSizeChange?: (size: number) => void
  /**
   * Total row count for server-side pagination — when set, `data` is treated
   * as the *current page only* and the footer/page-count use this number.
   * Implies `manualPagination`.
   */
  totalRows?: number

  /* --- server-side hooks --- */
  /** When true, NxTable does not paginate `data` itself — it only reports `page`/`pageSize` changes. */
  manualPagination?: boolean
  /** When true, NxTable does not sort `data` itself — only reports sort changes via `onSortChange`. */
  manualSort?: boolean
  /** When true, NxTable does not filter `data` itself — only reports filter/search changes. */
  manualFilter?: boolean
  /** Controlled sort. */
  sort?: NxSortState | null
  /** Fired when the user clicks a sortable header (asc → desc → none). */
  onSortChange?: (next: NxSortState | null) => void
  /** Fired when per-column filters change. The map is `columnKey → filterValue`. */
  onFilterChange?: (filters: Record<string, string>) => void

  /* --- expandable rows --- */
  /** Render an expanded panel below a row. When provided, an expander column is added. */
  renderExpanded?: (row: R) => ReactNode
  /** Controlled expanded row ids. */
  expandedIds?: string[]
  onExpandedChange?: (ids: string[]) => void
  /** Return `false` to hide the expander caret for a row. */
  isRowExpandable?: (row: R) => boolean

  /* --- per-row config --- */
  /** Extra className(s) for a row's `<tr>`. */
  rowClassName?: (row: R) => string | undefined
  /** Return `true` to render the row greyed out and non-interactive (no row click, no select). */
  isRowDisabled?: (row: R) => boolean
  /** Row click handler. */
  onRowClick?: (row: R) => void
  /** Fired when an inline-editable cell commits a new value. */
  onCellEdit?: (row: R, key: string, value: unknown) => void

  /* --- bulk / row actions --- */
  /** Bulk actions shown when ≥1 row is selected; receives the selected rows. */
  bulkActions?: (rows: R[]) => ReactNode
  /** Per-row action menu trigger content (rendered in a trailing column by default). */
  rowActions?: (row: R) => ReactNode
  /** Only show `rowActions` on row hover (otherwise it's transparent). Default false. */
  rowActionsOnHover?: boolean
  /**
   * When set, `rowActions` are absolutely-positioned **inside the named column's
   * cell** (right edge), instead of taking a trailing column of their own. This
   * matches the PingCode/Linear pattern where the title cell reveals ✎/⋮ on
   * hover. Pair with `rowActionsOnHover` so they only appear on hover.
   */
  rowActionsColumn?: string
  /**
   * Right-click (context) menu for a row. Receives the row plus a small ctx
   * (`{ selected, selection }` — whether *this* row is selected and the full
   * selected-row list). Render `ContextMenuItem`s / `Dropdown`-style items.
   */
  rowContextMenu?: (row: R, ctx: { selected: boolean; selection: R[] }) => ReactNode
  /** When right-clicking an *un*-selected row in a `selectable` table, select it first (file-manager behaviour). Default false. */
  selectOnContextMenu?: boolean

  /* --- footer / summary --- */
  /** Render a sticky summary/footer row below the body (totals, counts, …). Receives the rows currently in view. */
  summary?: (rowsInView: R[]) => ReactNode

  /* --- async --- */
  /** Show a loading overlay (spinner + dimmed body). Default false. */
  loading?: boolean
  /** Node shown in the body when `loading` and there's no data yet. Default a centered spinner row. */
  loadingState?: ReactNode

  /* --- state-change callbacks (for external persistence) --- */
  onColumnResize?: (key: string, width: number) => void
  onColumnReorder?: (orderedKeys: string[]) => void

  /* --- row reorder (drag-and-drop) --- */
  /**
   * Enable drag-to-reorder rows (powered by `@dnd-kit` — pointer + keyboard +
   * touch). A drag-handle column is prepended; dropping a row fires this callback
   * with an {@link NxRowReorderEvent}: the full new id order **and** the local
   * move (`beforeId`/`afterId`/`fromIndex`/`toIndex`/`movedRow`) so a backend can
   * persist with a single fractional-rank update instead of renumbering.
   * NxTable does **not** reorder `data` itself — apply `orderedIds` from the
   * callback (same pattern as `manualSort`). Disabled rows (`isRowDisabled`)
   * can't be dragged or dropped onto. The handle is also disabled while a `sort`
   * is active (sorted + manually-ordered don't mix) and when `paginate` is on
   * with more than one page.
   *
   * Plays nicely with `selectable` and pinned columns (the handle is its own
   * pinned-left column, before them). With `renderExpanded`, only the **collapsed
   * height** of a row is the drop target — collapse expanded rows before a long
   * drag if precise drop placement matters.
   */
  onRowReorder?: (event: NxRowReorderEvent<R>) => void
  /** Return `false` to lock a row in place (it can't be dragged or used as a drop target). Defaults to `!isRowDisabled(row)`. */
  isRowDraggable?: (row: R) => boolean

  /* --- misc --- */
  /** Empty-state node. */
  emptyState?: ReactNode
  /**
   * Stretch to fill the parent's height: the root becomes `h-full`, the table
   * scroll area takes the leftover space (toolbar pinned to the top, pagination
   * to the bottom, body scrolls internally). The parent must give NxTable a
   * height — set `height: 100%` on it, or place it in a flex container with
   * `flex: 1` (and remember `min-height: 0` on the flex parent so it can shrink).
   */
  fillHeight?: boolean
  /** Offset (px) for the sticky header — use when NxTable sits below a fixed app bar. Default 0. */
  stickyHeaderOffset?: number
  /**
   * How the "Columns" toolbar control behaves:
   * - `'menu'` (default) — a simple checkbox dropdown to show/hide columns.
   * - `'dialog'` — opens a `Transfer` dialog where you can show/hide, **reorder**,
   *   and pin columns to a "Frozen" group (left side). Order and pinning are
   *   tracked internally (and persisted with `persistKey`).
   */
  columnManager?: 'menu' | 'dialog'
  className?: string
}
