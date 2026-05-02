import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { NumberStepper } from './index'

const meta = {
  title: '02 · Primitives/Number stepper',
  component: NumberStepper,
  tags: ['autodocs'],
  args: { value: 3, min: 0, max: 100 },
} satisfies Meta<typeof NumberStepper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [v, setV] = useState(args.value)
    return <NumberStepper {...args} value={v} onChange={setV} />
  },
}

export const Sizes: Story = {
  render: () => {
    const [v, setV] = useState(2)
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <NumberStepper size="sm" value={v} onChange={setV} />
        <NumberStepper size="md" value={v} onChange={setV} />
        <NumberStepper size="lg" value={v} onChange={setV} />
      </div>
    )
  },
}

export const AtBounds: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <NumberStepper value={0} min={0} max={100} onChange={() => {}} />
      <NumberStepper value={100} min={0} max={100} onChange={() => {}} />
    </div>
  ),
}
