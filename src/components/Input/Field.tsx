import type { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const fieldStyles = tv({
  slots: {
    base: 'flex flex-col gap-[5px]',
    label: 'text-xs text-text-muted font-medium uppercase tracking-[0.05em]',
    hint: 'text-xs text-text-dim',
    err: 'text-xs text-err',
  },
})

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  children?: ReactNode
}

export function Field({ label, hint, error, className, children, ...rest }: FieldProps) {
  const { base, label: labelCls, hint: hintCls, err: errCls } = fieldStyles()
  return (
    <div className={base({ class: className })} {...rest}>
      {label !== undefined && <label className={labelCls()}>{label}</label>}
      {children}
      {error ? <span className={errCls()}>{error}</span> : hint ? <span className={hintCls()}>{hint}</span> : null}
    </div>
  )
}
