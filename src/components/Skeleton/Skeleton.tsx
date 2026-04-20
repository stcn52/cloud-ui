import type { HTMLAttributes } from 'react'
import { tv } from 'tailwind-variants'

export const skeletonStyles = tv({
  base: [
    'inline-block rounded-xs h-2.5',
    'bg-[linear-gradient(90deg,var(--color-bg-sunk),var(--color-line),var(--color-bg-sunk))]',
    '[background-size:300%_100%]',
    'animate-[shimmer_1.4s_linear_infinite]',
  ],
})

export type SkeletonProps = HTMLAttributes<HTMLSpanElement>

export function Skeleton({ className, ...rest }: SkeletonProps) {
  return <span className={skeletonStyles({ class: className })} {...rest} />
}
