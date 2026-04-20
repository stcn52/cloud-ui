import { Button, Popover, PopoverItem, PopoverSeparator } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

const iconPlus = (
  <svg viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const iconDeploy = (
  <svg viewBox="0 0 24 24">
    <polyline points="16 12 12 8 8 12" />
    <line x1="12" y1="16" x2="12" y2="8" />
  </svg>
)
const iconLogs = (
  <svg viewBox="0 0 24 24">
    <path d="M4 6h12M4 10h16M4 14h10" />
  </svg>
)
const iconPause = (
  <svg viewBox="0 0 24 24">
    <rect x="6" y="10" width="12" height="10" rx="1" />
    <path d="M9 10V7a3 3 0 0 1 6 0v3" />
  </svg>
)
const iconTrash = (
  <svg viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M6 6l1 14h10l1-14" />
  </svg>
)

export function PopoverPage() {
  return (
    <>
      <PageHeader
        kicker="05 · Overlays"
        title="Popover · menu"
        lede="Click-triggered floating menu. Closes on outside click or ESC. Use for row actions and secondary controls that shouldn't live on the chrome."
      />

      <div className="demo">
        <div className="demo-label">Row actions</div>
        <div className="demo-body">
          <Popover
            trigger={
              <Button iconOnly>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="5" cy="12" r="1.2" />
                  <circle cx="12" cy="12" r="1.2" />
                  <circle cx="19" cy="12" r="1.2" />
                </svg>
              </Button>
            }
            content={
              <>
                <PopoverItem icon={iconPlus} shortcut="⌘D">
                  Duplicate
                </PopoverItem>
                <PopoverItem icon={iconDeploy} shortcut="⌘↵">
                  Deploy
                </PopoverItem>
                <PopoverItem icon={iconLogs} shortcut="L">
                  View logs
                </PopoverItem>
                <PopoverSeparator />
                <PopoverItem icon={iconPause}>Pause</PopoverItem>
                <PopoverSeparator />
                <PopoverItem icon={iconTrash} shortcut="⌫" danger>
                  Delete
                </PopoverItem>
              </>
            }
          />
        </div>
      </div>
    </>
  )
}
