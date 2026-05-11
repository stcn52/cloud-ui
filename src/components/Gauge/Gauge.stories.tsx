import type { Meta, StoryObj } from '@storybook/react-vite'
import { Gauge } from './index'

const meta = {
  title: '03 · Data display/Gauge',
  component: Gauge,
  tags: ['autodocs'],
  args: { value: 50 },
} satisfies Meta<typeof Gauge>

export default meta
type Story = StoryObj<typeof meta>

const healthBands = [
  { from: 0,  color: 'var(--color-ok)' },
  { from: 70, color: 'var(--color-warn)' },
  { from: 90, color: 'var(--color-err)' },
]

export const Playground: Story = {
  render: () => <Gauge value={64} thresholds={healthBands} caption="CPU utilisation" />,
}

export const Thresholds: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <Gauge value={38} thresholds={healthBands} caption="38% — healthy" />
      <Gauge value={78} thresholds={healthBands} caption="78% — warning" />
      <Gauge value={94} thresholds={healthBands} caption="94% — critical" />
    </div>
  ),
}

export const FlatArc: Story = {
  parameters: { docs: { description: { story: 'Omit `thresholds` for a single accent arc.' } } },
  render: () => (
    <div className="flex items-end gap-8">
      <Gauge value={72} caption="Progress" />
      <Gauge value={72} sweep={180} caption="Half-circle" />
      <Gauge value={72} sweep={270} caption="¾ sweep" />
    </div>
  ),
}

export const CustomCenter: Story = {
  render: () => (
    <Gauge
      value={4.2}
      min={0}
      max={5}
      thresholds={[{ from: 0, color: 'var(--color-err)' }, { from: 2.5, color: 'var(--color-warn)' }, { from: 4, color: 'var(--color-ok)' }]}
      label={<div className="leading-tight"><div className="text-xl font-semibold tabular-nums">4.2</div><div className="text-[10px] text-text-dim">/ 5.0</div></div>}
      caption="Avg. rating"
    />
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <Gauge value={55} size={88} thickness={8} thresholds={healthBands} />
      <Gauge value={55} size={120} thresholds={healthBands} />
      <Gauge value={55} size={160} thickness={14} thresholds={healthBands} caption="Memory" />
    </div>
  ),
}
