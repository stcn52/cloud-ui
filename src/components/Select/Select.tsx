import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'
import { Portal } from '../_internal/Portal'

export interface SelectOption<V extends string = string> {
  value: V
  label: ReactNode
  disabled?: boolean
  /** Optional group heading — consecutive options with the same group are collected. */
  group?: string
}

export interface SelectProps<V extends string = string> {
  /** Controlled value. */
  value?: V
  /** Uncontrolled initial value. */
  defaultValue?: V
  /** Called with the new selected value. */
  onChange?: (value: V) => void
  options: SelectOption<V>[]
  /** Text shown when nothing is selected. */
  placeholder?: ReactNode
  /** Enable type-to-filter inside the dropdown. */
  searchable?: boolean
  disabled?: boolean
  invalid?: boolean
  size?: 'sm' | 'md'
  className?: string
  /** Accessible label when no external <label> is bound. */
  'aria-label'?: string
}

const triggerStyles = tv({
  base: [
    'w-full flex items-center gap-2 text-left rounded-sm cursor-pointer',
    'border bg-bg-elev text-text font-[inherit] transition-colors duration-[.12s]',
    'hover:border-line-strong',
    'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
    'disabled:bg-bg-sunk disabled:text-text-muted disabled:cursor-not-allowed',
  ],
  variants: {
    size: {
      sm: 'h-[26px] px-2 text-xs',
      md: 'h-[30px] px-2.5 text-sm',
    },
    invalid: {
      true: 'border-err focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-err)_25%,transparent)]',
      false: 'border-line focus-visible:border-accent',
    },
    open: {
      true: 'border-accent shadow-[var(--shadow-focus)]',
      false: '',
    },
  },
  defaultVariants: { size: 'md', invalid: false, open: false },
})

const panelStyles = tv({
  base: [
    'bg-bg-elev border border-line rounded-md shadow-md',
    'z-[52] overflow-hidden flex flex-col',
    'min-w-[var(--select-anchor-w)]',
  ],
})

const optionStyles = tv({
  base: [
    'flex items-center justify-between gap-2 px-2.5 py-1.5 cursor-pointer text-sm',
    'text-text hover:bg-bg-sunk',
  ],
  variants: {
    active: { true: 'bg-bg-sunk', false: '' },
    selected: { true: 'text-accent-ink font-medium', false: '' },
    disabled: { true: 'opacity-50 cursor-not-allowed hover:bg-transparent', false: '' },
  },
  defaultVariants: { active: false, selected: false, disabled: false },
})

export const Select = forwardRef(function Select<V extends string = string>(
  {
    value,
    defaultValue,
    onChange,
    options,
    placeholder = 'Select…',
    searchable = false,
    disabled = false,
    invalid = false,
    size = 'md',
    className,
    ...rest
  }: SelectProps<V>,
  ref: React.Ref<HTMLButtonElement>,
) {
  const isControlled = value !== undefined
  const [inner, setInner] = useState<V | undefined>(defaultValue)
  const selected = isControlled ? value : inner

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({ position: 'fixed', visibility: 'hidden' })

  const selectedOption = useMemo(
    () => options.find((o) => o.value === selected),
    [options, selected],
  )

  const filtered = useMemo(() => {
    if (!searchable || !query) return options
    const q = query.toLowerCase()
    return options.filter((o) => {
      const txt = typeof o.label === 'string' ? o.label : String(o.value)
      return txt.toLowerCase().includes(q)
    })
  }, [options, searchable, query])

  useEffect(() => {
    if (!open) return
    const t = triggerRef.current
    if (!t) return
    const rect = t.getBoundingClientRect()
    const maxBelow = window.innerHeight - rect.bottom - 8
    const maxAbove = rect.top - 8
    const below = maxBelow >= 200 || maxBelow >= maxAbove
    setPanelStyle({
      position: 'fixed',
      top: below ? rect.bottom + 4 : Math.max(8, rect.top - 4 - 260),
      left: rect.left,
      '--select-anchor-w': `${rect.width}px`,
    } as React.CSSProperties)
    setActiveIdx(Math.max(0, filtered.findIndex((o) => o.value === selected)))
  }, [open, filtered, selected])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const commit = (opt: SelectOption<V>) => {
    if (opt.disabled) return
    if (!isControlled) setInner(opt.value)
    onChange?.(opt.value)
    setOpen(false)
    setQuery('')
    triggerRef.current?.focus()
  }

  const onTriggerKey = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(true)
    }
  }

  const onPanelKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(filtered.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const o = filtered[activeIdx]
      if (o) commit(o)
    }
  }

  return (
    <>
      <button
        ref={(node) => {
          triggerRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
        }}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        className={triggerStyles({ size, invalid, open, class: className })}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={onTriggerKey}
        {...rest}
      >
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span style={{ color: 'var(--color-text-dim)' }}>{placeholder}</span>
          )}
        </span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <Portal>
          <div
            ref={panelRef}
            role="listbox"
            tabIndex={-1}
            className={panelStyles()}
            style={panelStyle}
            onKeyDown={onPanelKey}
          >
            {searchable && (
              <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--color-line)' }}>
                <input
                  autoFocus
                  placeholder="Filter…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setActiveIdx(0)
                  }}
                  style={{
                    width: '100%',
                    border: 0,
                    outline: 'none',
                    background: 'transparent',
                    fontSize: 13,
                    fontFamily: 'inherit',
                    color: 'var(--color-text)',
                  }}
                />
              </div>
            )}
            <div style={{ maxHeight: 240, overflowY: 'auto', padding: 4 }}>
              {filtered.length === 0 && (
                <div style={{ padding: '8px 10px', fontSize: 12, color: 'var(--color-text-dim)' }}>
                  No results
                </div>
              )}
              {filtered.map((opt, i) => {
                const isSelected = opt.value === selected
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    className={optionStyles({
                      active: i === activeIdx,
                      selected: isSelected,
                      disabled: !!opt.disabled,
                    })}
                    onMouseEnter={() => setActiveIdx(i)}
                    onClick={() => commit(opt)}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                        <polyline points="5 12.5 10 17.5 19 7.5" />
                      </svg>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Portal>
      )}
    </>
  )
}) as <V extends string = string>(
  p: SelectProps<V> & { ref?: React.Ref<HTMLButtonElement> },
) => React.ReactElement
