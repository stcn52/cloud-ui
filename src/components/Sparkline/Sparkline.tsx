import { useId, type HTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const sparklineStyles = tv({
  base: 'inline-block align-middle text-accent',
  variants: {
    tone: {
      accent: 'text-accent',
      ok:     'text-ok',
      warn:   'text-warn',
      err:    'text-err',
      muted:  'text-text-muted',
    },
  },
  defaultVariants: { tone: 'accent' },
})

type SparklineVariants = VariantProps<typeof sparklineStyles>
export type SparklineTone = NonNullable<SparklineVariants['tone']>
export type SparklineVariant = 'line' | 'area' | 'bar'

export interface SparklineProps extends Omit<HTMLAttributes<SVGSVGElement>, 'children'> {
  /** Numeric series — at least 2 points. */
  data: number[]
  variant?: SparklineVariant
  width?: number
  height?: number
  tone?: SparklineTone
  strokeWidth?: number
}

export function Sparkline({
  data,
  variant = 'line',
  width = 80,
  height = 22,
  tone,
  strokeWidth = 1.5,
  className,
  ...rest
}: SparklineProps) {
  const gradientId = useId()

  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const step = width / (data.length - 1)
  const pad = 2
  const innerH = height - pad * 2

  const points = data.map((v, i) => {
    const x = i * step
    const y = pad + (1 - (v - min) / range) * innerH
    return [x, y] as const
  })
  const polyPoints = points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
  const areaPath =
    `M${points[0][0]},${points[0][1]} ` +
    points.slice(1).map(([x, y]) => `L${x.toFixed(2)},${y.toFixed(2)}`).join(' ') +
    ` L${width},${height} L0,${height} Z`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={sparklineStyles({ tone, class: className })}
      preserveAspectRatio="none"
      {...rest}
    >
      {variant === 'area' && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.4" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} />
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            points={polyPoints}
          />
        </>
      )}
      {variant === 'line' && (
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          points={polyPoints}
        />
      )}
      {variant === 'bar' && (
        <g fill="currentColor">
          {points.map(([x, y], i) => {
            const barW = Math.max(2, step - 3)
            return (
              <rect
                key={i}
                x={x - barW / 2}
                y={y}
                width={barW}
                height={Math.max(1, height - y - pad / 2)}
                rx={1}
              />
            )
          })}
        </g>
      )}
    </svg>
  )
}
