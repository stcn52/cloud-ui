import { Card, CardFoot, CardHead, Pill } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function CardPage() {
  return (
    <>
      <PageHeader
        kicker="03 · Data display"
        title="Card"
        lede="Surface container with optional head/foot. Used to frame KPIs, charts, and any grouped content."
      />

      <div className="demo">
        <div className="demo-label">Basic</div>
        <div className="demo-body">
          <Card style={{ width: 320 }}>
            <div style={{ padding: 16, fontSize: 'var(--fs-sm)', color: 'var(--text)' }}>
              A plain card. No head, no foot — just a bordered, elevated surface.
            </div>
          </Card>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">With head & foot</div>
        <div className="demo-body">
          <Card style={{ width: 360 }}>
            <CardHead title="api-gateway" sub="v142 · us-east-1" />
            <div style={{ padding: 16, fontSize: 'var(--fs-sm)' }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Requests/min</span>
                <span className="mono num">8,420</span>
              </div>
              <div className="row" style={{ justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>p95 latency</span>
                <span className="mono num">124ms</span>
              </div>
            </div>
            <CardFoot>
              <Pill tone="ok" dot>
                Healthy
              </Pill>
              <span style={{ marginLeft: 'auto' }}>Last check 4s ago</span>
            </CardFoot>
          </Card>
        </div>
      </div>
    </>
  )
}
