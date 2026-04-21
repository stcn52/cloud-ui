import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Field, Input } from '../..'

const meta: Meta = {
  title: '08 · Layouts/Auth split',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

export const SignInSplit: Story = {
  render: () => (
    <div className="grid grid-cols-2 h-[640px] bg-bg border-t border-line">
      <aside
        className="text-white p-10 flex flex-col"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.5 0.12 250), oklch(0.3 0.08 250))',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-white/20 grid place-items-center font-bold">L</div>
          <span className="font-semibold">Linden Cloud</span>
        </div>
        <div className="mt-auto">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight max-w-md">
            The fastest way to ship what operators actually need.
          </h2>
          <p className="mt-3 text-white/70 max-w-md leading-relaxed">
            12 regions. Zero-config deploys. Dense, operator-first console —
            exactly the one this design system renders.
          </p>
          <div className="flex items-center gap-6 mt-8 text-sm text-white/60">
            <div><span className="mono text-white">847k</span> devs</div>
            <div><span className="mono text-white">99.94%</span> uptime</div>
            <div><span className="mono text-white">4 yrs</span> SOC 2</div>
          </div>
        </div>
      </aside>

      <div className="flex items-center justify-center p-10">
        <div style={{ width: 360 }}>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-text-muted mt-1 text-sm">
            Don't have an account?{' '}
            <a className="text-accent-ink underline" href="#">Create one</a>
          </p>

          <div className="flex flex-col gap-3 mt-6">
            <Button style={{ width: '100%', justifyContent: 'center' }}>
              Continue with Google
            </Button>
            <Button style={{ width: '100%', justifyContent: 'center' }}>
              Continue with GitHub
            </Button>
          </div>

          <div className="flex items-center gap-3 my-5 text-xs text-text-dim">
            <div className="flex-1 h-px bg-line" />
            <span>or with email</span>
            <div className="flex-1 h-px bg-line" />
          </div>

          <div className="flex flex-col gap-3">
            <Field label="Email">
              <Input type="email" placeholder="you@linden.com" />
            </Field>
            <Field label="Password">
              <Input type="password" placeholder="••••••••" />
            </Field>
            <Button intent="primary" style={{ width: '100%', justifyContent: 'center' }}>
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </div>
  ),
}
