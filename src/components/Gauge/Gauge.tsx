import type { HTMLAttributes, ReactNode } from 'react'

export interface GaugeThreshold {
  /** Value at which this band starts (in the gauge's [min, max] domain). */
  from: number
  /** CSS colour for the band and — when `value` falls in it — the value text. */
  color: string
  label?: string
}

export interface GaugeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number
  min?: number
  max?: number
  /** Outer diameter in px. Default 140. */
  size?: number
  /** Arc thickness in px. Default 12. */
  thickness?: number
  /** Sweep angle of the arc in degrees (180 = half-circle, 270 = ¾). Default 220. */
  sweep?: number
  /** Threshold bands, ordered by `from` ascending. The arc colours by band; the
   *  value text picks up the active band's colour. Omit for a flat accent arc. */
  thresholds?: GaugeThreshold[]
  /** Centre content. Omit for an auto numeric readout; pass a node for custom; `false` to hide. */
  label?: ReactNode | false
  /** Small caption under the value. */
  caption?: ReactNode
}

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const
}
function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const [sx, sy] = polar(cx, cy, r, a0)
  const [ex, ey] = polar(cx, cy, r, a1)
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0
  const sweepFlag = a1 > a0 ? 1 : 0
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} ${sweepFlag} ${ex} ${ey}`
}

export function Gauge({
  value,
  min = 0,
  max = 100,
  size = 140,
  thickness = 12,
  sweep = 220,
  thresholds,
  label,
  caption,
  className,
  ...rest
}: GaugeProps) {
  const clamped = Math.max(min, Math.min(max, value))
  const frac = max > min ? (clamped - min) / (max - min) : 0
  // Centre the sweep around the bottom: start at 90 + (360 - sweep)/2 going clockwise.
  const start = 90 + (360 - sweep) / 2
  const end = start + sweep
  const angleAt = (f: number) => start + f * sweep

  const r = (size - thickness) / 2
  const cx = size / 2
  const cy = size / 2
  // Height needed: the arc dips below centre by r*sin of the half-spread past 180.
  const overhang = sweep > 180 ? r * Math.sin(((sweep - 180) / 2) * Math.PI / 180) : 0
  const vbH = cy + r + thickness / 2 + (overhang > 0 ? 0 : 0)

  // Band segments along the track.
  const bands = (() => {
    if (!thresholds || thresholds.length === 0) return [{ a0: start, a1: end, color: 'var(--color-accent)' }]
    const sorted = [...thresholds].sort((a, b) => a.from - b.from)
    return sorted.map((t, i) => {
      const f0 = (Math.max(min, t.from) - min) / (max - min)
      const next = sorted[i + 1]
      const f1 = next ? (Math.max(min, next.from) - min) / (max - min) : 1
      return { a0: angleAt(f0), a1: angleAt(f1), color: t.color }
    })
  })()

  const activeColor = (() => {
    if (!thresholds || thresholds.length === 0) return 'var(--color-accent)'
    const sorted = [...thresholds].sort((a, b) => a.from - b.from)
    let c = sorted[0].color
    for (const t of sorted) if (clamped >= t.from) c = t.color
    return c
  })()

  const valueAngle = angleAt(frac)
  const [nx, ny] = polar(cx, cy, r, valueAngle)

  const centerNode =
    label === false ? null
    : label !== undefined ? label
    : <span className="text-xl font-semibold tabular-nums" style={{ color: activeColor }}>{Math.round(clamped)}</span>

  return (
    <div className={className} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2 }} {...rest}>
      <div style={{ position: 'relative', width: size, height: vbH }}>
        <svg width={size} height={vbH} viewBox={`0 0 ${size} ${vbH}`} aria-hidden>
          {/* track */}
          <path d={arc(cx, cy, r, start, end)} fill="none" stroke="var(--color-bg-sunk)" strokeWidth={thickness} strokeLinecap="round" />
          {/* bands up to the value (so the unfilled remainder shows the track) */}
          {bands.map((b, i) => {
            const fillEnd = Math.min(b.a1, valueAngle)
            if (fillEnd <= b.a0) return null
            return <path key={i} d={arc(cx, cy, r, b.a0, fillEnd)} fill="none" stroke={b.color} strokeWidth={thickness} strokeLinecap={i === 0 ? 'round' : 'butt'} />
          })}
          {/* needle dot */}
          <circle cx={nx} cy={ny} r={thickness / 2 + 1.5} fill="var(--color-bg-elev)" stroke={activeColor} strokeWidth={2.5} />
        </svg>
        <div style={{ position: 'absolute', left: 0, right: 0, top: cy - 14, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          {centerNode}
        </div>
      </div>
      {caption && <span className="text-xs text-text-muted">{caption}</span>}
    </div>
  )
}
