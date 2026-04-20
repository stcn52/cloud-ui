import { useState } from 'react'
import { DatePicker, type DateRange } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

function fmt(d: Date) {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function DatePickerPage() {
  const [single, setSingle] = useState<Date | null>(null)
  const [range, setRange] = useState<DateRange | null>(null)

  return (
    <>
      <PageHeader
        kicker="06 · Advanced"
        title="Date picker"
        lede="Single-month calendar; supports single-date and range modes. Navigate months with arrows or keyboard."
      />

      <div className="demo">
        <div className="demo-label">Single date</div>
        <div className="demo-body" style={{ gap: 24, alignItems: 'flex-start' }}>
          <DatePicker value={single} onChange={(v) => setSingle(v as Date | null)} />
          <div className="mono" style={{ fontSize: 12 }}>
            Picked: {single ? fmt(single) : <span style={{ color: 'var(--text-dim)' }}>none</span>}
          </div>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">Range</div>
        <div className="demo-body" style={{ gap: 24, alignItems: 'flex-start' }}>
          <DatePicker mode="range" value={range} onChange={(v) => setRange(v as DateRange | null)} />
          <div className="mono" style={{ fontSize: 12 }}>
            Picked:{' '}
            {range ? (
              <>
                {fmt(range[0])} → {fmt(range[1])}
              </>
            ) : (
              <span style={{ color: 'var(--text-dim)' }}>none</span>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
