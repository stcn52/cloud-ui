import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from '../Input'
import { Select, type SelectOption } from './index'

// A single-mode wrapper keeps Storybook args/typing simple — the discriminated
// union (`multiple: true | false`) lives on the real component, but stories
// only need one branch at a time.
const SingleSelect = (props: {
  options: SelectOption[]
  placeholder?: React.ReactNode
  searchable?: boolean
  clearable?: boolean
  footer?: React.ReactNode
  disabled?: boolean
  invalid?: boolean
  size?: 'sm' | 'md'
  value?: string
  onChange?: (v: string | undefined) => void
}) => <Select {...props} />

// A small round letter-badge, matching the screenshot's option avatars.
const LetterBadge = ({ children, hue }: { children: string; hue: number }) => (
  <span
    style={{
      width: 18,
      height: 18,
      borderRadius: '50%',
      display: 'inline-grid',
      placeItems: 'center',
      fontSize: 10,
      fontWeight: 600,
      color: `oklch(0.35 0.1 ${hue})`,
      background: `oklch(0.92 0.05 ${hue})`,
    }}
  >
    {children}
  </span>
)

const Dot = ({ ok }: { ok: boolean }) => (
  <span
    style={{
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: ok ? 'var(--color-ok)' : 'var(--color-text-dim)',
    }}
  />
)


const regions = [
  { value: 'us-east-1', label: 'us-east-1 (N. Virginia)' },
  { value: 'us-west-2', label: 'us-west-2 (Oregon)' },
  { value: 'eu-west-1', label: 'eu-west-1 (Ireland)' },
  { value: 'ap-northeast-1', label: 'ap-northeast-1 (Tokyo)', disabled: true },
]

const meta = {
  title: '02 · Primitives/Select',
  component: SingleSelect,
  tags: ['autodocs'],
  args: { options: regions, placeholder: 'Choose a region…' },
} satisfies Meta<typeof SingleSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | undefined>()
    return <SingleSelect {...args} value={value} onChange={setValue} />
  },
}

export const InField: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>()
    return (
      <Field label="Region">
        <Select options={regions} value={value} onChange={setValue} placeholder="Choose a region…" />
      </Field>
    )
  },
}

export const Searchable: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>()
    return <Select options={regions} searchable value={value} onChange={setValue} placeholder="Search regions…" />
  },
}

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('us-west-2')
    return <Select options={regions} clearable value={value} onChange={setValue} placeholder="Choose a region…" />
  },
}

const teamMembers = [
  { value: 'alex', label: 'Alex Chen' },
  { value: 'bri',  label: 'Bri Tanaka' },
  { value: 'cal',  label: 'Cal Robinson' },
  { value: 'dee',  label: 'Dee Patel' },
  { value: 'evan', label: 'Evan Walsh' },
  { value: 'finn', label: 'Finn O’Hara' },
  { value: 'gia',  label: 'Gia Romano' },
]

export const Multiple: Story = {
  parameters: {
    docs: { description: { story: 'Pass `multiple` to allow selecting several options. Selected entries render as chips inside the trigger; click the × on a chip or press Backspace to remove.' } },
  },
  render: () => {
    const [value, setValue] = useState<string[]>(['alex', 'cal'])
    return (
      <div style={{ width: 360 }}>
        <Field label="Reviewers" hint="Pick one or more teammates">
          <Select
            multiple
            options={teamMembers}
            value={value}
            onChange={setValue}
            placeholder="Add reviewers…"
            clearable
          />
        </Field>
      </div>
    )
  },
}

export const MultipleSearchable: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([])
    return (
      <div style={{ width: 360 }}>
        <Select
          multiple
          searchable
          clearable
          options={teamMembers}
          value={value}
          onChange={setValue}
          placeholder="Search and select…"
        />
      </div>
    )
  },
}

export const MultipleMaxTags: Story = {
  parameters: {
    docs: { description: { story: '`maxTagCount` collapses the overflow into a `+N` chip so the trigger does not grow unbounded.' } },
  },
  render: () => {
    const [value, setValue] = useState<string[]>(['alex', 'bri', 'cal', 'dee', 'evan'])
    return (
      <div style={{ width: 320 }}>
        <Select
          multiple
          options={teamMembers}
          value={value}
          onChange={setValue}
          maxTagCount={2}
          clearable
          placeholder="Pick people…"
        />
      </div>
    )
  },
}

