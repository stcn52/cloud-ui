import type { Meta, StoryObj } from '@storybook/react-vite'
import { CheckRow, Checkbox } from './index'

const meta = {
  title: '02 · Primitives/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { args: { checked: true } }

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <CheckRow label="Unchecked"><Checkbox /></CheckRow>
      <CheckRow label="Checked"><Checkbox defaultChecked /></CheckRow>
      <CheckRow label="Indeterminate"><Checkbox indeterminate /></CheckRow>
      <CheckRow label="Disabled"><Checkbox disabled /></CheckRow>
      <CheckRow label="Disabled checked"><Checkbox disabled defaultChecked /></CheckRow>
    </div>
  ),
}
