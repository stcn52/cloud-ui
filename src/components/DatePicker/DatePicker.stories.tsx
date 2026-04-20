import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker, type DateRange } from './index'

const meta = {
  title: '06 · Advanced/Date picker',
  component: DatePicker,
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

function fmt(d: Date) {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export const Single: Story = {
  render: () => {
    const [d, setD] = useState<Date | null>(null)
    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <DatePicker value={d} onChange={(v) => setD(v as Date | null)} />
        <div className="mono" style={{ fontSize: 12 }}>
          Picked: {d ? fmt(d) : <span style={{ color: 'var(--color-text-dim)' }}>none</span>}
        </div>
      </div>
    )
  },
}

export const Range: Story = {
  render: () => {
    const [r, setR] = useState<DateRange | null>(null)
    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <DatePicker mode="range" value={r} onChange={(v) => setR(v as DateRange | null)} />
        <div className="mono" style={{ fontSize: 12 }}>
          Picked: {r ? <>{fmt(r[0])} → {fmt(r[1])}</> : <span style={{ color: 'var(--color-text-dim)' }}>none</span>}
        </div>
      </div>
    )
  },
}
