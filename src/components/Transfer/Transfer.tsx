import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'

/* -------------------------------------------------------------------------- */
/* Model                                                                       */
/* -------------------------------------------------------------------------- */

export interface TransferItem {
  key: string
  label: ReactNode
  /** Leading element on the row (an icon / type glyph). */
  icon?: ReactNode
  /** Disabled items can't be moved (they stay wherever they are). */
  disabled?: boolean
  /** Plain-text projection for search; falls back to `label` if it's a string. */
  searchText?: string
}

/** An item on the target (right) side, with optional group assignment. */
export interface TransferTargetEntry {
  key: string
  /** Which target group this entry belongs to (matches `TransferGroup.id`). */
  group?: string
}

/** A target-side bucket — e.g. "Frozen (max 3)". */
export interface TransferGroup {
  id: string
  label: ReactNode
  /** Cap on how many entries this group accepts. Omit for unlimited. */
  max?: number
}

type TargetInput = string | TransferTargetEntry
const normalizeTarget = (v: TargetInput[]): TransferTargetEntry[] =>
  v.map((e) => (typeof e === 'string' ? { key: e } : { key: e.key, group: e.group }))

export interface TransferProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  items: TransferItem[]
  /** Controlled — keys (and optional group) currently on the target side, **in order**. */
  value?: TargetInput[]
  /** Uncontrolled initial target. */
  defaultValue?: TargetInput[]
  /** Fired with the new target entries (ordered). */
  onChange?: (value: TransferTargetEntry[]) => void
  /**
   * Target-side groups. When provided, the right pane is split into these
   * buckets (in declared order), plus an implicit "ungrouped" bucket for
   * entries with no `group`. Groups with a `max` reject drops past the cap.
   */
  groups?: TransferGroup[]
  /** Heading for the implicit ungrouped bucket when `groups` is set. Default "Other". */
  ungroupedLabel?: ReactNode
  /** Allow drag-to-reorder (and drag-between-groups) on the target side. Default true. */
  sortable?: boolean
  /** Titles above each pane — `[sourceTitle, targetTitle]`. */
  titles?: [ReactNode, ReactNode]
  /** Show the search box in each pane. Default true. */
  searchable?: boolean
  /** Search placeholder. Default "Search…". */
  searchPlaceholder?: string
  /** "Restore defaults" handler — the link is hidden when omitted. */
  onResetDefaults?: () => void
  /** Empty-state text for an empty pane. */
  emptyText?: ReactNode
  /** Fixed pane height in px. Default 280. */
  paneHeight?: number
  disabled?: boolean
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                      */
/* -------------------------------------------------------------------------- */

const paneStyles = tv({
  base: 'flex flex-col border border-line rounded-md bg-bg-elev overflow-hidden flex-1 min-w-0',
})
const rowStyles = tv({
  base: 'flex items-center gap-2 px-2.5 py-1.5 text-sm text-text cursor-pointer select-none rounded-xs',
  variants: {
    hover: { true: 'hover:bg-bg-sunk', false: '' },
    disabled: { true: 'opacity-50 cursor-not-allowed hover:bg-transparent', false: '' },
    dragging: { true: 'opacity-40', false: '' },
    dropTarget: { true: 'bg-accent-weak', false: '' },
  },
  defaultVariants: { hover: true, disabled: false, dragging: false, dropTarget: false },
})

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

const UNGROUPED = '__ungrouped__'

