import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Card, Empty } from '../..'

const meta: Meta = {
  title: '07 · Compositions/Empty states',
  parameters: {
    docs: {
      description: {
        component: 'Three variants — first-time, zero-result, error. Each has one primary CTA.',
      },
    },
  },
}
export default meta
type Story = StoryObj

const rocket = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
  </svg>
)
const search = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4-4" />
  </svg>
)
const alert = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 3l10 18H2z" />
    <line x1="12" y1="10" x2="12" y2="15" />
    <circle cx="12" cy="18" r="0.5" fill="currentColor" />
  </svg>
)

export const ThreeVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-3" style={{ width: 900 }}>
      <Card>
        <Empty
          icon={rocket}
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
      <Card>
        <Empty
          icon={search}
          title="No logs match your filter"
          description={<>Try widening the time range or removing <span className="mono">level:ERROR</span>.</>}
          actions={<Button size="sm">Clear filters</Button>}
        />
      </Card>
      <Card>
        <Empty
          icon={alert}
          title="Could not reach the region"
          description="us-east-1 is unreachable from your network. Retry or pick a different region."
          actions={
            <>
              <Button intent="primary" size="sm">Retry</Button>
              <Button size="sm" intent="ghost">Contact support</Button>
            </>
          }
        />
      </Card>
    </div>
  ),
}
