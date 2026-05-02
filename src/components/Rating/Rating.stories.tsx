import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Rating } from './index'

const meta = {
  title: '02 · Primitives/Rating',
  component: Rating,
  tags: ['autodocs'],
  args: { value: 4 },
} satisfies Meta<typeof Rating>

export default meta
type Story = StoryObj<typeof meta>

export const Display: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Rating value={4} />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
        <Rating value={4.2} />
        <span className="num" style={{ color: 'var(--color-text-muted)' }}>4.2</span>
        <span style={{ color: 'var(--color-text-dim)' }}>· 1 248 reviews</span>
      </span>
      <Rating value={3} size="lg" />
      <Rating value={2.5} size="sm" />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [v, setV] = useState(3)
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Rating value={v} onChange={setV} size="lg" />
        <span className="num" style={{ fontSize: 13 }}>{v}</span>
      </div>
    )
  },
}
