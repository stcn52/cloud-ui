import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Pill } from '../..'

const meta: Meta = {
  title: '07 · Compositions/Resource cards',
  parameters: {
    docs: {
      description: {
        component:
          'For mixed-type inventories where each row needs different metadata. Alternative to a strict table.',
      },
    },
  },
}
export default meta
type Story = StoryObj

interface Row {
  icon: React.ReactNode
  name: string
  kind: string
  status: 'ok' | 'warn' | 'err'
  statusLabel: string
  region: string
  meta: string
}
const rows: Row[] = [
  { icon: '📦', name: 'api-gateway', kind: 'service', status: 'ok', statusLabel: 'Healthy', region: 'us-east-1', meta: '8,420 rpm · 124ms p95' },
  { icon: '🗄️', name: 'primary-db', kind: 'postgres 15', status: 'ok', statusLabel: 'Healthy', region: 'us-east-1', meta: '12/16 GB · 88 conns' },
  { icon: '⚡', name: 'ingest-worker', kind: 'service', status: 'warn', statusLabel: 'Degraded', region: 'us-east-1', meta: '342ms p95 · 0.2% err' },
  { icon: '📧', name: 'mail-relay', kind: 'service', status: 'err', statusLabel: 'Failing', region: 'us-east-1', meta: '— · last ok 8m ago' },
]

export const MixedInventory: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: 720 }}>
      {rows.map((r) => (
        <Card key={r.name}>
          <div className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-bg-sunk grid place-items-center text-lg shrink-0">
              {r.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{r.name}</span>
                <span className="text-xs text-text-dim font-mono">{r.kind}</span>
              </div>
              <div className="text-xs text-text-muted mt-0.5 truncate">{r.meta}</div>
            </div>
            <Pill tone={r.status} dot>{r.statusLabel}</Pill>
            <span className="mono text-xs text-text-muted w-20 text-right">{r.region}</span>
          </div>
        </Card>
      ))}
    </div>
  ),
}
