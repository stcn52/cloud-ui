import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../Checkbox'
import { Pill } from '../Pill'
import { Table } from './index'

const meta = {
  title: '03 · Data display/Table',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

interface Row {
  name: string
  statusTone: 'ok' | 'warn' | 'err'
  statusLabel: string
  region: string
  version: string
  reqs: string
  p95: string
}
const rows: Row[] = [
  { name: 'api-gateway', statusTone: 'ok', statusLabel: 'Healthy', region: 'us-east-1', version: 'v142', reqs: '8,420', p95: '124ms' },
  { name: 'auth-service', statusTone: 'ok', statusLabel: 'Healthy', region: 'us-east-1', version: 'v88', reqs: '2,140', p95: '86ms' },
  { name: 'ingest-worker', statusTone: 'warn', statusLabel: 'Degraded', region: 'us-east-1', version: 'v204', reqs: '12,800', p95: '342ms' },
  { name: 'mail-relay', statusTone: 'err', statusLabel: 'Failing', region: 'us-east-1', version: 'v7', reqs: '—', p95: '—' },
]

export const ResourceList: Story = {
  render: () => (
    <Table>
      <thead>
        <tr>
          <th style={{ width: 24 }}><Checkbox /></th>
          <th>Name</th>
          <th>Status</th>
          <th>Region</th>
          <th>Version</th>
          <th>Requests/m</th>
          <th>p95</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td><Checkbox /></td>
            <td>{r.name}</td>
            <td><Pill tone={r.statusTone} dot>{r.statusLabel}</Pill></td>
            <td className="mono">{r.region}</td>
            <td className="mono">{r.version}</td>
            <td className="mono">{r.reqs}</td>
            <td className="mono">{r.p95}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  ),
}
