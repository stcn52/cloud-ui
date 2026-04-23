import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pill } from '../Pill'
import { Tab, Tabs } from './index'

const meta = {
  title: '04 · Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { value: 'Overview', onChange: () => {} },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const tabs = ['Overview', 'Deployments', 'Logs', 'Metrics', 'Env vars', 'Settings'] as const

export const Basic: Story = {
  render: () => {
    const [active, setActive] = useState<(typeof tabs)[number]>('Overview')
    return (
      <div style={{ padding: 12 }}>
        <Tabs value={active} onChange={(v) => setActive(v as (typeof tabs)[number])}>
          {tabs.map((t) => (
            <Tab key={t} id={t}>
              {t}
              {t === 'Deployments' && (
                <Pill mono style={{ marginLeft: 4, height: 14, fontSize: 9 }}>142</Pill>
              )}
            </Tab>
          ))}
        </Tabs>
        <div style={{ padding: '20px 0', color: 'var(--color-text-muted)', fontSize: 12.5 }}>
          Active: <span className="mono">{active}</span>
        </div>
      </div>
    )
  },
}
