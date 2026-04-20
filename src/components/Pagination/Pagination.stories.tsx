import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from './index'

const meta = {
  title: '04 · Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { page: 1, total: 20 },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.page)
    return <Pagination {...args} page={page} onChange={setPage} />
  },
}

export const WithSummary: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 520 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>
          Showing {(page - 1) * 25 + 1}–{Math.min(page * 25, 482)} of 482
        </span>
        <Pagination page={page} total={20} onChange={setPage} />
      </div>
    )
  },
}
