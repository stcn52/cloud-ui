import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from '../Input'
import { TagInput } from './index'

const meta = {
  title: '06 · Advanced/Tag input',
  component: TagInput,
  tags: ['autodocs'],
} satisfies Meta<typeof TagInput>

export default meta
type Story = StoryObj<typeof meta>

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const Playground: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>(['team:platform', 'tier:1', 'owner:maya'])
    return (
      <Field label="Tags">
        <TagInput value={tags} onChange={setTags} placeholder="Add tag…" />
      </Field>
    )
  },
}

export const WithValidation: Story = {
  render: () => {
    const [invites, setInvites] = useState<string[]>(['maya@linden.com', 'notavalidemail'])
    const hasInvalid = invites.some((i) => !emailRegex.test(i))
    return (
      <Field
        label="Invite collaborators"
        error={hasInvalid ? 'One email is invalid.' : undefined}
      >
        <TagInput
          value={invites}
          onChange={setInvites}
          placeholder="name@company.com"
          validate={(t) => (emailRegex.test(t) ? null : 'Invalid email')}
        />
      </Field>
    )
  },
}
