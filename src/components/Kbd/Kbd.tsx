import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
}

export function Kbd({ className, children, ...rest }: KbdProps) {
  return (
    <kbd className={className ? cx(className) : undefined} {...rest}>
      {children}
    </kbd>
  )
}
