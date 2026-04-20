import { Dot, Pill } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function PillPage() {
  return (
    <>
      <PageHeader
        kicker="02 · Primitives"
        title="Pill & Badge"
        lede="Compact labels for status, tags, and metadata. Six tones, two sizes, and a mono variant for machine-readable values."
      />

      <div className="demo">
        <div className="demo-label">Status pills</div>
        <div className="demo-body">
          <Pill tone="ok" dot>
            Healthy
          </Pill>
          <Pill tone="warn" dot>
            Degraded
          </Pill>
          <Pill tone="err" dot>
            Failing
          </Pill>
          <Pill tone="info" dot>
            Building
          </Pill>
          <Pill dot>Paused</Pill>
          <Pill tone="solid">v142</Pill>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">Tag / chip</div>
        <div className="demo-body">
          <Pill mono>env:prod</Pill>
          <Pill mono>region:us-east-1</Pill>
          <Pill mono tone="info">
            service:api-gateway
          </Pill>
          <Pill mono onRemove={() => {}}>
            level:ERROR
          </Pill>
          <Pill size="lg" dot dotColor="var(--ok)">
            Online · 12 instances
          </Pill>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">Status dot</div>
        <div className="demo-body" style={{ gap: 20 }}>
          <span className="row" style={{ gap: 6, fontSize: 'var(--fs-sm)' }}>
            <Dot tone="ok" /> Operational
          </span>
          <span className="row" style={{ gap: 6, fontSize: 'var(--fs-sm)' }}>
            <Dot tone="warn" /> Degraded
          </span>
          <span className="row" style={{ gap: 6, fontSize: 'var(--fs-sm)' }}>
            <Dot tone="err" /> Outage
          </span>
          <span className="row" style={{ gap: 6, fontSize: 'var(--fs-sm)' }}>
            <Dot /> Unknown
          </span>
        </div>
      </div>
    </>
  )
}
