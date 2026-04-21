import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Button,
  CheckRow,
  Field,
  Input,
  Select,
  Switch,
} from '../..'

const meta: Meta = {
  title: '07 · Compositions/Settings page',
  parameters: {
    docs: {
      description: {
        component:
          'Left nav + form-row pattern. Every preference has a label, description, and its matching input on the right.',
      },
    },
  },
}
export default meta
type Story = StoryObj

const navItems = [
  'Profile',
  'Organization',
  'Security',
  'Billing',
  'API keys',
  'Webhooks',
  'Audit log',
]

function Row({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[260px_1fr] gap-6 py-4 border-b border-line">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-text-muted mt-0.5 leading-snug">{description}</div>
      </div>
      <div>{children}</div>
    </div>
  )
}

export const OrganizationSettings: Story = {
  render: () => (
    <div className="border border-line rounded-md bg-bg-elev grid grid-cols-[220px_1fr]" style={{ width: 900 }}>
      <aside className="p-3 border-r border-line text-sm space-y-0.5">
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
      <div className="p-6">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Organization</h2>
        <Row label="Workspace name" description="Displayed to everyone in this org.">
          <Field><Input defaultValue="Linden Labs" /></Field>
        </Row>
        <Row label="Default region" description="New services provision here unless overridden.">
          <Field>
            <Select>
              <option>us-east-1</option>
              <option>us-west-2</option>
              <option>eu-west-1</option>
            </Select>
          </Field>
        </Row>
        <Row label="Require 2FA" description="All members must enroll in two-factor auth.">
          <CheckRow label="Enabled for all members"><Switch defaultChecked /></CheckRow>
        </Row>
        <Row label="Retention" description="How long to keep logs after they stop streaming.">
          <CheckRow label="Keep 30 days (default)"><Switch /></CheckRow>
        </Row>
        <div className="flex gap-2 pt-4">
          <Button>Discard</Button>
          <Button intent="primary">Save changes</Button>
        </div>
      </div>
    </div>
  ),
}
