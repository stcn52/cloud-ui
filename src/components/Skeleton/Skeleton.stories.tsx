import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './index'

const meta = {
  title: '03 · Data display/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Placeholders: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Skeleton style={{ width: '40%', height: 14 }} />
      <Skeleton style={{ width: '70%' }} />
      <Skeleton style={{ width: '60%' }} />
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <Skeleton style={{ width: 26, height: 26, borderRadius: '50%' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
          <Skeleton style={{ width: '30%' }} />
          <Skeleton style={{ width: '50%', height: 8 }} />
        </div>
      </div>
    </div>
  ),
}
