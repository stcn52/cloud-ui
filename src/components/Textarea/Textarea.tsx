import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { tv } from 'tailwind-variants'

export const textareaStyles = tv({
  base: [
    'w-full px-2.5 py-2 text-sm rounded-sm min-h-[72px] resize-y',
    'border border-line bg-bg-elev text-text',
    'font-[inherit] transition-colors duration-[.12s]',
    'hover:border-line-strong',
    'focus:outline-none focus:border-accent focus:shadow-[var(--shadow-focus)]',
    'disabled:bg-bg-sunk disabled:text-text-muted disabled:cursor-not-allowed',
  ],
  variants: {
    invalid: {
      true: 'border-err hover:border-err focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-err)_25%,transparent)]',
      false: '',
    },
  },
  defaultVariants: { invalid: false },
})

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={textareaStyles({ invalid, class: className })}
      {...rest}
    />
  )
})
