import { PageHeader } from '../Layout'

const shadows = [
  ['--shadow-xs', 'flat · hairline'],
  ['--shadow-sm', 'cards, buttons'],
  ['--shadow-md', 'dropdowns'],
  ['--shadow-lg', 'modals, toasts'],
] as const

export function ElevationPage() {
  return (
    <>
      <PageHeader
        kicker="01 · Foundations"
        title="Elevation"
        lede="Flat by default. Shadow is for modals, popovers, and toasts only — if you need it to feel elevated, ask whether it should be."
      />

      <div className="demo">
        <div className="demo-label">Scale</div>
        <div className="demo-body plain" style={{ padding: 40 }}>
          <div className="elev-row">
            {shadows.map(([token, role]) => (
              <div className="elev-card" key={token} style={{ boxShadow: `var(${token})` }}>
                {token}
                <br />
                {role}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
