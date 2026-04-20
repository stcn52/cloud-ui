import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cascader, type CascaderOption } from './index'

const meta = {
  title: '06 · Advanced/Cascader',
  component: Cascader,
  tags: ['autodocs'],
  args: { options: [] },
} satisfies Meta<typeof Cascader>

export default meta
type Story = StoryObj<typeof meta>

const data: CascaderOption[] = [
  {
    value: 'us-east-1',
    label: 'us-east-1',
    children: [
      { value: 'use1-az1', label: 'use1-az1', children: [{ value: 'subnet-9b72', label: 'subnet-9b72' }] },
      { value: 'use1-az2', label: 'use1-az2', children: [{ value: 'subnet-4c1d', label: 'subnet-4c1d' }] },
      {
        value: 'use1-az4',
        label: 'use1-az4',
        children: [
          { value: 'subnet-0a8f', label: 'subnet-0a8f' },
          { value: 'subnet-e340', label: 'subnet-e340' },
        ],
      },
    ],
  },
  { value: 'us-east-2', label: 'us-east-2', children: [{ value: 'use2-az1', label: 'use2-az1', children: [{ value: 'subnet-u2', label: 'subnet-u2' }] }] },
  { value: 'eu-west-1', label: 'eu-west-1', children: [{ value: 'euw1-az1', label: 'euw1-az1', children: [{ value: 'subnet-eu', label: 'subnet-eu' }] }] },
]

export const RegionAzSubnet: Story = {
  render: () => {
    const [path, setPath] = useState<string[]>(['us-east-1', 'use1-az4', 'subnet-0a8f'])
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="mono" style={{ fontSize: 12 }}>
          Picked: <span style={{ color: 'var(--color-accent-ink)' }}>{path.join(' / ')}</span>
        </div>
        <Cascader options={data} value={path} onChange={setPath} />
      </div>
    )
  },
}
