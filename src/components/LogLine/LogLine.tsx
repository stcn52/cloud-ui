import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export type LogLevel = 'info' | 'warn' | 'err' | 'ok'

export interface LogLineProps extends HTMLAttributes<HTMLDivElement> {
  level: LogLevel
  timestamp?: ReactNode
  message?: ReactNode
  children?: ReactNode
}

export function LogLine({
  level,
  timestamp,
  message,
  className,
  children,
  ...rest
}: LogLineProps) {
  return (
    <div className={cx('logline', level, className)} {...rest}>
      <span className="ts">{timestamp}</span>
      <span className="lvl">{level.toUpperCase()}</span>
      <span>{message ?? children}</span>
    </div>
  )
}
