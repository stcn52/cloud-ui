import { Skeleton } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function SkeletonPage() {
  return (
    <>
      <PageHeader
        kicker="03 · Data display"
        title="Skeleton"
        lede="Loading placeholders. Shimmer on neutral background — never colored. Match the shape of what you're replacing."
      />

      <div className="demo">
        <div className="demo-label">Loading placeholders</div>
        <div className="demo-body" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
          <Skeleton style={{ width: '40%', height: 14 }} />
          <Skeleton style={{ width: '70%' }} />
          <Skeleton style={{ width: '60%' }} />
          <div className="row" style={{ gap: 10, marginTop: 8 }}>
            <Skeleton style={{ width: 26, height: 26, borderRadius: '50%' }} />
            <div className="col" style={{ gap: 5, flex: 1 }}>
              <Skeleton style={{ width: '30%' }} />
              <Skeleton style={{ width: '50%', height: 8 }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
