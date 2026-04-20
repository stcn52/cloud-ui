import { CopyField } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function CopyFieldPage() {
  return (
    <>
      <PageHeader
        kicker="06 · Advanced"
        title="Copy-to-clipboard"
        lede="One-click copy for IDs, keys, and connection strings. Brief success state confirms the copy without a toast."
      />

      <div className="demo">
        <div className="demo-label">IDs & secrets</div>
        <div className="demo-body" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <div className="row" style={{ gap: 12 }}>
            <span style={{ width: 80, fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
              Service ID
            </span>
            <CopyField value="svc_8f2a10e47c9b">svc_8f2a10e47c9b</CopyField>
          </div>

          <div className="row" style={{ gap: 12 }}>
            <span style={{ width: 80, fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
              API key
            </span>
            <CopyField value="nc_live_abc123K7qZ">nc_live_••••••••••••K7qZ</CopyField>
          </div>

          <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
            <span style={{ width: 80, marginTop: 4, fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
              Connection
            </span>
            <div
              style={{
                background: 'var(--bg-sunk)',
                border: '1px solid var(--line)',
                borderRadius: 6,
                padding: '10px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: 11.5,
                color: 'var(--text)',
                position: 'relative',
                minWidth: 420,
              }}
            >
              <div style={{ color: 'var(--text-dim)', marginBottom: 4 }}>$ psql</div>
              <div>postgres://maya:••••@db.linden.cloud:5432/events_db</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
