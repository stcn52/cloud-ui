import type { Meta, StoryObj } from '@storybook/react-vite'
import { CopyField } from './index'

const meta = {
  title: '06 · Advanced/Copy field',
  component: CopyField,
  tags: ['autodocs'],
  args: { children: 'svc_8f2a10e47c9b', value: 'svc_8f2a10e47c9b' },
} satisfies Meta<typeof CopyField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ChildrenFallback: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CopyField>pnpm add @stcn52/cloud-ui</CopyField>
      <CopyField>
        <code>docker run -p 8080:8080 myimage:latest</code>
      </CopyField>
    </div>
  ),
}

export const MultipleFields: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CopyField value="svc_8f2a10e47c9b">svc_8f2a10e47c9b</CopyField>
      <CopyField value="nc_live_abc123K7qZ">nc_live_••••••••••••K7qZ</CopyField>
      <CopyField value="postgres://user:pass@db/events">
        postgres://user:pass@db/events
      </CopyField>
    </div>
  ),
}
