import { Table, Pill, Checkbox, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

interface Row {
  name: string
  statusTone: 'ok' | 'warn' | 'err'
  statusLabel: string
  region: string
  version: string
  reqs: string
  p95: string
}

const rows: Row[] = [
  { name: 'api-gateway',   statusTone: 'ok',   statusLabel: 'Healthy',  region: 'us-east-1', version: 'v142', reqs: '8,420',  p95: '124ms' },
  { name: 'auth-service',  statusTone: 'ok',   statusLabel: 'Healthy',  region: 'us-east-1', version: 'v88',  reqs: '2,140',  p95: '86ms'  },
  { name: 'ingest-worker', statusTone: 'warn', statusLabel: 'Degraded', region: 'us-east-1', version: 'v204', reqs: '12,800', p95: '342ms' },
  { name: 'mail-relay',    statusTone: 'err',  statusLabel: 'Failing',  region: 'us-east-1', version: 'v7',   reqs: '—',      p95: '—'     },
]

export default function TablePage() {
  return (
    <article className="page">
      <h1>Table</h1>
      <p>
        A thin styling wrapper over native <code>&lt;table&gt;</code>. You write raw{' '}
        <code>&lt;thead&gt;</code> / <code>&lt;tbody&gt;</code> / <code>&lt;tr&gt;</code> and the
        component handles borders, hover, and density. Add <code>className="mono"</code> to a cell
        for monospace tabular data.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Tabular data — resources, users, events. Not a replacement for a data-grid: no built-in
        sort, pagination, or row selection — compose those from other primitives.
      </Banner>

      <h2>Resource list</h2>
      <Demo
        code={`<Table>
  <thead>
    <tr>
      <th style={{ width: 24 }}><Checkbox /></th>
      <th>Name</th>
      <th>Status</th>
      <th>Region</th>
      <th>Version</th>
      <th>Requests/m</th>
      <th>p95</th>
    </tr>
  </thead>
  <tbody>
    {rows.map((r) => (
      <tr key={r.name}>
        <td><Checkbox /></td>
        <td>{r.name}</td>
        <td><Pill tone={r.statusTone} dot>{r.statusLabel}</Pill></td>
        <td className="mono">{r.region}</td>
        <td className="mono">{r.version}</td>
        <td className="mono">{r.reqs}</td>
        <td className="mono">{r.p95}</td>
      </tr>
    ))}
  </tbody>
</Table>`}
      >
        <div style={{ width: '100%' }}>
          <Table>
            <thead>
              <tr>
                <th style={{ width: 24 }}><Checkbox /></th>
                <th>Name</th>
                <th>Status</th>
                <th>Region</th>
                <th>Version</th>
                <th>Requests/m</th>
                <th>p95</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <td><Checkbox /></td>
                  <td>{r.name}</td>
                  <td><Pill tone={r.statusTone} dot>{r.statusLabel}</Pill></td>
                  <td className="mono">{r.region}</td>
                  <td className="mono">{r.version}</td>
                  <td className="mono">{r.reqs}</td>
                  <td className="mono">{r.p95}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Demo>

      <h2>Minimal</h2>
      <Demo
        code={`<Table>
  <thead>
    <tr><th>Key</th><th>Value</th></tr>
  </thead>
  <tbody>
    <tr><td>id</td><td className="mono">usr_8f2a1e</td></tr>
    <tr><td>email</td><td className="mono">jane@example.com</td></tr>
    <tr><td>created</td><td className="mono">2025-11-02T14:22Z</td></tr>
  </tbody>
</Table>`}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Table>
            <thead>
              <tr><th>Key</th><th>Value</th></tr>
            </thead>
            <tbody>
              <tr><td>id</td><td className="mono">usr_8f2a1e</td></tr>
              <tr><td>email</td><td className="mono">jane@example.com</td></tr>
              <tr><td>created</td><td className="mono">2025-11-02T14:22Z</td></tr>
            </tbody>
          </Table>
        </div>
      </Demo>

      <h2>Empty</h2>
      <Demo
        code={`<Table>
  <thead>
    <tr><th>Name</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr>
      <td colSpan={2} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
        No matches.
      </td>
    </tr>
  </tbody>
</Table>`}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Table>
            <thead>
              <tr><th>Name</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={2} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No matches.
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Raw <code>&lt;thead&gt;</code> / <code>&lt;tbody&gt;</code> markup.</td></tr>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Merged onto the root <code>&lt;table&gt;</code>.</td></tr>
          <tr><td>…<code>TableHTMLAttributes</code></td><td><code>TableHTMLAttributes&lt;HTMLTableElement&gt;</code></td><td>—</td><td>All standard <code>&lt;table&gt;</code> attributes.</td></tr>
        </tbody>
      </Table>

      <h2>Conventions</h2>
      <Table>
        <thead>
          <tr><th>Hook</th><th>Effect</th></tr>
        </thead>
        <tbody>
          <tr><td><code>&lt;td className="mono"&gt;</code></td><td>Monospace, smaller, dimmed — for ids, versions, timestamps, metrics.</td></tr>
          <tr><td><code>&lt;th style={'{{ width: N }}'}&gt;</code></td><td>Fix a column width (e.g. a leading checkbox column).</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
