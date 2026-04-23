import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Radio, RadioGroup, RadioRow } from './index'

const meta = {
  title: '02 · Primitives/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { args: { defaultChecked: true } }

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <RadioRow label="Public"><Radio name="v" /></RadioRow>
      <RadioRow label="Team only"><Radio name="v" defaultChecked /></RadioRow>
      <RadioRow label="Owner only"><Radio name="v" /></RadioRow>
      <RadioRow label="Enterprise"><Radio name="v" disabled /></RadioRow>
    </div>
  ),
}

export const Invalid: Story = {
  args: { invalid: true, defaultChecked: true, name: 'invalid-demo' },
}

export const WithRadioGroup: Story = {
  render: () => {
    const [value, setValue] = useState('us-east-1')
    return (
      <RadioGroup
        name="region"
        value={value}
        onChange={setValue}
        options={[
          { value: 'us-east-1', label: 'us-east-1' },
          { value: 'eu-west-1', label: 'eu-west-1' },
          { value: 'ap-south-1', label: 'ap-south-1 (Enterprise)', disabled: true },
        ]}
      />
    )
  },
}

export const HorizontalRadioGroup: Story = {
  render: () => {
    const [value, setValue] = useState('day')
    return (
      <RadioGroup
        name="range"
        value={value}
        onChange={setValue}
        orientation="horizontal"
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]}
      />
    )
  },
}

export const InvalidRadioGroup: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <RadioGroup
        name="required"
        value={value}
        onChange={setValue}
        invalid
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
      />
    )
  },
}
