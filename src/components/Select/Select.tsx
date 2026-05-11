import {
  Fragment,
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
  /** Group heading — consecutive options sharing the same `group` render under one heading. */
  group?: string
  /** Secondary text shown right-aligned on the option row (e.g. a role or hint). */
  description?: ReactNode
  /** Leading element rendered before the label — an avatar, a status dot, an icon. */
  icon?: ReactNode
}

interface SelectBase<V extends string = string> {
  options: SelectOption<V>[]
  /** Text shown when nothing is selected. */
  placeholder?: ReactNode
  /** Enable type-to-filter inside the dropdown. */
  searchable?: boolean
  /** Show a small × button to clear the value(s). */
  clearable?: boolean
  /** Sticky element rendered at the bottom of the panel — e.g. an "+ Add new…" action. */
  footer?: ReactNode
  disabled?: boolean
  invalid?: boolean
  size?: 'sm' | 'md'
  className?: string
  'aria-label'?: string
}

interface SelectSingleProps<V extends string = string> extends SelectBase<V> {
  multiple?: false
  value?: V
  defaultValue?: V
  onChange?: (value: V | undefined) => void
}

interface SelectMultipleProps<V extends string = string> extends SelectBase<V> {
  multiple: true
  value?: V[]
  defaultValue?: V[]
  onChange?: (value: V[]) => void
  /** Limit how many chips render before collapsing into "+N". */
  maxTagCount?: number
}

export type SelectProps<V extends string = string> =
  | SelectSingleProps<V>
  | SelectMultipleProps<V>

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
      sm: 'min-h-[26px] px-2 text-xs py-0.5',
      md: 'min-h-[30px] px-2.5 text-sm py-1',
    },
    invalid: {
      true: 'border-err focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-err)_25%,transparent)]',
      false: 'border-line focus-visible:border-accent',
    },
    open: {
      true: 'border-accent shadow-[var(--shadow-focus)]',
      false: '',
    },
    multiple: {
      true: 'items-start',
      false: '',
    },
  },
  defaultVariants: { size: 'md', invalid: false, open: false, multiple: false },
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

const chipStyles = tv({
  base: [
    'inline-flex items-center gap-1 max-w-full',
    'px-1.5 py-0.5 rounded-xs text-xs',
    'bg-accent-weak text-accent-ink',
  ],
})

