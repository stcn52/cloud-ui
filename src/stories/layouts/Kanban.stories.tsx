import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, Card, Pill } from '../..'

const meta: Meta = {
  title: '08 · Layouts/Kanban board',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

interface Task {
  id: string
  title: string
  priority?: 'high' | 'low'
  tags?: string[]
  owner: string
}

const columns: { title: string; tone: 'neutral' | 'info' | 'warn' | 'ok'; tasks: Task[] }[] = [
  {
    title: 'Backlog',
    tone: 'neutral',
    tasks: [
      { id: 'INGEST-412', title: 'Add retry with jitter to ingest worker', owner: 'MC' },
      { id: 'BILL-88', title: 'Meter GB-sec for functions', owner: 'JP' },
      { id: 'DOCS-31', title: 'Write theming guide', tags: ['docs'], owner: 'AP' },
    ],
  },
  {
    title: 'In progress',
    tone: 'info',
    tasks: [
      { id: 'AUTH-204', title: 'SSO via Okta SAML', priority: 'high', owner: 'MC' },
      { id: 'UI-58', title: 'Redesign settings nav', owner: 'TW' },
    ],
  },
  {
    title: 'Review',
    tone: 'warn',
    tasks: [
      { id: 'API-142', title: 'Paginate /v1/events endpoint', owner: 'JK' },
    ],
  },
  {
    title: 'Done',
    tone: 'ok',
    tasks: [
      { id: 'DEPLOY-7', title: 'Blue/green for api-gateway', owner: 'MC' },
      { id: 'SEC-12', title: 'Rotate secrets in eu-west-1', owner: 'JP' },
    ],
  },
]

export const Board: Story = {
  render: () => (
    <div className="p-4 bg-bg min-h-[640px] overflow-auto">
      <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
        {columns.map((col) => (
          <div key={col.title} className="w-72 flex flex-col gap-2">
            <div className="flex items-center gap-2 px-2 py-1">
              <Pill tone={col.tone} dot>{col.title}</Pill>
              <span className="mono text-xs text-text-dim">{col.tasks.length}</span>
              <span style={{ flex: 1 }} />
              <button className="text-text-dim hover:text-text text-sm">+</button>
            </div>
            <div className="space-y-2">
              {col.tasks.map((t) => (
                <Card key={t.id}>
                  <div className="p-3">
                    <div className="text-[10px] mono text-text-dim uppercase tracking-wider">{t.id}</div>
                    <div className="text-sm mt-1">{t.title}</div>
                    <div className="flex items-center gap-1 mt-2">
                      {t.priority === 'high' && <Pill tone="err" mono>high</Pill>}
                      {t.tags?.map((tag) => <Pill key={tag} mono>{tag}</Pill>)}
                      <span style={{ flex: 1 }} />
                      <Avatar size="sm">{t.owner}</Avatar>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}
