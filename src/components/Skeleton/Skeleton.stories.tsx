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

export const Text: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 480, fontSize: 14 }}>
      <Skeleton variant="text" />
      <Skeleton variant="text" width="85%" />
      <Skeleton variant="text" width="60%" />
      <p style={{ marginTop: 12, lineHeight: 1.5 }}>
        Inline mid-sentence <Skeleton variant="text" width={80} /> continues here.
      </p>
    </div>
  ),
}

export const Circle: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Skeleton variant="circle" width={24} height={24} />
      <Skeleton variant="circle" width={32} height={32} />
      <Skeleton variant="circle" width={48} height={48} />
    </div>
  ),
}

export const Block: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Skeleton variant="block" width={240} height={80} />
      <Skeleton variant="block" width="100%" height={16} />
      <Skeleton variant="block" width="60%" height={12} />
    </div>
  ),
}
