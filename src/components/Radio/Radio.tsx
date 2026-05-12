import { forwardRef, type InputHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { useResolvedSize } from '../../context/ConfigProvider'

export const radioStyles = tv({
  base: [
    'appearance-none shrink-0 rounded-full',
    'border border-line-strong bg-bg-elev',
    'inline-grid place-items-center cursor-pointer',
    'transition-colors duration-[.12s]',
    'hover:border-accent',
    'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
    'checked:bg-accent checked:border-accent',
    'checked:after:content-[""] checked:after:rounded-full checked:after:bg-white',
  ],
  variants: {
    size: {
      sm: 'w-3 h-3 checked:after:w-1 checked:after:h-1',
      md: 'w-[14px] h-[14px] checked:after:w-[5px] checked:after:h-[5px]',
      lg: 'w-[18px] h-[18px] checked:after:w-1.5 checked:after:h-1.5',
    },
    invalid: {
      true: [
        'border-err hover:border-err',
        'focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-err)_25%,transparent)]',
        'checked:bg-err checked:border-err',
      ],
      false: '',
    },
  },
  defaultVariants: { size: 'md', invalid: false },
})

type RadioVariants = VariantProps<typeof radioStyles>
export type RadioSize = NonNullable<RadioVariants['size']>

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  invalid?: boolean
  /** Dot size. No explicit value ⇒ follows the global `ConfigProvider` density. */
  size?: RadioSize
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, invalid, size: sizeProp, ...rest },
  ref,
) {
  const size = useResolvedSize(sizeProp, { compact: 'sm', normal: 'md', comfortable: 'lg' })
  return (
    <input
      ref={ref}
      type="radio"
      className={radioStyles({ size, invalid, class: className })}
      {...rest}
    />
  )
})
