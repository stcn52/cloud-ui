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
})

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, ...rest },
  ref,
) {
  return <input ref={ref} type="checkbox" className={switchStyles({ class: className })} {...rest} />
})
