import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb, Breadcrumbs } from './index'

const meta = {
  title: '04 · Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Full: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumb>Workspaces</Breadcrumb>
      <Breadcrumb>Linden Labs</Breadcrumb>
      <Breadcrumb>Services</Breadcrumb>
      <Breadcrumb leaf>api-gateway</Breadcrumb>
    </Breadcrumbs>
  ),
}

export const Shallow: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumb>Linden</Breadcrumb>
      <Breadcrumb leaf>Overview</Breadcrumb>
    </Breadcrumbs>
  ),
}
