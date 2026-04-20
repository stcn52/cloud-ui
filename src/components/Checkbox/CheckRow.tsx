import type { LabelHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface CheckRowProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label?: ReactNode
  labelClassName?: string
  children?: ReactNode
}

export function CheckRow({ label, labelClassName, className, children, ...rest }: CheckRowProps) {
  return (
    <label className={cx('check-row', className)} {...rest}>
      {children}
      {label !== undefined && <span className={cx('lbl', labelClassName)}>{label}</span>}
    </label>
  )
}
