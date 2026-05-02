import { type HTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const ratingStyles = tv({
  slots: {
    base: 'inline-flex items-center gap-0.5 text-warn align-middle',
    star: 'block',
    interactive: 'cursor-pointer hover:scale-110 transition-transform',
  },
  variants: {
    size: {
      sm: { star: 'w-3 h-3' },
      md: { star: 'w-3.5 h-3.5' },
      lg: { star: 'w-5 h-5' },
    },
  },
  defaultVariants: { size: 'md' },
})

type RatingVariants = VariantProps<typeof ratingStyles>
export type RatingSize = NonNullable<RatingVariants['size']>

export interface RatingProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange'> {
  /** 0–`max`, accepts halves. */
  value: number
  /** Total stars. default 5 */
  max?: number
  size?: RatingSize
  /** When set, the rating becomes interactive: clicking a star calls `onChange`. */
  onChange?: (value: number) => void
  /** Read-only display. default true unless `onChange` is provided. */
  readOnly?: boolean
}

const star = (
  <polygon points="12,2 15,9 22,10 17,15 18,22 12,18 6,22 7,15 2,10 9,9" />
)

export function Rating({
  value,
  max = 5,
  size = 'md',
  onChange,
  readOnly,
  className,
  ...rest
}: RatingProps) {
  const interactive = !!onChange && !readOnly
  const { base, star: starCls, interactive: interactiveCls } = ratingStyles({ size })
  return (
    <span
      role="img"
      aria-label={`${value} of ${max}`}
      className={base({ class: className })}
      {...rest}
    >
      {Array.from({ length: max }, (_, i) => {
        const idx = i + 1
        const filled = value >= idx
        const half   = !filled && value > i && value < idx
        const cls = interactive ? `${starCls()} ${interactiveCls()}` : starCls()
        const onClick = interactive ? () => onChange?.(idx) : undefined
        const onClickHalf = interactive ? () => onChange?.(idx - 0.5) : undefined

        if (half) {
          return (
            <span key={i} className="relative inline-block" onClick={onClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={cls}>
                {star}
              </svg>
              <svg viewBox="0 0 24 24" fill="currentColor" className={`${cls} absolute inset-0 [clip-path:inset(0_50%_0_0)]`}>
                {star}
              </svg>
            </span>
          )
        }

        return interactive ? (
          <span key={i} className="relative inline-block">
            <svg
              viewBox="0 0 24 24"
              fill={filled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={1.6}
              className={cls}
              onClick={onClick}
            >
              {star}
            </svg>
            <span
              className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
              onClick={onClickHalf}
              aria-hidden
            />
          </span>
        ) : (
          <svg
            key={i}
            viewBox="0 0 24 24"
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.6}
            className={starCls()}
          >
            {star}
          </svg>
        )
      })}
    </span>
  )
}
