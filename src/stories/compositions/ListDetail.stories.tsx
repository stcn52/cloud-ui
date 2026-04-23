import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  Pill,
  Tab,
  Tabs,
} from '../..'
import { useState } from 'react'

const meta: Meta = {
  title: '07 · Compositions/List + detail layout',
  parameters: {
    docs: {
      description: {
        component:
          'The bread-and-butter console layout. Breadcrumb + title at top, content + metadata sidebar below.',
      },
    },
  },
}
export default meta
type Story = StoryObj

export const ServiceDetail: Story = {
  render: () => {
    const [tab, setTab] = useState<'Overview' | 'Deployments' | 'Env vars' | 'Logs'>('Overview')
    return (
      <div
        className="border border-line rounded-md bg-bg-elev"
        style={{ width: 900 }}
      >
        <div className="px-4 py-3 border-b border-line flex items-center gap-2">
          <Breadcrumbs>
            <BreadcrumbItem>Services</BreadcrumbItem>
            <BreadcrumbItem leaf>api-gateway</BreadcrumbItem>
          </Breadcrumbs>
          <div style={{ flex: 1 }} />
          <Pill tone="ok" dot>Healthy</Pill>
          <Button size="sm">Edit</Button>
          <Button size="sm" intent="primary">Deploy</Button>
        </div>
        <div className="px-4 pt-3">
          <h1 className="text-xl font-semibold tracking-tight">api-gateway</h1>
          <div className="text-text-muted text-sm mt-1">v142 · us-east-1 · 12 instances · last deploy 4h ago</div>
          <div className="mt-3">
            <Tabs value={tab} onChange={(v) => setTab(v as typeof tab)}>
              {(['Overview', 'Deployments', 'Env vars', 'Logs'] as const).map((t) => (
                <Tab key={t} id={t}>{t}</Tab>
              ))}
            </Tabs>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_280px] gap-4 p-4">
          <div className="space-y-3">
            <Card>
              <div className="p-4 text-sm text-text-muted">
                <div className="font-semibold text-text mb-1">Overview</div>
                Request load looks nominal. No deploy in progress.
              </div>
            </Card>
            <Card>
              <div className="p-4 text-sm">
                <div className="font-semibold text-text mb-2">Recent deployments</div>
                <div className="space-y-1 font-mono text-xs text-text-muted">
                  <div>v142 · 4h ago · ok</div>
                  <div>v141 · 2d ago · ok</div>
                  <div>v140 · 3d ago · rolled back</div>
                </div>
              </div>
            </Card>
          </div>
          <aside className="space-y-3">
            <Card>
              <div className="p-3 text-xs">
                <div className="uppercase tracking-wider text-text-dim mb-1">Owner</div>
                <div>platform@linden</div>
              </div>
            </Card>
            <Card>
              <div className="p-3 text-xs">
                <div className="uppercase tracking-wider text-text-dim mb-1">Tags</div>
                <div className="flex flex-wrap gap-1">
                  <Pill mono>env:prod</Pill>
                  <Pill mono>tier:1</Pill>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    )
  },
}
