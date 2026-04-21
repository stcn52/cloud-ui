import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, Pill } from '../..'

const meta: Meta = {
  title: '08 · Layouts/Three-pane',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const navItems = [
  'Overview', 'Services', 'Databases', 'Deployments', 'Logs', 'Settings',
]

const services = [
  { name: 'api-gateway', status: 'ok' as const, statusLabel: 'Healthy', region: 'us-east-1' },
  { name: 'auth-service', status: 'ok' as const, statusLabel: 'Healthy', region: 'us-east-1' },
  { name: 'ingest-worker', status: 'warn' as const, statusLabel: 'Degraded', region: 'us-east-1' },
  { name: 'billing-sync', status: 'ok' as const, statusLabel: 'Healthy', region: 'eu-west-1' },
  { name: 'mail-relay', status: 'err' as const, statusLabel: 'Failing', region: 'us-east-1' },
  { name: 'cdn-edge', status: 'ok' as const, statusLabel: 'Healthy', region: 'global' },
]

export const NavListInspector: Story = {
  render: () => (
    <div className="grid grid-cols-[180px_280px_1fr] h-[600px] bg-bg border-t border-line">
      <aside className="border-r border-line bg-panel p-3 text-sm space-y-0.5">
        {navItems.map((it, i) => (
          <div
            key={it}
            className={
              i === 1
                ? 'px-2 py-1.5 rounded-xs bg-accent-weak text-accent-ink font-medium'
                : 'px-2 py-1.5 rounded-xs text-text-muted hover:bg-bg-sunk cursor-pointer'
            }
          >
            {it}
          </div>
        ))}
      </aside>

      <div className="border-r border-line overflow-auto">
        <div className="px-3 py-2.5 border-b border-line text-xs text-text-dim uppercase tracking-wider font-medium">
          Services <span className="mono ml-1 text-[10px]">{services.length}</span>
        </div>
        {services.map((s, i) => (
          <div
            key={s.name}
            className={
              i === 2
                ? 'px-3 py-2 border-b border-line bg-accent-weak cursor-pointer'
                : 'px-3 py-2 border-b border-line hover:bg-bg-sunk cursor-pointer'
            }
          >
            <div className="flex items-center gap-2">
              <Pill tone={s.status} dot />
              <span className="text-sm font-medium">{s.name}</span>
            </div>
            <div className="text-xs text-text-dim mono ml-4 mt-0.5">{s.region}</div>
          </div>
        ))}
      </div>

      <main className="p-5 overflow-auto">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xl font-semibold tracking-tight">ingest-worker</h2>
          <Pill tone="warn" dot>Degraded</Pill>
          <div style={{ flex: 1 }} />
          <Avatar size="sm">MC</Avatar>
        </div>
        <div className="text-sm text-text-muted">v204 · us-east-1 · 4 instances · last deploy 2d ago</div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="border border-line rounded-md bg-bg-elev p-3">
            <div className="text-xs text-text-muted uppercase tracking-wider">Requests / min</div>
            <div className="mono text-xl font-semibold mt-1">12,800</div>
          </div>
          <div className="border border-line rounded-md bg-bg-elev p-3">
            <div className="text-xs text-text-muted uppercase tracking-wider">p95 latency</div>
            <div className="mono text-xl font-semibold mt-1">342ms</div>
          </div>
        </div>
      </main>
    </div>
  ),
}
