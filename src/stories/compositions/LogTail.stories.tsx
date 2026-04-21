import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Dot, LogLine, Pill } from '../..'

const meta: Meta = {
  title: '07 · Compositions/Log tail',
  parameters: {
    docs: {
      description: {
        component: 'Live tailing terminal + filter chips + severity counts — the debugging surface.',
      },
    },
  },
}
export default meta
type Story = StoryObj

const logs: { ts: string; level: 'info' | 'warn' | 'err' | 'ok'; msg: string }[] = [
  { ts: '14:22:01', level: 'info', msg: 'GET /v1/users/me 200 · 42ms · usr_8f2a' },
  { ts: '14:22:01', level: 'info', msg: 'POST /v1/auth/token 200 · 88ms' },
  { ts: '14:22:02', level: 'warn', msg: 'rate_limit: 80% bucket consumed for org_482' },
  { ts: '14:22:03', level: 'err', msg: 'upstream timeout: db.primary (2000ms exceeded) req_a81c' },
  { ts: '14:22:03', level: 'ok', msg: 'deploy: api-gateway@v142 → us-east-1 complete' },
  { ts: '14:22:05', level: 'warn', msg: 'slow_query: SELECT … FROM events WHERE (1.8s)' },
  { ts: '14:22:07', level: 'err', msg: 'unhandled: NullPointerException at Handler.java:182' },
]

export const LiveStream: Story = {
  render: () => (
    <div className="border border-line rounded-md overflow-hidden" style={{ width: 900 }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-line bg-panel">
        <Dot tone="ok" style={{ animation: 'pulse 2s infinite' }} />
        <span className="mono text-xs">live · api-gateway</span>
        <div className="flex gap-1 ml-4">
          <Pill tone="err" mono>24 err</Pill>
          <Pill tone="warn" mono>138 warn</Pill>
          <Pill tone="info" mono>4,802 info</Pill>
        </div>
        <div style={{ flex: 1 }} />
        <Pill mono onRemove={() => {}}>level:ERROR</Pill>
        <Button size="sm" intent="ghost">pause</Button>
        <Button size="sm" intent="ghost">clear</Button>
      </div>
      <div className="bg-bg-sunk py-1.5 max-h-[320px] overflow-auto">
        {logs.map((l, i) => (
          <LogLine key={i} level={l.level} timestamp={l.ts} message={l.msg} />
        ))}
      </div>
    </div>
  ),
}
