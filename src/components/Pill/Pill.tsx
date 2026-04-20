import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export type PillTone = 'neutral' | 'ok' | 'warn' | 'err' | 'info' | 'solid'
export type PillSize = 'md' | 'lg'

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone
  size?: PillSize
  mono?: boolean
  dot?: boolean
  dotColor?: string
  onRemove?: () => void
  children?: ReactNode
}

const toneClass: Record<PillTone, string> = {
  neutral: '',
  ok: 'ok',
  warn: 'warn',
  err: 'err',
  info: 'info',
  solid: 'solid',
}

export function Pill({
  tone = 'neutral',
  size = 'md',
  mono,
  dot,
  dotColor,
  onRemove,
  className,
  children,
  ...rest
}: PillProps) {
  return (
    <span
      className={cx('pill', toneClass[tone], size === 'lg' && 'lg', mono && 'mono', className)}
      {...rest}
    >
      {dot && <span className="dotc" style={dotColor ? { color: dotColor } : undefined} />}
      {children}
      {onRemove && (
        <button
          type="button"
          className="x"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          ×
        </button>
      )}
    </span>
  )
}
