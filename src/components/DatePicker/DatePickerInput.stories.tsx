import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePickerInput } from './index'

const meta = {
  title: '06 · Advanced/Date picker input',
  component: DatePickerInput,
  tags: ['autodocs'],
} satisfies Meta<typeof DatePickerInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [d, setD] = useState<Date | null>(null)
    return (
      <div style={{ width: 240 }}>
        <DatePickerInput value={d} onChange={setD} />
        <div className="mono" style={{ marginTop: 10, fontSize: 12, color: 'var(--color-text-dim)' }}>
          Picked: {d ? d.toDateString() : 'none'}
        </div>
      </div>
    )
  },
}

export const WithClearable: Story = {
  render: () => {
    const [d, setD] = useState<Date | null>(new Date(2026, 3, 23))
    return (
      <div style={{ width: 240 }}>
        <DatePickerInput value={d} onChange={setD} clearable />
      </div>
    )
  },
}

export const Invalid: Story = {
  render: () => {
    const [d, setD] = useState<Date | null>(null)
    return (
      <div style={{ width: 240 }}>
        <DatePickerInput value={d} onChange={setD} invalid placeholder="Required" />
      </div>
    )
  },
}

export const CustomFormat: Story = {
  render: () => {
    const [d, setD] = useState<Date | null>(new Date(2026, 3, 23))
    return (
      <div style={{ width: 240 }}>
        <DatePickerInput value={d} onChange={setD} format="MM/dd/yyyy" />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <DatePickerInput value={new Date(2026, 3, 23)} disabled />
    </div>
  ),
}
