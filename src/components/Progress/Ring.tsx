import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

export const ringStyles = tv({
  slots: {
    base: [
      'w-14 h-14 rounded-full grid place-items-center relative',
      'before:content-[""] before:absolute before:inset-[5px]',
      'before:rounded-full before:bg-bg-elev',
    ],
    label: 'relative font-mono text-[11px] font-semibold',
  },
})

export type RingTone = 'accent' | 'warn' | 'err' | 'ok'

export interface RingProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  tone?: RingTone
  children?: ReactNode
}

const toneVar: Record<RingTone, string> = {
  accent: 'var(--color-accent)',
  warn:   'var(--color-warn)',
  err:    'var(--color-err)',
  ok:     'var(--color-ok)',
}

export function Ring({
  value,
  max = 100,
  tone = 'accent',
  className,
  style,
  children,
  ...rest
}: RingProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const mergedStyle: CSSProperties = {
    ...style,
    background: `conic-gradient(${toneVar[tone]} ${pct}%, var(--color-bg-sunk) 0)`,
  }
  const { base, label } = ringStyles()
  return (
    <div className={base({ class: className })} style={mergedStyle} {...rest}>
      <span className={label()}>{children ?? `${Math.round(pct)}%`}</span>
    </div>
  )
}
