import { useState } from 'react'
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFoot,
  DrawerHead,
  Pill,
  Tab,
  Tabs,
} from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function DrawerPage() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'Overview' | 'Env' | 'History'>('Overview')

  return (
    <>
      <PageHeader
        kicker="05 · Overlays"
        title="Drawer"
        lede="Right-side inspector for editing or reviewing the selected row. Focus-trapped but less aggressive than a dialog."
      />

      <div className="demo">
        <div className="demo-label">Right-side inspector</div>
        <div className="demo-body">
          <Button onClick={() => setOpen(true)}>Open inspector</Button>
        </div>
      </div>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <DrawerHead>
          <div>
            <div style={{ fontWeight: 600, fontSize: 'var(--fs-md)' }}>api-gateway</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
              svc_8f2a71 · us-east-1
            </div>
          </div>
          <Button iconOnly size="sm" intent="ghost" style={{ marginLeft: 'auto' }} onClick={() => setOpen(false)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </Button>
        </DrawerHead>
        <DrawerBody>
          <Tabs style={{ marginBottom: 12 }}>
            {(['Overview', 'Env', 'History'] as const).map((t) => (
              <Tab key={t} active={t === tab} onClick={() => setTab(t)}>
                {t}
              </Tab>
            ))}
          </Tabs>

          <div className="row" style={{ gap: 8, marginBottom: 12 }}>
            <Pill tone="ok" dot>
              Healthy
            </Pill>
            <Pill mono>v142</Pill>
            <Pill mono>12 instances</Pill>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', fontSize: 'var(--fs-sm)' }}>
            <div>
              <div className="kpi-label">Requests/m</div>
              <div className="mono num" style={{ fontSize: 16 }}>
                8,420
              </div>
            </div>
            <div>
              <div className="kpi-label">p95</div>
              <div className="mono num" style={{ fontSize: 16 }}>
                124ms
              </div>
            </div>
            <div>
              <div className="kpi-label">CPU</div>
              <div className="mono num" style={{ fontSize: 16 }}>
                38%
              </div>
            </div>
            <div>
              <div className="kpi-label">Memory</div>
              <div className="mono num" style={{ fontSize: 16 }}>
                1.2<span style={{ fontSize: 11, color: 'var(--text-dim)' }}>GB</span>
              </div>
            </div>
          </div>
        </DrawerBody>
        <DrawerFoot>
          <Button intent="ghost">Open in console ↗</Button>
          <Button intent="primary">Deploy</Button>
        </DrawerFoot>
      </Drawer>
    </>
  )
}
