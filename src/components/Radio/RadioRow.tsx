import type { LabelHTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const radioRowStyles = tv({
  slots: {
    base: 'inline-flex gap-2 items-center text-sm cursor-pointer select-none',
    label: 'leading-[1.2]',
  },
})

export interface RadioRowProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label?: ReactNode
  labelClassName?: string
  children?: ReactNode
}

export function RadioRow({ label, labelClassName, className, children, ...rest }: RadioRowProps) {
  const { base, label: labelCls } = radioRowStyles()
  return (
    <label className={base({ class: className })} {...rest}>
      {children}
      {label !== undefined && <span className={labelCls({ class: labelClassName })}>{label}</span>}
    </label>
  )
}