export const Select = forwardRef(function Select<V extends string = string>(
  props: SelectProps<V>,
  ref: React.Ref<HTMLButtonElement>,
) {
  // Internally treat both shapes as one permissive bag — the discriminated union
  // is enforced at the call site by the `as` cast on the export below.
  type AnyProps = SelectBase<V> & {
    multiple?: boolean
    value?: V | V[]
    defaultValue?: V | V[]
    onChange?: (v: V | V[] | undefined) => void
    maxTagCount?: number
  }
  const {
    options,
    placeholder = 'Select…',
    searchable = false,
    clearable = false,
    footer,
    disabled = false,
    invalid = false,
    size = 'md',
    className,
    multiple,
    value: _v,
    defaultValue: _dv,
    onChange: _oc,
    maxTagCount: _mtc,
    ...rest
  } = props as AnyProps

  // Normalize controlled/uncontrolled value across single/multi via internal array.
  const isControlled = _v !== undefined
  const initial: V[] = multiple
    ? ((_dv as V[] | undefined) ?? [])
    : (_dv as V | undefined) !== undefined
    ? [_dv as V]
    : []
  const [inner, setInner] = useState<V[]>(initial)
  const selected: V[] = multiple
    ? ((_v as V[] | undefined) ?? (isControlled ? [] : inner))
    : (_v as V | undefined) !== undefined
    ? [_v as V]
    : isControlled
    ? []
    : inner

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({ position: 'fixed', visibility: 'hidden' })

  const selectedSet = useMemo(() => new Set(selected), [selected])
  const selectedOptions = useMemo(
    () => selected.map((v) => options.find((o) => o.value === v)).filter(Boolean) as SelectOption<V>[],
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
    const firstSelected = filtered.findIndex((o) => selectedSet.has(o.value))
    setActiveIdx(Math.max(0, firstSelected))
  }, [open, filtered, selectedSet])

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

  const emit = (next: V[]) => {
    if (!isControlled) setInner(next)
    if (multiple) {
      ;(_oc as ((v: V[]) => void) | undefined)?.(next)
    } else {
      ;(_oc as ((v: V | undefined) => void) | undefined)?.(next[0])
    }
  }

  const commit = (opt: SelectOption<V>) => {
    if (opt.disabled) return
    if (multiple) {
      const next = selectedSet.has(opt.value)
        ? selected.filter((v) => v !== opt.value)
        : [...selected, opt.value]
      emit(next)
      // keep panel open in multi mode
    } else {
      emit([opt.value])
      setOpen(false)
      setQuery('')
      triggerRef.current?.focus()
    }
  }

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation()
    emit([])
  }

  const removeOne = (e: React.MouseEvent, v: V) => {
    e.stopPropagation()
    emit(selected.filter((x) => x !== v))
  }

  const onTriggerKey = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(true)
    } else if (e.key === 'Backspace' && multiple && selected.length > 0 && !open) {
      e.preventDefault()
      emit(selected.slice(0, -1))
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

  const showClear = clearable && !disabled && selected.length > 0
  const maxTagCount = multiple ? _mtc : undefined
  const visibleChips =
    multiple && maxTagCount !== undefined ? selectedOptions.slice(0, maxTagCount) : selectedOptions
  const overflow =
    multiple && maxTagCount !== undefined ? Math.max(0, selectedOptions.length - maxTagCount) : 0

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
        className={triggerStyles({ size, invalid, open, multiple: !!multiple, class: className })}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={onTriggerKey}
        {...rest}
      >
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
          {selected.length === 0 ? (
            <span style={{ color: 'var(--color-text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {placeholder}
            </span>
          ) : multiple ? (
            <>
              {visibleChips.map((opt) => (
                <span key={opt.value} className={chipStyles()} onClick={(e) => e.stopPropagation()}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {opt.label}
                  </span>
                  {!disabled && (
                    <button
                      type="button"
                      aria-label="Remove"
                      onClick={(e) => removeOne(e, opt.value)}
                      style={{
                        border: 0,
                        background: 'transparent',
                        color: 'inherit',
                        cursor: 'pointer',
                        padding: 0,
                        lineHeight: 1,
                        opacity: 0.6,
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  )}
                </span>
              ))}
              {overflow > 0 && (
                <span className={chipStyles()} style={{ background: 'var(--color-bg-sunk)', color: 'var(--color-text-muted)' }}>
                  +{overflow}
                </span>
              )}
            </>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, width: '100%' }}>
              {selectedOptions[0]?.icon !== undefined && (
                <span style={{ display: 'inline-flex', flexShrink: 0 }}>{selectedOptions[0]!.icon}</span>
              )}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedOptions[0]?.label}
              </span>
            </span>
          )}
        </span>
        {showClear && (
          <span
            role="button"
            aria-label="Clear"
            tabIndex={-1}
            onClick={clear}
            style={{ display: 'inline-flex', opacity: 0.6, cursor: 'pointer' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </span>
        )}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <Portal>
          <div
            ref={panelRef}
            role="listbox"
            aria-multiselectable={multiple || undefined}
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
                const isSelected = selectedSet.has(opt.value)
                // Emit a group heading whenever the group changes between consecutive options.
                const prevGroup = i > 0 ? filtered[i - 1].group : undefined
                const showHeading = opt.group !== undefined && opt.group !== prevGroup
                return (
                  <Fragment key={opt.value}>
                    {showHeading && (
                      <div
                        role="presentation"
                        style={{
                          padding: '6px 10px 2px',
                          fontSize: 10.5,
                          fontWeight: 500,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          color: 'var(--color-text-dim)',
                        }}
                      >
                        {opt.group}
                      </div>
                    )}
                    <div
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
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                        {multiple && (
                          <span
                            aria-hidden
                            style={{
                              width: 14,
                              height: 14,
                              border: '1px solid var(--color-line-strong)',
                              borderRadius: 3,
                              background: isSelected ? 'var(--color-accent)' : 'transparent',
                              color: 'white',
                              display: 'inline-grid',
                              placeItems: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {isSelected && (
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden>
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </span>
                        )}
                        {opt.icon !== undefined && (
                          <span style={{ display: 'inline-flex', flexShrink: 0 }}>{opt.icon}</span>
                        )}
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {opt.label}
                        </span>
                      </span>
                      {opt.description !== undefined && (
                        <span style={{ fontSize: 11, color: 'var(--color-text-dim)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                          {opt.description}
                        </span>
                      )}
                      {!multiple && isSelected && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden style={{ flexShrink: 0 }}>
                          <polyline points="5 12.5 10 17.5 19 7.5" />
                        </svg>
                      )}
                    </div>
                  </Fragment>
                )
              })}
            </div>
            {footer !== undefined && (
              <div style={{ borderTop: '1px solid var(--color-line)' }}>{footer}</div>
            )}
          </div>
        </Portal>
      )}
    </>
  )
}) as <V extends string = string>(
  p: SelectProps<V> & { ref?: React.Ref<HTMLButtonElement> },
) => React.ReactElement
