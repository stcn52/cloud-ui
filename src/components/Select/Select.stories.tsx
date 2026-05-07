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
  disabled?: boolean
  invalid?: boolean
  size?: 'sm' | 'md'
  value?: string
  onChange?: (v: string | undefined) => void
}) => <Select {...props} />


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
