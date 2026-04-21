import type { HTMLAttributes, MouseEvent, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

/**
 * Chrome-style tabs: rounded top corners, active tab blends into the content
 * surface below (no underline). Use for file/document browsers where each tab
 * owns a full panel. Meant to be paired with a bottom border drawn by the
 * container so the active tab visually "sits on" the content.
 */
export const cardTabsStyles = tv({
  base: [
    // Row of tabs — add a bottom border so inactive tabs look like they sit
    // above it and the active tab interrupts it.
    'flex items-end gap-0.5',
  ],
})

export interface CardTabsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function CardTabs({ className, children, ...rest }: CardTabsProps) {
  return (
    <div className={cardTabsStyles({ class: className })} role="tablist" {...rest}>
      {children}
    </div>
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
      true: {
        base: 'bg-bg-elev text-text border-line',
      },
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

export interface CardTabProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean
  closable?: boolean
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void
  icon?: ReactNode
  children?: ReactNode
}

export function CardTab({
  active,
  closable,
  onClose,
  icon,
  className,
  children,
  onClick,
  ...rest
}: CardTabProps) {
  const { base, close } = cardTabStyles({ active })
  return (
    <div
      role="tab"
      tabIndex={0}
      aria-selected={active}
      className={base({ class: className })}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
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
