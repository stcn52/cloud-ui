import type { AnchorHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const linkStyles = tv({
  base: [
    'cursor-pointer',
    'underline decoration-line-strong underline-offset-[3px] decoration-1',
    'transition-colors duration-[.12s]',
    'hover:decoration-current',
  ],
  variants: {
    intent: {
      default: 'text-accent-ink hover:text-accent',
      muted:   'text-text-muted decoration-line hover:text-text',
      danger:  'text-err',
    },
    bare: {
      true:  'no-underline hover:underline',
      false: '',
    },
  },
  defaultVariants: { intent: 'default', bare: false },
})

type LinkVariants = VariantProps<typeof linkStyles>
export type LinkIntent = NonNullable<LinkVariants['intent']>

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  intent?: LinkIntent
  /** Drop the underline until hover. Use sparingly — undecorated links read as plain text. */
  bare?: boolean
}

export function Link({ intent, bare, className, children, ...rest }: LinkProps) {
  return (
    <a className={linkStyles({ intent, bare, class: className })} {...rest}>
      {children}
    </a>
  )
}
