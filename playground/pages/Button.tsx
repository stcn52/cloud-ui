import { Button, ButtonGroup } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function ButtonPage() {
  return (
    <>
      <PageHeader
        kicker="02 · Primitives"
        title="Button"
        lede={
          <>
            One base <code className="mono">.btn</code>, six intents, four sizes. Primary is
            reserved for the main action on a page — never two at once.
          </>
        }
      />

      <div className="demo">
        <div className="demo-label">
          Intents <span className="sub">intent=primary · subtle · ghost · outline · danger</span>
        </div>
        <div className="demo-body">
          <Button intent="primary">Deploy to prod</Button>
          <Button>Cancel</Button>
          <Button intent="subtle">Promote</Button>
          <Button intent="ghost">Skip for now</Button>
          <Button intent="outline">Outline</Button>
          <Button intent="danger">Delete project</Button>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">
          Sizes <span className="sub">size=xs · sm · md · lg</span>
        </div>
        <div className="demo-body">
          <Button intent="primary" size="xs">
            xs
          </Button>
          <Button intent="primary" size="sm">
            sm
          </Button>
          <Button intent="primary">default</Button>
          <Button intent="primary" size="lg">
            lg
          </Button>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">States</div>
        <div className="demo-body">
          <Button intent="primary">Default</Button>
          <Button intent="primary" loading>
            Saving…
          </Button>
          <Button intent="primary" disabled>
            Disabled
          </Button>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">With icon & group</div>
        <div className="demo-body">
          <Button>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="16 12 12 8 8 12" />
              <line x1="12" y1="16" x2="12" y2="8" />
            </svg>
            Deploy
          </Button>
          <Button intent="primary">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New resource
          </Button>
          <Button iconOnly title="More">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="5" cy="12" r="1.2" />
              <circle cx="12" cy="12" r="1.2" />
              <circle cx="19" cy="12" r="1.2" />
            </svg>
          </Button>
          <ButtonGroup>
            <Button>Day</Button>
            <Button style={{ background: 'var(--bg-sunk)' }}>Week</Button>
            <Button>Month</Button>
          </ButtonGroup>
        </div>
      </div>
    </>
  )
}
