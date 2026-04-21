import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Delta, Dot, Kpi, LogLine, Pill, Ring } from '../..'

const meta: Meta = {
  title: '08 · Layouts/Command center',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const logs: { ts: string; level: 'info' | 'warn' | 'err' | 'ok'; msg: string }[] = [
  { ts: '14:22:01', level: 'info', msg: 'GET /v1/users/me 200 · 42ms' },
  { ts: '14:22:02', level: 'warn', msg: 'rate_limit: 80% bucket consumed' },
  { ts: '14:22:03', level: 'err', msg: 'upstream timeout: db.primary 2000ms' },
  { ts: '14:22:04', level: 'ok', msg: 'deploy: api-gateway@v142 complete' },
  { ts: '14:22:05', level: 'info', msg: 'POST /v1/events 200 · 19ms' },
]

export const Dashboard: Story = {
  render: () => (
    <div className="p-4 bg-bg min-h-[600px]">
      <div className="grid grid-cols-6 gap-3">
        <Kpi className="col-span-1" label="Requests / min" value="12,840" foot={<><Delta direction="up">+8.2%</Delta> vs 1h</>} />
        <Kpi className="col-span-1" label="p95 latency" value={<>184<span style={{ fontSize: 14, color: 'var(--color-text-dim)' }}>ms</span></>} foot={<><Delta direction="down">−12ms</Delta></>} />
        <Kpi className="col-span-1" label="Error rate" value={<>0.34<span style={{ fontSize: 14, color: 'var(--color-text-dim)' }}>%</span></>} foot={<><Delta direction="up">+0.1%</Delta></>} />
        <Kpi className="col-span-1" label="Active users" value="842" foot={<>peaks at 17:00</>} />
        <Kpi className="col-span-1" label="Monthly spend" value="$2,480" foot={<Pill tone="info">62% budget</Pill>} />
        <Kpi className="col-span-1" label="Uptime SLO" value={<>99.94<span style={{ fontSize: 14, color: 'var(--color-text-dim)' }}>%</span></>} foot={<>30d rolling</>} />

        <Card className="col-span-4">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div>
                <div className="text-xs text-text-muted uppercase tracking-wider font-medium">
                  Requests · last 24h
                </div>
                <div className="mono text-xl font-medium mt-1">847,291</div>
              </div>
            </div>
            <svg viewBox="0 0 600 160" style={{ width: '100%', height: 160 }}>
              <defs>
                <linearGradient id="gcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,110 L30,102 L60,98 L90,88 L150,70 L210,64 L270,42 L330,38 L390,30 L450,52 L510,34 L570,32 L600,38 L600,160 L0,160 Z"
                fill="url(#gcc)"
              />
              <path
                d="M0,110 L30,102 L60,98 L90,88 L150,70 L210,64 L270,42 L330,38 L390,30 L450,52 L510,34 L570,32 L600,38"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.75"
              />
            </svg>
          </div>
        </Card>

        <Card className="col-span-2">
          <div className="px-4 py-3 border-b border-line font-semibold text-sm">Alerts</div>
          <div className="divide-y divide-line text-sm">
            {[
              { tone: 'err' as const, label: 'mail-relay failing health', sub: '8m ago' },
              { tone: 'warn' as const, label: 'ingest-worker p95 > 300ms', sub: '23m ago' },
              { tone: 'warn' as const, label: 'db primary CPU > 80%', sub: '1h ago' },
              { tone: 'ok' as const, label: 'deploy api-gateway@v142', sub: '4h ago' },
            ].map((a, i) => (
              <div key={i} className="px-4 py-2.5 flex items-center gap-2">
                <Dot tone={a.tone} />
                <span className="flex-1 truncate">{a.label}</span>
                <span className="text-xs text-text-dim">{a.sub}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="col-span-4">
          <div className="px-4 py-3 border-b border-line font-semibold text-sm">Live logs</div>
          <div className="bg-bg-sunk py-1 max-h-[220px] overflow-auto">
            {logs.map((l, i) => (
              <LogLine key={i} level={l.level} timestamp={l.ts} message={l.msg} />
            ))}
          </div>
        </Card>

        <Card className="col-span-2">
          <div className="px-4 py-3 border-b border-line font-semibold text-sm">Quota</div>
          <div className="p-4 flex items-center gap-4">
            <Ring value={62}>62%</Ring>
            <div className="text-xs text-text-muted space-y-1">
              <div>CPU: <span className="mono">24 / 48</span></div>
              <div>Memory: <span className="mono">62 / 96 GB</span></div>
              <div>Instances: <span className="mono">14 / 24</span></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
}
