import {
  Affix,
  Button,
  Checkbox,
  Input,
  InputGroup,
  Pill,
  Table,
} from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

interface Row {
  name: string
  statusTone: 'ok' | 'warn' | 'err'
  statusLabel: string
  region: string
  version: string
  reqs: string
  p95: string
  cost: string
}

const rows: Row[] = [
  { name: 'api-gateway', statusTone: 'ok', statusLabel: 'Healthy', region: 'us-east-1', version: 'v142', reqs: '8,420', p95: '124ms', cost: '$840' },
  { name: 'auth-service', statusTone: 'ok', statusLabel: 'Healthy', region: 'us-east-1', version: 'v88', reqs: '2,140', p95: '86ms', cost: '$210' },
  { name: 'ingest-worker', statusTone: 'warn', statusLabel: 'Degraded', region: 'us-east-1', version: 'v204', reqs: '12,800', p95: '342ms', cost: '$620' },
  { name: 'billing-sync', statusTone: 'ok', statusLabel: 'Healthy', region: 'eu-west-1', version: 'v12', reqs: '84', p95: '1.2s', cost: '$48' },
  { name: 'mail-relay', statusTone: 'err', statusLabel: 'Failing', region: 'us-east-1', version: 'v7', reqs: '—', p95: '—', cost: '$12' },
  { name: 'cdn-edge', statusTone: 'ok', statusLabel: 'Healthy', region: 'global', version: 'v91', reqs: '44,220', p95: '12ms', cost: '$1,210' },
  { name: 'analytics-etl', statusTone: 'ok', statusLabel: 'Healthy', region: 'us-east-1', version: 'v36', reqs: '320', p95: '4.8s', cost: '$380' },
]

export function TablePage() {
  return (
    <>
      <PageHeader
        kicker="03 · Data display"
        title="Table"
        lede="Dense by default: 34px rows, 13px body, tabular mono numerals, 1px rule between rows."
      />

      <div className="demo">
        <div className="demo-label">Resource list</div>
        <div className="demo-body plain" style={{ padding: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
            <div className="row">
              <div style={{ width: 260 }}>
                <InputGroup>
                  <Affix>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="11" cy="11" r="7" />
                      <path d="M21 21l-4-4" />
                    </svg>
                  </Affix>
                  <Input size="sm" placeholder="Filter 48 services…" />
                </InputGroup>
              </div>
              <Pill mono onRemove={() => {}}>
                env:prod
              </Pill>
              <Pill mono onRemove={() => {}}>
                region:us-east-1
              </Pill>
              <Button size="sm" intent="ghost">
                + filter
              </Button>
            </div>
            <div className="row">
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                48 items
              </span>
              <Button size="sm">Export</Button>
              <Button size="sm" intent="primary">
                + New
              </Button>
            </div>
          </div>

          <Table>
            <thead>
              <tr>
                <th style={{ width: 24 }}>
                  <Checkbox />
                </th>
                <th>Name</th>
                <th>Status</th>
                <th>Region</th>
                <th>Version</th>
                <th>Requests/m</th>
                <th>p95</th>
                <th>Cost</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <td>
                    <Checkbox />
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={1.5}>
                        <rect x="3" y="4" width="18" height="6" rx="1" />
                        <rect x="3" y="14" width="18" height="6" rx="1" />
                      </svg>
                      {r.name}
                    </span>
                  </td>
                  <td>
                    <Pill tone={r.statusTone} dot>
                      {r.statusLabel}
                    </Pill>
                  </td>
                  <td className="mono">{r.region}</td>
                  <td className="mono">{r.version}</td>
                  <td className="mono num" style={{ color: 'var(--text)' }}>
                    {r.reqs}
                  </td>
                  <td className="mono num">{r.p95}</td>
                  <td className="mono num">{r.cost}</td>
                  <td>
                    <Button iconOnly size="xs" intent="ghost">
                      ⋯
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderTop: '1px solid var(--line)', background: 'var(--panel)' }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
              Showing 1–7 of 48
            </span>
            <div className="pagination">
              <Button size="sm" intent="ghost">
                ‹
              </Button>
              <Button size="sm" className="on">
                1
              </Button>
              <Button size="sm" intent="ghost">
                2
              </Button>
              <Button size="sm" intent="ghost">
                3
              </Button>
              <span>…</span>
              <Button size="sm" intent="ghost">
                7
              </Button>
              <Button size="sm" intent="ghost">
                ›
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
