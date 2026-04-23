import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pill } from '../Pill'
import { Delta, Kpi } from './index'

const meta = {
  title: '03 · Data display/KPI',
  component: Kpi,
  tags: ['autodocs'],
} satisfies Meta<typeof Kpi>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  render: () => (
    <Kpi
      label="Requests / min"
      value="12,840"
      foot={
        <>
          <Delta direction="up">+8.2%</Delta> vs 1h ago
        </>
      }
    />
  ),
}

export const WithUnit: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      <Kpi label="JS (gzip)" value={36} unit="kB" />
      <Kpi label="p95 latency" value={184} unit="ms" foot={<Delta direction="down">−12ms</Delta>} />
      <Kpi label="Error rate" value="0.34" unit="%" />
    </div>
  ),
}

export const FourUp: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      <Kpi
        label="Requests / min"
        value="12,840"
        foot={<><Delta direction="up">+8.2%</Delta> vs 1h ago</>}
      />
      <Kpi
        label="p95 latency"
        value={<>184<span style={{ fontSize: 14, color: 'var(--color-text-dim)' }}>ms</span></>}
        foot={<><Delta direction="down">−12ms</Delta> SLA: 250ms</>}
      />
      <Kpi
        label="Error rate"
        value={<>0.34<span style={{ fontSize: 14, color: 'var(--color-text-dim)' }}>%</span></>}
        foot={<><Delta direction="up">+0.1%</Delta> last hour</>}
      />
      <Kpi
        label="Monthly spend"
        value="$2,480"
        foot={<Pill tone="info">62% of budget</Pill>}
      />
    </div>
  ),
}
