import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Card, Field, Input } from '../..'

const meta: Meta = {
  title: '07 · Compositions/Auth form',
  parameters: {
    docs: {
      description: {
        component: 'Sign-in panel with SSO options + divider + credentials. The one screen every user sees.',
      },
    },
  },
}
export default meta
type Story = StoryObj

const google = (
  <svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M12 11v2.5h5.7c-.2 1.3-1.5 3.8-5.7 3.8-3.4 0-6.2-2.8-6.2-6.3S8.6 4.7 12 4.7c2 0 3.3.8 4 1.6l2.7-2.6C17 2.2 14.7 1.2 12 1.2 6.1 1.2 1.3 6 1.3 12S6.1 22.8 12 22.8c6.8 0 11.2-4.8 11.2-11.5 0-.8-.1-1.4-.2-2z" /></svg>
)
const github = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.4.7-4.1-1.6-4.1-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 3 1.3 3.7 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.4-5.5-6A4.7 4.7 0 0 1 6.3 8c-.1-.3-.5-1.5.1-3 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.7.1 3a4.7 4.7 0 0 1 1.3 3.3c0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A12 12 0 0 0 12 .3" /></svg>
)

export const SignIn: Story = {
  render: () => (
    <Card style={{ width: 400 }}>
      <div className="p-6">
        <h2 className="text-lg font-semibold tracking-tight">Sign in to Linden</h2>
        <div className="text-sm text-text-muted mt-1">Welcome back. Pick your method.</div>

        <div className="flex flex-col gap-2 mt-4">
          <Button style={{ width: '100%', justifyContent: 'center' }}>
            {google} Continue with Google
          </Button>
          <Button style={{ width: '100%', justifyContent: 'center' }}>
            {github} Continue with GitHub
          </Button>
        </div>

        <div className="flex items-center gap-3 my-5 text-xs text-text-dim">
          <div className="flex-1 h-px bg-line" />
          <span>or</span>
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

        <div className="mt-4 text-xs text-text-muted text-center">
          Don't have an account? <a className="text-accent-ink underline" href="#">Create one</a>
        </div>
      </div>
    </Card>
  ),
}
