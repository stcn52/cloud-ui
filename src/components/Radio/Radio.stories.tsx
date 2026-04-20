import type { Meta, StoryObj } from '@storybook/react-vite'
import { Radio, RadioRow } from './index'

const meta = {
  title: '02 · Primitives/Radio',
  component: Radio,
  tags: ['autodocs'],
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { args: { defaultChecked: true } }

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <RadioRow label="Public"><Radio name="v" /></RadioRow>
      <RadioRow label="Team only"><Radio name="v" defaultChecked /></RadioRow>
      <RadioRow label="Owner only"><Radio name="v" /></RadioRow>
      <RadioRow label="Enterprise"><Radio name="v" disabled /></RadioRow>
    </div>
  ),
}
