import { Card, Kpi } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

// Stacked bars data
const barGroups = Array.from({ length: 24 }, (_, i) => {
  const v1 = 38 + Math.sin(i / 2) * 14
  const v2 = 24 + Math.cos(i / 3) * 8
  const v3 = 14 + Math.sin(i / 4) * 6
  return [v1, v2, v3]
})
const barColors = ['var(--accent)', 'oklch(0.72 0.08 230)', 'oklch(0.85 0.04 230)']

// Sparks
const sparkA = Array.from({ length: 20 }, (_, i) => 40 + Math.sin(i / 2) * 40)
const sparkB = Array.from({ length: 20 }, (_, i) => (i === 14 ? 90 : 10 + ((i * 37) % 30)))

// Heatmap (deterministic pseudo-random so SSR + render match)
function seedRand(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}
const heatRand = seedRand(42)
const heatCells = Array.from({ length: 24 * 7 }, () => {
  const r = heatRand()
  if (r < 0.02) return 'var(--err)'
  if (r < 0.06) return 'var(--warn)'
  if (r < 0.9) return `color-mix(in oklch, var(--ok) ${40 + heatRand() * 50}%, var(--bg-sunk))`
  return 'var(--bg-sunk)'
})

export function ChartsPage() {
  return (
    <>
      <PageHeader
        kicker="03 · Data display"
        title="Charts"
        lede="Monochrome + one accent, hairline gridlines, mono axis labels. These are playground demos — not shipped library components (use d3/recharts/etc. in real apps)."
      />

      <div className="demo">
        <div className="demo-label">Area / line</div>
        <div className="demo-body plain" style={{ padding: '14px 16px' }}>
          <Card style={{ padding: '14px 16px' }}>
            <div className="spread" style={{ marginBottom: 10 }}>
              <Kpi
                className="nested"
                label="Requests · last 24h"
                value={<span className="mono num" style={{ fontSize: 20, fontWeight: 500 }}>847,291</span>}
                style={{ padding: 0, border: 0, background: 'transparent', boxShadow: 'none' }}
              />
              <div className="seg">
                <button>1h</button>
                <button>6h</button>
                <button className="on">24h</button>
                <button>7d</button>
              </div>
            </div>

            <svg viewBox="0 0 600 160" style={{ width: '100%', height: 160, display: 'block' }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.14 230)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="oklch(0.62 0.14 230)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g stroke="var(--line)" strokeWidth="1">
                <line x1="0" x2="600" y1="40" y2="40" />
                <line x1="0" x2="600" y1="80" y2="80" />
                <line x1="0" x2="600" y1="120" y2="120" />
              </g>
              <path
                d="M0,110 L30,102 L60,98 L90,88 L120,92 L150,70 L180,58 L210,64 L240,48 L270,42 L300,54 L330,38 L360,46 L390,30 L420,42 L450,52 L480,40 L510,34 L540,44 L570,32 L600,38 L600,160 L0,160 Z"
                fill="url(#g1)"
              />
              <path
                d="M0,110 L30,102 L60,98 L90,88 L120,92 L150,70 L180,58 L210,64 L240,48 L270,42 L300,54 L330,38 L360,46 L390,30 L420,42 L450,52 L480,40 L510,34 L540,44 L570,32 L600,38"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.75"
              />
              <circle cx="390" cy="30" r="3" fill="var(--accent)" />
              <line x1="390" x2="390" y1="30" y2="160" stroke="var(--accent)" strokeDasharray="2 3" strokeWidth="1" opacity="0.6" />
            </svg>

            <div className="spread mono" style={{ fontSize: 10.5, color: 'var(--text-dim)', marginTop: 6 }}>
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </Card>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">Stacked bars · regional breakdown</div>
        <div className="demo-body plain" style={{ padding: '14px 16px' }}>
          <Card style={{ padding: '14px 16px' }}>
            <svg viewBox="0 0 600 120" style={{ width: '100%', height: 120, display: 'block' }}>
              {barGroups.map((vals, i) => {
                let y = 110
                const x = 10 + i * 24
                return (
                  <g key={i}>
                    {vals.map((v, j) => {
                      const h = (v / 80) * 90
                      const rect = <rect key={j} x={x} y={y - h} width={16} height={h} fill={barColors[j]} />
                      y -= h
                      return rect
                    })}
                  </g>
                )
              })}
              <line x1="0" x2="600" y1="110" y2="110" stroke="var(--line-strong)" strokeWidth="1" />
            </svg>
            <div className="row" style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
              <span className="row" style={{ gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)' }} />
                us-east-1
              </span>
              <span className="row" style={{ gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'oklch(0.72 0.08 230)' }} />
                eu-west-1
              </span>
              <span className="row" style={{ gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'oklch(0.85 0.04 230)' }} />
                ap-south-1
              </span>
            </div>
          </Card>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">Sparkline · inline</div>
        <div className="demo-body">
          <div className="row" style={{ gap: 24 }}>
            <div>
              <div className="kpi-label">CPU</div>
              <div className="row" style={{ gap: 8, marginTop: 4 }}>
                <span className="mono num" style={{ fontSize: 16 }}>38%</span>
                <svg viewBox="0 0 100 30" style={{ width: 90, height: 30 }}>
                  <polyline
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    points="0,20 10,18 20,22 30,14 40,16 50,10 60,14 70,8 80,12 90,6 100,9"
                  />
                </svg>
              </div>
            </div>
            <div>
              <div className="kpi-label">Memory</div>
              <div className="row" style={{ gap: 8, marginTop: 4 }}>
                <span className="mono num" style={{ fontSize: 16 }}>72%</span>
                <div className="spark">
                  {sparkA.map((h, i) => (
                    <span key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="kpi-label">Errors / min</div>
              <div className="row" style={{ gap: 8, marginTop: 4 }}>
                <span className="mono num" style={{ fontSize: 16 }}>2.4</span>
                <div className="spark">
                  {sparkB.map((h, i) => (
                    <span
                      key={i}
                      style={{
                        height: `${h}%`,
                        background: i === 14 ? 'var(--err)' : 'var(--text-dim)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">Heatmap · 24 × 7 uptime</div>
        <div className="demo-body plain" style={{ padding: '18px 20px' }}>
          <div className="heat">
            {heatCells.map((bg, i) => (
              <div key={i} style={{ background: bg }} />
            ))}
          </div>
          <div className="row mono" style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 8, gap: 6 }}>
            <span>7 days ago</span>
            <span style={{ flex: 1 }} />
            <span>now</span>
          </div>
        </div>
      </div>
    </>
  )
}
