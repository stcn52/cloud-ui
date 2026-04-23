import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Pill } from '../Pill'
import { Tooltip } from './index'

const meta = {
  title: '05 · Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { tip: 'Download logs' },
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
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

export const Top: Story = {
  args: { tip: 'Top tooltip', placement: 'top', open: true, children: <Button>Top</Button> },
}

export const Bottom: Story = {
  args: { tip: 'Bottom tooltip', placement: 'bottom', open: true, children: <Button>Bottom</Button> },
}

export const Left: Story = {
  args: { tip: 'Left tooltip', placement: 'left', open: true, children: <Button>Left</Button> },
}

export const Right: Story = {
  args: { tip: 'Right tooltip', placement: 'right', open: true, children: <Button>Right</Button> },
}

export const Placements: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 56,
        padding: 80,
      }}
    >
      <Tooltip tip="Top placement" placement="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip tip="Bottom placement" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip tip="Left placement" placement="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip tip="Right placement" placement="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
}

export const Collision: Story = {
  render: () => (
    <div style={{ minHeight: 120 }}>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>
        This tooltip prefers <code>top</code>, but there is no room above — it flips to <code>bottom</code>.
      </p>
      <div style={{ paddingTop: 0 }}>
        <Tooltip tip="I flipped to bottom because there is no room above" placement="top" open>
          <Button>Near top of viewport</Button>
        </Tooltip>
      </div>
    </div>
  ),
}
