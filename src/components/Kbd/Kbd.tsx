import type { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

export const kbdStyles = tv({
  base: [
    'font-mono text-[10.5px] px-1.5 py-px',
    'border border-line border-b-2 rounded-xs',
    'bg-bg-elev text-text-muted',
  ],
})

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
}

export function Kbd({ className, children, ...rest }: KbdProps) {
  return (
    <kbd className={kbdStyles({ class: className })} {...rest}>
      {children}
    </kbd>
  )
}
