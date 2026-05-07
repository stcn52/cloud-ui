import {
  cloneElement,
  isValidElement,
  type FormHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import { Field, type FieldProps } from '../Input'
import type { FieldBindings } from './useForm'

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Wire to `useForm().submit` — calls `e.preventDefault` for you. */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  children?: ReactNode
}

/** Thin `<form>` wrapper. Stops the default browser submission and passes the event through. */
export function Form({ onSubmit, children, ...rest }: FormProps) {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(e)
      }}
      {...rest}
    >
      {children}
    </form>
  )
}

export interface FormFieldProps<V>
  extends Omit<FieldProps, 'children' | 'error'> {
  /** Result of `form.field(name)`. */
  bind: FieldBindings<V>
  /**
   * The control. Receives `value`, `onChange`, `onBlur`, `invalid` injected from `bind`.
   * Existing handlers on the child are preserved and chained.
   */
  children: ReactElement<{
    value?: V
    checked?: boolean
    onChange?: (next: V) => void
    onBlur?: () => void
    invalid?: boolean
  }>
}

/**
 * Wires a `FieldBindings` into a labelled `Field`. Injects `value`/`onChange`/`onBlur`/`invalid`
 * onto the child control while chaining any handlers it already had.
 */
export function FormField<V>({ bind, children, hint, ...fieldProps }: FormFieldProps<V>) {
  if (!isValidElement(children)) return null
  const childProps = (children.props ?? {}) as {
    onChange?: (next: V) => void
    onBlur?: () => void
  }
  const isBool = typeof bind.value === 'boolean'
  const merged = cloneElement(children, {
    // Booleans go into `checked` (Switch / Checkbox); everything else into `value`.
    ...(isBool ? { checked: bind.value as unknown as boolean } : { value: bind.value }),
    invalid: bind.invalid,
    onChange: (next: V | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Adapt native input/textarea events (`e.target.value`/`.checked`) to a value.
      const isEvent =
        typeof next === 'object' &&
        next !== null &&
        'target' in (next as object) &&
        (next as { target?: unknown }).target instanceof Element
      if (isEvent) {
        const t = (next as React.ChangeEvent<HTMLInputElement>).target
        const value = (t.type === 'checkbox' ? t.checked : t.value) as unknown as V
        bind.onChange(value)
      } else {
        bind.onChange(next as V)
      }
      ;(childProps.onChange as ((n: unknown) => void) | undefined)?.(next as unknown)
    },
    onBlur: () => {
      bind.onBlur()
      childProps.onBlur?.()
    },
  })
  return (
    <Field error={bind.error} hint={hint} {...fieldProps}>
      {merged}
    </Field>
  )
}
