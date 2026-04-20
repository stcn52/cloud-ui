import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd } from './index'

const meta = {
  title: '02 · Primitives/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  args: { children: '⌘K' },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Shortcuts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
      <span><Kbd>⌘</Kbd> <Kbd>K</Kbd> open palette</span>
      <span><Kbd>⇧</Kbd> <Kbd>/</Kbd> shortcuts</span>
      <span><Kbd>G</Kbd> then <Kbd>D</Kbd> go to deployments</span>
      <span><Kbd>↵</Kbd> confirm</span>
      <span><Kbd>Esc</Kbd> dismiss</span>
    </div>
  ),
}
