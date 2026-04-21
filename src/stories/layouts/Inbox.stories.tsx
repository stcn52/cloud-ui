import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, Dot } from '../..'

const meta: Meta = {
  title: '08 · Layouts/Inbox',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const folders = [
  { name: 'Inbox', count: 42, active: true },
  { name: 'Alerts', count: 8 },
  { name: 'Mentions', count: 3 },
  { name: 'Archived', count: 0 },
]

const messages = [
  { from: 'PagerDuty', subject: 'High error rate · ingest-worker', preview: 'Error rate exceeded 1% for 5 consecutive minutes…', at: '14:22', unread: true, tone: 'err' as const },
  { from: 'GitHub', subject: 'PR #432: Rename getCwd to getCwd…', preview: 'maya opened a pull request in linden/api-platform', at: '13:04', unread: true },
  { from: 'Linear', subject: 'Issue INGEST-412 assigned to you', preview: 'Aditi assigned INGEST-412 · "Add retry to ingest worker"', at: '11:58' },
  { from: 'Stripe', subject: 'Invoice INV_0482 paid', preview: 'Your invoice for December was paid automatically.', at: '09:30' },
  { from: 'CI', subject: 'Build passed · api-gateway@v142', preview: 'All checks passed · 14 tests, 0 failures', at: 'Yesterday', tone: 'ok' as const },
]

export const MailList: Story = {
  render: () => (
    <div className="grid grid-cols-[200px_360px_1fr] h-[640px] bg-bg border-t border-line">
      <aside className="border-r border-line bg-panel p-3 text-sm space-y-0.5">
        {folders.map((f) => (
          <div
            key={f.name}
            className={
              f.active
                ? 'px-2 py-1.5 rounded-xs bg-accent-weak text-accent-ink font-medium flex items-center'
                : 'px-2 py-1.5 rounded-xs text-text-muted hover:bg-bg-sunk cursor-pointer flex items-center'
            }
          >
            {f.name}
            {f.count > 0 && <span className="ml-auto mono text-[10px]">{f.count}</span>}
          </div>
        ))}
      </aside>

      <div className="border-r border-line overflow-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              i === 0
                ? 'px-3 py-2.5 border-b border-line bg-accent-weak cursor-pointer'
                : 'px-3 py-2.5 border-b border-line hover:bg-bg-sunk cursor-pointer'
            }
          >
            <div className="flex items-center gap-2">
              {m.tone && <Dot tone={m.tone} />}
              <span className={m.unread ? 'text-sm font-semibold' : 'text-sm text-text-muted'}>{m.from}</span>
              <span className="text-xs text-text-dim ml-auto">{m.at}</span>
            </div>
            <div className={m.unread ? 'text-sm mt-0.5 truncate' : 'text-sm mt-0.5 text-text-muted truncate'}>
              {m.subject}
            </div>
            <div className="text-xs text-text-dim truncate mt-0.5">{m.preview}</div>
          </div>
        ))}
      </div>

      <main className="overflow-auto">
        <div className="px-6 py-4 border-b border-line flex items-center gap-3">
          <Avatar>PD</Avatar>
          <div>
            <div className="font-semibold">High error rate · ingest-worker</div>
            <div className="text-xs text-text-muted mt-0.5">PagerDuty · to: sre@linden.com · 14:22</div>
          </div>
        </div>
        <div className="p-6 text-sm leading-relaxed max-w-2xl">
          <p>Error rate exceeded 1% for 5 consecutive minutes on <span className="mono">ingest-worker</span>.</p>
          <ul className="list-disc pl-5 mt-3 space-y-1 text-text-muted">
            <li>Started: 14:17 UTC</li>
            <li>Peak error rate: 3.4%</li>
            <li>Affected region: us-east-1</li>
          </ul>
          <p className="mt-3">Consider rolling back to <span className="mono">v203</span> or scaling up the worker pool.</p>
        </div>
      </main>
    </div>
  ),
}
