import type { Meta, StoryObj } from '@storybook/react-vite'
import { LogLine } from './index'

const meta = {
  title: '03 · Data display/LogLine',
  component: LogLine,
  tags: ['autodocs'],
  args: {
    level: 'info',
    timestamp: '14:22:01',
    message: 'GET /v1/users/me 200 · 42ms · usr_8f2a',
  },
  argTypes: {
    level: { control: 'select', options: ['info', 'warn', 'err', 'ok'] },
  },
} satisfies Meta<typeof LogLine>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

interface Entry { ts: string; level: 'info' | 'warn' | 'err' | 'ok'; msg: string }
const logs: Entry[] = [
  { ts: '14:22:01', level: 'info', msg: 'GET /v1/users/me 200 · 42ms · usr_8f2a' },
  { ts: '14:22:02', level: 'warn', msg: 'rate_limit: 80% bucket consumed for org_482' },
  { ts: '14:22:03', level: 'err', msg: 'upstream timeout: db.primary (2000ms exceeded) req_a81c' },
  { ts: '14:22:03', level: 'ok', msg: 'deploy: api-gateway@v142 → us-east-1 complete' },
  { ts: '14:22:05', level: 'warn', msg: 'slow_query: SELECT … FROM events WHERE (1.8s)' },
  { ts: '14:22:07', level: 'err', msg: 'unhandled: NullPointerException at Handler.java:182' },
]

export const Stream: Story = {
  render: () => (
    <div style={{ background: 'var(--color-bg-sunk)', padding: '6px 0', maxHeight: 260, overflow: 'auto' }}>
      {logs.map((l, i) => (
        <LogLine key={i} level={l.level} timestamp={l.ts} message={l.msg} />
      ))}
    </div>
  ),
}
