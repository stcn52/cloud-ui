import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  children?: ReactNode
}

export function Field({ label, hint, error, className, children, ...rest }: FieldProps) {
  return (
    <div className={cx('field', className)} {...rest}>
      {label !== undefined && <label>{label}</label>}
      {children}
      {error ? <span className="err">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  )
}
