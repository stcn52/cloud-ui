import type { HTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const progressStyles = tv({
  slots: {
    base: 'h-1.5 rounded-[3px] bg-bg-sunk overflow-hidden',
    bar: 'block h-full rounded-[3px]',
  },
  variants: {
    tone: {
      accent: { bar: 'bg-accent' },
      warn:   { bar: 'bg-warn' },
      err:    { bar: 'bg-err' },
    },
  },
  defaultVariants: { tone: 'accent' },
})

type ProgressVariants = VariantProps<typeof progressStyles>
export type ProgressTone = NonNullable<ProgressVariants['tone']>

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  tone?: ProgressTone
}

export function Progress({
  value,
  max = 100,
  tone = 'accent',
  className,
  ...rest
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const { base, bar } = progressStyles({ tone })
  return (
    <div
      className={base({ class: className })}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      {...rest}
    >
      <span className={bar()} style={{ width: `${pct}%` }} />
    </div>
  )
}
