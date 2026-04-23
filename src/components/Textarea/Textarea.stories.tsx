import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from '../Input'
import { Textarea } from './index'

const meta = {
  title: '02 · Primitives/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { placeholder: 'Migration runbook…' },
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const InField: Story = {
  render: () => (
    <Field label="Notes">
      <Textarea placeholder="Migration runbook…" rows={4} />
    </Field>
  ),
}

export const Invalid: Story = {
  args: { invalid: true, defaultValue: 'Too short' },
}
