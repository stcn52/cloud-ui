import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider, DividerLabel } from './index'

const meta = {
  title: '02 · Primitives/Divider',
  component: Divider,
  tags: ['autodocs'],
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <div style={{ fontSize: 13, padding: '4px 0' }}>Account</div>
      <Divider />
      <div style={{ fontSize: 13, padding: '4px 0' }}>Settings</div>
      <Divider />
      <div style={{ fontSize: 13, padding: '4px 0' }}>Sign out</div>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', height: 22, fontSize: 12, color: 'var(--color-text-muted)' }}>
      <span>Maya Patel</span>
      <Divider orientation="vertical" />
      <span>Operator</span>
      <Divider orientation="vertical" />
      <span className="mono">us-east-1</span>
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <DividerLabel>or continue with</DividerLabel>
    </div>
  ),
}
