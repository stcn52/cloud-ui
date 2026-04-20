import { PageHeader } from '../Layout'

interface Row {
  label: string
  sample: string
  style: React.CSSProperties
  spec: string
}

const rows: Row[] = [
  { label: '2xl · Display', sample: 'Developers ship on cloud-ui', style: { fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }, spec: '28 / 1.1 / -0.02em' },
  { label: 'xl · H1', sample: 'Services overview', style: { fontSize: 20, fontWeight: 600, letterSpacing: '-0.015em' }, spec: '20 / 1.2 / -0.015em' },
  { label: 'lg · H2', sample: 'Recent deployments', style: { fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }, spec: '15 / 1.3 / -0.01em' },
  { label: 'md · Body', sample: "The request was rejected because it exceeded the plan's rate limit.", style: { fontSize: 13 }, spec: '13 / 1.5' },
  { label: 'sm · UI', sample: 'Deploy to production', style: { fontSize: 12.5 }, spec: '12.5 / 1.4' },
  { label: 'xs · Label', sample: 'Last deployed', style: { fontSize: 11.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }, spec: '11.5 / 0.05em tracking' },
  { label: 'xxs · Caption', sample: 'Provisioned 3m ago in us-east-1', style: { fontSize: 10.5, color: 'var(--text-dim)' }, spec: '10.5 / 1.4' },
]

export function TypographyPage() {
  return (
    <>
      <PageHeader
        kicker="01 · Foundations"
        title="Typography"
        lede={
          <>
            Two families: <b>Inter</b> for UI at −0.003em tracking, <b>JetBrains Mono</b> for anything quantitative. Nothing else.
          </>
        }
      />

      <div className="demo">
        <div className="demo-label">Scale</div>
        <div className="demo-body plain" style={{ padding: 0 }}>
          {rows.map((r) => (
            <div key={r.label} className="type-row">
              <span className="label">{r.label}</span>
              <span className="sample" style={r.style}>{r.sample}</span>
              <span className="spec">{r.spec}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">Monospace · tabular numerals</div>
        <div className="demo-body plain" style={{ padding: 20 }}>
          <div className="col" style={{ gap: 6 }}>
            <div className="mono num" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.03em' }}>
              12,840 <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>requests / min</span>
            </div>
            <div className="mono num" style={{ fontSize: 18, color: 'var(--text-muted)' }}>
              0.34% <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>error rate</span>
            </div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--text-dim)' }}>
              dep_8f2a71 · bb08af1 · 2m 14s
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
