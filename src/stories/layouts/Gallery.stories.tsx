import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Pill } from '../..'

const meta: Meta = {
  title: '08 · Layouts/Gallery',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

interface Item {
  name: string
  desc: string
  tag: string
  gradient: string
}
const items: Item[] = [
  { name: 'Node · API starter', desc: 'Express + Postgres + Auth0', tag: 'Official', gradient: 'linear-gradient(135deg, oklch(0.78 0.08 230), oklch(0.55 0.12 280))' },
  { name: 'Next.js SaaS', desc: 'App router · Stripe · Clerk', tag: 'Official', gradient: 'linear-gradient(135deg, oklch(0.78 0.08 40), oklch(0.55 0.12 10))' },
  { name: 'Python worker', desc: 'Celery + Redis + S3', tag: 'Community', gradient: 'linear-gradient(135deg, oklch(0.78 0.08 180), oklch(0.55 0.12 210))' },
  { name: 'Static site', desc: 'Astro + CDN + forms', tag: 'Official', gradient: 'linear-gradient(135deg, oklch(0.78 0.08 120), oklch(0.55 0.12 150))' },
  { name: 'Event-driven', desc: 'Kafka · ClickHouse · dbt', tag: 'Community', gradient: 'linear-gradient(135deg, oklch(0.78 0.08 280), oklch(0.55 0.12 310))' },
  { name: 'Monitoring stack', desc: 'Grafana · Prom · Loki', tag: 'Official', gradient: 'linear-gradient(135deg, oklch(0.78 0.08 60), oklch(0.55 0.12 30))' },
]

export const Templates: Story = {
  render: () => (
    <div className="p-6 bg-bg min-h-[640px]">
      <div className="flex items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Templates</h2>
          <p className="text-text-muted text-sm">Start from a proven stack, or fork to customize.</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((it) => (
          <Card key={it.name}>
            <div style={{ background: it.gradient, height: 140 }} />
            <div className="p-3">
              <div className="flex items-center gap-2">
                <div className="font-semibold text-sm">{it.name}</div>
                <Pill tone={it.tag === 'Official' ? 'info' : 'neutral'}>{it.tag}</Pill>
              </div>
              <div className="text-xs text-text-muted mt-1">{it.desc}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  ),
}
