import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionItem } from './index'
import { Pill } from '../Pill'
import { Badge } from '../Badge'

const meta = {
  title: '06 · Advanced/Accordion',
  component: Accordion,
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Single-open by default — opening one item closes the previous. Each item header takes an optional `extra` slot for counts or status pills.' } } },
  render: () => (
    <div style={{ width: 460 }}>
      <Accordion defaultValue="basic">
        <AccordionItem value="basic" title="基本信息" extra="5 项">
          配置工作空间名称、描述、地区、配额方案等基础属性。
        </AccordionItem>
        <AccordionItem value="members" title="成员与权限" extra="28 人">
          管理工作空间成员、角色与访问范围。
        </AccordionItem>
        <AccordionItem value="security" title="安全与验收" extra={<Pill tone="warn" size="xs">待配置</Pill>}>
          配置 SSO、审计日志保留期与合规验收项。
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const Multiple: Story = {
  parameters: { docs: { description: { story: '`type="multiple"` lets several items stay open at once.' } } },
  render: () => (
    <div style={{ width: 460 }}>
      <Accordion type="multiple" defaultValue={['general', 'notifications']}>
        <AccordionItem value="general" title="General" extra={<Badge count={2} tone="neutral" />}>
          Workspace name, default region, billing contact.
        </AccordionItem>
        <AccordionItem value="notifications" title="Notifications">
          Email digests, Slack integration, on-call escalation rules.
        </AccordionItem>
        <AccordionItem value="advanced" title="Advanced" extra={<Pill tone="err" size="xs">danger zone</Pill>}>
          Transfer ownership, delete workspace.
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState<string | undefined>('a')
    return (
      <div style={{ width: 460, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="text-sm text-text-muted">
          open: <code>{open ?? '(none)'}</code> ·{' '}
          <button className="text-accent-ink underline" onClick={() => setOpen('b')}>open B</button> ·{' '}
          <button className="text-accent-ink underline" onClick={() => setOpen(undefined)}>close all</button>
        </div>
        <Accordion value={open} onValueChange={(v) => setOpen(v as string | undefined)}>
          <AccordionItem value="a" title="Section A">Content A</AccordionItem>
          <AccordionItem value="b" title="Section B">Content B</AccordionItem>
          <AccordionItem value="c" title="Section C" disabled>Disabled — can't open</AccordionItem>
        </Accordion>
      </div>
    )
  },
}
