import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Input, Segmented } from '../..'
import { useState } from 'react'

const meta: Meta = {
  title: '07 · Compositions/Filter toolbar',
  parameters: {
    docs: {
      description: {
        component:
          'Search + saved view + active-filter chips + right-side actions. Standard header for any list screen.',
      },
    },
  },
}
export default meta
type Story = StoryObj

const searchIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-dim)" strokeWidth={1.7}
    style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const exportIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

function Chip({ active, children }: { active?: boolean; children: React.ReactNode }) {
  const base = 'inline-flex items-center gap-1.5 px-2 py-1 rounded-xs text-xs border cursor-pointer'
  return (
    <div
      className={
        active
          ? `${base} border-accent bg-accent-weak text-accent-ink`
          : `${base} border-line text-text-muted hover:bg-bg-sunk`
      }
    >
      {children}
    </div>
  )
}

export const InstanceList: Story = {
  render: () => {
    const [seg, setSeg] = useState<'all' | 'running' | 'stopped' | 'failed'>('all')
    return (
      <div className="border border-line rounded-md overflow-hidden bg-bg-elev" style={{ width: 900 }}>
        <div className="flex items-center gap-2 px-3.5 py-2 border-b border-line flex-wrap">
          <Segmented
            value={seg}
            onChange={setSeg}
            options={[
              { value: 'all', label: 'All' },
              { value: 'running', label: <>Running <span className="text-text-dim">24</span></> },
              { value: 'stopped', label: 'Stopped' },
              { value: 'failed', label: 'Failed' },
            ]}
          />
          <div style={{ position: 'relative', width: 240 }}>
            {searchIcon}
            <Input size="sm" placeholder="Search by name, IP, tag…" style={{ paddingLeft: 28 }} />
          </div>
          <Chip active>Region: <b>us-east-1</b> <span style={{ opacity: 0.5 }}>✕</span></Chip>
          <Chip active>Status: <b>Healthy</b> <span style={{ opacity: 0.5 }}>✕</span></Chip>
          <Chip>+ Add filter</Chip>
          <div className="grow" style={{ flex: 1 }} />
          <Button size="sm" intent="ghost">{exportIcon} Export</Button>
          <Button size="sm" intent="ghost">Save view</Button>
          <Button size="sm" intent="primary">+ New instance</Button>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1 text-[11.5px] text-text-dim bg-bg">
          <span className="mono">24 of 312 shown</span>
          <span>·</span>
          <a href="#" className="text-accent-ink underline">clear filters</a>
          <div style={{ flex: 1 }} />
          <span className="mono">Sort:</span>
          <Button size="xs" intent="ghost">name ↑</Button>
          <span className="text-line-strong">|</span>
          <Segmented
            value={'list' as 'list' | 'grid'}
            onChange={() => {}}
            options={[
              { value: 'list', label: '☰' },
              { value: 'grid', label: '▦' },
            ]}
          />
        </div>
      </div>
    )
  },
}
