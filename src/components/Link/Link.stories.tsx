import type { Meta, StoryObj } from '@storybook/react-vite'
import { Link } from './index'

const meta = {
  title: '02 · Primitives/Link',
  component: Link,
  tags: ['autodocs'],
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
      <p style={{ margin: 0, lineHeight: 1.7, maxWidth: 540 }}>
        Read the <Link href="#">migration runbook</Link> before promoting to production.
        For quick rollouts, prefer the <Link href="#" intent="muted">canary strategy</Link>.
        See <Link href="#">third-party integrations →</Link> for the full provider list.
      </p>
      <div style={{ display: 'flex', gap: 16 }}>
        <Link href="#">Default</Link>
        <Link href="#" intent="muted">Muted</Link>
        <Link href="#" intent="danger">Danger</Link>
        <Link href="#" bare>Bare (hover to reveal)</Link>
      </div>
    </div>
  ),
}
