import { forwardRef, type InputHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const inputStyles = tv({
  base: [
    'w-full border border-line rounded-sm bg-bg-elev text-text',
    'font-[inherit] transition-colors duration-[.12s]',
    'hover:border-line-strong',
    'focus:outline-none focus:border-accent focus:shadow-[var(--shadow-focus)]',
    'disabled:bg-bg-sunk disabled:text-text-muted disabled:cursor-not-allowed',
  ],
  variants: {
    size: {
      sm: 'h-6 px-2 text-xs',
      md: 'h-[30px] px-2.5 text-sm',
      lg: 'h-9 px-2.5 text-md',
    },
    invalid: {
      true: 'border-err shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-err)_20%,transparent)]',
      false: '',
    },
    mono: { true: 'font-mono', false: '' },
    num:  { true: '[font-variant-numeric:tabular-nums]', false: '' },
  },
  defaultVariants: { size: 'md', invalid: false, mono: false, num: false },
})

type InputVariants = VariantProps<typeof inputStyles>
export type InputSize = NonNullable<InputVariants['size']>

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize
  invalid?: boolean
  mono?: boolean
  num?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', invalid, mono, num, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={inputStyles({ size, invalid, mono, num, class: className })}
      {...rest}
    />
  )
})
