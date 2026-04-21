import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardFoot, CardHead, Progress } from '../..'

const meta: Meta = {
  title: '07 · Compositions/Billing summary',
  parameters: {
    docs: {
      description: {
        component: 'Usage breakdown + running total + payment method card. All from primitives.',
      },
    },
  },
}
export default meta
type Story = StoryObj

const lineItems = [
  { label: 'Compute', sub: '432 hrs × $0.12', amount: '$51.84' },
  { label: 'Bandwidth', sub: '1.2 TB × $0.09', amount: '$108.00' },
  { label: 'Storage', sub: '480 GB × $0.02', amount: '$9.60' },
  { label: 'Databases', sub: 'primary-db · replicas 2', amount: '$84.00' },
]

export const Monthly: Story = {
  render: () => (
    <div className="grid grid-cols-[1fr_320px] gap-4" style={{ width: 900 }}>
      <Card>
        <CardHead title="December usage" sub="Dec 1 – Dec 28" />
        <div className="divide-y divide-line">
          {lineItems.map((it) => (
            <div key={it.label} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm font-medium">{it.label}</div>
                <div className="text-xs text-text-dim mt-0.5 font-mono">{it.sub}</div>
              </div>
              <div className="mono text-sm">{it.amount}</div>
            </div>
          ))}
        </div>
        <CardFoot>
          <span className="text-sm font-medium text-text">Subtotal</span>
          <span className="mono text-sm ml-auto">$253.44</span>
        </CardFoot>
      </Card>
      <div className="flex flex-col gap-3">
        <Card>
          <div className="p-4">
            <div className="text-xs uppercase tracking-wider text-text-muted mb-1">
              Running total
            </div>
            <div className="mono text-2xl font-semibold tracking-tight">
              $253.44
            </div>
            <div className="mt-3">
              <Progress value={62} />
              <div className="flex justify-between mt-1 text-xs text-text-dim mono">
                <span>$0</span>
                <span>$400 budget</span>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <CardHead title="Payment method" />
          <div className="p-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 rounded bg-bg-sunk grid place-items-center text-[10px] font-mono text-text-dim">
                VISA
              </div>
              <span className="mono text-xs">•••• 4242</span>
              <span className="text-text-dim text-xs ml-auto">exp 04/27</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
}
