import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Pill } from '../..'

const meta: Meta = {
  title: '08 · Layouts/Status board',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const services = [
  { name: 'API', status: 'ok' as const },
  { name: 'Dashboard', status: 'ok' as const },
  { name: 'Deployments', status: 'warn' as const },
  { name: 'Logs ingestion', status: 'ok' as const },
  { name: 'Email notifications', status: 'err' as const },
  { name: 'Webhooks', status: 'ok' as const },
]

function Bars({ tone }: { tone: 'ok' | 'warn' | 'err' }) {
  return (
    <div className="flex gap-0.5 h-6">
      {Array.from({ length: 90 }).map((_, i) => {
        const isIncident =
          (tone === 'err' && (i === 80 || i === 81)) ||
          (tone === 'warn' && i === 83)
        const color = isIncident
          ? tone === 'err'
            ? 'var(--color-err)'
            : 'var(--color-warn)'
          : 'var(--color-ok)'
        return (
          <div
            key={i}
            className="flex-1 rounded-[1px] opacity-80"
            style={{ background: color }}
          />
        )
      })}
    </div>
  )
}

export const Public: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-8 bg-bg min-h-[640px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-accent to-accent-ink" />
        <span className="font-semibold">Linden Cloud</span>
        <div className="ml-auto">
          <Pill tone="warn" dot>Degraded performance</Pill>
        </div>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mb-1">All systems</h1>
      <div className="text-text-muted text-sm mb-6">
        Last 90 days · updates every 30s
      </div>

      <Card>
        <div className="divide-y divide-line">
          {services.map((s) => (
            <div key={s.name} className="px-4 py-3 flex items-center gap-4">
              <div className="w-40 text-sm font-medium truncate">{s.name}</div>
              <div className="flex-1"><Bars tone={s.status} /></div>
              <Pill tone={s.status} dot>
                {s.status === 'ok' && 'Operational'}
                {s.status === 'warn' && 'Degraded'}
                {s.status === 'err' && 'Outage'}
              </Pill>
            </div>
          ))}
        </div>
      </Card>

      <h2 className="text-xl font-semibold mt-8 mb-2">Incident history</h2>
      <Card>
        <div className="p-4 text-sm">
          <div className="flex items-center gap-2">
            <Pill tone="err" dot>Investigating</Pill>
            <span className="font-semibold">Email notifications delivery delay</span>
            <span className="ml-auto text-xs text-text-dim mono">14:22 UTC</span>
          </div>
          <p className="mt-2 text-text-muted">
            We're seeing elevated error rates on the email relay. Notifications
            are being retried automatically; no action required.
          </p>
        </div>
      </Card>
    </div>
  ),
}
