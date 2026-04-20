import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function Tabs({ className, children, ...rest }: TabsProps) {
  return (
    <div className={cx('tabs', className)} role="tablist" {...rest}>
      {children}
    </div>
  )
}

export interface TabProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean
  children?: ReactNode
}

export function Tab({ active, className, children, onClick, ...rest }: TabProps) {
  return (
    <div
      className={cx('tab', active && 'active', className)}
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
