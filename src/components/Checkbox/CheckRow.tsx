import type { LabelHTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const checkRowStyles = tv({
  slots: {
    base: 'inline-flex gap-2 items-center text-sm cursor-pointer select-none',
    label: 'leading-[1.2]',
  },
})

export interface CheckRowProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label?: ReactNode
  labelClassName?: string
  children?: ReactNode
}

export function CheckRow({ label, labelClassName, className, children, ...rest }: CheckRowProps) {
  const { base, label: labelCls } = checkRowStyles()
  return (
    <label className={base({ class: className })} {...rest}>
      {children}
      {label !== undefined && <span className={labelCls({ class: labelClassName })}>{label}</span>}
    </label>
  )
}
