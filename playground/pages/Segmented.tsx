import { useState } from 'react'
import { Segmented } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function SegmentedPage() {
  const [range, setRange] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h')
  const [view, setView] = useState<'graph' | 'table'>('graph')
  const [env, setEnv] = useState<'all' | 'prod' | 'preview'>('all')

  return (
    <>
      <PageHeader
        kicker="04 · Navigation"
        title="Segmented"
        lede="Pick exactly one. Use for small, fixed option sets — time ranges, view modes, environments. Three+ options: use this. Two options: use a Switch if it maps to on/off."
      />

      <div className="demo">
        <div className="demo-label">Pick one</div>
        <div className="demo-body">
          <Segmented
            value={range}
            onChange={setRange}
            options={[
              { value: '1h', label: '1h' },
              { value: '6h', label: '6h' },
              { value: '24h', label: '24h' },
              { value: '7d', label: '7d' },
              { value: '30d', label: '30d' },
            ]}
          />
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: 'graph', label: 'Graph' },
              { value: 'table', label: 'Table' },
            ]}
          />
          <Segmented
            value={env}
            onChange={setEnv}
            options={[
              { value: 'all', label: 'All' },
              { value: 'prod', label: 'Production' },
              { value: 'preview', label: 'Preview' },
            ]}
          />
        </div>
      </div>
    </>
  )
}
