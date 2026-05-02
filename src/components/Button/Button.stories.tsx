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
      options: ['default', 'primary', 'subtle', 'ghost', 'outline', 'danger', 'success', 'warning', 'link'],
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
      <Button intent="subtle">Promote</Button>
      <Button>Cancel</Button>
      <Button intent="outline">Outline</Button>
      <Button intent="ghost">Skip for now</Button>
      <Button intent="link">Learn more →</Button>
      <Button intent="success">Approve</Button>
      <Button intent="warning">Override</Button>
      <Button intent="danger">Delete project</Button>
    </div>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 320 }}>
      <Button intent="primary" size="lg" fullWidth>Continue with email</Button>
      <Button size="lg" fullWidth>Continue with Google</Button>
      <Button intent="ghost" size="lg" fullWidth>Use single sign-on</Button>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button fullWidth>Cancel</Button>
        <Button intent="primary" fullWidth>Save changes</Button>
      </div>
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
