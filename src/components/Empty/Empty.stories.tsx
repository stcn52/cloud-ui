import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Card } from '../Card'
import { Empty } from './index'

const meta = {
  title: '05 · Overlays/Empty state',
  component: Empty,
  tags: ['autodocs'],
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const FirstRun: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <Empty
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <rect x="3" y="4" width="18" height="6" rx="1" />
            <rect x="3" y="14" width="18" height="6" rx="1" />
          </svg>
        }
        title="No services yet"
        description="Ship your first container, function, or static site — we'll provision a subdomain and TLS automatically."
        actions={
          <>
            <Button intent="primary" size="sm">+ Create service</Button>
            <Button size="sm" intent="ghost">Import from GitHub</Button>
          </>
        }
      />
    </Card>
  ),
}

export const NoResults: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <Empty
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
        }
        title="No logs match your filter"
        description={<>Try widening the time range or removing <span className="mono">level:ERROR</span>.</>}
        actions={<Button size="sm">Clear filters</Button>}
      />
    </Card>
  ),
}