export function Transfer({
  items,
  value,
  defaultValue,
  onChange,
  groups,
  ungroupedLabel = 'Other',
  sortable = true,
  titles = ['Available', 'Selected'],
  searchable = true,
  searchPlaceholder = 'Search…',
  onResetDefaults,
  emptyText = 'Nothing here',
  paneHeight = 280,
  disabled = false,
  className,
  ...rest
}: TransferProps) {
  const isControlled = value !== undefined
  const [inner, setInner] = useState<TransferTargetEntry[]>(() => normalizeTarget(defaultValue ?? []))
  const target = isControlled ? normalizeTarget(value!) : inner

  const emit = useCallback((next: TransferTargetEntry[]) => {
    if (!isControlled) setInner(next)
    onChange?.(next)
  }, [isControlled, onChange])

  const itemMap = useMemo(() => new Map(items.map((i) => [i.key, i])), [items])
  const targetKeys = useMemo(() => new Set(target.map((e) => e.key)), [target])
  const sourceItems = useMemo(() => items.filter((i) => !targetKeys.has(i.key)), [items, targetKeys])

  const [srcQuery, setSrcQuery] = useState('')
  const [tgtQuery, setTgtQuery] = useState('')

  const matches = (it: TransferItem, q: string) => {
    if (!q) return true
    const hay = (it.searchText ?? (typeof it.label === 'string' ? it.label : it.key)).toLowerCase()
    return hay.includes(q.toLowerCase())
  }
  const filteredSource = useMemo(() => sourceItems.filter((i) => matches(i, srcQuery)), [sourceItems, srcQuery])

  /* --- move helpers --- */
  const addToTarget = (key: string, groupId?: string) => {
    const it = itemMap.get(key)
    if (!it || it.disabled) return
    if (groups && groupId && groupId !== UNGROUPED) {
      const g = groups.find((x) => x.id === groupId)
      if (g?.max !== undefined && target.filter((e) => e.group === groupId).length >= g.max) return
    }
    emit([...target, { key, group: groupId && groupId !== UNGROUPED ? groupId : undefined }])
  }
  const removeFromTarget = (key: string) => {
    const it = itemMap.get(key)
    if (it?.disabled) return
    emit(target.filter((e) => e.key !== key))
  }
  const addAll = () => emit([...target, ...filteredSource.filter((i) => !i.disabled).map((i) => ({ key: i.key }))])
  const removeAll = () => emit(target.filter((e) => itemMap.get(e.key)?.disabled))

  /* --- drag reorder / regroup on target side --- */
  const dragKey = useRef<string | null>(null)
  const [dragOver, setDragOver] = useState<{ key: string | null; group: string | null } | null>(null)

  const moveEntry = (key: string, beforeKey: string | null, groupId: string | undefined) => {
    const without = target.filter((e) => e.key !== key)
    const entry: TransferTargetEntry = { key, group: groupId && groupId !== UNGROUPED ? groupId : undefined }
    if (beforeKey === null) {
      // append to the end of its group (or overall list when ungrouped)
      // find last index belonging to this group; if none, append at end
      let insertAt = without.length
      if (groups) {
        for (let i = without.length - 1; i >= 0; i--) {
          if ((without[i].group ?? UNGROUPED) === (groupId ?? UNGROUPED)) { insertAt = i + 1; break }
          if (i === 0) insertAt = without.length
        }
      }
      without.splice(insertAt, 0, entry)
    } else {
      const idx = without.findIndex((e) => e.key === beforeKey)
      without.splice(idx < 0 ? without.length : idx, 0, entry)
    }
    // group capacity check
    if (groups && groupId && groupId !== UNGROUPED) {
      const g = groups.find((x) => x.id === groupId)
      const count = without.filter((e) => e.group === groupId).length
      if (g?.max !== undefined && count > g.max) return
    }
    emit(without)
  }

  const onRowDragStart = (key: string) => (e: React.DragEvent) => {
    if (!sortable || disabled) return
    if (itemMap.get(key)?.disabled) { e.preventDefault(); return }
    dragKey.current = key
    e.dataTransfer.effectAllowed = 'move'
  }
  const onRowDragOver = (overKey: string | null, groupId: string | null) => (e: React.DragEvent) => {
    if (!sortable || dragKey.current === null) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver({ key: overKey, group: groupId })
  }
  const onRowDrop = (overKey: string | null, groupId: string | null) => (e: React.DragEvent) => {
    if (!sortable || dragKey.current === null) return
    e.preventDefault()
    const k = dragKey.current
    dragKey.current = null
    setDragOver(null)
    if (k === overKey) return
    moveEntry(k, overKey, groupId ?? undefined)
  }
  const onDragEnd = () => { dragKey.current = null; setDragOver(null) }

  /* --- target-side rendering (grouped or flat) --- */
  const renderTargetRow = (entry: TransferTargetEntry, groupId: string | null) => {
    const it = itemMap.get(entry.key)
    if (!it) return null
    if (tgtQuery && !matches(it, tgtQuery)) return null
    const dragging = dragKey.current === entry.key
    const isDropTarget = dragOver?.key === entry.key
    return (
      <div
        key={entry.key}
        draggable={sortable && !disabled && !it.disabled}
        onDragStart={onRowDragStart(entry.key)}
        onDragOver={onRowDragOver(entry.key, groupId)}
        onDrop={onRowDrop(entry.key, groupId)}
        onDragEnd={onDragEnd}
        className={rowStyles({ disabled: !!it.disabled, dragging, dropTarget: isDropTarget })}
        onClick={() => removeFromTarget(entry.key)}
        role="option"
        aria-selected
      >
        {sortable && (
          <span className="text-text-dim shrink-0 cursor-grab" aria-hidden>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" /><circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" /><circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" /></svg>
          </span>
        )}
        {it.icon !== undefined && <span className="shrink-0 inline-flex">{it.icon}</span>}
        <span className="truncate flex-1">{it.label}</span>
        {!it.disabled && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden className="text-text-dim shrink-0">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        )}
      </div>
    )
  }

  const targetBuckets: { id: string; label: ReactNode; max: number | undefined; entries: TransferTargetEntry[] }[] = useMemo(() => {
    if (!groups) return [{ id: UNGROUPED, label: '', max: undefined, entries: target }]
    const out = groups.map((g) => ({ id: g.id, label: g.label, max: g.max, entries: target.filter((e) => e.group === g.id) }))
    out.push({ id: UNGROUPED, label: ungroupedLabel, max: undefined, entries: target.filter((e) => !e.group) })
    return out
  }, [groups, target, ungroupedLabel])

  const Pane = ({
    title, query, onQuery, children, footer,
  }: { title: ReactNode; query: string; onQuery: (v: string) => void; children: ReactNode; footer?: ReactNode }) => (
    <div className={paneStyles()} style={{ height: paneHeight }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-line">
        <span className="text-xs uppercase tracking-[0.05em] font-medium text-text-muted">{title}</span>
        {footer}
      </div>
      {searchable && (
        <div className="px-2 py-1.5 border-b border-line">
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent border-0 outline-none text-sm text-text placeholder:text-text-dim px-1"
          />
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-1">{children}</div>
    </div>
  )

  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')} {...rest}>
      <div className="flex items-stretch gap-3">
        {/* source */}
        <Pane
          title={titles[0]}
          query={srcQuery}
          onQuery={setSrcQuery}
          footer={
            <button
              type="button"
              disabled={disabled || filteredSource.every((i) => i.disabled)}
              onClick={addAll}
              className="ml-auto text-xs text-accent-ink hover:underline disabled:opacity-40 disabled:no-underline"
            >
              Add all
            </button>
          }
        >
          {filteredSource.length === 0 ? (
            <div className="px-2.5 py-6 text-center text-sm text-text-dim">{emptyText}</div>
          ) : filteredSource.map((it) => (
            <div
              key={it.key}
              className={rowStyles({ disabled: !!it.disabled })}
              onClick={() => !it.disabled && !disabled && addToTarget(it.key)}
              role="option"
              aria-selected={false}
            >
              {it.icon !== undefined && <span className="shrink-0 inline-flex">{it.icon}</span>}
              <span className="truncate flex-1">{it.label}</span>
              {!it.disabled && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden className="text-text-dim shrink-0">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
            </div>
          ))}
        </Pane>

        {/* target */}
        <Pane
          title={titles[1]}
          query={tgtQuery}
          onQuery={setTgtQuery}
          footer={
            <button
              type="button"
              disabled={disabled || target.every((e) => itemMap.get(e.key)?.disabled)}
              onClick={removeAll}
              className="ml-auto text-xs text-text-dim hover:text-text hover:underline disabled:opacity-40 disabled:no-underline"
            >
              Remove all
            </button>
          }
        >
          {target.length === 0 ? (
            <div
              className="px-2.5 py-6 text-center text-sm text-text-dim"
              onDragOver={onRowDragOver(null, groups ? UNGROUPED : null)}
              onDrop={onRowDrop(null, groups ? UNGROUPED : null)}
            >
              {emptyText}
            </div>
          ) : groups ? (
            targetBuckets.map((b) => (
              <div key={b.id} className="mb-1 last:mb-0">
                {(b.id !== UNGROUPED || b.entries.length > 0) && (
                  <div
                    className={[
                      'px-2 pt-1.5 pb-1 text-[10.5px] uppercase tracking-[0.05em] font-medium text-text-dim flex items-center gap-1.5',
                      dragOver?.group === b.id && dragOver?.key === null ? 'bg-accent-weak rounded-xs' : '',
                    ].filter(Boolean).join(' ')}
                    onDragOver={onRowDragOver(null, b.id)}
                    onDrop={onRowDrop(null, b.id)}
                  >
                    {b.label}
                    {b.max !== undefined && <span className="normal-case tracking-normal text-text-dim/80">({b.entries.length}/{b.max})</span>}
                  </div>
                )}
                <div
                  className="min-h-[6px]"
                  onDragOver={onRowDragOver(null, b.id)}
                  onDrop={onRowDrop(null, b.id)}
                >
                  {b.entries.map((e) => renderTargetRow(e, b.id))}
                </div>
              </div>
            ))
          ) : (
            <div
              onDragOver={onRowDragOver(null, null)}
              onDrop={onRowDrop(null, null)}
            >
              {target.map((e) => renderTargetRow(e, null))}
            </div>
          )}
        </Pane>
      </div>

      {onResetDefaults && (
        <div>
          <button type="button" onClick={onResetDefaults} className="text-xs text-accent-ink hover:underline">
            Restore defaults
          </button>
        </div>
      )}
    </div>
  )
}
