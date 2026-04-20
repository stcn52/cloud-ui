import { useState } from 'react'
import { Field, TagInput } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function TagInputPage() {
  const [tags, setTags] = useState<string[]>(['team:platform', 'tier:1', 'owner:maya'])
  const [domains, setDomains] = useState<string[]>(['linden.com', '*.linden.dev'])
  const [invites, setInvites] = useState<string[]>(['maya@linden.com', 'notavalidemail'])

  const invalidInvite = invites.some((i) => !emailRegex.test(i))

  return (
    <>
      <PageHeader
        kicker="06 · Advanced"
        title="Tag input"
        lede={
          <>
            <kbd>↵</kbd> or <kbd>,</kbd> to add, <kbd>⌫</kbd> on empty to delete the last tag.
          </>
        }
      />

      <div className="demo">
        <div className="demo-label">Labels, domains, emails</div>
        <div className="demo-body" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 16, maxWidth: 520 }}>
          <Field label="Tags">
            <TagInput value={tags} onChange={setTags} placeholder="Add tag…" />
          </Field>

          <Field label="Allowed domains">
            <TagInput value={domains} onChange={setDomains} placeholder="example.com" />
          </Field>

          <Field
            label="Invite collaborators"
            error={invalidInvite ? 'One email is invalid.' : undefined}
          >
            <TagInput
              value={invites}
              onChange={setInvites}
              placeholder="name@company.com"
              validate={(t) => (emailRegex.test(t) ? null : 'Invalid email')}
            />
          </Field>
        </div>
      </div>
    </>
  )
}
