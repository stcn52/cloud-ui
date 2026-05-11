import type { Meta, StoryObj } from '@storybook/react-vite'
import { JsonViewer } from './index'

const meta = {
  title: '07 · More/JSON viewer',
  component: JsonViewer,
  tags: ['autodocs'],
  args: { data: { hello: 'world' } },
} satisfies Meta<typeof JsonViewer>

export default meta
type Story = StoryObj<typeof meta>

const sample = {
  id: 'wks_4f2a',
  name: 'acme-staging',
  region: 'us-east-1',
  active: true,
  quota: { cpu: 32, memoryGb: 128, addons: ['logs', 'metrics', 'tracing'] },
  members: [
    { user: 'alex', role: 'owner', mfa: true },
    { user: 'bri', role: 'admin', mfa: false },
  ],
  meta: { createdAt: '2026-04-01T09:12:00Z', lastDeploy: null },
}

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 480 }}>
      <JsonViewer {...args} data={sample} />
    </div>
  ),
}

export const FullyExpanded: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <JsonViewer data={sample} defaultExpandDepth={Infinity} />
    </div>
  ),
}

export const FromString: Story = {
  parameters: { docs: { description: { story: 'Pass a JSON *string* and it gets parsed. Invalid strings render as-is with a warning.' } } },
  render: () => (
    <div style={{ width: 480, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <JsonViewer data='{"a":1,"b":[true,false,null],"c":{"nested":"yes"}}' />
      <JsonViewer data='{ not really json' />
    </div>
  ),
}

export const Primitive: Story = {
  render: () => (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <JsonViewer data={42} copyable={false} />
      <JsonViewer data="just a string" copyable={false} />
      <JsonViewer data={null} copyable={false} />
    </div>
  ),
}
