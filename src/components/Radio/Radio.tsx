import { forwardRef, type InputHTMLAttributes } from 'react'
import { tv } from 'tailwind-variants'

export const radioStyles = tv({
  base: [
    'appearance-none w-[14px] h-[14px] shrink-0 rounded-full',
    'border border-line-strong bg-bg-elev',
    'inline-grid place-items-center cursor-pointer',
    'transition-colors duration-[.12s]',
    'hover:border-accent',
    'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
    'checked:bg-accent checked:border-accent',
    'checked:after:content-[""] checked:after:w-[5px] checked:after:h-[5px]',
    'checked:after:rounded-full checked:after:bg-white',
  ],
  variants: {
    invalid: {
      true: [
        'border-err hover:border-err',
        'focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-err)_25%,transparent)]',
        'checked:bg-err checked:border-err',
      ],
      false: '',
    },
  },
  defaultVariants: { invalid: false },
})

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  invalid?: boolean
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, invalid, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type="radio"
      className={radioStyles({ invalid, class: className })}
      {...rest}
    />
  )
})
