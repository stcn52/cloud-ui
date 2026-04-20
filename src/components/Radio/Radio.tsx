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
})

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, ...rest },
  ref,
) {
  return <input ref={ref} type="radio" className={radioStyles({ class: className })} {...rest} />
})
