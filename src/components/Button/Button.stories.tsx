import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, ButtonGroup } from './index'

const meta = {
  title: '02 · Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Deploy to prod',
  },
  argTypes: {
    intent: {
      control: 'select',
      options: ['default', 'primary', 'subtle', 'ghost', 'outline', 'danger'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { intent: 'primary', size: 'md' },
}

export const Intents: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button intent="primary">Deploy to prod</Button>
      <Button>Cancel</Button>
      <Button intent="subtle">Promote</Button>
      <Button intent="ghost">Skip for now</Button>
      <Button intent="outline">Outline</Button>
      <Button intent="danger">Delete project</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button intent="primary" size="xs">xs</Button>
      <Button intent="primary" size="sm">sm</Button>
      <Button intent="primary">default</Button>
      <Button intent="primary" size="lg">lg</Button>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button intent="primary">Default</Button>
      <Button intent="primary" loading>Saving…</Button>
      <Button intent="primary" disabled>Disabled</Button>
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Day</Button>
      <Button>Week</Button>
      <Button>Month</Button>
    </ButtonGroup>
  ),
}

export const AsAnchor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button as="a" href="https://example.com" target="_blank" rel="noreferrer" intent="primary">
        External link
      </Button>
      <Button as="a" href="#" intent="ghost">
        Ghost link
      </Button>
      <Button as="a" href="#" intent="outline">
        Outline link
      </Button>
    </div>
  ),
}
