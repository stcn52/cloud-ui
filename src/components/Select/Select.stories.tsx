import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from '../Input'
import { Select } from './index'

const regions = [
  { value: 'us-east-1', label: 'us-east-1 (N. Virginia)' },
  { value: 'us-west-2', label: 'us-west-2 (Oregon)' },
  { value: 'eu-west-1', label: 'eu-west-1 (Ireland)' },
  { value: 'ap-northeast-1', label: 'ap-northeast-1 (Tokyo)', disabled: true },
]

const meta = {
  title: '02 · Primitives/Select',
  component: Select,
  tags: ['autodocs'],
  args: { options: regions, placeholder: 'Choose a region…' },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | undefined>()
    return <Select {...args} value={value} onChange={setValue} />
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
