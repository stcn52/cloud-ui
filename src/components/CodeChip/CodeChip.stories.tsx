import type { Meta, StoryObj } from '@storybook/react-vite'
import { CodeChip } from './index'

const meta = {
  title: '02 · Primitives/Code chip',
  component: CodeChip,
  tags: ['autodocs'],
} satisfies Meta<typeof CodeChip>

export default meta
type Story = StoryObj<typeof meta>

export const Inline: Story = {
  render: () => (
    <p style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 620, margin: 0 }}>
      Run <CodeChip>nextcli deploy</CodeChip> to push the current branch.
      Override the region with <CodeChip>--region us-west-2</CodeChip>,
      or set <CodeChip intent="accent">NEXTCLI_PROFILE=prod</CodeChip> in your shell.
      Configuration lives at <CodeChip>~/.nextcli/config.toml</CodeChip>.
    </p>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <CodeChip>default</CodeChip>
      <CodeChip intent="accent">accent</CodeChip>
      <CodeChip intent="err">err</CodeChip>
    </div>
  ),
}
