import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export type RingTone = 'accent' | 'warn' | 'err' | 'ok'

export interface RingProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  tone?: RingTone
  children?: ReactNode
}

const toneVar: Record<RingTone, string> = {
  accent: 'var(--accent)',
  warn: 'var(--warn)',
  err: 'var(--err)',
  ok: 'var(--ok)',
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
    ['--p' as string]: pct,
    background: `conic-gradient(${toneVar[tone]} calc(var(--p) * 1%), var(--bg-sunk) 0)`,
  }
  return (
    <div className={cx('ring', className)} style={mergedStyle} {...rest}>
      <span>{children ?? `${Math.round(pct)}%`}</span>
    </div>
  )
}
