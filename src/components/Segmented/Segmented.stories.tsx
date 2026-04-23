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

export const Sizes: Story = {
  render: () => {
    const [a, setA] = useState<'1h' | '24h' | '7d'>('24h')
    const [b, setB] = useState<'1h' | '24h' | '7d'>('24h')
    const opts = [
      { value: '1h' as const, label: '1h' },
      { value: '24h' as const, label: '24h' },
      { value: '7d' as const, label: '7d' },
    ]
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Segmented size="sm" value={a} onChange={setA} options={opts} />
        <Segmented size="md" value={b} onChange={setB} options={opts} />
      </div>
    )
  },
}

export const InferredGeneric: Story = {
  render: () => {
    // Passing `as const` lets TS infer V as 'light' | 'dark' rather than widening to string.
    const options = [
      { value: 'light', label: '☀' },
      { value: 'dark', label: '☾' },
    ] as const
    const [v, setV] = useState<(typeof options)[number]['value']>('light')
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Segmented value={v} onChange={setV} options={options} />
        <span className="mono" style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>
          V inferred: {v}
        </span>
      </div>
    )
  },
}
