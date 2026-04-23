import { LogLine, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const stream = [
  { ts: '14:22:01', level: 'info' as const, msg: 'GET /v1/users/me 200 · 42ms · usr_8f2a' },
  { ts: '14:22:02', level: 'warn' as const, msg: 'rate_limit: 80% bucket consumed for org_482' },
  { ts: '14:22:03', level: 'err'  as const, msg: 'upstream timeout: db.primary (2000ms exceeded) req_a81c' },
  { ts: '14:22:03', level: 'ok'   as const, msg: 'deploy: api-gateway@v142 → us-east-1 complete' },
  { ts: '14:22:05', level: 'warn' as const, msg: 'slow_query: SELECT … FROM events WHERE (1.8s)' },
  { ts: '14:22:07', level: 'err'  as const, msg: 'unhandled: NullPointerException at Handler.java:182' },
]

export default function LogLinePage() {
  return (
    <article className="page">
      <h1>LogLine</h1>
      <p>
        A single monospace log row with a fixed 3-column grid: timestamp · level · message. Stack
        them inside a scroll container to get a viewer.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Terminal-ish log streams, audit trails, event feeds where density matters. For rich
        structured rows (expandable JSON, filters, highlighting) build on top of <code>Table</code>{' '}
        instead.
      </Banner>

      <h2>Levels</h2>
      <Demo
        code={`<LogLine level="info" timestamp="14:22:01" message="GET /v1/users/me 200 · 42ms" />
<LogLine level="ok"   timestamp="14:22:03" message="deploy: api-gateway@v142 complete" />
<LogLine level="warn" timestamp="14:22:02" message="rate_limit: 80% bucket consumed" />
<LogLine level="err"  timestamp="14:22:03" message="upstream timeout: db.primary" />`}
      >
        <div style={{ width: '100%', background: 'var(--color-bg-sunk)', padding: '6px 0' }}>
          <LogLine level="info" timestamp="14:22:01" message="GET /v1/users/me 200 · 42ms" />
          <LogLine level="ok"   timestamp="14:22:03" message="deploy: api-gateway@v142 complete" />
          <LogLine level="warn" timestamp="14:22:02" message="rate_limit: 80% bucket consumed" />
          <LogLine level="err"  timestamp="14:22:03" message="upstream timeout: db.primary" />
        </div>
      </Demo>

      <h2>Stream</h2>
      <Demo
        code={`<div style={{ background: 'var(--color-bg-sunk)', padding: '6px 0', maxHeight: 200, overflow: 'auto' }}>
  {logs.map((l, i) => (
    <LogLine key={i} level={l.level} timestamp={l.ts} message={l.msg} />
  ))}
</div>`}
      >
        <div
          style={{
            width: '100%',
            background: 'var(--color-bg-sunk)',
            padding: '6px 0',
            maxHeight: 200,
            overflow: 'auto',
          }}
        >
          {stream.map((l, i) => (
            <LogLine key={i} level={l.level} timestamp={l.ts} message={l.msg} />
          ))}
        </div>
      </Demo>

      <h2>Message as children</h2>
      <p>
        If you need inline markup inside the message, pass it as <code>children</code> instead of
        the <code>message</code> prop.
      </p>
      <Demo
        code={`<LogLine level="info" timestamp="14:22:01">
  GET <code>/v1/users/me</code> <strong>200</strong> · 42ms
</LogLine>`}
      >
        <div style={{ width: '100%', background: 'var(--color-bg-sunk)', padding: '6px 0' }}>
          <LogLine level="info" timestamp="14:22:01">
            GET <code>/v1/users/me</code> <strong>200</strong> · 42ms
          </LogLine>
        </div>
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>level</code></td><td><code>'info' | 'ok' | 'warn' | 'err'</code></td><td>—</td><td>Required. Color-codes the level label.</td></tr>
          <tr><td><code>timestamp</code></td><td><code>ReactNode</code></td><td>—</td><td>First column. Free-form — string, <code>&lt;time&gt;</code>, etc.</td></tr>
          <tr><td><code>message</code></td><td><code>ReactNode</code></td><td>—</td><td>Third column. Falls back to <code>children</code> when omitted.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Used as the message when <code>message</code> is not provided.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
