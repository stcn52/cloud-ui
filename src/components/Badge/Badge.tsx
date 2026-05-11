import type { HTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const badgeStyles = tv({
  base: [
    'inline-flex items-center justify-center select-none',
    'font-mono [font-variant-numeric:tabular-nums] leading-none',
    'rounded-full text-white',
  ],
  variants: {
    tone: {
      err:  'bg-err',
      ok:   'bg-ok',
      warn: 'bg-warn',
      info: 'bg-info',
      accent: 'bg-accent',
      neutral: 'bg-text-dim',
    },
    size: {
      sm: 'text-[9px] min-w-[14px] h-[14px] px-1',
      md: 'text-[10px] min-w-[16px] h-[16px] px-1',
    },
    dot: {
      true:  'p-0 min-w-0',
      false: '',
    },
  },
  compoundVariants: [
    { dot: true, size: 'sm', class: 'w-1.5 h-1.5' },
    { dot: true, size: 'md', class: 'w-2 h-2' },
  ],
  defaultVariants: { tone: 'err', size: 'md', dot: false },
})

type BadgeVariants = VariantProps<typeof badgeStyles>
export type BadgeTone = NonNullable<BadgeVariants['tone']>

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Number to display. Values above `max` render as `max+`. Ignored when `dot` is set. */
  count?: number
  /** Cap the displayed number; anything larger shows `{max}+`. Default 99. */
  max?: number
  /** Render a bare dot with no number — used to signal "something new" without a count. */
  dot?: boolean
  /** When true and `count` is 0 (and not `dot`), the badge still renders. Default hides it. */
  showZero?: boolean
  tone?: BadgeTone
  size?: BadgeVariants['size']
  /**
   * When provided, the badge is positioned at the top-right of `children`
   * (which must be a single positioned-able element — we wrap it in an
   * `inline-flex` span). Without `children`, the badge renders standalone.
   */
  children?: ReactNode
}

export function Badge({
  count,
  max = 99,
  dot = false,
  showZero = false,
  tone = 'err',
  size = 'md',
  className,
  children,
  ...rest
}: BadgeProps) {
  const hidden = !dot && (count === undefined || (count <= 0 && !showZero))
  const text = dot ? null : count! > max ? `${max}+` : String(count)

  const badge = hidden ? null : (
    <span className={badgeStyles({ tone, size, dot, class: className })} {...rest}>
      {text}
    </span>
  )

  if (children === undefined) return badge

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            transform: 'translate(40%, -40%)',
            pointerEvents: 'none',
          }}
        >
          {badge}
        </span>
      )}
    </span>
  )
}
