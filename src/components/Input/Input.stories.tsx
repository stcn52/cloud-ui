import type { Meta, StoryObj } from '@storybook/react-vite'
import { Affix, Field, Input, InputGroup } from './index'
import { Button } from '../Button'

const meta = {
  title: '02 · Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'linden-labs' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    mono: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
      <Field label="Default"><Input placeholder="linden-labs" /></Field>
      <Field label="Small"><Input size="sm" placeholder="Filter" /></Field>
      <Field label="Large"><Input size="lg" placeholder="Project name" /></Field>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
      <Field label="Disabled"><Input defaultValue="locked" disabled /></Field>
      <Field label="Error" error="Must be lowercase kebab-case.">
        <Input invalid defaultValue="bad value" />
      </Field>
      <Field label="Hint" hint="Never shown again.">
        <Input defaultValue="••••8a71" mono />
      </Field>
    </div>
  ),
}

export const Invalid: Story = {
  args: { invalid: true, defaultValue: 'bad value' },
}

const searchIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4-4" />
  </svg>
)

export const WithAffix: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
      <Field label="Endpoint">
        <InputGroup>
          <Affix>https://</Affix>
          <Input mono defaultValue="api.linden.dev" />
          <Affix side="right">.linden.sh</Affix>
        </InputGroup>
      </Field>
      <Field label="Search">
        <InputGroup>
          <Affix>{searchIcon}</Affix>
          <Input placeholder="Find a service…" />
          <Affix side="right"><kbd>⌘K</kbd></Affix>
        </InputGroup>
      </Field>
      <Field label="Price cap">
        <InputGroup>
          <Affix>$</Affix>
          <Input mono num defaultValue="25.00" />
          <Affix side="right">USD / mo</Affix>
        </InputGroup>
      </Field>
      <Field label="Secret" hint="Never shown again after you leave this page.">
        <InputGroup>
          <Input mono defaultValue="••••••••••8a71" />
          <Affix side="right">
            <Button size="xs" intent="ghost" style={{ height: 18 }}>reveal</Button>
          </Affix>
        </InputGroup>
      </Field>
    </div>
  ),
}

export const Clearable: Story = {
  parameters: { docs: { description: { story: '`clearable` shows a small × on the right while the input has a value; clicking it empties the field (works for controlled and uncontrolled inputs) and refocuses. `onClear` fires alongside.' } } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <Field label="Search (uncontrolled)">
        <Input clearable defaultValue="some text" placeholder="Type something…" />
      </Field>
      <Field label="Filter (sizes)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Input size="sm" clearable defaultValue="sm" />
          <Input size="md" clearable defaultValue="md" />
          <Input size="lg" clearable defaultValue="lg" />
        </div>
      </Field>
      <Field label="With left icon (compose with absolute positioning)">
        <div style={{ position: 'relative' }}>
          <Input clearable defaultValue="acme-staging" style={{ paddingLeft: 28 }} />
          <svg style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-text-dim" aria-hidden>
            <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </Field>
    </div>
  ),
}
