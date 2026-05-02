import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MiniTabs } from './index'
import { Pill } from '../Pill'

const meta = {
  title: '04 · Navigation/Mini tabs',
  component: MiniTabs,
  tags: ['autodocs'],
  args: { value: 'overview', options: [], onChange: () => {} },
} satisfies Meta<typeof MiniTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [v, setV] = useState('overview')
    return (
      <MiniTabs
        value={v}
        onChange={setV}
        options={[
          { value: 'overview', label: 'Overview' },
          { value: 'logs',     label: 'Logs' },
          { value: 'metrics',  label: 'Metrics' },
          { value: 'settings', label: 'Settings' },
        ]}
      />
    )
  },
}

export const WithCounts: Story = {
  render: () => {
    const [v, setV] = useState('pending')
    return (
      <MiniTabs
        value={v}
        onChange={setV}
        options={[
          { value: 'active',  label: <>Active <Pill mono>12</Pill></> },
          { value: 'pending', label: <>Pending <Pill mono tone="info">3</Pill></> },
          { value: 'failed',  label: <>Failed <Pill mono tone="err">1</Pill></> },
          { value: 'all',     label: <>All <Pill mono>248</Pill></> },
        ]}
      />
    )
  },
}
