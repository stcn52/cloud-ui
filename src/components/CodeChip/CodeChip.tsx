import type { HTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const codeChipStyles = tv({
  base: [
    'inline-flex items-center align-baseline',
    'px-1.5 py-px rounded-xs',
    'font-mono text-[11.5px] leading-[1.5]',
    'bg-bg-sunk border border-line text-text-muted',
    'whitespace-nowrap',
  ],
  variants: {
    intent: {
      default: '',
      accent:  'bg-accent-weak border-[color-mix(in_oklch,var(--color-accent)_30%,transparent)] text-accent-ink',
      err:     'bg-[color-mix(in_oklch,var(--color-err)_8%,transparent)] border-[color-mix(in_oklch,var(--color-err)_30%,transparent)] text-err',
    },
  },
  defaultVariants: { intent: 'default' },
})

type CodeChipVariants = VariantProps<typeof codeChipStyles>
export type CodeChipIntent = NonNullable<CodeChipVariants['intent']>

export interface CodeChipProps extends HTMLAttributes<HTMLSpanElement> {
  intent?: CodeChipIntent
  children?: ReactNode
}

export function CodeChip({ intent, className, children, ...rest }: CodeChipProps) {
  return (
    <span className={codeChipStyles({ intent, class: className })} {...rest}>
      {children}
    </span>
  )
}
