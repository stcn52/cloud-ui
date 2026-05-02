import type { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const fieldStyles = tv({
  slots: {
    base: 'flex flex-col gap-[5px]',
    labelRow: 'flex items-baseline gap-1.5',
    label: 'text-xs text-text-muted font-medium uppercase tracking-[0.05em]',
    req:   'text-err leading-none',
    optional: 'text-[10.5px] text-text-dim font-normal normal-case tracking-normal',
    hint: 'text-xs text-text-dim',
    err: 'text-xs text-err',
  },
})

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  /** Show a red `*` after the label. */
  required?: boolean
  /** Show a dim "optional" suffix after the label. Ignored if `required` is set. */
  optional?: boolean
  children?: ReactNode
}

export function Field({
  label,
  hint,
  error,
  required,
  optional,
  className,
  children,
  ...rest
}: FieldProps) {
  const { base, labelRow, label: labelCls, req, optional: optionalCls, hint: hintCls, err: errCls } = fieldStyles()
  return (
    <div className={base({ class: className })} {...rest}>
      {label !== undefined && (
        <div className={labelRow()}>
          <label className={labelCls()}>{label}</label>
          {required ? (
            <span className={req()} aria-hidden>*</span>
          ) : optional ? (
            <span className={optionalCls()}>optional</span>
          ) : null}
        </div>
      )}
      {children}
      {error ? <span className={errCls()}>{error}</span> : hint ? <span className={hintCls()}>{hint}</span> : null}
    </div>
  )
}
