import { forwardRef, type SelectHTMLAttributes } from 'react'
import { tv } from 'tailwind-variants'

export const selectStyles = tv({
  base: [
    'w-full h-[30px] px-2.5 text-sm rounded-sm',
    'border border-line bg-bg-elev text-text',
    'font-[inherit] transition-colors duration-[.12s]',
    'hover:border-line-strong',
    'focus:outline-none focus:border-accent focus:shadow-[var(--shadow-focus)]',
    'disabled:bg-bg-sunk disabled:text-text-muted disabled:cursor-not-allowed',
  ],
})

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...rest },
  ref,
) {
  return (
    <select ref={ref} className={selectStyles({ class: className })} {...rest}>
      {children}
    </select>
  )
})
