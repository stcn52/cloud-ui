import { useState } from 'react'
import { TagInput, Table, Banner, Pill } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function BasicDemo() {
  const [tags, setTags] = useState<string[]>(['platform', 'staging'])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 360 }}>
      <TagInput value={tags} onChange={setTags} placeholder="Add a tag…" />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-muted)' }}>
        value = <Pill tone="info">{JSON.stringify(tags)}</Pill>
      </div>
    </div>
  )
}

function MaxTagsDemo() {
  const LIMIT = 3
  const [tags, setTags] = useState<string[]>([])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 360 }}>
      <TagInput
        value={tags}
        onChange={(next) => {
          if (next.length <= LIMIT) setTags(next)
        }}
        placeholder={tags.length >= LIMIT ? `Max ${LIMIT} tags` : 'Add a tag…'}
      />
      <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>
        {tags.length} / {LIMIT} used
      </div>
    </div>
  )
}

function EmailValidationDemo() {
  const [tags, setTags] = useState<string[]>(['ada@example.com', 'not-an-email'])
  return (
    <TagInput
      value={tags}
      onChange={setTags}
      placeholder="Add an email…"
      validate={(t) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t) ? null : 'Not a valid email')}
      style={{ width: 360 }}
    />
  )
}

function SpaceSeparatorDemo() {
  const [tags, setTags] = useState<string[]>(['us-east-1'])
  return (
    <TagInput
      value={tags}
      onChange={setTags}
      commitKeys={['Enter', ' ', ',']}
      placeholder="Space, comma, or Enter to commit"
      style={{ width: 360 }}
    />
  )
}

export default function TagInputPage() {
  return (
    <article className="page">
      <h1>TagInput</h1>
      <p>
        An input that turns each committed value into a removable tag chip. Good for labels, CC
        lists, allowed-domain sets, and any "free text + bounded list" field.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Collecting a small, user-authored set of strings. For picking from a fixed predefined list
        prefer <code>Select</code> (multi) or a <code>Dropdown</code>.
      </Banner>

      <h2>Basic (controlled)</h2>
      <p>
        Type a value and press <kbd>Enter</kbd> or <kbd>,</kbd> to commit it. Press{' '}
        <kbd>Backspace</kbd> on an empty input to remove the last tag.
      </p>
      <Demo
        code={`const [tags, setTags] = useState(['platform', 'staging'])

<TagInput
  value={tags}
  onChange={setTags}
  placeholder="Add a tag…"
/>`}
      >
        <BasicDemo />
      </Demo>

      <h2>Max tags</h2>
      <p>
        There's no built-in cap — reject extra values in your <code>onChange</code>.
      </p>
      <Demo
        code={`const LIMIT = 3
const [tags, setTags] = useState<string[]>([])

<TagInput
  value={tags}
  onChange={(next) => {
    if (next.length <= LIMIT) setTags(next)
  }}
  placeholder={tags.length >= LIMIT ? \`Max \${LIMIT} tags\` : 'Add a tag…'}
/>`}
      >
        <MaxTagsDemo />
      </Demo>

      <h2>Validation</h2>
      <p>
        <code>validate</code> is called per tag on render. Return <code>null</code> for valid and a
        string for an error — invalid tags get an error tone.
      </p>
      <Demo
        code={`<TagInput
  defaultValue={['ada@example.com', 'not-an-email']}
  validate={(t) =>
    /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(t) ? null : 'Not a valid email'
  }
/>`}
      >
        <EmailValidationDemo />
      </Demo>

      <h2>Custom commit keys</h2>
      <p>
        By default <code>Enter</code> and <code>,</code> commit the draft. Override with{' '}
        <code>commitKeys</code> — e.g. allow a space for hostname-style lists.
      </p>
      <Demo
        code={`<TagInput
  defaultValue={['us-east-1']}
  commitKeys={['Enter', ' ', ',']}
  placeholder="Space, comma, or Enter to commit"
/>`}
      >
        <SpaceSeparatorDemo />
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>string[]</code></td><td>—</td><td>Controlled tag list.</td></tr>
          <tr><td><code>defaultValue</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>Uncontrolled initial tags.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(next: string[]) =&gt; void</code></td><td>—</td><td>Fires on commit (Enter/comma/blur) and on tag removal.</td></tr>
          <tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>Inner input placeholder.</td></tr>
          <tr><td><code>commitKeys</code></td><td><code>string[]</code></td><td><code>['Enter', ',']</code></td><td>Keyboard keys that commit the current draft.</td></tr>
          <tr><td><code>validate</code></td><td><code>(tag: string) =&gt; string | null</code></td><td>—</td><td>Per-tag validator. Return a string to mark the tag invalid.</td></tr>
          <tr><td><code>renderTag</code></td><td><code>(tag, error) =&gt; ReactNode</code></td><td>—</td><td>Escape hatch to render a custom chip. You lose the default × button.</td></tr>
        </tbody>
      </Table>

      <Banner tone="warn" title="Dedupe + trim" style={{ margin: '16px 0' }}>
        The component trims whitespace on commit and drops exact duplicates silently. It does not
        dedupe case-insensitively — handle that in your <code>onChange</code> if you need it.
      </Banner>
    </article>
  )
}
