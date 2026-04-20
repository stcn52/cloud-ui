import type { HTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

export type ProgressTone = 'accent' | 'warn' | 'err'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  tone?: ProgressTone
}

const toneClass: Record<ProgressTone, string> = {
  accent: '',
  warn: 'warn',
  err: 'err',
}

export function Progress({
  value,
  max = 100,
  tone = 'accent',
  className,
  ...rest
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div
      className={cx('progress', toneClass[tone], className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      {...rest}
    >
      <span style={{ width: `${pct}%` }} />
    </div>
  )
}
