import { Banner, Button } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

const icons = {
  info: (
    <svg className="icn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <circle cx="12" cy="16" r="0.6" fill="currentColor" />
    </svg>
  ),
  ok: (
    <svg className="icn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="5 12 10 17 20 7" />
    </svg>
  ),
  warn: (
    <svg className="icn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M12 3l10 18H2z" />
      <line x1="12" y1="10" x2="12" y2="15" />
    </svg>
  ),
  err: (
    <svg className="icn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  ),
}

export function BannerPage() {
  return (
    <>
      <PageHeader
        kicker="05 · Overlays"
        title="Banner"
        lede="Persistent inline feedback at the top of a view. Four intents. Stays until dismissed or the underlying state changes."
      />

      <div className="demo">
        <div className="demo-label">Four intents</div>
        <div className="demo-body" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
          <Banner tone="info" icon={icons.info} title="Rolling deploy in progress" onDismiss={() => {}}>
            3 of 12 instances updated to v143 · est. 4m remaining
          </Banner>
          <Banner tone="ok" icon={icons.ok} title="Database migration complete" onDismiss={() => {}}>
            Applied 3 migrations in 14s · 0 rows failed
          </Banner>
          <Banner
            tone="warn"
            icon={icons.warn}
            title="You're close to your monthly budget"
            actions={<Button size="xs">Increase cap</Button>}
          >
            $2,480 of $4,000 used · projected to exceed on Dec 28
          </Banner>
          <Banner
            tone="err"
            icon={icons.err}
            title="mail-relay is failing health checks"
            actions={<Button size="xs">Investigate</Button>}
          >
            Last success 8m ago · restart may be required
          </Banner>
        </div>
      </div>
    </>
  )
}
