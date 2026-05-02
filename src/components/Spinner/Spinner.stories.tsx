import type { Meta, StoryObj } from '@storybook/react-vite'
import { BarLoader, DotsLoader, Spinner } from './index'

const meta = {
  title: '02 · Primitives/Spinners & loaders',
  component: Spinner,
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Ring: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
      <Spinner muted />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
        <Spinner size="sm" />
        Connecting to <span className="mono">db-primary</span>…
      </span>
    </div>
  ),
}

export const Dots: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <DotsLoader />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
        Marco is typing <DotsLoader />
      </span>
    </div>
  ),
}

export const Bar: Story = {
  render: () => (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <BarLoader />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--color-text-muted)' }}>
        <Spinner size="sm" />
        Indexing 14 218 logs…
      </span>
    </div>
  ),
}
