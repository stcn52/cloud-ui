import { forwardRef, type InputHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, ...rest },
  ref,
) {
  return <input ref={ref} type="radio" className={cx('radio', className)} {...rest} />
})
