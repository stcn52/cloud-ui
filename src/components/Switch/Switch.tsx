import { forwardRef, type InputHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { useResolvedSize } from '../../context/ConfigProvider'

export const switchStyles = tv({
  base: [
    'appearance-none rounded-full shrink-0 cursor-pointer relative',
    'bg-line-strong transition-colors duration-150',
    'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
    'checked:bg-accent',
    // Knob via ::after
    'after:content-[""] after:absolute after:top-[2px] after:left-[2px]',
    'after:rounded-full after:bg-white',
    'after:shadow-[0_1px_2px_rgba(0,0,0,0.2)]',
    'after:transition-transform after:duration-150',
  ],
  variants: {
    size: {
      sm: 'w-6 h-3.5 after:w-2.5 after:h-2.5 checked:after:translate-x-2.5',
      md: 'w-7 h-4 after:w-3 after:h-3 checked:after:translate-x-3',
      lg: 'w-9 h-5 after:w-4 after:h-4 checked:after:translate-x-4',
    },
    invalid: {
      true: [
        'bg-[color-mix(in_oklch,var(--color-err)_35%,var(--color-line-strong))]',
        'focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-err)_25%,transparent)]',
        'checked:bg-err',
      ],
      false: '',
    },
  },
  defaultVariants: { size: 'md', invalid: false },
})

type SwitchVariants = VariantProps<typeof switchStyles>
export type SwitchSize = NonNullable<SwitchVariants['size']>

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  invalid?: boolean
  /** Track size. No explicit value ⇒ follows the global `ConfigProvider` density. */
  size?: SwitchSize
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, invalid, size: sizeProp, ...rest },
  ref,
) {
  const size = useResolvedSize(sizeProp, { compact: 'sm', normal: 'md', comfortable: 'lg' })
  return (
    <input
      ref={ref}
      type="checkbox"
      className={switchStyles({ size, invalid, class: className })}
      {...rest}
    />
  )
})
