import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Pill } from '../..'

const meta: Meta = {
  title: '08 · Layouts/Marketing / landing',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const features = [
  {
    icon: '⚡',
    title: 'Push-to-deploy',
    body: 'Push to main, we build it, test it, and roll it out. Preview envs per PR, zero config.',
  },
  {
    icon: '📊',
    title: 'Observability built in',
    body: 'Logs, metrics, traces — correlated by default. No agent install, no sidecars.',
  },
  {
    icon: '🛡',
    title: 'Operator-first security',
    body: 'SSO, audit logs, secret rotation. Every workflow designed for the people on call.',
  },
]

export const Landing: Story = {
  render: () => (
    <div className="bg-bg min-h-[640px]">
      <header className="px-8 py-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-accent to-accent-ink" />
          <span className="font-semibold">Linden Cloud</span>
        </div>
        <nav className="flex gap-5 text-sm text-text-muted">
          <a href="#" className="hover:text-text">Product</a>
          <a href="#" className="hover:text-text">Pricing</a>
          <a href="#" className="hover:text-text">Docs</a>
          <a href="#" className="hover:text-text">Changelog</a>
        </nav>
        <div style={{ flex: 1 }} />
        <Button size="sm" intent="ghost">Sign in</Button>
        <Button size="sm" intent="primary">Start free</Button>
      </header>

      <section className="px-8 py-20 max-w-5xl mx-auto text-center">
        <Pill tone="info" className="mx-auto">New · SOC 2 Type II certified</Pill>
        <h1 className="text-5xl font-semibold tracking-tight leading-[1.05] mt-5">
          The operator's cloud.
        </h1>
        <p className="text-lg text-text-muted mt-5 max-w-2xl mx-auto leading-relaxed">
          Dense, thoughtful tooling for the people actually running production.
          Not another dashboard that buries the signal.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Button intent="primary">Start free · no card</Button>
          <Button intent="ghost">Watch 3-min demo →</Button>
        </div>
        <div className="text-xs text-text-dim mt-4 mono">
          us-east-1 · eu-west-1 · ap-south-1 · +9 more
        </div>
      </section>

      <section className="px-8 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title}>
              <div className="w-10 h-10 rounded-md bg-accent-weak text-accent-ink text-xl grid place-items-center mb-3">
                {f.icon}
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-text-muted mt-1 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
}
