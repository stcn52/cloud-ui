import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './Progress'
import { Ring } from './Ring'

const meta = {
  title: '03 · Data display/Progress & Ring',
  component: Progress,
  tags: ['autodocs'],
  args: { value: 62 },
  argTypes: {
    tone: { control: 'select', options: ['accent', 'warn', 'err'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Linear: Story = {}

export const LinearTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
      <Progress value={62} />
      <Progress value={84} tone="warn" />
      <Progress value={100} tone="err" />
    </div>
  ),
}

export const Rings: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Ring value={28}>28%</Ring>
      <Ring value={62}>62%</Ring>
      <Ring value={84} tone="warn">84%</Ring>
      <Ring value={99} tone="ok">99.9%</Ring>
    </div>
  ),
}
