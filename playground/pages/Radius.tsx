import { PageHeader } from '../Layout'

const rad = [
  ['--r-xs', 4, 'xs · pills'],
  ['--r-sm', 6, 'sm · controls'],
  ['--r-md', 8, 'md · cards'],
  ['--r-lg', 12, 'lg · modals'],
  ['--r-xl', 16, 'xl · feature'],
] as const

export function RadiusPage() {
  return (
    <>
      <PageHeader
        kicker="01 · Foundations"
        title="Radius"
        lede="Softer than sharp, harder than rounded. 6px for controls; 8–12px for containers."
      />

      <div className="demo">
        <div className="demo-label">Scale</div>
        <div className="demo-body plain">
          <div className="radius-row">
            {rad.map(([token, px, role]) => (
              <div className="radius-card" key={token}>
                <div className="box" style={{ borderRadius: px }} />
                <div className="lbl">
                  {token}
                  <br />
                  {role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