/* -------------------------------------------------------------------------- */
/* Grouped options                                                             */
/* -------------------------------------------------------------------------- */

const groupedRegions: SelectOption[] = [
  { value: 'us-east-1', label: 'us-east-1 (N. Virginia)', group: 'Americas' },
  { value: 'us-west-2', label: 'us-west-2 (Oregon)',      group: 'Americas' },
  { value: 'sa-east-1', label: 'sa-east-1 (São Paulo)',   group: 'Americas' },
  { value: 'eu-west-1', label: 'eu-west-1 (Ireland)',     group: 'Europe' },
  { value: 'eu-central-1', label: 'eu-central-1 (Frankfurt)', group: 'Europe' },
  { value: 'ap-northeast-1', label: 'ap-northeast-1 (Tokyo)', group: 'Asia Pacific' },
  { value: 'ap-south-1', label: 'ap-south-1 (Mumbai)',    group: 'Asia Pacific' },
]

export const Grouped: Story = {
  parameters: {
    docs: { description: { story: 'Give options a `group` and consecutive options under the same name render beneath an uppercase heading. Works with `searchable` and `multiple` too.' } },
  },
  render: () => {
    const [value, setValue] = useState<string | undefined>()
    return (
      <div style={{ width: 320 }}>
        <Select options={groupedRegions} searchable value={value} onChange={setValue} placeholder="Choose a region…" />
      </div>
    )
  },
}

/* -------------------------------------------------------------------------- */
/* Rich options — icon + description                                           */
/* -------------------------------------------------------------------------- */

const teammates: SelectOption[] = [
  { value: 'backend',  label: '@backend-dev',  icon: <LetterBadge hue={60}>B</LetterBadge>, description: '后端' },
  { value: 'qa',       label: '@qa-mia',       icon: <LetterBadge hue={350}>M</LetterBadge>, description: 'QA' },
  { value: 'frontend', label: '@frontend-ethan', icon: <LetterBadge hue={150}>E</LetterBadge>, description: '前端' },
  { value: 'ceo',      label: '@ceo-alex',     icon: <LetterBadge hue={290}>A</LetterBadge>, description: '协调' },
]

export const RichOptions: Story = {
  parameters: {
    docs: { description: { story: 'Each `SelectOption` can carry an `icon` (leading — an avatar, a status dot) and a `description` (trailing, dim). The icon also shows in the trigger for the selected single value.' } },
  },
  render: () => {
    const [value, setValue] = useState<string[]>(['backend', 'qa'])
    return (
      <div style={{ width: 340 }}>
        <Field label="分配给 AI 同事">
          <Select multiple options={teammates} value={value} onChange={setValue} placeholder="继续添加…" clearable />
        </Field>
      </div>
    )
  },
}

const nodeOptions: SelectOption[] = [
  { value: 'mac',     label: 'Mac Studio (本机)', icon: <Dot ok />, group: '在线节点' },
  { value: 'thinkpad', label: 'ThinkPad X1',      icon: <Dot ok />, description: 'Lease 1', group: '在线节点' },
  { value: 'linux',   label: 'Linux Server',     icon: <Dot ok />, description: 'Lease 2', group: '在线节点' },
  { value: 'dev02',   label: '开发机-02',         icon: <Dot ok={false} />, group: '离线', disabled: true },
]

export const WithFooter: Story = {
  parameters: {
    docs: { description: { story: 'The `footer` slot sticks to the bottom of the panel — handy for a persistent "add new" action. Combined here with grouped, icon-bearing options to match a node-picker layout.' } },
  },
  render: () => {
    const [value, setValue] = useState<string | undefined>('mac')
    return (
      <div style={{ width: 320 }}>
        <Field label="执行节点">
          <Select
            options={nodeOptions}
            searchable
            value={value}
            onChange={setValue}
            placeholder="选择节点…"
            footer={
              <button
                type="button"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  fontSize: 13,
                  color: 'var(--color-accent-ink)',
                  background: 'transparent',
                  border: 0,
                  cursor: 'pointer',
                }}
                onClick={() => alert('打开「添加新节点」对话框')}
              >
                + 添加新节点
              </button>
            }
          />
        </Field>
      </div>
    )
  },
}
