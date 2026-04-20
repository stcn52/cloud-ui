import { Delta, Kpi, Pill } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function KpiPage() {
  return (
    <>
      <PageHeader
        kicker="03 · Data display"
        title="KPI"
        lede="A single number answers operators' first question. Mono tabular digits, short label, one delta or context line underneath."
      />

      <div className="demo">
        <div className="demo-label">Four-up summary row</div>
        <div className="demo-body plain" style={{ padding: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, width: '100%' }}>
            <Kpi
              label="Requests / min"
              value="12,840"
              foot={
                <>
                  <Delta direction="up">+8.2%</Delta> vs 1h ago
                </>
              }
            />
            <Kpi
              label="p95 latency"
              value={
                <>
                  184<span style={{ fontSize: 14, color: 'var(--text-dim)' }}>ms</span>
                </>
              }
              foot={
                <>
                  <Delta direction="down">−12ms</Delta> SLA: 250ms
                </>
              }
            />
            <Kpi
              label="Error rate"
              value={
                <>
                  0.34<span style={{ fontSize: 14, color: 'var(--text-dim)' }}>%</span>
                </>
              }
              foot={
                <>
                  <Delta direction="up">+0.1%</Delta> last hour
                </>
              }
            />
            <Kpi
              label="Monthly spend"
              value="$2,480"
              foot={<Pill tone="info">62% of budget</Pill>}
            />
          </div>
        </div>
      </div>
    </>
  )
}
