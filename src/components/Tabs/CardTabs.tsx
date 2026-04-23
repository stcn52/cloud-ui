import {
  createContext,
  useContext,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'

interface CardTabsContextValue {
  value: string
  onChange: (value: string) => void
}

const CardTabsContext = createContext<CardTabsContextValue | null>(null)

function useCardTabsContext(component: string): CardTabsContextValue {
  const ctx = useContext(CardTabsContext)
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside a <CardTabs value={...} onChange={...}>`)
  }
  return ctx
}

/**
 * Chrome-style tabs: rounded top corners, active tab blends into the content
 * surface below (no underline). Use for file/document browsers where each tab
 * owns a full panel.
 */
export const cardTabsStyles = tv({
  base: ['flex items-end gap-0.5'],
})

export interface CardTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Currently active tab id. */
  value: string
  /** Fired with the new tab id. */
  onChange: (value: string) => void
  children?: ReactNode
}

export function CardTabs({ value, onChange, className, children, ...rest }: CardTabsProps) {
  return (
    <CardTabsContext.Provider value={{ value, onChange }}>
      <div className={cardTabsStyles({ class: className })} role="tablist" {...rest}>
        {children}
      </div>
    </CardTabsContext.Provider>
  )
}

export const cardTabStyles = tv({
  slots: {
    base: [
      'inline-flex items-center gap-1.5',
      'px-3 h-8 text-sm rounded-t-md',
      'border border-b-0 cursor-pointer select-none',
      'transition-colors',
    ],
    close: [
      'inline-grid place-items-center w-4 h-4 rounded-full',
      'text-text-dim hover:bg-line hover:text-text',
      'border-0 bg-transparent p-0 cursor-pointer',
    ],
  },
  variants: {
    active: {
      true: { base: 'bg-bg-elev text-text border-line' },
      false: {
        base: [
          'bg-bg-sunk text-text-muted border-transparent',
          'hover:bg-bg-elev/60 hover:text-text',
        ],
      },
    },
  },
  defaultVariants: { active: false },
})

export interface CardTabProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  id: string
  closable?: boolean
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void
  icon?: ReactNode
  children?: ReactNode
}

export function CardTab({
  id,
  closable,
  onClose,
  icon,
  className,
  children,
  ...rest
}: CardTabProps) {
  const { value, onChange } = useCardTabsContext('CardTab')
  const active = value === id
  const { base, close } = cardTabStyles({ active })

  return (
    <div
      role="tab"
      tabIndex={active ? 0 : -1}
      aria-selected={active}
      data-tab-id={id}
      className={base({ class: className })}
      onClick={() => onChange(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onChange(id)
        }
      }}
      {...rest}
    >
      {icon}
      <span>{children}</span>
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
