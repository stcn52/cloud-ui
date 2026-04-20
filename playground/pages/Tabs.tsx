import { useState } from 'react'
import { Pill, Tab, Tabs } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

const tabs = ['Overview', 'Deployments', 'Logs', 'Metrics', 'Env vars', 'Settings'] as const

export function TabsPage() {
  const [active, setActive] = useState<(typeof tabs)[number]>('Overview')

  return (
    <>
      <PageHeader
        kicker="04 · Navigation"
        title="Tabs"
        lede="Underline tabs for in-page sections. One clear active state, no pill backgrounds, counts go in pills beside the label."
      />

      <div className="demo">
        <div className="demo-label">Underline</div>
        <div className="demo-body plain" style={{ padding: '0 20px', background: 'var(--bg-elev)' }}>
          <Tabs style={{ paddingTop: 8 }}>
            {tabs.map((t) => (
              <Tab key={t} active={t === active} onClick={() => setActive(t)}>
                {t}
                {t === 'Deployments' && (
                  <Pill mono style={{ marginLeft: 4, height: 14, fontSize: 9 }}>
                    142
                  </Pill>
                )}
              </Tab>
            ))}
          </Tabs>
          <div style={{ padding: '20px 0', color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
            Active: <span className="mono">{active}</span>
          </div>
        </div>
      </div>
    </>
  )
}
