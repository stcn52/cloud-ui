import type { HTMLAttributes, ReactNode } from 'react'

export interface DonutSegment {
  /** Raw value — segments are normalised against the sum (or `total` if given). */
  value: number
  label: ReactNode
  /** CSS colour. Defaults cycle through the design-system status/accent palette. */
  color?: string
}

export interface DonutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  segments: DonutSegment[]
  /** Diameter in px. Default 120. */
  size?: number
  /** Ring thickness in px. Default 14. */
  thickness?: number
  /** Override the denominator (e.g. show "70 / 100" by passing total=100). Default = sum of values. */
  total?: number
  /** Centre content. Pass `false` to hide; omit for an auto "sum" label; pass a node for custom. */
  center?: ReactNode | false
  /** Render a legend beside the ring. Default true. */
  legend?: boolean
  /** Gap between segments, in degrees. Default 2. */
  gap?: number
}

const PALETTE = [
  'var(--color-accent)',
  'var(--color-ok)',
  'var(--color-warn)',
  'var(--color-err)',
  'var(--color-info)',
  'color-mix(in oklch, var(--color-accent) 55%, var(--color-text-dim))',
]

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const [sx, sy] = polar(cx, cy, r, endDeg)
  const [ex, ey] = polar(cx, cy, r, startDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey}`
}

export function Donut({
  segments,
  size = 120,
  thickness = 14,
  total,
  center,
  legend = true,
  gap = 2,
  className,
  ...rest
}: DonutProps) {
  const sum = segments.reduce((a, s) => a + Math.max(0, s.value), 0)
  const denom = total ?? sum ?? 1
  const r = (size - thickness) / 2
  const cx = size / 2
  const cy = size / 2

  // Build arcs.
  let cursor = 0
  const arcs = segments.map((s, i) => {
    const frac = denom > 0 ? Math.max(0, s.value) / denom : 0
    const sweep = frac * 360
    const start = cursor + gap / 2
    const end = cursor + sweep - gap / 2
    cursor += sweep
    return {
      d: end > start ? arcPath(cx, cy, r, start, end) : '',
      color: s.color ?? PALETTE[i % PALETTE.length],
      frac,
      label: s.label,
      value: s.value,
    }
  })

  const centerNode =
    center === false ? null
    : center !== undefined ? center
    : <span className="text-lg font-semibold tabular-nums">{total !== undefined ? `${Math.round((sum / denom) * 100)}%` : sum}</span>

  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }} {...rest}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-bg-sunk)" strokeWidth={thickness} />
          {arcs.map((a, i) => a.d && (
            <path key={i} d={a.d} fill="none" stroke={a.color} strokeWidth={thickness} strokeLinecap="butt" />
          ))}
        </svg>
        {centerNode && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', color: 'var(--color-text)' }}>
            {centerNode}
          </div>
        )}
      </div>
      {legend && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {arcs.map((a, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: a.color, flexShrink: 0 }} />
              <span className="text-text-muted">{a.label}</span>
              <span className="text-text-dim tabular-nums" style={{ marginLeft: 'auto' }}>{Math.round(a.frac * 100)}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
