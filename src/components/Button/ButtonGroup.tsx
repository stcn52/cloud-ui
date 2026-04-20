import type { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

export const buttonGroupStyles = tv({
  base: [
    'inline-flex shadow-xs',
    // Flatten every child's radius/shadow/margin, then re-round first/last.
    '[&>button]:rounded-none [&>button]:shadow-none [&>button]:-ml-px',
    '[&>button:first-child]:rounded-l-sm [&>button:first-child]:ml-0',
    '[&>button:last-child]:rounded-r-sm',
  ],
})

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function ButtonGroup({ className, children, ...rest }: ButtonGroupProps) {
  return (
    <div className={buttonGroupStyles({ class: className })} {...rest}>
      {children}
    </div>
  )
}
