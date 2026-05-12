import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { useResolvedSize } from '../../context/ConfigProvider'

export const textareaStyles = tv({
  base: [
    'w-full rounded-sm resize-y',
    'border border-line bg-bg-elev text-text',
    'font-[inherit] transition-colors duration-[.12s]',
    'hover:border-line-strong',
    'focus:outline-none focus:border-accent focus:shadow-[var(--shadow-focus)]',
    'disabled:bg-bg-sunk disabled:text-text-muted disabled:cursor-not-allowed',
  ],
  variants: {
    size: {
      sm: 'px-2 py-1.5 text-xs min-h-[56px]',
      md: 'px-2.5 py-2 text-sm min-h-[72px]',
      lg: 'px-3 py-2.5 text-base min-h-[88px]',
    },
    invalid: {
      true: 'border-err hover:border-err focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-err)_25%,transparent)]',
      false: '',
    },
  },
  defaultVariants: { size: 'md', invalid: false },
})

type TextareaVariants = VariantProps<typeof textareaStyles>
export type TextareaSize = NonNullable<TextareaVariants['size']>

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  invalid?: boolean
  /** Padding / font scale. No explicit value ⇒ follows the global `ConfigProvider` density. */
  size?: TextareaSize
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, size: sizeProp, ...rest },
  ref,
) {
  const size = useResolvedSize(sizeProp, { compact: 'sm', normal: 'md', comfortable: 'lg' })
  return (
    <textarea
      ref={ref}
      className={textareaStyles({ size, invalid, class: className })}
      {...rest}
    />
  )
})
