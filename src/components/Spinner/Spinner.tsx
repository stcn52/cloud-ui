import type { HTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const spinnerStyles = tv({
  base: [
    'inline-block rounded-full',
    'border-2 border-line-strong border-t-accent',
    'animate-[spin_0.8s_linear_infinite]',
    'align-middle',
  ],
  variants: {
    size: {
      sm: 'w-3 h-3 border',
      md: 'w-4 h-4',
      lg: 'w-6 h-6 border-[3px]',
    },
    muted: {
      true:  'border-line border-t-text-muted',
      false: '',
    },
  },
  defaultVariants: { size: 'md', muted: false },
})

type SpinnerVariants = VariantProps<typeof spinnerStyles>
export type SpinnerSize = NonNullable<SpinnerVariants['size']>

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize
  muted?: boolean
}

export function Spinner({ size, muted, className, ...rest }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={spinnerStyles({ size, muted, class: className })}
      {...rest}
    />
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* DotsLoader — three pulsing dots, used for "thinking…" / "typing…"          */
/* ────────────────────────────────────────────────────────────────────────── */

const dotsStyles = tv({
  slots: {
    base: 'inline-flex items-center gap-1 align-middle',
    dot:  'w-1 h-1 rounded-full bg-text-dim animate-[pulse_1.2s_ease-in-out_infinite]',
  },
})

export interface DotsLoaderProps extends HTMLAttributes<HTMLSpanElement> {}

export function DotsLoader({ className, ...rest }: DotsLoaderProps) {
  const { base, dot } = dotsStyles()
  return (
    <span className={base({ class: className })} {...rest}>
      <span className={dot()} style={{ animationDelay: '0s' }} />
      <span className={dot()} style={{ animationDelay: '0.2s' }} />
      <span className={dot()} style={{ animationDelay: '0.4s' }} />
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* BarLoader — indeterminate top-of-panel bar                                 */
/* ────────────────────────────────────────────────────────────────────────── */

const barStyles = tv({
  base: [
    'block w-full h-0.5 rounded-full bg-bg-sunk overflow-hidden relative',
    'before:content-[""] before:absolute before:inset-y-0 before:w-1/3',
    'before:bg-accent before:rounded-full',
    'before:animate-[barLoader_1.2s_ease-in-out_infinite]',
  ],
})

export interface BarLoaderProps extends HTMLAttributes<HTMLDivElement> {}

export function BarLoader({ className, ...rest }: BarLoaderProps) {
  return <div role="progressbar" aria-busy className={barStyles({ class: className })} {...rest} />
}
