import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...rest },
  ref,
) {
  return (
    <select ref={ref} className={cx('select', className)} {...rest}>
      {children}
    </select>
  )
})
