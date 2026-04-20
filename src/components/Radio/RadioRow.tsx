import type { LabelHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface RadioRowProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label?: ReactNode
  labelClassName?: string
  children?: ReactNode
}

export function RadioRow({ label, labelClassName, className, children, ...rest }: RadioRowProps) {
  return (
    <label className={cx('radio-row', className)} {...rest}>
      {children}
      {label !== undefined && <span className={cx('lbl', labelClassName)}>{label}</span>}
    </label>
  )
}
