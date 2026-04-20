import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Segmented } from './index'

const meta = {
  title: '04 · Navigation/Segmented',
  component: Segmented,
  tags: ['autodocs'],
  args: {
    value: '24h',
    options: [
      { value: '1h', label: '1h' },
      { value: '24h', label: '24h' },
      { value: '7d', label: '7d' },
    ],
  },
} satisfies Meta<typeof Segmented>

export default meta
type Story = StoryObj<typeof meta>

export const TimeRange: Story = {
  render: () => {
    const [v, setV] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h')
    return (
      <Segmented
        value={v}
        onChange={setV}
        options={[
          { value: '1h', label: '1h' },
          { value: '6h', label: '6h' },
          { value: '24h', label: '24h' },
          { value: '7d', label: '7d' },
          { value: '30d', label: '30d' },
        ]}
      />
    )
  },
}

export const ViewMode: Story = {
  render: () => {
    const [v, setV] = useState<'graph' | 'table'>('graph')
    return (
      <Segmented
        value={v}
        onChange={setV}
        options={[
          { value: 'graph', label: 'Graph' },
          { value: 'table', label: 'Table' },
        ]}
      />
    )
  },
}
