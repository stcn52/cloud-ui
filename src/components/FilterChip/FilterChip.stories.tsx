import type { Meta, StoryObj } from '@storybook/react-vite'
import { FilterBar, FilterChip } from './index'

const meta = {
  title: '03 · Data display/Filter chip',
  component: FilterChip,
  tags: ['autodocs'],
} satisfies Meta<typeof FilterChip>

export default meta
type Story = StoryObj<typeof meta>

const errIcon = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12" y2="16" />
  </svg>
)

export const Variants: Story = {
  render: () => (
    <FilterBar>
      <FilterChip variant="add">+ Filter</FilterChip>
      <FilterChip>env</FilterChip>
      <FilterChip variant="active" filterKey="env:" value="prod" onRemove={() => {}} />
      <FilterChip variant="active" filterKey="status:" value="running" onRemove={() => {}} />
      <FilterChip variant="active" filterKey="region:" value="us-east-1, eu-west-2 +1" onRemove={() => {}} />
      <FilterChip count={14}>Active</FilterChip>
      <FilterChip variant="active" count={2}>Failed</FilterChip>
      <FilterChip variant="active" filterKey="cost >" value="$50/mo" onRemove={() => {}} />
      <FilterChip variant="active" filterKey="created:" value="Apr 1 → Apr 30" onRemove={() => {}} />
    </FilterBar>
  ),
}

export const Operators: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Operator chips for numeric & date filters. The operator (`>=`, `in`, `<`, `~`) is part of the key, the right side is the literal value.',
      },
    },
  },
  render: () => (
    <FilterBar>
      <FilterChip variant="active" filterKey="cpu >=" value="80 %" onRemove={() => {}} />
      <FilterChip variant="active" filterKey="mem in" value="[40, 90]" onRemove={() => {}} />
      <FilterChip variant="active" filterKey="latency <" value="120 ms" onRemove={() => {}} />
      <FilterChip variant="active" filterKey="tag has" value="team:platform" onRemove={() => {}} />
      <FilterChip variant="active" filterKey="created >" value="last 7 d" onRemove={() => {}} />
      <FilterChip variant="active" filterKey="name ~" value="api-*" onRemove={() => {}} />
    </FilterBar>
  ),
}

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Disabled (filter the user can\'t edit), invalid (bad syntax), and the standard active state.',
      },
    },
  },
  render: () => (
    <FilterBar>
      <FilterChip disabled filterKey="env:" value="staging" onRemove={() => {}} />
      <FilterChip variant="active" filterKey="team:" value="platform" onRemove={() => {}} />
      <FilterChip variant="invalid" filterKey="cost" value="invalid syntax" onRemove={() => {}}>
        {errIcon}
      </FilterChip>
    </FilterBar>
  ),
}

export const FilterBarChipOnly: Story = {
  name: 'FilterBar · chip-only',
  parameters: {
    docs: {
      description: {
        story: 'The cheapest layout — pure chips. Used most often in dense list-page toolbars where every pixel of horizontal space matters.',
      },
    },
  },
  render: () => (
    <FilterBar style={{ padding: 8, border: '1px solid var(--color-line)', borderRadius: 8, background: 'var(--color-panel)' }}>
      <FilterChip variant="active" filterKey="env:" value="prod" onRemove={() => {}} />
      <FilterChip variant="active" filterKey="status:" value="running" onRemove={() => {}} />
      <FilterChip variant="active" filterKey="region:" value="us-east-1" onRemove={() => {}} />
      <FilterChip variant="add">+ Filter</FilterChip>
      <span style={{ flex: 1 }} />
      <button className="text-xs px-2 py-0.5 rounded-xs text-text-dim cursor-pointer bg-transparent border-0 hover:text-text">Clear all</button>
      <button className="text-xs px-2 py-0.5 rounded-xs cursor-pointer border border-line bg-bg-elev text-text-muted hover:bg-bg-sunk">Save view</button>
    </FilterBar>
  ),
}
