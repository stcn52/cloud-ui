import { Progress, Ring } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function ProgressPage() {
  return (
    <>
      <PageHeader
        kicker="03 · Data display"
        title="Progress & Ring"
        lede="Linear bar for determinate tasks; conic ring for percentage summaries. Three tones — accent, warn, err — map to status thresholds."
      />

      <div className="demo">
        <div className="demo-label">Linear</div>
        <div className="demo-body" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 14 }}>
          <div className="col" style={{ gap: 4 }}>
            <div className="spread">
              <span className="mono" style={{ fontSize: 11 }}>Uploading image · 62%</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>24 / 38 MB</span>
            </div>
            <Progress value={62} />
          </div>
          <div className="col" style={{ gap: 4 }}>
            <div className="spread">
              <span className="mono" style={{ fontSize: 11 }}>Disk usage</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--warn)' }}>84%</span>
            </div>
            <Progress value={84} tone="warn" />
          </div>
          <div className="col" style={{ gap: 4 }}>
            <div className="spread">
              <span className="mono" style={{ fontSize: 11 }}>Budget</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--err)' }}>102%</span>
            </div>
            <Progress value={100} tone="err" />
          </div>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">Radial</div>
        <div className="demo-body" style={{ gap: 24 }}>
          <Ring value={28}>28%</Ring>
          <Ring value={62}>62%</Ring>
          <Ring value={84} tone="warn">84%</Ring>
          <Ring value={99} tone="ok">99.9%</Ring>
        </div>
      </div>
    </>
  )
}
