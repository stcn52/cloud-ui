import type { HTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const dividerStyles = tv({
  base: 'border-0 bg-line',
  variants: {
    orientation: {
      horizontal: 'h-px w-full my-2',
      vertical:   'w-px self-stretch mx-2 min-h-[1em]',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

type DividerVariants = VariantProps<typeof dividerStyles>
export type DividerOrientation = NonNullable<DividerVariants['orientation']>

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: DividerOrientation
}

export function Divider({ orientation = 'horizontal', className, ...rest }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        className={dividerStyles({ orientation, class: className })}
        {...(rest as HTMLAttributes<HTMLSpanElement>)}
      />
    )
  }
  return <hr className={dividerStyles({ orientation, class: className })} {...rest} />
}

/* ────────────────────────────────────────────────────────────────────────── */
/* DividerLabel — "or"-style separator with text on both sides                */
/* ────────────────────────────────────────────────────────────────────────── */

const dividerLabelStyles = tv({
  slots: {
    base: 'flex items-center gap-3 text-xs text-text-dim my-2',
    line: 'flex-1 h-px bg-line',
    label: 'whitespace-nowrap uppercase tracking-[0.05em]',
  },
})

export interface DividerLabelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function DividerLabel({ className, children, ...rest }: DividerLabelProps) {
  const { base, line, label } = dividerLabelStyles()
  return (
    <div role="separator" className={base({ class: className })} {...rest}>
      <span className={line()} />
      <span className={label()}>{children}</span>
      <span className={line()} />
    </div>
  )
}
