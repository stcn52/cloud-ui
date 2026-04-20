import type { Meta, StoryObj } from '@storybook/react-vite'
import { PipeStep, Pipeline } from './index'

const meta = {
  title: '03 · Data display/Pipeline',
  component: Pipeline,
  tags: ['autodocs'],
} satisfies Meta<typeof Pipeline>

export default meta
type Story = StoryObj<typeof meta>

export const InProgress: Story = {
  render: () => (
    <Pipeline>
      <PipeStep status="ok">Clone · 2s</PipeStep>
      <PipeStep status="ok">Install · 48s</PipeStep>
      <PipeStep status="ok">Test · 1m 24s</PipeStep>
      <PipeStep status="running">Build · 0m 42s</PipeStep>
      <PipeStep>Deploy</PipeStep>
      <PipeStep>Smoke</PipeStep>
    </Pipeline>
  ),
}

export const WithFailure: Story = {
  render: () => (
    <Pipeline>
      <PipeStep status="ok">Clone</PipeStep>
      <PipeStep status="ok">Install</PipeStep>
      <PipeStep status="err">Test · 14 failed</PipeStep>
      <PipeStep>Build</PipeStep>
      <PipeStep>Deploy</PipeStep>
    </Pipeline>
  ),
}
