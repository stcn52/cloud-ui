import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Popover, PopoverItem, PopoverSeparator } from './index'

const meta = {
  title: '05 · Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: { trigger: <button>trigger</button>, content: null },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

const iconPlus = <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
const iconDeploy = <svg viewBox="0 0 24 24"><polyline points="16 12 12 8 8 12" /><line x1="12" y1="16" x2="12" y2="8" /></svg>
const iconTrash = (
  <svg viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M6 6l1 14h10l1-14" />
  </svg>
)

export const RowActions: Story = {
  render: () => (
    <Popover
      trigger={
        <Button iconOnly>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="5" cy="12" r="1.2" />
            <circle cx="12" cy="12" r="1.2" />
            <circle cx="19" cy="12" r="1.2" />
          </svg>
        </Button>
      }
      content={
        <>
          <PopoverItem icon={iconPlus} shortcut="⌘D">Duplicate</PopoverItem>
          <PopoverItem icon={iconDeploy} shortcut="⌘↵">Deploy</PopoverItem>
          <PopoverSeparator />
          <PopoverItem icon={iconTrash} shortcut="⌫" danger>Delete</PopoverItem>
        </>
      }
    />
  ),
}
