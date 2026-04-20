import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Pill } from '../Pill'
import { Tooltip } from './index'

const meta = {
  title: '05 · Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { tip: 'Download logs' },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { children: <Button>Hover me</Button>, open: true },
}

export const OnIconButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 40, paddingTop: 50 }}>
      <Tooltip tip="Download logs">
        <Button iconOnly>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <polyline points="8 12 12 16 16 12" />
            <line x1="12" y1="8" x2="12" y2="16" />
          </svg>
        </Button>
      </Tooltip>
      <Tooltip tip="Settings · ⌘,">
        <Button iconOnly>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
          </svg>
        </Button>
      </Tooltip>
      <Tooltip tip="Click to copy · 2m ago">
        <Pill mono>sha:bb08af1</Pill>
      </Tooltip>
    </div>
  ),
}
