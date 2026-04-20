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
})

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...rest },
  ref,
) {
  return <textarea ref={ref} className={textareaStyles({ class: className })} {...rest} />
})
