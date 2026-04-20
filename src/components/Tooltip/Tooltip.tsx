import type { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const tooltipStyles = tv({
  slots: {
    // group enables peer-style hover propagation to the tip via variants
    base: 'group relative inline-flex',
    tip: [
      'absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2',
      'bg-[oklch(0.18_0.015_250)] text-white',
      'text-[11px] leading-[1.3] px-2 py-[5px] rounded-xs whitespace-nowrap',
      'pointer-events-none shadow-md',
      'opacity-0 transition-opacity duration-[.12s]',
      'group-hover:opacity-100 group-focus-within:opacity-100',
      'data-[open=true]:opacity-100',
      // Arrow ::after
      'after:content-[""] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2',
      'after:border-4 after:border-transparent after:border-t-[oklch(0.18_0.015_250)]',
    ],
  },
})

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  tip: ReactNode
  /** Force show (useful for testing/demo). */
  open?: boolean
  children?: ReactNode
}

export function Tooltip({ tip, open, className, children, ...rest }: TooltipProps) {
  const { base, tip: tipCls } = tooltipStyles()
  return (
    <div className={base({ class: className })} {...rest}>
      {children}
      <span className={tipCls()} role="tooltip" data-open={open ? 'true' : undefined}>
        {tip}
      </span>
    </div>
  )
}
