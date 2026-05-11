import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Accordion,
  AccordionItem,
  Avatar,
  Banner,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Checkbox,
  MiniTabs,
  Pill,
  Select,
  Textarea,
} from '../..'

const meta: Meta = {
  title: '07 · Compositions/Ticket detail',
  parameters: {
    docs: {
      description: {
        component:
          'A support-ticket detail page assembled from primitives — header strip, conversation thread, reply box, and a metadata sidebar. Useful as a dark-mode contrast check: every text tier (title / muted meta / dim timestamps), status pills, and the accent action buttons should stay legible on both themes. Flip the Storybook theme toolbar to compare.',
      },
    },
  },
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    const [tab, setTab] = useState<'reply' | 'note'>('reply')
    const [reply, setReply] = useState('')
    const [resolved, setResolved] = useState(false)
    const [priority, setPriority] = useState<string | undefined>('p1')

    return (
      <div style={{ width: 1080 }} className="text-md">
        {/* page-header strip */}
        <div className="flex items-center gap-2 mb-2">
          <Breadcrumbs>
            <BreadcrumbItem>工单列表</BreadcrumbItem>
            <BreadcrumbItem leaf>#T-2</BreadcrumbItem>
          </Breadcrumbs>
          <span className="text-text font-semibold">E2E test ticket</span>
        </div>
        <div className="flex items-center gap-2 mb-4 text-xs">
          <Pill tone="err" size="xs" dot>待处理</Pill>
          <Pill tone="warn" size="xs">P1 高</Pill>
          <span className="text-text-dim">服务器 · 未指派 · </span>
          <span className="text-err">SLA 违约 · 已超 3d 22h</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
          {/* main column */}
          <div className="border border-line rounded-md bg-bg-elev p-4">
            <div className="flex items-center gap-2 mb-1">
              <Pill tone="warn" size="xs">P1 高</Pill>
              <Pill tone="err" size="xs" dot>待处理</Pill>
              <span className="text-text-dim text-xs">#T-2 · 分类: 服务器</span>
            </div>
            <h1 className="text-xl font-semibold tracking-tight">E2E test ticket</h1>
            <div className="text-text-muted text-sm mt-1 mb-4">
              提交人 <span className="text-text font-medium">e2etest</span> · 提交时间 —
            </div>

            {/* thread */}
            <div className="flex flex-col gap-3">
              {[
                { who: 'e2etest', body: 'first message body' },
                { who: 'e2etest', body: 'a follow up reply' },
              ].map((m, i) => (
                <div key={i} className="border border-line rounded-md bg-bg-sunk p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Avatar size="sm">{m.who.slice(0, 1).toUpperCase()}</Avatar>
                    <span className="text-text font-medium text-sm">{m.who}</span>
                  </div>
                  <div className="text-text-muted text-sm">{m.body}</div>
                </div>
              ))}
            </div>

            {/* reply box */}
            <div className="mt-4">
              <MiniTabs
                value={tab}
                onChange={(v) => setTab(v as typeof tab)}
                options={[
                  { value: 'reply', label: '回复用户' },
                  { value: 'note', label: '内部备注' },
                ]}
              />
              <div className="mt-2.5">
                <Textarea
                  rows={4}
                  placeholder={tab === 'reply' ? '输入回复内容…' : '仅团队可见的备注…'}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <Button size="sm" intent="ghost">选择文件…</Button>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-sm text-text-muted cursor-pointer select-none">
                    <Checkbox checked={resolved} onChange={(e) => setResolved(e.target.checked)} />
                    标记为已解决
                  </label>
                  <Button size="sm" intent="primary">发送回复</Button>
                </div>
              </div>
            </div>
          </div>

          {/* sidebar */}
          <div className="border border-line rounded-md bg-bg-elev p-3 self-start">
            <div className="text-text-muted text-xs uppercase tracking-[0.05em] font-medium mb-2">状态</div>
            <Banner tone="err" className="mb-3 text-xs">SLA 违约 · 已超 3d 23h</Banner>
            <div className="flex flex-col gap-2 mb-3">
              <Select
                size="sm"
                value={priority}
                onChange={setPriority}
                options={[
                  { value: 'p0', label: 'P0 紧急' },
                  { value: 'p1', label: 'P1 高' },
                  { value: 'p2', label: 'P2 中' },
                  { value: 'p3', label: 'P3 低' },
                ]}
              />
              <Button size="sm" intent="default">改 + 重算 SLA</Button>
              <Select
                size="sm"
                placeholder="分配给 (user_id)"
                options={[
                  { value: 'alex', label: 'Alex Chen' },
                  { value: 'bri', label: 'Bri Tanaka' },
                ]}
              />
              <Button size="sm" intent="primary">指派</Button>
            </div>
            <Accordion>
              <AccordionItem value="links" title="关联 / 根因" extra={<Pill tone="neutral" size="xs">0</Pill>}>
                暂无关联工单。可在此挂接父子工单、重复项或已知根因。
              </AccordionItem>
              <AccordionItem value="meta" title="工单信息 / 时间">
                创建 — · 首次响应 — · 最近活动 —
              </AccordionItem>
              <AccordionItem value="audit" title="操作流水">
                状态变更、指派、SLA 重算等操作记录将显示在这里。
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    )
  },
}
