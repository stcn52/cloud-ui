import type { HTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const dotStyles = tv({
  base: 'w-2 h-2 rounded-full inline-block align-middle',
  variants: {
    tone: {
      neutral: 'bg-text-dim',
      ok:   'bg-ok shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-ok)_18%,transparent)]',
      warn: 'bg-warn shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-warn)_18%,transparent)]',
      err:  'bg-err shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-err)_18%,transparent)]',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

type DotVariants = VariantProps<typeof dotStyles>
export type DotTone = NonNullable<DotVariants['tone']>

export interface DotProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: DotTone
}

export function Dot({ tone = 'neutral', className, ...rest }: DotProps) {
  return <span className={dotStyles({ tone, class: className })} {...rest} />
}
