import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Pill } from '../..'

const meta: Meta = {
  title: '08 · Layouts/Topology / graph',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

interface Node {
  id: string
  label: string
  x: number
  y: number
  status: 'ok' | 'warn' | 'err'
}
const nodes: Node[] = [
  { id: 'edge', label: 'cdn-edge', x: 80, y: 140, status: 'ok' },
  { id: 'api', label: 'api-gateway', x: 280, y: 140, status: 'ok' },
  { id: 'auth', label: 'auth-service', x: 480, y: 60, status: 'ok' },
  { id: 'worker', label: 'ingest-worker', x: 480, y: 220, status: 'warn' },
  { id: 'db', label: 'primary-db', x: 680, y: 140, status: 'ok' },
  { id: 'mail', label: 'mail-relay', x: 280, y: 320, status: 'err' },
]

interface Edge {
  from: string
  to: string
  rps: string
  tone: 'ok' | 'warn' | 'err'
}
const edges: Edge[] = [
  { from: 'edge', to: 'api', rps: '8.4k', tone: 'ok' },
  { from: 'api', to: 'auth', rps: '2.1k', tone: 'ok' },
  { from: 'api', to: 'worker', rps: '12.8k', tone: 'warn' },
  { from: 'auth', to: 'db', rps: '2.1k', tone: 'ok' },
  { from: 'worker', to: 'db', rps: '4.2k', tone: 'warn' },
  { from: 'api', to: 'mail', rps: '—', tone: 'err' },
]

const toneColor: Record<'ok' | 'warn' | 'err', string> = {
  ok: 'var(--color-ok)',
  warn: 'var(--color-warn)',
  err: 'var(--color-err)',
}

export const ServiceMesh: Story = {
  render: () => {
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))
    return (
      <div className="p-5 bg-bg min-h-[640px]">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xl font-semibold tracking-tight">Service mesh · us-east-1</h2>
          <Pill tone="warn" dot>2 degraded</Pill>
        </div>
        <Card>
          <svg
            viewBox="0 0 800 400"
            style={{
              width: '100%',
              height: 400,
              background:
                'linear-gradient(var(--color-line) 1px, transparent 1px) 0 0/24px 24px,' +
                'linear-gradient(90deg, var(--color-line) 1px, transparent 1px) 0 0/24px 24px,' +
                'var(--color-bg)',
            }}
          >
            {/* edges */}
            {edges.map((e, i) => {
              const a = byId[e.from]
              const b = byId[e.to]
              const mx = (a.x + b.x) / 2
              const my = (a.y + b.y) / 2
              return (
                <g key={i}>
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={toneColor[e.tone]}
                    strokeWidth={1.5}
                    strokeDasharray={e.tone === 'err' ? '4 4' : undefined}
                    opacity={0.7}
                  />
                  <rect
                    x={mx - 20}
                    y={my - 9}
                    width={40}
                    height={18}
                    rx={3}
                    fill="var(--color-bg-elev)"
                    stroke="var(--color-line)"
                  />
                  <text
                    x={mx}
                    y={my}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    fill="var(--color-text-muted)"
                  >
                    {e.rps}
                  </text>
                </g>
              )
            })}

            {/* nodes */}
            {nodes.map((n) => (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={22}
                  fill="var(--color-bg-elev)"
                  stroke={toneColor[n.status]}
                  strokeWidth={2}
                />
                <circle cx={n.x + 15} cy={n.y - 15} r={4} fill={toneColor[n.status]} />
                <text
                  x={n.x}
                  y={n.y + 38}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={11}
                  fill="var(--color-text)"
                >
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
        </Card>
      </div>
    )
  },
}
