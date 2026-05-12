import { forwardRef, useCallback, type InputHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { useResolvedSize } from '../../context/ConfigProvider'

export const checkboxStyles = tv({
  base: [
    'appearance-none shrink-0 rounded-[3px]',
    'border border-line-strong bg-bg-elev',
    'inline-grid place-items-center cursor-pointer',
    'transition-colors duration-[.12s]',
    'hover:border-accent',
    'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
    'checked:bg-accent checked:border-accent',
    // Checkmark via ::after
    'checked:after:content-[""] checked:after:border-l-[1.5px] checked:after:border-b-[1.5px] checked:after:border-white',
    'checked:after:rotate-[-45deg] checked:after:-translate-y-px',
    // Indeterminate
    'indeterminate:bg-accent indeterminate:border-accent',
    'indeterminate:after:content-[""] indeterminate:after:bg-white indeterminate:after:border-0 indeterminate:after:rotate-0 indeterminate:after:translate-y-0',
  ],
  variants: {
    size: {
      sm: 'w-3 h-3 checked:after:w-1.5 checked:after:h-1 indeterminate:after:w-1.5 indeterminate:after:h-px',
      md: 'w-[14px] h-[14px] checked:after:w-2 checked:after:h-[5px] indeterminate:after:w-2 indeterminate:after:h-[1.5px]',
      lg: 'w-[18px] h-[18px] checked:after:w-2.5 checked:after:h-1.5 indeterminate:after:w-2.5 indeterminate:after:h-[2px]',
    },
  },
  defaultVariants: { size: 'md' },
})

type CheckboxVariants = VariantProps<typeof checkboxStyles>
export type CheckboxSize = NonNullable<CheckboxVariants['size']>

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  indeterminate?: boolean
  /** Box size. No explicit value ⇒ follows the global `ConfigProvider` density. */
  size?: CheckboxSize
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { indeterminate = false, size: sizeProp, className, ...rest },
  forwardedRef,
) {
  const size = useResolvedSize(sizeProp, { compact: 'sm', normal: 'md', comfortable: 'lg' })
  const refCallback = useCallback(
    (node: HTMLInputElement | null) => {
      if (node) node.indeterminate = indeterminate
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    [indeterminate, forwardedRef],
  )

  return (
    <input
      ref={refCallback}
      type="checkbox"
      className={checkboxStyles({ size, class: className })}
      {...rest}
    />
  )
})
