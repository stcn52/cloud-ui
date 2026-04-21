import type { HTMLAttributes, MouseEvent, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const tabsStyles = tv({
  base: 'flex gap-1 border-b border-line',
})

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function Tabs({ className, children, ...rest }: TabsProps) {
  return (
    <div className={tabsStyles({ class: className })} role="tablist" {...rest}>
      {children}
    </div>
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

export interface TabProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean
  /** Show a trailing `×` button. */
  closable?: boolean
  /** Fired when the `×` is clicked. `onClick` still fires when the body is clicked. */
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void
  children?: ReactNode
}

export function Tab({
  active,
  closable,
  onClose,
  className,
  children,
  onClick,
  ...rest
}: TabProps) {
  const { base, close } = tabStyles({ active })
  return (
    <div
      className={base({ class: className })}
      role="tab"
      tabIndex={0}
      aria-selected={active}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
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
