import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Pill } from '../Pill'
import { Tab, Tabs } from '../Tabs'
import { Drawer, DrawerBody, DrawerFoot, DrawerHead } from './index'

const meta = {
  title: '05 · Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: { open: false },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Inspector: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState<'Overview' | 'Env' | 'History'>('Overview')
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open inspector</Button>
        <Drawer open={open} onClose={() => setOpen(false)}>
          <DrawerHead>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>api-gateway</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--color-text-dim)', marginTop: 2 }}>
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
                <Tab key={t} active={t === tab} onClick={() => setTab(t)}>{t}</Tab>
              ))}
            </Tabs>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Pill tone="ok" dot>Healthy</Pill>
              <Pill mono>v142</Pill>
              <Pill mono>12 instances</Pill>
            </div>
          </DrawerBody>
          <DrawerFoot>
            <Button intent="ghost">Open in console ↗</Button>
            <Button intent="primary">Deploy</Button>
          </DrawerFoot>
        </Drawer>
      </>
    )
  },
}
