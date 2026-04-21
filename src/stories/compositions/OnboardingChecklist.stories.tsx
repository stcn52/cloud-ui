import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Card, Progress } from '../..'

const meta: Meta = {
  title: '07 · Compositions/Onboarding checklist',
  parameters: {
    docs: {
      description: {
        component:
          'Progressive first-run guide. Persistent until 100%, then collapses to a single "Done" state.',
      },
    },
  },
}
export default meta
type Story = StoryObj

interface Step {
  label: string
  desc: string
  done: boolean
  cta: string
}
const steps: Step[] = [
  { label: 'Create your first service', desc: 'Ship a container, function, or static site.', done: true, cta: 'Done' },
  { label: 'Invite a teammate', desc: 'Share access with an email, domain, or SSO group.', done: true, cta: 'Done' },
  { label: 'Connect your Git repo', desc: 'Deploys on push — preview envs per PR.', done: false, cta: 'Connect' },
  { label: 'Set up a custom domain', desc: 'We issue TLS automatically.', done: false, cta: 'Add domain' },
  { label: 'Tune your budget', desc: 'Alerts before you hit your monthly cap.', done: false, cta: 'Set budget' },
]

const check = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
    <polyline points="5 12 10 17 20 7" />
  </svg>
)

export const ChecklistPanel: Story = {
  render: () => {
    const done = steps.filter((s) => s.done).length
    const pct = Math.round((done / steps.length) * 100)
    return (
      <Card style={{ width: 520 }}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-semibold">Get started with Linden</div>
            <span className="ml-auto text-xs text-text-dim mono">
              {done} / {steps.length} done
            </span>
          </div>
          <Progress value={pct} />
        </div>
        <div className="border-t border-line divide-y divide-line">
          {steps.map((s) => (
            <div key={s.label} className="px-4 py-3 flex items-start gap-3">
              <div
                className={
                  s.done
                    ? 'w-5 h-5 rounded-full bg-ok text-white grid place-items-center shrink-0 mt-0.5'
                    : 'w-5 h-5 rounded-full border border-line bg-bg-elev shrink-0 mt-0.5'
                }
              >
                {s.done && check}
              </div>
              <div className="flex-1 min-w-0">
                <div className={s.done ? 'text-sm text-text-muted line-through' : 'text-sm font-medium'}>
                  {s.label}
                </div>
                <div className="text-xs text-text-dim mt-0.5">{s.desc}</div>
              </div>
              {!s.done && <Button size="sm">{s.cta}</Button>}
            </div>
          ))}
        </div>
      </Card>
    )
  },
}
