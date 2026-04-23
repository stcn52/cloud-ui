import {
  createContext,
  useContext,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'

interface TabsContextValue {
  value: string
  onChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext)
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside a <Tabs value={...} onChange={...}>`)
  }
  return ctx
}

const tabsStyles = tv({
  base: 'flex gap-1 border-b border-line',
})

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Currently active tab id. */
  value: string
  /** Fired with the new tab id when the user clicks or keyboard-activates a tab. */
  onChange: (value: string) => void
  children?: ReactNode
}

export function Tabs({ value, onChange, className, children, ...rest }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={tabsStyles({ class: className })} role="tablist" {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export const tabStyles = tv({
  slots: {
    base: [
      'inline-flex items-center gap-1.5',
      'text-sm text-text-muted px-3 py-2 cursor-pointer',
      'border-b-2 border-transparent -mb-px',
      'hover:text-text',
    ],
    close: [
      'inline-grid place-items-center w-4 h-4 rounded-full',
      'text-text-dim hover:bg-bg-sunk hover:text-text',
      'border-0 bg-transparent p-0 cursor-pointer',
    ],
  },
  variants: {
    active: {
      true: { base: 'text-text border-b-accent font-medium' },
      false: {},
    },
  },
  defaultVariants: { active: false },
})

export interface TabProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  /** The id matched against the parent Tabs `value`. */
  id: string
  /** Show a trailing `×` button. */
  closable?: boolean
  /** Fired when the `×` is clicked. */
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void
  children?: ReactNode
}

export function Tab({
  id,
  closable,
  onClose,
  className,
  children,
  ...rest
}: TabProps) {
  const { value, onChange } = useTabsContext('Tab')
  const active = value === id
  const { base, close } = tabStyles({ active })

  return (
    <div
      className={base({ class: className })}
      role="tab"
      tabIndex={active ? 0 : -1}
      aria-selected={active}
      data-tab-id={id}
      onClick={() => onChange(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onChange(id)
        }
      }}
      {...rest}
    >
      {children}
      {closable && (
        <button
          type="button"
          aria-label="Close tab"
          className={close()}
          onClick={(e) => {
            e.stopPropagation()
            onClose?.(e)
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
}

export { TabsContext }
