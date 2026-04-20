import { Button, Dot, LogLine, Pill } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

interface Entry {
  ts: string
  level: 'info' | 'warn' | 'err' | 'ok'
  msg: string
}

const logs: Entry[] = [
  { ts: '14:22:01', level: 'info', msg: 'GET /v1/users/me 200 · 42ms · usr_8f2a' },
  { ts: '14:22:01', level: 'info', msg: 'POST /v1/auth/token 200 · 88ms' },
  { ts: '14:22:02', level: 'warn', msg: 'rate_limit: 80% bucket consumed for org_482' },
  { ts: '14:22:02', level: 'info', msg: 'GET /v1/projects 200 · 12ms' },
  { ts: '14:22:03', level: 'err', msg: 'upstream timeout: db.primary (2000ms exceeded) req_a81c' },
  { ts: '14:22:03', level: 'ok', msg: 'deploy: api-gateway@v142 → us-east-1 complete (2m 14s)' },
  { ts: '14:22:04', level: 'info', msg: 'GET /v1/metrics 200 · 34ms' },
  { ts: '14:22:04', level: 'info', msg: 'POST /v1/events 200 · 19ms · batch=120' },
  { ts: '14:22:05', level: 'warn', msg: 'slow_query: SELECT … FROM events WHERE (1.8s)' },
  { ts: '14:22:05', level: 'info', msg: 'GET /v1/users 200 · 8ms · cache=HIT' },
  { ts: '14:22:06', level: 'info', msg: 'POST /v1/webhooks/stripe 200 · 240ms' },
  { ts: '14:22:07', level: 'err', msg: 'unhandled: NullPointerException at Handler.java:182' },
]

export function LogsPage() {
  return (
    <>
      <PageHeader
        kicker="03 · Data display"
        title="Logs"
        lede="Dense monospace log viewer. One line per event — timestamp, level tag, message. Four levels drive color; everything else stays neutral."
      />

      <div className="demo">
        <div className="demo-label">Streaming viewer</div>
        <div className="demo-body plain" style={{ padding: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '1px solid var(--line)', background: 'var(--panel)' }}>
            <div className="row">
              <Dot tone="ok" style={{ animation: 'pulse 2s infinite' }} />
              <span className="mono" style={{ fontSize: 11 }}>
                live · api-gateway
              </span>
            </div>
            <div className="row">
              <Pill mono onRemove={() => {}}>
                level:ERROR
              </Pill>
              <Button size="sm" intent="ghost">
                pause
              </Button>
              <Button size="sm" intent="ghost">
                clear
              </Button>
            </div>
          </div>

          <div style={{ background: 'var(--bg-sunk)', padding: '6px 0', maxHeight: 260, overflowY: 'auto' }}>
            {logs.map((l, i) => (
              <LogLine key={i} level={l.level} timestamp={l.ts} message={l.msg} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
