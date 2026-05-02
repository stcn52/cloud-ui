import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { OtpInput } from './index'

const meta = {
  title: '02 · Primitives/OTP input',
  component: OtpInput,
  tags: ['autodocs'],
  args: { value: '' },
} satisfies Meta<typeof OtpInput>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  render: () => {
    const [v, setV] = useState('')
    return <OtpInput value={v} onChange={setV} />
  },
}

export const InProgress: Story = {
  render: () => {
    const [v, setV] = useState('429')
    return <OtpInput value={v} onChange={setV} autoFocus />
  },
}

export const Complete: Story = {
  render: () => {
    const [v, setV] = useState('429018')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <OtpInput value={v} onChange={setV} />
        <span style={{ fontSize: 12, color: 'var(--color-ok)' }}>Verified · signing you in…</span>
      </div>
    )
  },
}

export const Error: Story = {
  render: () => {
    const [v, setV] = useState('429000')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <OtpInput value={v} onChange={setV} invalid />
        <span style={{ fontSize: 12, color: 'var(--color-err)' }}>Invalid code · 2 attempts remaining</span>
      </div>
    )
  },
}

export const FourDigit: Story = {
  render: () => {
    const [v, setV] = useState('')
    return <OtpInput value={v} onChange={setV} length={4} />
  },
}
