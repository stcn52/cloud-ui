import type { Meta, StoryObj } from '@storybook/react-vite'
import { PipelineStep, Pipeline } from './index'

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
      <PipelineStep status="ok">Clone · 2s</PipelineStep>
      <PipelineStep status="ok">Install · 48s</PipelineStep>
      <PipelineStep status="ok">Test · 1m 24s</PipelineStep>
      <PipelineStep status="running">Build · 0m 42s</PipelineStep>
      <PipelineStep>Deploy</PipelineStep>
      <PipelineStep>Smoke</PipelineStep>
    </Pipeline>
  ),
}

export const WithFailure: Story = {
  render: () => (
    <Pipeline>
      <PipelineStep status="ok">Clone</PipelineStep>
      <PipelineStep status="ok">Install</PipelineStep>
      <PipelineStep status="err">Test · 14 failed</PipelineStep>
      <PipelineStep>Build</PipelineStep>
      <PipelineStep>Deploy</PipelineStep>
    </Pipeline>
  ),
}
