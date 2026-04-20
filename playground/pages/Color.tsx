import { PageHeader } from '../Layout'

interface Swatch {
  token: string
  name: string
  value: string
  ink?: string
}

const neutrals: Swatch[] = [
  { token: 'bg', name: 'Canvas', value: 'oklch(0.995 0.004 240)' },
  { token: 'bg-sunk', name: 'Sunk', value: 'oklch(0.975 0.006 240)' },
  { token: 'panel', name: 'Panel', value: 'oklch(0.985 0.005 240)' },
  { token: 'line', name: 'Line', value: 'oklch(0.92 0.008 240)' },
  { token: 'text-muted', name: 'Muted', value: 'oklch(0.52 0.015 250)' },
  { token: 'text', name: 'Text', value: 'oklch(0.22 0.02 250)' },
]

const accents: Swatch[] = [
  { token: 'accent', name: 'Azure', value: 'oklch(0.62 0.14 230)', ink: 'white' },
  { token: 'accent-weak', name: 'Weak', value: 'oklch(0.95 0.04 230)', ink: 'var(--accent-ink)' },
  { token: 'ok', name: 'Success', value: 'oklch(0.66 0.13 155)', ink: 'white' },
  { token: 'warn', name: 'Warning', value: 'oklch(0.76 0.14 75)', ink: 'oklch(0.25 0.08 75)' },
  { token: 'err', name: 'Error', value: 'oklch(0.62 0.18 22)', ink: 'white' },
  { token: 'info', name: 'Info', value: 'oklch(0.62 0.14 230)', ink: 'white' },
]

function SwatchCard({ s, showSample }: { s: Swatch; showSample?: boolean }) {
  return (
    <div className="sw-card">
      <div
        className="sw-chip"
        style={
          showSample
            ? {
                background: `var(--${s.token})`,
                color: s.ink,
                display: 'flex',
                alignItems: 'flex-end',
                padding: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
              }
            : { background: `var(--${s.token})` }
        }
      >
        {showSample && 'Aa 123'}
      </div>
      <div className="sw-meta">
        <div className="sw-name">{s.name}</div>
        <div className="sw-token">--{s.token}</div>
        <div className="sw-val">{s.value}</div>
      </div>
    </div>
  )
}

export function ColorPage() {
  return (
    <>
      <PageHeader
        kicker="01 · Foundations"
        title="Color"
        lede="All colors live in OKLCH so lightness ramps evenly across hues. Six cool-tinted neutrals; one accent; four states."
      />

      <div className="demo">
        <div className="demo-label">
          Neutrals <span className="sub">6 steps · cool-tinted</span>
        </div>
        <div className="demo-body plain" style={{ padding: 18 }}>
          <div className="swatch-row">
            {neutrals.map((s) => (
              <SwatchCard key={s.token} s={s} />
            ))}
          </div>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">
          Accent & status <span className="sub">one accent; four states</span>
        </div>
        <div className="demo-body plain" style={{ padding: 18 }}>
          <div className="swatch-row">
            {accents.map((s) => (
              <SwatchCard key={s.token} s={s} showSample />
            ))}
          </div>
        </div>
        <div className="demo-foot">
{`// usage
color: var(--text);              // default body
background: var(--bg-elev);      // cards, dropdowns, modals
border-color: var(--line);       // all hairlines
color: var(--accent-ink);        // links, selected state`}
        </div>
      </div>
    </>
  )
}
