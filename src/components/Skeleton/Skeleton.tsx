import type { CSSProperties, HTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const skeletonStyles = tv({
  base: [
    'inline-block',
    'bg-[linear-gradient(90deg,var(--color-bg-sunk),var(--color-line),var(--color-bg-sunk))]',
    '[background-size:300%_100%]',
    'animate-[shimmer_1.4s_linear_infinite]',
  ],
  variants: {
    variant: {
      block:  'rounded-xs h-2.5',
      text:   'rounded-sm align-middle',
      circle: 'rounded-full',
    },
  },
  defaultVariants: { variant: 'block' },
})

type SkeletonVariants = VariantProps<typeof skeletonStyles>
export type SkeletonVariant = NonNullable<SkeletonVariants['variant']>

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual shape shortcut. default `block`. */
  variant?: SkeletonVariant
  /** Convenience — passed into style.width. */
  width?: number | string
  /** Convenience — passed into style.height. */
  height?: number | string
}

export function Skeleton({
  variant = 'block',
  width,
  height,
  className,
  style,
  ...rest
}: SkeletonProps) {
  // Build effective inline style per variant.
  const styleOverride: CSSProperties = {}

  if (variant === 'text') {
    // Default: full width (unless explicit width set), 0.8em height.
    if (width === undefined && style?.width === undefined) styleOverride.width = '100%'
    if (height === undefined && style?.height === undefined) styleOverride.height = '0.8em'
  }

  if (variant === 'circle') {
    // Warn if width != height — but don't block.
    const w = width ?? style?.width
    const h = height ?? style?.height
    if (
      process.env.NODE_ENV !== 'production' &&
      w !== undefined &&
      h !== undefined &&
      String(w) !== String(h)
    ) {
      // eslint-disable-next-line no-console
      console.warn('[Skeleton] circle variant expects equal width and height, got', w, 'vs', h)
    }
  }

  if (width !== undefined) styleOverride.width = width
  if (height !== undefined) styleOverride.height = height

  return (
    <span
      className={skeletonStyles({ variant, class: className })}
      style={{ ...style, ...styleOverride }}
      {...rest}
    />
  )
}
