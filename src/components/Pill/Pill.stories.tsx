import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dot, Pill } from './index'

const meta = {
  title: '02 · Primitives/Pill',
  component: Pill,
  tags: ['autodocs'],
  args: { children: 'Healthy', tone: 'ok', dot: true },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'ok', 'warn', 'err', 'info', 'solid'] },
    size: { control: 'select', options: ['md', 'lg'] },
    mono: { control: 'boolean' },
    dot: { control: 'boolean' },
  },
} satisfies Meta<typeof Pill>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const StatusPills: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Pill tone="ok" dot>Healthy</Pill>
      <Pill tone="warn" dot>Degraded</Pill>
      <Pill tone="err" dot>Failing</Pill>
      <Pill tone="info" dot>Building</Pill>
      <Pill dot>Paused</Pill>
      <Pill tone="solid">v142</Pill>
    </div>
  ),
}

export const Tags: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Pill mono>env:prod</Pill>
      <Pill mono>region:us-east-1</Pill>
      <Pill mono tone="info">service:api-gateway</Pill>
      <Pill mono onRemove={() => {}}>level:ERROR</Pill>
      <Pill size="lg" dot>Online · 12 instances</Pill>
    </div>
  ),
}

export const StatusDots: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 12 }}>
        <Dot tone="ok" /> Operational
      </span>
      <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 12 }}>
        <Dot tone="warn" /> Degraded
      </span>
      <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 12 }}>
        <Dot tone="err" /> Outage
      </span>
      <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 12 }}>
        <Dot /> Unknown
      </span>
    </div>
  ),
}
