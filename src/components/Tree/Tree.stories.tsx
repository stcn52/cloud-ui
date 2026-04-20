import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tree, type TreeNode } from './index'

const meta = {
  title: '06 · Advanced/Tree',
  component: Tree,
  tags: ['autodocs'],
} satisfies Meta<typeof Tree>

export default meta
type Story = StoryObj<typeof meta>

const orgIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const projIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4" />
  </svg>
)
const svcIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="4" width="18" height="6" rx="1" />
    <rect x="3" y="14" width="18" height="6" rx="1" />
  </svg>
)

const data: TreeNode[] = [
  {
    id: 'linden',
    label: 'Linden Labs',
    icon: orgIcon,
    meta: '3 projects',
    children: [
      {
        id: 'api-platform',
        label: 'api-platform',
        icon: projIcon,
        meta: '8 services',
        children: [
          { id: 'api-gateway', label: 'api-gateway', icon: svcIcon, meta: <span style={{ color: 'var(--color-accent-ink)' }}>v142</span> },
          { id: 'auth-service', label: 'auth-service', icon: svcIcon, meta: 'v88' },
          { id: 'ingest-worker', label: 'ingest-worker', icon: svcIcon, meta: 'v204' },
        ],
      },
      { id: 'billing', label: 'billing', icon: projIcon, meta: '4 services', children: [] },
      { id: 'analytics', label: 'analytics', icon: projIcon, meta: '6 services', children: [] },
    ],
  },
]

export const ResourceTree: Story = {
  args: {
    data,
    defaultExpanded: ['linden', 'api-platform'],
    defaultSelected: 'api-gateway',
  },
  render: (args) => (
    <div style={{ width: 420 }}>
      <Tree {...args} />
    </div>
  ),
}
