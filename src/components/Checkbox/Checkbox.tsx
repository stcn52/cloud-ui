import { forwardRef, useEffect, useRef, type InputHTMLAttributes } from 'react'
import { tv } from 'tailwind-variants'

export const checkboxStyles = tv({
  base: [
    'appearance-none w-[14px] h-[14px] shrink-0 rounded-[3px]',
    'border border-line-strong bg-bg-elev',
    'inline-grid place-items-center cursor-pointer',
    'transition-colors duration-[.12s]',
    'hover:border-accent',
    'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
    'checked:bg-accent checked:border-accent',
    // Checkmark via ::after
    'checked:after:content-[""] checked:after:w-2 checked:after:h-[5px]',
    'checked:after:border-l-[1.5px] checked:after:border-b-[1.5px] checked:after:border-white',
    'checked:after:rotate-[-45deg] checked:after:-translate-y-px',
    // Indeterminate
    'indeterminate:bg-accent indeterminate:border-accent',
    'indeterminate:after:content-[""] indeterminate:after:w-2 indeterminate:after:h-[1.5px]',
    'indeterminate:after:bg-white indeterminate:after:border-0 indeterminate:after:rotate-0 indeterminate:after:translate-y-0',
  ],
})

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  indeterminate?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { indeterminate = false, className, ...rest },
  forwardedRef,
) {
  const innerRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <input
      ref={(node) => {
        innerRef.current = node
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      }}
      type="checkbox"
      className={checkboxStyles({ class: className })}
      {...rest}
    />
  )
})
