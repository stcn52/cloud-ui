import {
  createContext,
  useCallback,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'

type AccordionType = 'single' | 'multiple'

interface AccordionContextValue {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

function useAccordionContext(component: string): AccordionContextValue {
  const ctx = useContext(AccordionContext)
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside an <Accordion>`)
  }
  return ctx
}

const accordionStyles = tv({
  base: 'flex flex-col rounded-md border border-line overflow-hidden bg-bg-elev divide-y divide-line',
})

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** `'single'` (default) closes the previously-open item when another opens; `'multiple'` allows several. */
  type?: AccordionType
  /** Controlled open value(s). A string for `single`, an array for `multiple`. */
  value?: string | string[]
  /** Uncontrolled initial open value(s). */
  defaultValue?: string | string[]
  /** Fired with the new open value(s) — a `string | undefined` for `single`, a `string[]` for `multiple`. */
  onValueChange?: (value: string | string[] | undefined) => void
  /** In `single` mode, allow clicking the open item to close it (so nothing is open). Default `true`. */
  collapsible?: boolean
  children?: ReactNode
}

const toArray = (v: string | string[] | undefined): string[] =>
  v === undefined ? [] : Array.isArray(v) ? v : [v]

export function Accordion({
  type = 'single',
  value,
  defaultValue,
  onValueChange,
  collapsible = true,
  className,
  children,
  ...rest
}: AccordionProps) {
  const isControlled = value !== undefined
  const [inner, setInner] = useState<string[]>(() => toArray(defaultValue))
  const openValues = isControlled ? toArray(value) : inner

  const emit = useCallback(
    (next: string[]) => {
      if (!isControlled) setInner(next)
      onValueChange?.(type === 'single' ? next[0] : next)
    },
    [isControlled, onValueChange, type],
  )

  const isOpen = useCallback((v: string) => openValues.includes(v), [openValues])

  const toggle = useCallback(
    (v: string) => {
      if (type === 'single') {
        if (openValues.includes(v)) emit(collapsible ? [] : [v])
        else emit([v])
      } else {
        emit(openValues.includes(v) ? openValues.filter((x) => x !== v) : [...openValues, v])
      }
    },
    [type, openValues, collapsible, emit],
  )

  return (
    <AccordionContext.Provider value={{ isOpen, toggle }}>
      <div className={accordionStyles({ class: className })} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

const itemStyles = tv({
  slots: {
    trigger: [
      'w-full flex items-center gap-2 px-3.5 py-2.5 text-left',
      'text-sm text-text font-medium cursor-pointer',
      'hover:bg-bg-sunk transition-colors duration-[.12s]',
      'focus-visible:outline-none focus-visible:bg-bg-sunk',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
    ],
    chevron: 'shrink-0 text-text-dim transition-transform duration-150',
    extra: 'ml-auto flex items-center gap-2 text-text-muted text-xs',
    panel: 'px-3.5 pb-3 pt-0.5 text-sm text-text-muted',
  },
  variants: {
    open: {
      true: { chevron: 'rotate-90' },
      false: {},
    },
  },
  defaultVariants: { open: false },
})

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Identifier matched against the parent Accordion's open value(s). */
  value: string
  /** Header label. */
  title: ReactNode
  /** Right-aligned header content — a count, a Pill, a Badge. */
  extra?: ReactNode
  /** Disable opening/closing. */
  disabled?: boolean
  children?: ReactNode
}

export function AccordionItem({
  value,
  title,
  extra,
  disabled,
  className,
  children,
  ...rest
}: AccordionItemProps) {
  const { isOpen, toggle } = useAccordionContext('AccordionItem')
  const open = isOpen(value)
  const { trigger, chevron, extra: extraCls, panel } = itemStyles({ open })
  const panelId = `accordion-panel-${value}`
  const triggerId = `accordion-trigger-${value}`

  return (
    <div className={className} data-state={open ? 'open' : 'closed'} {...rest}>
      <button
        type="button"
        id={triggerId}
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}
        className={trigger()}
        onClick={() => !disabled && toggle(value)}
      >
        <svg className={chevron()} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
          <polyline points="9 6 15 12 9 18" />
        </svg>
        <span>{title}</span>
        {extra !== undefined && <span className={extraCls()}>{extra}</span>}
      </button>
      {open && (
        <div id={panelId} role="region" aria-labelledby={triggerId} className={panel()}>
          {children}
        </div>
      )}
    </div>
  )
}

export { AccordionContext }
