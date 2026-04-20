import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface KpiProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
  value?: ReactNode
  foot?: ReactNode
  children?: ReactNode
}

export function Kpi({ label, value, foot, className, children, ...rest }: KpiProps) {
  return (
    <div className={cx('card kpi', className)} {...rest}>
      {label !== undefined && <div className="kpi-label">{label}</div>}
      {value !== undefined && <div className="kpi-value">{value}</div>}
      {foot !== undefined && <div className="kpi-foot">{foot}</div>}
      {children}
    </div>
  )
}

export type DeltaDirection = 'up' | 'down'

export interface DeltaProps extends HTMLAttributes<HTMLSpanElement> {
  direction?: DeltaDirection
  children?: ReactNode
}

export function Delta({ direction = 'up', className, children, ...rest }: DeltaProps) {
  return (
    <span className={cx('delta', direction, className)} {...rest}>
      {children}
    </span>
  )
}
