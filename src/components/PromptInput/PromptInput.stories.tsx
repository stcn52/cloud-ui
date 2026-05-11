import { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PromptInput, type PromptInputHandle } from './index'
import { Button } from '../Button'

const meta = {
  title: '06 · Advanced/Prompt input',
  component: PromptInput,
  tags: ['autodocs'],
} satisfies Meta<typeof PromptInput>

export default meta
type Story = StoryObj<typeof meta>

/* ---- toolbar bits ---- */
const ToolBtn = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <button
    type="button"
    aria-label={label}
    className="inline-grid place-items-center w-7 h-7 rounded-sm border border-line text-text-muted hover:text-text hover:border-line-strong"
  >
    {children}
  </button>
)
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const SlashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
    <line x1="16" y1="4" x2="8" y2="20" />
  </svg>
)
const MicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
    <rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 19v3" />
  </svg>
)
const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)
const StopIcon = () => <span style={{ width: 10, height: 10, borderRadius: 2, background: 'currentColor', display: 'block' }} />

const FileChip = ({ name }: { name: string }) => (
  <span className="inline-flex items-center gap-1.5 px-2 h-7 rounded-sm border border-line text-xs text-text-muted">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
    {name}
  </span>
)

export const Playground: Story = {
  render: () => {
    const [v, setV] = useState('')
    const [sent, setSent] = useState<string[]>([])
    return (
      <div style={{ width: 560, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PromptInput
          value={v}
          onValueChange={setV}
          onSubmit={(text) => { setSent((s) => [...s, text]); setV('') }}
          placeholder="Type a message…  (Enter to send, Shift+Enter for newline)"
          leading={<><ToolBtn label="Attach"><PlusIcon /></ToolBtn><ToolBtn label="Commands"><SlashIcon /></ToolBtn></>}
          trailing={
            <Button size="sm" intent="primary" iconOnly aria-label="Send" disabled={!v.trim()} onClick={() => { if (v.trim()) { setSent((s) => [...s, v]); setV('') } }}>
              <SendIcon />
            </Button>
          }
        />
        {sent.length > 0 && (
          <ul className="text-sm text-text-muted flex flex-col gap-1">
            {sent.map((s, i) => <li key={i}>↳ {s}</li>)}
          </ul>
        )}
      </div>
    )
  },
}

export const QueueComposer: Story = {
  parameters: { docs: { description: { story: 'The screenshot layout — file chip in the leading slot, a status label + stop button trailing, accent focus ring around the whole shell.' } } },
  render: () => {
    const ref = useRef<PromptInputHandle>(null)
    const [running, setRunning] = useState(true)
    return (
      <div style={{ width: 640 }}>
        <PromptInput
          ref={ref}
          minRows={1}
          maxRows={6}
          placeholder="Queue another message…"
          onSubmit={() => ref.current?.clear()}
          leading={
            <>
              <ToolBtn label="Attach"><PlusIcon /></ToolBtn>
              <ToolBtn label="Commands"><SlashIcon /></ToolBtn>
              <span className="w-px h-5 bg-line mx-0.5" />
              <FileChip name="TicketDetail.stories.tsx" />
            </>
          }
          trailing={
            <>
              <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Auto mode
              </span>
              <Button
                size="sm"
                intent={running ? 'danger' : 'primary'}
                iconOnly
                aria-label={running ? 'Stop' : 'Send'}
                onClick={() => setRunning((r) => !r)}
              >
                {running ? <StopIcon /> : <SendIcon />}
              </Button>
            </>
          }
        />
      </div>
    )
  },
}

export const CmdEnter: Story = {
  parameters: { docs: { description: { story: '`submitOn="cmd-enter"` — plain Enter inserts a newline, ⌘/Ctrl+Enter submits. Good for longer prompts.' } } },
  render: () => {
    const [last, setLast] = useState<string>('')
    return (
      <div style={{ width: 560, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PromptInput
          submitOn="cmd-enter"
          minRows={3}
          placeholder="Write a longer prompt…  (⌘/Ctrl+Enter to send)"
          onSubmit={setLast}
          leading={<ToolBtn label="Attach"><PlusIcon /></ToolBtn>}
          trailing={<Button size="sm" intent="primary">Send</Button>}
        />
        {last && <div className="text-sm text-text-muted">last submitted: <code>{last.slice(0, 60)}</code></div>}
      </div>
    )
  },
}

export const WithMic: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <PromptInput
        placeholder="Ask anything…"
        leading={<ToolBtn label="Attach"><PlusIcon /></ToolBtn>}
        trailing={
          <>
            <ToolBtn label="Voice"><MicIcon /></ToolBtn>
            <Button size="sm" intent="primary" iconOnly aria-label="Send"><SendIcon /></Button>
          </>
        }
      />
    </div>
  ),
}
