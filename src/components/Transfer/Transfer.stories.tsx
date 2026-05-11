import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Transfer, type TransferItem, type TransferTargetEntry } from './index'
import { Dialog, DialogHead, DialogBody, DialogFoot } from '../Dialog'
import { Button } from '../Button'

const meta = {
  title: '06 · Advanced/Transfer',
  component: Transfer,
  tags: ['autodocs'],
  args: { items: [] },
} satisfies Meta<typeof Transfer>

export default meta
type Story = StoryObj<typeof meta>

const TypeIcon = ({ kind }: { kind: 'text' | 'date' | 'user' | 'num' | 'status' | 'link' }) => {
  const paths: Record<string, ReactPath> = {
    text: <text x="3" y="14" fontSize="11" fill="currentColor" fontFamily="serif">Aa</text>,
    date: <><rect x="3" y="4" width="14" height="13" rx="1.5" /><path d="M3 8h14M7 2v3M13 2v3" /></>,
    user: <><circle cx="10" cy="7" r="3" /><path d="M4 17a6 6 0 0 1 12 0" /></>,
    num: <text x="2" y="14" fontSize="11" fill="currentColor">123</text>,
    status: <><circle cx="10" cy="10" r="6" /><path d="M7 10l2 2 4-4" /></>,
    link: <path d="M8 12l4-4M6 14a3 3 0 0 1 0-4l2-2M14 6a3 3 0 0 1 0 4l-2 2" />,
  }
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.3} className="text-text-dim" aria-hidden>
      {paths[kind]}
    </svg>
  )
}
type ReactPath = React.ReactElement

const FIELDS: TransferItem[] = [
  { key: 'title', label: '标题', icon: <TypeIcon kind="text" />, disabled: true },
  { key: 'id', label: '编号', icon: <TypeIcon kind="num" /> },
  { key: 'workItemType', label: '工作项类型', icon: <TypeIcon kind="status" /> },
  { key: 'status', label: '状态', icon: <TypeIcon kind="status" /> },
  { key: 'owner', label: '负责人', icon: <TypeIcon kind="user" /> },
  { key: 'parent', label: '父工作项', icon: <TypeIcon kind="link" /> },
  { key: 'start', label: '开始时间', icon: <TypeIcon kind="date" /> },
  { key: 'end', label: '结束时间', icon: <TypeIcon kind="date" /> },
  { key: 'watchers', label: '关注人', icon: <TypeIcon kind="user" /> },
  { key: 'priority', label: '优先级', icon: <TypeIcon kind="num" /> },
  { key: 'severity', label: '严重程度', icon: <TypeIcon kind="num" /> },
  { key: 'repro', label: '复现概率', icon: <TypeIcon kind="num" /> },
  { key: 'created', label: '创建时间', icon: <TypeIcon kind="date" /> },
  { key: 'updated', label: '更新时间', icon: <TypeIcon kind="date" /> },
  { key: 'sprint', label: '迭代', icon: <TypeIcon kind="text" /> },
  { key: 'estimate', label: '预估工时', icon: <TypeIcon kind="num" /> },
  { key: 'tags', label: '标签', icon: <TypeIcon kind="text" /> },
]

export const Playground: Story = {
  render: () => {
    const [value, setValue] = useState<TransferTargetEntry[]>([
      { key: 'id' }, { key: 'title' }, { key: 'status' }, { key: 'owner' }, { key: 'priority' },
    ])
    return (
      <div style={{ width: 720 }}>
        <Transfer
          items={FIELDS}
          value={value}
          onChange={setValue}
          titles={['可选择属性', '已选择属性']}
          searchPlaceholder="搜索"
          onResetDefaults={() => setValue([{ key: 'id' }, { key: 'title' }, { key: 'status' }, { key: 'owner' }])}
        />
        <p className="text-xs text-text-dim mt-2">selected: {value.map((e) => e.key).join(', ')}</p>
      </div>
    )
  },
}

export const WithFrozenGroup: Story = {
  parameters: { docs: { description: { story: 'The target pane is split into groups via `groups`; a group with `max` rejects drops past the cap. Drag rows between the "冻结" bucket and "未冻结" — this is exactly the PingCode/Tencent-style column manager.' } } },
  render: () => {
    const [value, setValue] = useState<TransferTargetEntry[]>([
      { key: 'id', group: 'frozen' }, { key: 'title', group: 'frozen' },
      { key: 'status' }, { key: 'priority' }, { key: 'owner' }, { key: 'parent' }, { key: 'severity' },
    ])
    return (
      <div style={{ width: 720 }}>
        <Transfer
          items={FIELDS}
          value={value}
          onChange={setValue}
          titles={['可选择属性', '已选择属性']}
          searchPlaceholder="搜索"
          groups={[{ id: 'frozen', label: '冻结', max: 3 }]}
          ungroupedLabel="未冻结"
          onResetDefaults={() => setValue([{ key: 'id', group: 'frozen' }, { key: 'title', group: 'frozen' }, { key: 'status' }, { key: 'owner' }])}
        />
      </div>
    )
  },
}

export const NotSortable: Story = {
  parameters: { docs: { description: { story: '`sortable={false}` — a plain two-list picker, no reordering, no group buckets.' } } },
  render: () => {
    const [value, setValue] = useState<TransferTargetEntry[]>([{ key: 'id' }, { key: 'title' }, { key: 'status' }])
    return (
      <div style={{ width: 640 }}>
        <Transfer items={FIELDS.slice(0, 9)} value={value} onChange={setValue} sortable={false} />
      </div>
    )
  },
}

export const InADialog: Story = {
  parameters: { docs: { description: { story: 'The typical "configure table columns" dialog — `Transfer` inside `Dialog`, edits applied on confirm.' } } },
  render: () => {
    const DEFAULT: TransferTargetEntry[] = [{ key: 'id', group: 'frozen' }, { key: 'title', group: 'frozen' }, { key: 'status' }, { key: 'owner' }, { key: 'priority' }, { key: 'parent' }, { key: 'severity' }, { key: 'repro' }, { key: 'created' }]
    const [open, setOpen] = useState(false)
    const [applied, setApplied] = useState<TransferTargetEntry[]>(DEFAULT)
    const [draft, setDraft] = useState<TransferTargetEntry[]>(DEFAULT)
    return (
      <div>
        <Button onClick={() => { setDraft(applied); setOpen(true) }}>表头显示属性…</Button>
        <p className="text-xs text-text-dim mt-2">applied columns ({applied.length}): {applied.map((e) => (e.group ? `🔒${e.key}` : e.key)).join(', ')}</p>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogHead title="表头显示属性" />
          <DialogBody>
            <div style={{ width: 760 }}>
              <Transfer
                items={FIELDS}
                value={draft}
                onChange={setDraft}
                titles={[`可选择属性 · ${FIELDS.length}`, `已选择属性 · ${draft.length}`]}
                searchPlaceholder="搜索"
                groups={[{ id: 'frozen', label: '冻结', max: 3 }]}
                ungroupedLabel="未冻结"
                onResetDefaults={() => setDraft(DEFAULT)}
                paneHeight={320}
              />
            </div>
          </DialogBody>
          <DialogFoot>
            <Button intent="ghost" onClick={() => setOpen(false)}>取消</Button>
            <Button intent="primary" onClick={() => { setApplied(draft); setOpen(false) }}>确定</Button>
          </DialogFoot>
        </Dialog>
      </div>
    )
  },
}
