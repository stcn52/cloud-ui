import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Pill, Segmented } from '../..'
import { useState } from 'react'

const meta: Meta = {
  title: '08 · Layouts/Calendar',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface Ev {
  tone: 'info' | 'warn' | 'err' | 'ok'
  label: string
}
const events: Record<number, Ev[]> = {
  3: [{ tone: 'info', label: 'Deploy window' }],
  10: [{ tone: 'ok', label: 'Release v2.4' }],
  14: [
    { tone: 'info', label: 'Deploy window' },
    { tone: 'warn', label: 'DB maintenance' },
  ],
  18: [{ tone: 'err', label: 'Freeze starts' }],
  22: [{ tone: 'info', label: 'Deploy window' }],
  28: [{ tone: 'ok', label: 'Retro · platform' }],
}

const cells = Array.from({ length: 42 }, (_, i) => {
  // 2 leading-dim placeholders, then 31 days of March, rest trailing-dim
  const day = i - 2
  const inMonth = day >= 1 && day <= 31
  const display = inMonth ? day : day <= 0 ? 27 + day : day - 31
  return { display, inMonth }
})

export const Month: Story = {
  render: () => {
    const [view, setView] = useState<'month' | 'week'>('month')
    return (
      <div className="p-5 bg-bg min-h-[640px]">
        <div className="flex items-center gap-3 mb-4">
          <Button size="sm" intent="ghost">‹</Button>
          <h2 className="text-xl font-semibold tracking-tight">March 2026</h2>
          <Button size="sm" intent="ghost">›</Button>
          <Button size="sm">Today</Button>
          <div style={{ flex: 1 }} />
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: 'month', label: 'Month' },
              { value: 'week', label: 'Week' },
            ]}
          />
          <Button size="sm" intent="primary">+ Event</Button>
        </div>

        <div className="grid grid-cols-7 border-l border-t border-line">
          {DOW.map((d) => (
            <div
              key={d}
              className="px-2 py-1.5 border-r border-b border-line bg-panel text-[10px] uppercase tracking-wider text-text-muted mono"
            >
              {d}
            </div>
          ))}
          {cells.map((c, i) => {
            const evs = c.inMonth ? events[c.display] ?? [] : []
            return (
              <div
                key={i}
                className={
                  c.inMonth
                    ? 'min-h-[96px] px-2 py-1.5 border-r border-b border-line text-xs'
                    : 'min-h-[96px] px-2 py-1.5 border-r border-b border-line text-xs bg-bg-sunk text-text-dim'
                }
              >
                <div className="mono text-[11px] text-text-muted">{c.display}</div>
                <div className="mt-1 space-y-1">
                  {evs.map((e, j) => (
                    <Pill key={j} tone={e.tone} dot>
                      <span className="truncate">{e.label}</span>
                    </Pill>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
}
