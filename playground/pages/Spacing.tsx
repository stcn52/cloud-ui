import { PageHeader } from '../Layout'

const scale = [
  ['--sp-1', '4px', 4],
  ['--sp-2', '8px', 8],
  ['--sp-3', '12px', 12],
  ['--sp-4', '16px', 16],
  ['--sp-5', '24px', 24],
  ['--sp-6', '32px', 32],
  ['--sp-7', '48px', 48],
  ['--sp-8', '64px', 64],
] as const

export function SpacingPage() {
  return (
    <>
      <PageHeader
        kicker="01 · Foundations"
        title="Spacing"
        lede="A 4-point scale. Layouts snap to 8px, internal padding uses 12/16, generous vertical rhythm uses 24/32."
      />

      <div className="demo">
        <div className="demo-label">Scale</div>
        <div className="demo-body plain" style={{ padding: '18px 24px' }}>
          {scale.map(([token, label, px]) => (
            <div key={token} className="space-row">
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>{token}</span>
              <div className="space-bar" style={{ width: px }} />
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
