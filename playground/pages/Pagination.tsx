import { useState } from 'react'
import { Button, Pagination } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function PaginationPage() {
  const [page, setPage] = useState(1)

  return (
    <>
      <PageHeader
        kicker="04 · Navigation"
        title="Pagination"
        lede="Numbered for known totals, cursor (Load more) for streams. Never auto-scroll — operators want to stay where they clicked."
      />

      <div className="demo">
        <div className="demo-label">Numbered</div>
        <div className="demo-body" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 14 }}>
          <div className="spread">
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
              Showing {(page - 1) * 25 + 1}–{Math.min(page * 25, 482)} of 482
            </span>
            <Pagination page={page} total={20} onChange={setPage} />
          </div>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">Cursor · load more</div>
        <div className="demo-body">
          <div className="spread" style={{ width: '100%' }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
              Loaded 120 events
            </span>
            <Button size="sm">Load more ↓</Button>
          </div>
        </div>
      </div>
    </>
  )
}
