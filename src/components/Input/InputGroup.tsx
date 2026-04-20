import type { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

export const inputGroupStyles = tv({
  base: [
    'flex border border-line rounded-sm bg-bg-elev overflow-hidden',
    'focus-within:border-accent focus-within:shadow-[var(--shadow-focus)]',
    // Input inside loses its own border/radius/shadow/background
    '[&>input]:border-0 [&>input]:rounded-none [&>input]:bg-transparent',
    '[&>input]:shadow-none [&>input:focus]:shadow-none',
    '[&>input:hover]:border-transparent',
  ],
})

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function InputGroup({ className, children, ...rest }: InputGroupProps) {
  return (
    <div className={inputGroupStyles({ class: className })} {...rest}>
      {children}
    </div>
  )
}

export const affixStyles = tv({
  base: [
    'flex items-center px-2.5 bg-bg-sunk text-text-dim',
    'text-xs font-mono',
    'border-r border-line',
  ],
  variants: {
    side: {
      left:  '',
      right: 'border-r-0 border-l border-line',
    },
  },
  defaultVariants: { side: 'left' },
})

export interface AffixProps extends HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right'
  children?: ReactNode
}

export function Affix({ side = 'left', className, children, ...rest }: AffixProps) {
  return (
    <div className={affixStyles({ side, class: className })} {...rest}>
      {children}
    </div>
  )
}
