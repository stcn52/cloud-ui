import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarStack } from './index'

const meta = {
  title: '02 · Primitives/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { children: 'MC' },
  argTypes: {
    size:  { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['circle', 'square'] },
    tone:  { control: 'select', options: ['azure', 'rose', 'amber', 'mint', 'violet', 'stone', 'none'] },
    presence: { control: 'select', options: [undefined, 'ok', 'warn', 'err', 'idle'] },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar size="sm">MA</Avatar>
      <Avatar>MA</Avatar>
      <Avatar size="lg">MA</Avatar>
      <Avatar shape="square">MA</Avatar>
      <Avatar shape="square" size="lg">MA</Avatar>
    </div>
  ),
}

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar tone="azure">MA</Avatar>
      <Avatar tone="rose">MR</Avatar>
      <Avatar tone="amber">JK</Avatar>
      <Avatar tone="mint">AP</Avatar>
      <Avatar tone="violet">SY</Avatar>
      <Avatar tone="stone">ZM</Avatar>
    </div>
  ),
}

export const Presence: Story = {
  parameters: {
    docs: { description: { story: 'A status dot in the bottom-right corner. Border matches the surface so it sits cleanly over any background.' } },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar size="lg" tone="azure"  presence="ok">MA</Avatar>
      <Avatar size="lg" tone="rose"   presence="warn">MR</Avatar>
      <Avatar size="lg" tone="mint"   presence="err">AP</Avatar>
      <Avatar size="lg" tone="violet" presence="idle">SY</Avatar>
    </div>
  ),
}

export const Stack: Story = {
  render: () => (
    <AvatarStack>
      <Avatar tone="rose">MR</Avatar>
      <Avatar tone="azure">MA</Avatar>
      <Avatar tone="violet">AP</Avatar>
      <Avatar tone="mint">JK</Avatar>
      <Avatar tone="none" style={{ background: 'var(--color-bg-sunk)', color: 'var(--color-text-muted)', border: '1px solid var(--color-line)', fontSize: 9.5 }}>+3</Avatar>
    </AvatarStack>
  ),
}

export const OrgAndPlaceholder: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar size="lg" shape="square" tone="none" style={{ background: 'var(--color-text)', color: 'var(--color-bg-elev)' }}>CI</Avatar>
      <Avatar size="lg" shape="square" tone="mint">@T</Avatar>
      <Avatar size="lg" shape="square" tone="none" style={{ background: 'var(--color-bg-sunk)', color: 'var(--color-text-dim)', border: '1px dashed var(--color-line-strong)', fontSize: 14 }}>?</Avatar>
      <Avatar size="lg" tone="none" style={{ background: 'var(--color-bg-sunk)', color: 'var(--color-text-dim)', border: '1px dashed var(--color-line-strong)', fontSize: 14 }}>+</Avatar>
    </div>
  ),
}
