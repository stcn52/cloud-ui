import type { Meta, StoryObj } from '@storybook/react-vite'
import { BreadcrumbItem, Breadcrumbs } from './index'

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
      <BreadcrumbItem>Workspaces</BreadcrumbItem>
      <BreadcrumbItem>Linden Labs</BreadcrumbItem>
      <BreadcrumbItem>Services</BreadcrumbItem>
      <BreadcrumbItem leaf>api-gateway</BreadcrumbItem>
    </Breadcrumbs>
  ),
}

export const Shallow: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem>Linden</BreadcrumbItem>
      <BreadcrumbItem leaf>Overview</BreadcrumbItem>
    </Breadcrumbs>
  ),
}
