import { useRef, useState } from 'react'
import { PromptInput, type PromptInputHandle, Button, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function BasicPromptDemo() {
  const [value, setValue] = useState('')
  const [sent, setSent] = useState<string[]>([])
  return (
    <div style={{ width: 520, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <PromptInput
        value={value}
        onValueChange={setValue}
        onSubmit={(text) => {
          setSent((s) => [...s, text])
          setValue('')
        }}
        placeholder="Type a message…  (Enter to send, Shift+Enter for newline)"
        trailing={
          <Button size="sm" intent="primary" disabled={!value.trim()} onClick={() => { if (value.trim()) { setSent((s) => [...s, value]); setValue('') } }}>
            Send
          </Button>
        }
      />
      {sent.length > 0 && (
        <ul style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: 4, margin: 0, paddingLeft: 16 }}>
          {sent.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      )}
    </div>
  )
}

function ToolbarPromptDemo() {
  const ref = useRef<PromptInputHandle>(null)
  return (
    <div style={{ width: 560 }}>
      <PromptInput
        ref={ref}
        minRows={1}
        maxRows={6}
        placeholder="Queue another message…"
        onSubmit={() => ref.current?.clear()}
        leading={
          <>
            <Button size="xs" intent="ghost" iconOnly aria-label="Attach">+</Button>
            <Button size="xs" intent="ghost" iconOnly aria-label="Commands">/</Button>
          </>
        }
        trailing={
          <>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Auto mode</span>
            <Button size="sm" intent="primary">Send</Button>
          </>
        }
      />
    </div>
  )
}

function CmdEnterPromptDemo() {
  const [last, setLast] = useState('')
  return (
    <div style={{ width: 520, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <PromptInput
        submitOn="cmd-enter"
        minRows={3}
        placeholder="Write a longer prompt…  (⌘/Ctrl+Enter to send, Enter for newline)"
        onSubmit={setLast}
        trailing={<Button size="sm" intent="primary">Send</Button>}
      />
      {last && <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>last submitted: <code>{last.slice(0, 60)}</code></div>}
    </div>
  )
}

export default function PromptInputPage() {
  return (
    <article className="page">
      <h1>PromptInput</h1>
      <p>
        A chat-style composer: an auto-growing <code>&lt;textarea&gt;</code> wrapped in a focusable
        shell, with optional <code>leading</code> / <code>trailing</code> toolbar slots for icon
        buttons, attachment chips, status text, and the send / stop button. Submit on plain Enter
        (Shift+Enter for a newline) or switch to ⌘/Ctrl+Enter.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Any message composer — AI prompt box, comment field, chat input. For a single-line text
        field use <code>Input</code>; for a fixed-size multiline field with no toolbar use{' '}
        <code>Textarea</code>.
      </Banner>

      <h2>Basic</h2>
      <p>
        Controlled via <code>value</code> + <code>onValueChange</code> (or uncontrolled via{' '}
        <code>defaultValue</code>). <code>onSubmit</code> fires with the current text — and is
        skipped when the value is empty or whitespace-only. The textarea grows from{' '}
        <code>minRows</code> to <code>maxRows</code>, then scrolls.
      </p>
      <Demo
        code={`const [value, setValue] = useState('')

<PromptInput
  value={value}
  onValueChange={setValue}
  onSubmit={(text) => { send(text); setValue('') }}
  placeholder="Type a message…  (Enter to send, Shift+Enter for newline)"
  trailing={<Button size="sm" intent="primary" disabled={!value.trim()}>Send</Button>}
/>`}
      >
        <BasicPromptDemo />
      </Demo>

      <h2>Toolbar slots</h2>
      <p>
        <code>leading</code> renders at the left of the toolbar (attach / slash-command buttons,
        file chips); <code>trailing</code> is pushed to the right (status label, send / stop). The
        toolbar row only renders when at least one slot is provided. Grab the imperative{' '}
        <code>ref</code> to <code>focus()</code> or <code>clear()</code> the field.
      </p>
      <Demo
        code={`const ref = useRef<PromptInputHandle>(null)

<PromptInput
  ref={ref}
  minRows={1}
  maxRows={6}
  placeholder="Queue another message…"
  onSubmit={() => ref.current?.clear()}
  leading={<>
    <Button size="xs" intent="ghost" iconOnly aria-label="Attach">+</Button>
    <Button size="xs" intent="ghost" iconOnly aria-label="Commands">/</Button>
  </>}
  trailing={<>
    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Auto mode</span>
    <Button size="sm" intent="primary">Send</Button>
  </>}
/>`}
      >
        <ToolbarPromptDemo />
      </Demo>

      <h2>⌘/Ctrl+Enter to send</h2>
      <p>
        Set <code>submitOn="cmd-enter"</code> for longer prompts — plain Enter inserts a newline and
        ⌘/Ctrl+Enter submits.
      </p>
      <Demo
        code={`<PromptInput
  submitOn="cmd-enter"
  minRows={3}
  placeholder="Write a longer prompt…  (⌘/Ctrl+Enter to send)"
  onSubmit={setLast}
  trailing={<Button size="sm" intent="primary">Send</Button>}
/>`}
      >
        <CmdEnterPromptDemo />
      </Demo>

      <h2>Invalid / disabled</h2>
      <Demo
        code={`<PromptInput invalid defaultValue="oops" />
<PromptInput disabled defaultValue="read only" trailing={<Button size="sm" disabled>Send</Button>} />`}
      >
        <div style={{ width: 360 }}>
          <PromptInput invalid defaultValue="oops" />
        </div>
        <div style={{ width: 360 }}>
          <PromptInput disabled defaultValue="read only" trailing={<Button size="sm" disabled>Send</Button>} />
        </div>
      </Demo>

      <h2>PromptInput API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Controlled text value.</td></tr>
          <tr><td><code>defaultValue</code></td><td><code>string</code></td><td><code>''</code></td><td>Uncontrolled initial value.</td></tr>
          <tr><td><code>onValueChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Fires on every keystroke with the new text.</td></tr>
          <tr><td><code>onSubmit</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Fires on the submit keystroke. Not called when the value is empty/whitespace-only.</td></tr>
          <tr><td><code>submitOn</code></td><td><code>'enter' | 'cmd-enter'</code></td><td><code>'enter'</code></td><td><code>'enter'</code> — Enter submits, Shift+Enter newline. <code>'cmd-enter'</code> — ⌘/Ctrl+Enter submits, Enter newline.</td></tr>
          <tr><td><code>minRows</code></td><td><code>number</code></td><td><code>1</code></td><td>Min visible rows before auto-grow.</td></tr>
          <tr><td><code>maxRows</code></td><td><code>number</code></td><td><code>8</code></td><td>Max rows before the textarea scrolls instead of growing.</td></tr>
          <tr><td><code>leading</code></td><td><code>ReactNode</code></td><td>—</td><td>Left toolbar slot — icon buttons, attachment chips.</td></tr>
          <tr><td><code>trailing</code></td><td><code>ReactNode</code></td><td>—</td><td>Right toolbar slot — status text, send/stop button.</td></tr>
          <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Error border + focus ring.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Dims the shell and disables the textarea.</td></tr>
          <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'Type a message…'</code></td><td>Placeholder text.</td></tr>
          <tr><td>…<code>TextareaHTMLAttributes</code></td><td><code>TextareaHTMLAttributes&lt;HTMLTextAreaElement&gt;</code></td><td>—</td><td>Remaining textarea attributes (minus <code>onChange</code> / <code>onSubmit</code> / <code>value</code> / <code>defaultValue</code> / <code>rows</code>).</td></tr>
        </tbody>
      </Table>

      <h2>PromptInputHandle (ref)</h2>
      <Table>
        <thead>
          <tr><th>Member</th><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>focus()</code></td><td><code>() =&gt; void</code></td><td>Focus the textarea.</td></tr>
          <tr><td><code>clear()</code></td><td><code>() =&gt; void</code></td><td>Clear the text (uncontrolled mode — controlled callers own the value; also fires <code>onValueChange('')</code>).</td></tr>
          <tr><td><code>textarea</code></td><td><code>HTMLTextAreaElement | null</code></td><td>The underlying textarea element.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
