import type { Meta, StoryObj } from '@storybook/react-vite'
import { Donut } from './index'

const meta = {
  title: '03 · Data display/Donut',
  component: Donut,
  tags: ['autodocs'],
  args: { segments: [{ value: 1, label: 'A' }] },
} satisfies Meta<typeof Donut>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <Donut
      segments={[
        { value: 540, label: 'Compute' },
        { value: 220, label: 'Storage' },
        { value: 130, label: 'Egress' },
        { value: 60,  label: 'Other' },
      ]}
    />
  ),
}

export const WithTotal: Story = {
  parameters: { docs: { description: { story: 'Pass `total` to show a percentage in the centre instead of the raw sum.' } } },
  render: () => (
    <Donut
      total={100}
      segments={[
        { value: 62, label: 'Used' },
        { value: 38, label: 'Free', color: 'var(--color-bg-sunk)' },
      ]}
      center={<span className="text-lg font-semibold tabular-nums">62%</span>}
    />
  ),
}

export const NoLegend: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Donut size={72} thickness={9} legend={false} segments={[{ value: 3, label: 'ok' }, { value: 1, label: 'warn', color: 'var(--color-warn)' }]} center={<span className="text-xs font-semibold">4</span>} />
      <Donut size={88} thickness={11} legend={false} segments={[{ value: 7, label: 'ok' }, { value: 2, label: 'err', color: 'var(--color-err)' }]} />
      <Donut size={120} legend={false} segments={[{ value: 1, label: 'a' }, { value: 1, label: 'b' }, { value: 1, label: 'c' }]} center={false} />
    </div>
  ),
}

export const StatusBreakdown: Story = {
  render: () => (
    <Donut
      segments={[
        { value: 18, label: 'Running', color: 'var(--color-ok)' },
        { value: 4,  label: 'Degraded', color: 'var(--color-warn)' },
        { value: 2,  label: 'Down', color: 'var(--color-err)' },
        { value: 6,  label: 'Stopped', color: 'var(--color-text-dim)' },
      ]}
      center={<div className="leading-tight"><div className="text-lg font-semibold tabular-nums">30</div><div className="text-[10px] text-text-dim">services</div></div>}
    />
  ),
}
