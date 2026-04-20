import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pill } from '../Pill'
import { Card, CardFoot, CardHead } from './index'

const meta = {
  title: '03 · Data display/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Plain: Story = {
  render: () => (
    <Card style={{ width: 320 }}>
      <div style={{ padding: 16, fontSize: 13 }}>
        A plain card. No head, no foot — just a bordered, elevated surface.
      </div>
    </Card>
  ),
}

export const WithHeadAndFoot: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHead title="api-gateway" sub="v142 · us-east-1" />
      <div style={{ padding: 16, fontSize: 13 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Requests/min</span>
          <span className="mono" style={{ fontVariantNumeric: 'tabular-nums' }}>8,420</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ color: 'var(--color-text-muted)' }}>p95 latency</span>
          <span className="mono" style={{ fontVariantNumeric: 'tabular-nums' }}>124ms</span>
        </div>
      </div>
      <CardFoot>
        <Pill tone="ok" dot>Healthy</Pill>
        <span style={{ marginLeft: 'auto' }}>Last check 4s ago</span>
      </CardFoot>
    </Card>
  ),
}
