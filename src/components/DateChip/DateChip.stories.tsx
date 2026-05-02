import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateChip } from './index'

const meta = {
  title: '02 · Primitives/Date chip',
  component: DateChip,
  tags: ['autodocs'],
  args: { children: 'May 2, 2026' },
} satisfies Meta<typeof DateChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
  args: { selected: true, children: 'May 14' },
}

export const Range: Story = {
  parameters: {
    docs: { description: { story: 'A pair of chips with an arrow makes a date range. The active end uses `selected`.' } },
  },
  render: () => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <DateChip>May 1</DateChip>
      <span style={{ color: 'var(--color-text-dim)' }}>→</span>
      <DateChip selected>May 14</DateChip>
    </div>
  ),
}

export const NoIconNoCaret: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <DateChip noIcon>2026-05-02</DateChip>
      <DateChip noCaret>May 2</DateChip>
      <DateChip noIcon noCaret>14:32</DateChip>
    </div>
  ),
}
