import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sparkline } from './index'

const meta = {
  title: '03 · Data display/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  args: { data: [12, 18, 14, 20, 22, 18, 28, 24, 32, 30, 36] },
} satisfies Meta<typeof Sparkline>

export default meta
type Story = StoryObj<typeof meta>

const trend = [16, 14, 17, 12, 15, 10, 12, 7, 9, 4, 6]

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Sparkline data={trend} variant="line" />
      <Sparkline data={trend} variant="area" />
      <Sparkline data={trend} variant="bar" />
      <Sparkline data={[4, 6, 8, 7, 10, 12, 11, 14, 13, 16, 18]} tone="err" variant="line" />
    </div>
  ),
}

export const InlineKpi: Story = {
  render: () => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', border: '1px solid var(--color-line)',
      borderRadius: 8, background: 'var(--color-bg-elev)',
    }}>
      <span style={{ display: 'inline-flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>
          Requests · 24 h
        </span>
        <span className="num" style={{ fontSize: 18, fontWeight: 600 }}>14.2 K</span>
      </span>
      <Sparkline data={trend.map((n) => 24 - n)} variant="area" width={80} height={28} />
      <span style={{ color: 'var(--color-ok)', fontSize: 12, alignSelf: 'flex-end' }}>+12 %</span>
    </span>
  ),
}
