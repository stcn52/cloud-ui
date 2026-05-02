import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormSteps } from './index'

const meta = {
  title: '02 · Primitives/Form steps',
  component: FormSteps,
  tags: ['autodocs'],
  args: { steps: [], current: 0 },
} satisfies Meta<typeof FormSteps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <FormSteps
      current={1}
      steps={[
        { label: 'Account' },
        { label: 'Workspace' },
        { label: 'Plan' },
        { label: 'Invite team' },
      ]}
    />
  ),
}

export const Long: Story = {
  render: () => (
    <FormSteps
      current={3}
      steps={[
        { label: 'Source' },
        { label: 'Build' },
        { label: 'Test' },
        { label: 'Deploy' },
        { label: 'Verify' },
      ]}
    />
  ),
}

export const Vertical: Story = {
  render: () => (
    <FormSteps
      orientation="vertical"
      current={2}
      steps={[
        { label: 'Connect repository' },
        { label: 'Detect framework' },
        { label: 'Configure environment' },
        { label: 'Deploy preview' },
      ]}
    />
  ),
}

export const ExplicitStates: Story = {
  parameters: {
    docs: { description: { story: 'Override the auto-derived state per step — useful for branched workflows where some steps are skipped or marked optional.' } },
  },
  render: () => (
    <FormSteps
      steps={[
        { label: 'Source', state: 'done' },
        { label: 'Build',  state: 'done' },
        { label: 'Test',   state: 'active' },
        { label: 'Deploy', state: 'pending' },
      ]}
    />
  ),
}
