import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MentionPopover, type MentionItem } from './index'

const meta = {
  title: '07 · More/Mention popover',
  component: MentionPopover,
  tags: ['autodocs'],
  args: { items: [] },
} satisfies Meta<typeof MentionPopover>

export default meta
type Story = StoryObj<typeof meta>

const Letter = ({ c, hue }: { c: string; hue: number }) => (
  <span style={{ width: 18, height: 18, borderRadius: '50%', display: 'inline-grid', placeItems: 'center', fontSize: 10, fontWeight: 600, color: `oklch(0.35 0.1 ${hue})`, background: `oklch(0.92 0.05 ${hue})` }}>{c}</span>
)

const people: MentionItem[] = [
  { value: 'alex',   label: '@alex',   description: 'Alex Chen',    icon: <Letter c="A" hue={290} /> },
  { value: 'bri',    label: '@bri',    description: 'Bri Tanaka',   icon: <Letter c="B" hue={60} /> },
  { value: 'cal',    label: '@cal',    description: 'Cal Robinson', icon: <Letter c="C" hue={150} /> },
  { value: 'dee',    label: '@dee',    description: 'Dee Patel',    icon: <Letter c="D" hue={350} /> },
  { value: 'backend-dev', label: '@backend-dev', description: 'team',   icon: <Letter c="#" hue={230} /> },
  { value: 'qa-mia', label: '@qa-mia', description: 'QA',           icon: <Letter c="M" hue={350} /> },
]

export const Playground: Story = {
  render: () => {
    const [v, setV] = useState('Hey ')
    const [mentioned, setMentioned] = useState<string[]>([])
    return (
      <div style={{ width: 480, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MentionPopover
          items={people}
          value={v}
          onValueChange={setV}
          onMention={(it) => setMentioned((m) => [...new Set([...m, it.value])])}
          rows={4}
          placeholder="Type a comment… use @ to mention a teammate"
        />
        <div className="text-xs text-text-muted">mentioned: {mentioned.length ? mentioned.map((m) => `@${m}`).join(', ') : '(none)'}</div>
      </div>
    )
  },
}

export const CustomTrigger: Story = {
  parameters: { docs: { description: { story: 'Use a different trigger char (here `#` for issues / channels).' } } },
  render: () => {
    const [v, setV] = useState('Linked to ')
    const issues: MentionItem[] = [
      { value: '1842', label: '#1842', description: 'auth system' },
      { value: '1850', label: '#1850', description: 'rollback plan' },
      { value: '1903', label: '#1903', description: 'flaky test' },
    ]
    return (
      <div style={{ width: 420 }}>
        <MentionPopover items={issues} value={v} onValueChange={setV} trigger="#" rows={3} placeholder="Reference an issue with #…" />
      </div>
    )
  },
}

export const Uncontrolled: Story = {
  render: () => (
    <div style={{ width: 460 }}>
      <MentionPopover items={people} defaultValue="" rows={3} />
    </div>
  ),
}
