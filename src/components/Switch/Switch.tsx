import { forwardRef, type InputHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, ...rest },
  ref,
) {
  return <input ref={ref} type="checkbox" className={cx('switch', className)} {...rest} />
})
