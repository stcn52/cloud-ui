import { forwardRef, type InputHTMLAttributes } from 'react'
import { tv } from 'tailwind-variants'

export const switchStyles = tv({
  base: [
    'appearance-none w-7 h-4 rounded-full shrink-0 cursor-pointer relative',
    'bg-line-strong transition-colors duration-150',
    'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
    'checked:bg-accent',
    // Knob via ::after
    'after:content-[""] after:absolute after:top-[2px] after:left-[2px]',
    'after:w-3 after:h-3 after:rounded-full after:bg-white',
    'after:shadow-[0_1px_2px_rgba(0,0,0,0.2)]',
    'after:transition-transform after:duration-150',
    'checked:after:translate-x-3',
  ],
  variants: {
    invalid: {
      true: [
        'bg-[color-mix(in_oklch,var(--color-err)_35%,var(--color-line-strong))]',
        'focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-err)_25%,transparent)]',
        'checked:bg-err',
      ],
      false: '',
    },
  },
  defaultVariants: { invalid: false },
})

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  invalid?: boolean
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, invalid, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={switchStyles({ invalid, class: className })}
      {...rest}
    />
  )
})
