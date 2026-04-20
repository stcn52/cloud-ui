import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'
import { Portal } from '../_internal/Portal'
import { backdropClass } from '../Dialog/Dialog'
import { Kbd } from '../Kbd/Kbd'
import { useBodyScrollLock } from '../../utils/useBodyScrollLock'
import { useLocale } from '../../context/ConfigProvider'

const paletteStyles = tv({
  slots: {
    base: [
      'fixed left-1/2 top-[72px] -translate-x-1/2',
      'w-[520px] max-w-[calc(100vw-32px)]',
      'bg-bg-elev border border-line rounded-lg shadow-lg',
      'z-[51] overflow-hidden',
    ],
    inp: 'px-4 py-3 border-b border-line flex items-center gap-2.5',
    inpInput: [
      'border-0 outline-0 bg-transparent',
      'text-lg w-full text-text font-[inherit]',
    ],
    list: 'p-1.5 max-h-[260px] overflow-auto',
    groupLabel: [
      'text-[10px] uppercase tracking-[0.05em]',
      'text-text-dim px-2.5 pt-2 pb-1',
    ],
    item: [
      'flex items-center gap-2.5 px-2.5 py-[7px] rounded-xs',
      'text-sm text-text w-full text-left',
      'bg-transparent border-0 font-[inherit] cursor-pointer',
      '[&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:stroke-current [&_svg]:fill-none [&_svg]:stroke-[1.5] [&_svg]:text-text-muted',
    ],
    itemOn: 'bg-accent-weak',
    itemLabel: 'flex-1',
    itemShortcut: 'ml-auto font-mono text-[10px] text-text-dim',
    empty: 'px-5 py-6 text-center text-text-muted text-sm',
  },
})

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
  /** Text shown when nothing matches. default "No results" */
  emptyLabel?: ReactNode
}

const defaultFilter = (item: CommandItem, q: string) =>
  item.label.toLowerCase().includes(q.toLowerCase())

export function CommandPalette({
  open,
  onClose,
  items,
  placeholder,
  emptyLabel,
  className,
  filter = defaultFilter,
}: CommandPaletteProps) {
  const locale = useLocale()
  const resolvedPlaceholder = placeholder ?? locale.commandPalette.placeholder
  const resolvedEmpty = emptyLabel ?? locale.commandPalette.empty
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

  const s = paletteStyles()
  let runningIdx = 0
  return (
    <Portal>
      <div className={backdropClass} onClick={onClose} aria-hidden="true" />
      <div className={s.base({ class: className })} role="dialog" aria-modal="true">
        <div className={s.inp()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-dim)" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={resolvedPlaceholder}
            className={s.inpInput()}
          />
          <Kbd>{locale.commandPalette.escape}</Kbd>
        </div>
        <div className={s.list()} role="listbox">
          {filtered.length === 0 ? (
            <div className={s.empty()}>{resolvedEmpty}</div>
          ) : (
            groups.map(([group, groupItems]) => (
              <div key={group || '_'}>
                {group && <div className={s.groupLabel()}>{group}</div>}
                {groupItems.map((it) => {
                  const idx = runningIdx++
                  const isActive = idx === activeIdx
                  return (
                    <button
                      key={it.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      className={isActive ? `${s.item()} ${s.itemOn()}` : s.item()}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => {
                        it.onSelect?.()
                        onClose?.()
                      }}
                    >
                      {it.icon}
                      <span className={s.itemLabel()}>{it.label}</span>
                      {it.shortcut !== undefined && <span className={s.itemShortcut()}>{it.shortcut}</span>}
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
