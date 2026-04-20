import type { Meta, StoryObj } from '@storybook/react-vite'
import { CheckRow } from '../Checkbox'
import { Switch } from './index'

const meta = {
  title: '02 · Primitives/Switch',
  component: Switch,
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { args: { defaultChecked: true } }

export const Settings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <CheckRow label="Auto-deploy main"><Switch /></CheckRow>
      <CheckRow label="Preview deploys"><Switch defaultChecked /></CheckRow>
      <CheckRow label="2FA required"><Switch defaultChecked /></CheckRow>
      <CheckRow label="Audit log (Enterprise)"><Switch disabled /></CheckRow>
    </div>
  ),
}
