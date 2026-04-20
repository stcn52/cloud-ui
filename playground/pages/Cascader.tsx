import { useState } from 'react'
import { Cascader, type CascaderOption } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

const data: CascaderOption[] = [
  { value: 'us-west-2', label: 'us-west-2', children: [{ value: 'usw2-az1', label: 'usw2-az1', children: [{ value: 'subnet-3a', label: 'subnet-3a21' }] }] },
  {
    value: 'us-east-1',
    label: 'us-east-1',
    children: [
      { value: 'use1-az1', label: 'use1-az1', children: [{ value: 'subnet-9b72', label: 'subnet-9b72' }] },
      { value: 'use1-az2', label: 'use1-az2', children: [{ value: 'subnet-4c1d', label: 'subnet-4c1d' }] },
      { value: 'use1-az3', label: 'use1-az3', children: [{ value: 'subnet-e340', label: 'subnet-e340' }] },
      {
        value: 'use1-az4',
        label: 'use1-az4',
        children: [
          { value: 'subnet-0a8f', label: 'subnet-0a8f' },
          { value: 'subnet-4c1d-2', label: 'subnet-4c1d' },
          { value: 'subnet-9b72-2', label: 'subnet-9b72' },
          { value: 'subnet-e340-2', label: 'subnet-e340' },
        ],
      },
    ],
  },
  { value: 'us-east-2', label: 'us-east-2', children: [{ value: 'use2-az1', label: 'use2-az1', children: [{ value: 'subnet-u2', label: 'subnet-u2' }] }] },
  { value: 'eu-west-1', label: 'eu-west-1', children: [{ value: 'euw1-az1', label: 'euw1-az1', children: [{ value: 'subnet-eu', label: 'subnet-eu' }] }] },
]

export function CascaderPage() {
  const [path, setPath] = useState<string[]>(['us-east-1', 'use1-az4', 'subnet-0a8f'])

  return (
    <>
      <PageHeader
        kicker="06 · Advanced"
        title="Cascader"
        lede="Drill through hierarchical choices. Each column loads children of the previous column's selection."
      />

      <div className="demo">
        <div className="demo-label">Pick region → AZ → subnet</div>
        <div className="demo-body" style={{ gap: 16, alignItems: 'flex-start' }}>
          <div className="mono" style={{ fontSize: 12 }}>
            Picked: <span style={{ color: 'var(--accent-ink)' }}>{path.join(' / ')}</span>
          </div>
          <Cascader options={data} value={path} onChange={setPath} />
        </div>
      </div>
    </>
  )
}
