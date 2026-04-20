import type { HTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

export type DotTone = 'neutral' | 'ok' | 'warn' | 'err'

export interface DotProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: DotTone
}

const toneClass: Record<DotTone, string> = {
  neutral: '',
  ok: 'ok',
  warn: 'warn',
  err: 'err',
}

export function Dot({ tone = 'neutral', className, ...rest }: DotProps) {
  return <span className={cx('dot', toneClass[tone], className)} {...rest} />
}
