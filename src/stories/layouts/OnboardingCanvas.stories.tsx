import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Field, Input, Select } from '../..'

const meta: Meta = {
  title: '08 · Layouts/Onboarding canvas',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const steps = [
  { label: 'Workspace', done: true },
  { label: 'Region', active: true },
  { label: 'First service', done: false },
  { label: 'Invite team', done: false },
  { label: 'Billing', done: false },
]

export const Wizard: Story = {
  render: () => (
    <div className="grid grid-cols-[280px_1fr] h-[640px] bg-bg border-t border-line">
      <aside className="border-r border-line bg-panel p-5">
        <div className="mb-6">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-accent to-accent-ink" />
        </div>
        <div className="text-xs uppercase tracking-wider text-text-dim font-semibold mb-3">
          Setup
        </div>
        <div className="space-y-2">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <div
                className={
                  s.done
                    ? 'w-6 h-6 rounded-full bg-ok text-white grid place-items-center text-[10px] font-bold'
                    : s.active
                    ? 'w-6 h-6 rounded-full border-2 border-accent text-accent-ink grid place-items-center text-[10px] font-bold'
                    : 'w-6 h-6 rounded-full border border-line text-text-dim grid place-items-center text-[10px] mono'
                }
              >
                {s.done ? '✓' : i + 1}
              </div>
              <span
                className={
                  s.active
                    ? 'text-sm font-medium'
                    : s.done
                    ? 'text-sm text-text-muted'
                    : 'text-sm text-text-dim'
                }
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </aside>

      <main className="p-10 max-w-xl">
        <div className="text-xs uppercase tracking-wider text-text-dim font-semibold mb-2 mono">
          Step 2 of 5
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Pick a default region
        </h1>
        <p className="text-text-muted leading-relaxed">
          New services provision here unless overridden. You can change this any
          time in settings, but existing services stay where they are.
        </p>

        <div className="mt-6 space-y-4 max-w-md">
          <Field label="Region">
            <Select defaultValue="us-east-1">
              <option value="us-east-1">us-east-1 — N. Virginia</option>
              <option value="us-west-2">us-west-2 — Oregon</option>
              <option value="eu-west-1">eu-west-1 — Ireland</option>
            </Select>
          </Field>
          <Field label="Environment label" hint="Optional.">
            <Input placeholder="e.g. prod" />
          </Field>
        </div>

        <div className="mt-8 flex gap-2">
          <Button>Back</Button>
          <Button intent="primary">Continue</Button>
          <div style={{ flex: 1 }} />
          <Button intent="ghost">Skip for now</Button>
        </div>
      </main>
    </div>
  ),
}
