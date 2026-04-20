import type { HTMLAttributes, ReactNode } from 'react'
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
  base: [
    'text-sm text-text-muted px-3 py-2 cursor-pointer',
    'border-b-2 border-transparent -mb-px',
    'hover:text-text',
  ],
  variants: {
    active: {
      true: 'text-text border-b-accent font-medium',
      false: '',
    },
  },
  defaultVariants: { active: false },
})

export interface TabProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean
  children?: ReactNode
}

export function Tab({ active, className, children, onClick, ...rest }: TabProps) {
  return (
    <div
      className={tabStyles({ active, class: className })}
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
    </div>
  )
}
