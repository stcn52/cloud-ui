import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Portal } from '../_internal/Portal'
import { useBodyScrollLock } from '../../utils/useBodyScrollLock'
import { cx } from '../../utils/cx'

export interface CommandItem {
  id: string
  label: string
  group?: string
  icon?: ReactNode
  shortcut?: ReactNode
  onSelect?: () => void
}

export interface CommandPaletteProps {
  open: boolean
  onClose?: () => void
  items: CommandItem[]
  placeholder?: string
  className?: string
  /** Filter function. Defaults to case-insensitive substring match on label. */
  filter?: (item: CommandItem, query: string) => boolean
}

const defaultFilter = (item: CommandItem, q: string) =>
  item.label.toLowerCase().includes(q.toLowerCase())

export function CommandPalette({
  open,
  onClose,
  items,
  placeholder = 'Search…',
  className,
  filter = defaultFilter,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useBodyScrollLock(open)

  const filtered = useMemo(
    () => (query ? items.filter((it) => filter(it, query)) : items),
    [items, query, filter],
  )

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>()
    for (const it of filtered) {
      const g = it.group ?? ''
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(it)
    }
    return Array.from(map.entries())
  }, [filtered])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActiveIdx(0)
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  useEffect(() => {
    setActiveIdx(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(filtered.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const it = filtered[activeIdx]
      if (it) {
        it.onSelect?.()
        onClose?.()
      }
    }
  }

  if (!open) return null

  let runningIdx = 0
  return (
    <Portal>
      <div className="overlay-backdrop" onClick={onClose} aria-hidden="true" />
      <div className={cx('cmd-palette', className)} role="dialog" aria-modal="true">
        <div className="inp">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
          />
          <kbd>esc</kbd>
        </div>
        <div className="list" role="listbox">
          {filtered.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
              No results
            </div>
          ) : (
            groups.map(([group, groupItems]) => (
              <div key={group || '_'}>
                {group && <div className="grp-l">{group}</div>}
                {groupItems.map((it) => {
                  const idx = runningIdx++
                  return (
                    <button
                      key={it.id}
                      type="button"
                      role="option"
                      aria-selected={idx === activeIdx}
                      className={cx('it', idx === activeIdx && 'on')}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => {
                        it.onSelect?.()
                        onClose?.()
                      }}
                    >
                      {it.icon}
                      <span style={{ flex: 1 }}>{it.label}</span>
                      {it.shortcut !== undefined && <span className="kb">{it.shortcut}</span>}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </Portal>
  )
}
