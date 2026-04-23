import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from './index'

const meta = {
  title: '04 · Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { current: 1, total: 200, pageSize: 10 },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.current)
    return <Pagination {...args} current={page} onChange={setPage} />
  },
}

export const WithSummary: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    const pageSize = 25
    const total = 482
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 520 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
        </span>
        <Pagination current={page} total={total} pageSize={pageSize} onChange={setPage} />
      </div>
    )
  },
}
