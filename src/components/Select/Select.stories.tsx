import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from '../Input'
import { Select } from './index'

const meta = {
  title: '02 · Primitives/Select',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Select {...args}>
      <option>us-east-1 (N. Virginia)</option>
      <option>us-west-2 (Oregon)</option>
      <option>eu-west-1 (Ireland)</option>
    </Select>
  ),
}

export const InField: Story = {
  render: () => (
    <Field label="Region">
      <Select>
        <option>us-east-1 (N. Virginia)</option>
        <option>us-west-2 (Oregon)</option>
        <option>eu-west-1 (Ireland)</option>
      </Select>
    </Field>
  ),
}
