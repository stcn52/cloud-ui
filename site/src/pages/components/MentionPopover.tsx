import { useState } from 'react'
import { MentionPopover, type MentionItem, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const people: MentionItem[] = [
  { value: 'alex', label: '@alex', description: 'Alex Chen' },
  { value: 'bri', label: '@bri', description: 'Bri Tanaka' },
  { value: 'cal', label: '@cal', description: 'Cal Robinson' },
  { value: 'dee', label: '@dee', description: 'Dee Patel' },
  { value: 'backend-dev', label: '@backend-dev', description: 'team' },
  { value: 'qa-mia', label: '@qa-mia', description: 'QA' },
]

function MentionDemo() {
  const [v, setV] = useState('Hey ')
  const [mentioned, setMentioned] = useState<string[]>([])
  return (
    <div style={{ width: 460, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <MentionPopover
        items={people}
        value={v}
        onValueChange={setV}
        onMention={(it) => setMentioned((m) => [...new Set([...m, it.value])])}
        rows={4}
        placeholder="Type a comment… use @ to mention a teammate"
      />
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
        mentioned: {mentioned.length ? mentioned.map((m) => `@${m}`).join(', ') : '(none)'}
      </div>
    </div>
  )
}

function CustomTriggerDemo() {
  const [v, setV] = useState('Linked to ')
  const issues: MentionItem[] = [
    { value: '1842', label: '#1842', description: 'auth system' },
    { value: '1850', label: '#1850', description: 'rollback plan' },
    { value: '1903', label: '#1903', description: 'flaky test' },
  ]
  return (
    <div style={{ width: 420 }}>
      <MentionPopover
        items={issues}
        value={v}
        onValueChange={setV}
        trigger="#"
        rows={3}
        placeholder="Reference an issue with #…"
      />
    </div>
  )
}

export default function MentionPopoverPage() {
  return (
    <article className="page">
      <h1>MentionPopover</h1>
      <p>
        A <code>&lt;textarea&gt;</code> with an inline <code>@</code>-mention menu. Typing the
        trigger char (preceded by start-of-text or whitespace) opens a filtered list of{' '}
        <code>items</code>; ↑/↓ moves the highlight, Enter / Tab inserts <code>@value</code> + a
        space, Esc dismisses. The menu is positioned just below the textarea — keep it in a{' '}
        <code>position: relative</code> container with room beneath.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Comment / description fields where people <code>@</code>-mention teammates (or{' '}
        <code>#</code>-link issues, etc.). For a plain multiline field use <code>Textarea</code>;
        for a chat composer with a toolbar use <code>PromptInput</code>.
      </Banner>

      <h2>Mentioning people</h2>
      <p>
        Controlled via <code>value</code> + <code>onValueChange</code> (or uncontrolled via{' '}
        <code>defaultValue</code>). <code>onMention</code> fires with the chosen{' '}
        <code>MentionItem</code> when one is inserted. Each item's <code>value</code> is the inserted
        text (without the trigger); <code>label</code> / <code>description</code> / <code>icon</code>{' '}
        control the menu row.
      </p>
      <Demo
        code={`const people: MentionItem[] = [
  { value: 'alex', label: '@alex', description: 'Alex Chen' },
  { value: 'bri',  label: '@bri',  description: 'Bri Tanaka' },
  { value: 'backend-dev', label: '@backend-dev', description: 'team' },
]

const [v, setV] = useState('Hey ')

<MentionPopover
  items={people}
  value={v}
  onValueChange={setV}
  onMention={(it) => track(it.value)}
  rows={4}
  placeholder="Type a comment… use @ to mention a teammate"
/>`}
      >
        <MentionDemo />
      </Demo>

      <h2>Custom trigger</h2>
      <p>
        Set <code>trigger</code> to any single character — e.g. <code>#</code> for issues or
        channels.
      </p>
      <Demo
        code={`<MentionPopover
  items={[
    { value: '1842', label: '#1842', description: 'auth system' },
    { value: '1850', label: '#1850', description: 'rollback plan' },
  ]}
  value={v}
  onValueChange={setV}
  trigger="#"
  rows={3}
  placeholder="Reference an issue with #…"
/>`}
      >
        <CustomTriggerDemo />
      </Demo>

      <h2>Uncontrolled / invalid</h2>
      <p>
        Skip the value props for an uncontrolled field; <code>invalid</code> gives the error border.
        All other <code>&lt;textarea&gt;</code> attributes (<code>rows</code>, <code>maxLength</code>,{' '}
        <code>name</code>, …) pass through.
      </p>
      <Demo
        code={`<MentionPopover items={people} defaultValue="cc @" rows={3} />
<MentionPopover items={people} invalid placeholder="Required" rows={3} />`}
      >
        <div style={{ width: 420 }}>
          <MentionPopover items={people} defaultValue="cc @" rows={3} />
        </div>
        <div style={{ width: 420 }}>
          <MentionPopover items={people} invalid placeholder="Required" rows={3} />
        </div>
      </Demo>

      <h2>MentionPopover API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>items</code></td><td><code>MentionItem[]</code></td><td>—</td><td>People/things that can be mentioned. Required.</td></tr>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Controlled text value.</td></tr>
          <tr><td><code>defaultValue</code></td><td><code>string</code></td><td><code>''</code></td><td>Uncontrolled initial value.</td></tr>
          <tr><td><code>onValueChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Fires on every keystroke with the new text.</td></tr>
          <tr><td><code>onMention</code></td><td><code>(item: MentionItem) =&gt; void</code></td><td>—</td><td>Fires when a mention is inserted.</td></tr>
          <tr><td><code>trigger</code></td><td><code>string</code></td><td><code>'@'</code></td><td>Trigger character.</td></tr>
          <tr><td><code>maxItems</code></td><td><code>number</code></td><td><code>8</code></td><td>Max menu items shown.</td></tr>
          <tr><td><code>filter</code></td><td><code>(query: string, item: MentionItem) =&gt; boolean</code></td><td>—</td><td>Custom matcher (receives the text after the trigger). Default: case-insensitive substring on <code>value</code> + string <code>label</code>.</td></tr>
          <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Error border + focus ring.</td></tr>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Applied to the wrapping <code>&lt;div&gt;</code> (which is <code>position: relative</code>).</td></tr>
          <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'Write something… use @ to mention'</code></td><td>Placeholder text.</td></tr>
          <tr><td>…<code>TextareaHTMLAttributes</code></td><td><code>TextareaHTMLAttributes&lt;HTMLTextAreaElement&gt;</code></td><td>—</td><td>Remaining textarea attributes (minus <code>onChange</code> / <code>value</code> / <code>defaultValue</code>) — e.g. <code>rows</code>, <code>maxLength</code>, <code>name</code>.</td></tr>
        </tbody>
      </Table>

      <h2>MentionItem</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Inserted text (without the trigger char) — <code>'alex'</code> → <code>'@alex'</code>. Required.</td></tr>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td><code>value</code></td><td>Display label in the menu.</td></tr>
          <tr><td><code>description</code></td><td><code>ReactNode</code></td><td>—</td><td>Secondary text on the right of the row (a role, a name).</td></tr>
          <tr><td><code>icon</code></td><td><code>ReactNode</code></td><td>—</td><td>Leading element (avatar / icon).</td></tr>
        </tbody>
      </Table>

      <h2>MentionPopoverHandle (ref)</h2>
      <Table>
        <thead>
          <tr><th>Member</th><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>focus()</code></td><td><code>() =&gt; void</code></td><td>Focus the textarea.</td></tr>
          <tr><td><code>textarea</code></td><td><code>HTMLTextAreaElement | null</code></td><td>The underlying textarea element.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
