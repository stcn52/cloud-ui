import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryBuilder, queryToString, emptyGroup, type QueryField, type QueryGroup } from './index'

const meta = {
  title: '07 · More/Query builder',
  component: QueryBuilder,
  tags: ['autodocs'],
  args: { fields: [] },
} satisfies Meta<typeof QueryBuilder>

export default meta
type Story = StoryObj<typeof meta>

const fields: QueryField[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'cpu', label: 'vCPUs', type: 'number' },
  { name: 'region', label: 'Region', type: 'select', options: [
    { value: 'us-east-1', label: 'us-east-1' },
    { value: 'us-west-2', label: 'us-west-2' },
    { value: 'eu-west-1', label: 'eu-west-1' },
  ]},
  { name: 'status', label: 'Status', type: 'select', options: [
    { value: 'running', label: 'running' },
    { value: 'stopped', label: 'stopped' },
    { value: 'error', label: 'error' },
  ]},
  { name: 'managed', label: 'Managed', type: 'boolean' },
  { name: 'created', label: 'Created', type: 'date' },
]

export const Playground: Story = {
  render: () => {
    const [q, setQ] = useState<QueryGroup>({
      ...emptyGroup('and'),
      rules: [
        { id: 'r1', field: 'region', op: 'eq', value: 'us-east-1' },
        { id: 'r2', field: 'cpu', op: 'gte', value: '8' },
      ],
    })
    return (
      <div style={{ width: 640, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="border border-line rounded-md bg-bg-elev p-4">
          <QueryBuilder fields={fields} value={q} onChange={setQ} />
        </div>
        <pre className="text-xs font-mono text-text-muted bg-bg-sunk rounded-sm border border-line p-3 whitespace-pre-wrap">
          {queryToString(q, fields)}
        </pre>
      </div>
    )
  },
}

export const WithNestedGroups: Story = {
  parameters: { docs: { description: { story: 'Click "+ Group" to nest an AND/OR sub-group (up to `maxDepth`).' } } },
  render: () => {
    const [q, setQ] = useState<QueryGroup>({
      id: 'g0', combinator: 'and',
      rules: [
        { id: 'r1', field: 'status', op: 'eq', value: 'running' },
        { id: 'g1', combinator: 'or', rules: [
          { id: 'r2', field: 'region', op: 'eq', value: 'us-east-1' },
          { id: 'r3', field: 'region', op: 'eq', value: 'us-west-2' },
        ]},
      ],
    })
    return (
      <div style={{ width: 680, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="border border-line rounded-md bg-bg-elev p-4">
          <QueryBuilder fields={fields} value={q} onChange={setQ} maxDepth={3} />
        </div>
        <pre className="text-xs font-mono text-text-muted bg-bg-sunk rounded-sm border border-line p-3 whitespace-pre-wrap">
          {queryToString(q, fields)}
        </pre>
      </div>
    )
  },
}

export const FlatOnly: Story = {
  parameters: { docs: { description: { story: '`allowGroups={false}` keeps it to a single flat AND/OR list — no nesting.' } } },
  render: () => {
    const [q, setQ] = useState<QueryGroup>(emptyGroup('or'))
    return (
      <div style={{ width: 600 }} className="border border-line rounded-md bg-bg-elev p-4">
        <QueryBuilder fields={fields} value={q} onChange={setQ} allowGroups={false} />
      </div>
    )
  },
}
