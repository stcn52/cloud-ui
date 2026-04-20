import { Button, Pill, Tooltip } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function TooltipPage() {
  return (
    <>
      <PageHeader
        kicker="05 · Overlays"
        title="Tooltip"
        lede="Hover or focus a target to see a short label. Use for icon-only controls and truncated values. Never put anything interactive inside."
      />

      <div className="demo">
        <div className="demo-label">Icon-only controls</div>
        <div className="demo-body" style={{ gap: 40, paddingTop: 50 }}>
          <Tooltip tip="Download logs">
            <Button iconOnly>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <polyline points="8 12 12 16 16 12" />
                <line x1="12" y1="8" x2="12" y2="16" />
              </svg>
            </Button>
          </Tooltip>
          <Tooltip tip="Settings · ⌘,">
            <Button iconOnly>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="3" />
                <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
              </svg>
            </Button>
          </Tooltip>
          <Tooltip tip="Click to copy · 2m ago">
            <Pill mono>sha:bb08af1</Pill>
          </Tooltip>
        </div>
      </div>
    </>
  )
}
