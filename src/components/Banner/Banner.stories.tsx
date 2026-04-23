import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Banner } from './index'

const meta = {
  title: '05 · Overlays/Banner',
  component: Banner,
  tags: ['autodocs'],
  args: { title: 'Rolling deploy in progress', tone: 'info', children: '3 of 12 instances updated to v143 · est. 4m remaining' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'info', 'ok', 'warn', 'err'] },
  },
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

const icons = {
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <circle cx="12" cy="16" r="0.6" fill="currentColor" />
    </svg>
  ),
  ok: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="5 12 10 17 20 7" />
    </svg>
  ),
  warn: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M12 3l10 18H2z" />
      <line x1="12" y1="10" x2="12" y2="15" />
    </svg>
  ),
  err: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  ),
}

export const Playground: Story = { args: { icon: icons.info, onDismiss: () => {} } }

export const AutoUnmount: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 520 }}>
      <Banner tone="info" icon={icons.info} title="Self-dismissing banner" onDismiss={() => {}} autoUnmount>
        Click the × to unmount this banner. No consumer state needed.
      </Banner>
      <Banner tone="warn" icon={icons.warn} title="Also self-dismissing" autoUnmount>
        autoUnmount also works without an onDismiss handler.
      </Banner>
    </div>
  ),
}

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 600 }}>
      <Banner tone="info" icon={icons.info} title="Rolling deploy in progress" onDismiss={() => {}}>
        3 of 12 instances updated to v143 · est. 4m remaining
      </Banner>
      <Banner tone="ok" icon={icons.ok} title="Database migration complete" onDismiss={() => {}}>
        Applied 3 migrations in 14s · 0 rows failed
      </Banner>
      <Banner tone="warn" icon={icons.warn} title="You're close to your monthly budget" actions={<Button size="xs">Increase cap</Button>}>
        $2,480 of $4,000 used · projected to exceed on Dec 28
      </Banner>
      <Banner tone="err" icon={icons.err} title="mail-relay is failing health checks" actions={<Button size="xs">Investigate</Button>}>
        Last success 8m ago · restart may be required
      </Banner>
    </div>
  ),
}
