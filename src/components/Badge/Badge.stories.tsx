import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './index'
import { Button } from '../Button'

const meta = {
  title: '02 · Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { count: 3 },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
const InboxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
)

const IconBtn = ({ children }: { children: React.ReactNode }) => (
  <button
    type="button"
    className="inline-grid place-items-center w-8 h-8 rounded-sm border border-line bg-bg-elev text-text-muted hover:text-text hover:border-line-strong"
  >
    {children}
  </button>
)

export const Playground: Story = {
  render: (args) => <Badge {...args} />,
}

export const Counts: Story = {
  parameters: { docs: { description: { story: 'Numbers above `max` (default 99) collapse to `99+`. Zero hides the badge unless `showZero`.' } } },
  render: () => (
    <div className="flex items-center gap-4">
      <Badge count={1} />
      <Badge count={8} />
      <Badge count={42} />
      <Badge count={128} />
      <Badge count={9999} max={999} />
      <Badge count={0} />
      <Badge count={0} showZero />
    </div>
  ),
}

export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge count={3} tone="err" />
      <Badge count={3} tone="warn" />
      <Badge count={3} tone="ok" />
      <Badge count={3} tone="info" />
      <Badge count={3} tone="accent" />
      <Badge count={3} tone="neutral" />
    </div>
  ),
}

export const Dot: Story = {
  parameters: { docs: { description: { story: 'A bare dot signals "something new" without a count.' } } },
  render: () => (
    <div className="flex items-center gap-4">
      <Badge dot />
      <Badge dot tone="ok" />
      <Badge dot size="sm" />
      <Badge dot>
        <IconBtn><BellIcon /></IconBtn>
      </Badge>
    </div>
  ),
}

export const OnIcons: Story = {
  parameters: { docs: { description: { story: 'Pass `children` and the badge anchors to the top-right corner — wrap icon buttons, avatars, anything.' } } },
  render: () => (
    <div className="flex items-center gap-5">
      <Badge count={3}>
        <IconBtn><BellIcon /></IconBtn>
      </Badge>
      <Badge count={128}>
        <IconBtn><InboxIcon /></IconBtn>
      </Badge>
      <Badge dot tone="err">
        <Button size="sm">收件箱</Button>
      </Badge>
    </div>
  ),
}
