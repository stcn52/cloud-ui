import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, Button, Card, Checkbox, Pill, Table } from '../..'

const meta: Meta = {
  title: '07 · Compositions/Access review',
  parameters: {
    docs: {
      description: {
        component:
          "A focused table for the one thing that's always stressful: who has production access and why.",
      },
    },
  },
}
export default meta
type Story = StoryObj

interface Member {
  initials: string
  name: string
  email: string
  role: 'Owner' | 'Admin' | 'Member' | 'Read-only'
  mfa: boolean
  lastActive: string
  risk?: 'warn' | 'err'
  riskLabel?: string
}
const members: Member[] = [
  { initials: 'MC', name: 'Maya Chen', email: 'maya@linden.com', role: 'Owner', mfa: true, lastActive: '2m ago' },
  { initials: 'JP', name: 'Julien Prevost', email: 'julien@linden.com', role: 'Admin', mfa: true, lastActive: '14m ago' },
  { initials: 'AP', name: 'Aditi Patel', email: 'aditi@linden.com', role: 'Admin', mfa: false, lastActive: '2h ago', risk: 'warn', riskLabel: 'MFA disabled' },
  { initials: 'JK', name: 'Jin Kawasaki', email: 'jin@contractor.dev', role: 'Member', mfa: true, lastActive: '41d ago', risk: 'err', riskLabel: 'Inactive > 30d' },
  { initials: 'TW', name: 'Thabo Williams', email: 'thabo@linden.com', role: 'Read-only', mfa: true, lastActive: '1d ago' },
]

export const ProdAccess: Story = {
  render: () => (
    <Card style={{ width: 900 }}>
      <div className="px-4 py-3 border-b border-line flex items-center gap-3">
        <div>
          <div className="font-semibold">Production access review</div>
          <div className="text-xs text-text-muted">5 members · 2 flagged · last review 14d ago</div>
        </div>
        <div style={{ flex: 1 }} />
        <Button size="sm">Export CSV</Button>
        <Button size="sm" intent="primary">Complete review</Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th style={{ width: 24 }}><Checkbox /></th>
            <th>Member</th>
            <th>Role</th>
            <th>MFA</th>
            <th>Last active</th>
            <th>Risk</th>
            <th style={{ width: 80 }} />
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.email}>
              <td><Checkbox /></td>
              <td>
                <div className="flex items-center gap-2">
                  <Avatar size="sm">{m.initials}</Avatar>
                  <div>
                    <div className="text-sm">{m.name}</div>
                    <div className="text-xs text-text-dim mono">{m.email}</div>
                  </div>
                </div>
              </td>
              <td>{m.role}</td>
              <td>{m.mfa ? <Pill tone="ok" dot>On</Pill> : <Pill tone="err" dot>Off</Pill>}</td>
              <td className="mono">{m.lastActive}</td>
              <td>
                {m.risk ? (
                  <Pill tone={m.risk} dot>{m.riskLabel}</Pill>
                ) : (
                  <span className="text-text-dim text-xs">—</span>
                )}
              </td>
              <td>
                <Button size="xs" intent="ghost">Revoke</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  ),
}
