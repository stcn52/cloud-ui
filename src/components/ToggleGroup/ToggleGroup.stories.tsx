import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToggleGroup } from './index'

const meta = {
  title: '02 · Primitives/Toggle group',
  component: ToggleGroup,
  tags: ['autodocs'],
  args: { value: 'day', options: [], onChange: () => {} },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [v, setV] = useState('day')
    return (
      <ToggleGroup
        value={v}
        onChange={setV}
        options={[
          { value: 'day',   label: 'Day' },
          { value: 'week',  label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'year',  label: 'Year' },
        ]}
      />
    )
  },
}

export const Accent: Story = {
  render: () => {
    const [v, setV] = useState('write')
    return (
      <ToggleGroup
        intent="accent"
        value={v}
        onChange={setV}
        options={[
          { value: 'read',  label: 'Read' },
          { value: 'write', label: 'Write' },
          { value: 'admin', label: 'Admin' },
        ]}
      />
    )
  },
}

export const UnitSwitcher: Story = {
  parameters: {
    docs: { description: { story: 'Used inline as a unit picker — `s / min / h` next to a number input.' } },
  },
  render: () => {
    const [v, setV] = useState('s')
    return (
      <ToggleGroup
        size="sm"
        value={v}
        onChange={setV}
        options={[
          { value: 's',   label: 's' },
          { value: 'min', label: 'min' },
          { value: 'h',   label: 'h' },
        ]}
      />
    )
  },
}
