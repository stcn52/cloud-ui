import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from './index'

const meta = {
  title: '02 · Primitives/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: { value: 50 },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  render: () => {
    const [v, setV] = useState(50)
    return (
      <div style={{ width: 320 }}>
        <label className="text-sm text-text-muted">CPU limit · {v} %</label>
        <Slider value={v} onChange={(n) => setV(n as number)} />
      </div>
    )
  },
}

export const WithMarks: Story = {
  render: () => {
    const [v, setV] = useState(24)
    return (
      <div style={{ width: 320 }}>
        <label className="text-sm text-text-muted">Concurrency · {v}</label>
        <Slider
          value={v}
          onChange={(n) => setV(n as number)}
          marks={['0', '25', '50', '75', '100']}
        />
      </div>
    )
  },
}

export const Range: Story = {
  render: () => {
    const [v, setV] = useState<[number, number]>([18, 62])
    return (
      <div style={{ width: 320 }}>
        <label className="text-sm text-text-muted">
          Latency window · <span className="mono">{v[0] * 8} ms – {v[1] * 8} ms</span>
        </label>
        <Slider value={v} onChange={(n) => setV(n as [number, number])} />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Slider value={35} disabled />
    </div>
  ),
}
