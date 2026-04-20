import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  tip: ReactNode
  children?: ReactNode
}

export function Tooltip({ tip, className, children, ...rest }: TooltipProps) {
  return (
    <div className={cx('tooltip', className)} {...rest}>
      {children}
      <span className="tip" role="tooltip">
        {tip}
      </span>
    </div>
  )
}
