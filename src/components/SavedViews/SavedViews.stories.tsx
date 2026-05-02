import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SavedViews, type ViewItem } from './index'
import { FilterBar, FilterChip } from '../FilterChip'

const meta = {
  title: '03 · Data display/Saved views',
  component: SavedViews,
  tags: ['autodocs'],
  args: {
    value: 'production',
    onChange: () => {},
    views: [],
  },
} satisfies Meta<typeof SavedViews>

export default meta
type Story = StoryObj<typeof meta>

const baseViews: ViewItem[] = [
  { id: 'all',         label: 'All',                 count: 248, locked: true },
  { id: 'production',  label: 'Production',          count: 42,  locked: true },
  { id: 'failed-24h',  label: 'Failed last 24 h',    count: 2 },
  { id: 'mine',        label: 'Owned by me',         count: 7 },
  { id: 'team',        label: 'My team',             count: 14 },
  { id: 'high-cost',   label: 'High cost',           count: 38 },
]

export const Tabs: Story = {
  render: () => {
    const [view, setView] = useState('production')
    return (
      <SavedViews
        value={view}
        onChange={setView}
        views={baseViews}
        onAdd={() => {}}
      />
    )
  },
}

export const WithDirtyState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A view becomes "dirty" when filters have been edited beyond the saved set. A subtle banner offers Discard / Save.',
      },
    },
  },
  render: () => {
    const [view, setView] = useState('production')
    return (
      <div style={{ border: '1px solid var(--color-line)', borderRadius: 10, background: 'var(--color-panel)' }}>
        <SavedViews value={view} onChange={setView} views={baseViews} onAdd={() => {}} />
        <div style={{ padding: 14, fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>Active filters from <b style={{ color: 'var(--color-text)' }}>Production</b>:</span>
          <FilterBar>
            <FilterChip variant="active" filterKey="env:" value="prod" />
            <FilterChip variant="active" filterKey="status:" value="running, degraded" />
          </FilterBar>
          <span style={{ flex: 1 }} />
          <span style={{ color: 'var(--color-text-dim)', fontSize: 11.5 }}>Modified · pin or save changes</span>
          <button className="text-xs px-2 py-0.5 rounded-xs text-text-muted cursor-pointer bg-transparent border-0 hover:text-text">Discard</button>
          <button className="text-xs px-2 py-0.5 rounded-xs cursor-pointer bg-accent text-white border-0 hover:opacity-90">Save</button>
        </div>
      </div>
    )
  },
}
