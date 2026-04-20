import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarStack } from './index'

const meta = {
  title: '02 · Primitives/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { children: 'MC' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['circle', 'square'] },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar size="sm">MC</Avatar>
      <Avatar>JP</Avatar>
      <Avatar size="lg">AP</Avatar>
      <Avatar shape="square">JK</Avatar>
    </div>
  ),
}

export const Stack: Story = {
  render: () => (
    <AvatarStack>
      <Avatar style={{ background: 'linear-gradient(135deg, oklch(0.78 0.08 40), oklch(0.55 0.12 10))' }}>MC</Avatar>
      <Avatar style={{ background: 'linear-gradient(135deg, oklch(0.78 0.08 180), oklch(0.55 0.12 210))' }}>TW</Avatar>
      <Avatar style={{ background: 'linear-gradient(135deg, oklch(0.78 0.08 280), oklch(0.55 0.12 310))' }}>AP</Avatar>
      <Avatar style={{ background: 'linear-gradient(135deg, oklch(0.78 0.08 120), oklch(0.55 0.12 150))' }}>JK</Avatar>
      <Avatar style={{ background: 'var(--color-bg-sunk)', color: 'var(--color-text-muted)', border: '1px solid var(--color-line)' }}>+3</Avatar>
    </AvatarStack>
  ),
}
