import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, FormField, useForm, required, email } from '../Form'
import { Input } from '../Input'
import { Select } from '../Select'
import { Switch } from '../Switch'
import { StepForm } from './StepForm'

const meta = {
  title: '02 · Primitives/Step form',
  component: StepForm,
  tags: ['autodocs'],
  args: { steps: [] },
} satisfies Meta<typeof StepForm>

export default meta
type Story = StoryObj<typeof meta>

const regions = [
  { value: 'us-east-1', label: 'us-east-1 (N. Virginia)' },
  { value: 'us-west-2', label: 'us-west-2 (Oregon)' },
  { value: 'eu-west-1', label: 'eu-west-1 (Ireland)' },
]

const teamMembers = [
  { value: 'alex', label: 'Alex Chen' },
  { value: 'bri',  label: 'Bri Tanaka' },
  { value: 'cal',  label: 'Cal Robinson' },
  { value: 'dee',  label: 'Dee Patel' },
]

export const NewProjectWizard: Story = {
  parameters: {
    docs: { description: { story: 'One shared `useForm` spans every step. Each step declares the `fields` it owns, and `StepForm` runs `form.validateFields(fields)` automatically before advancing. The final step calls `form.submit()` so `onSubmit` fires once with all collected values.' } },
  },
  render: () => {
    type WizardValues = {
      name: string
      email: string
      project: string
      region: string | undefined
      reviewers: string[]
      notify: boolean
    }
    const [done, setDone] = useState<WizardValues | null>(null)
    const form = useForm<WizardValues>({
      initialValues: {
        name: '',
        email: '',
        project: '',
        region: undefined,
        reviewers: [],
        notify: true,
      },
      rules: {
        name:     required(),
        email:    [required(), email()],
        project:  required(),
        region:   required('Pick a region'),
        reviewers: required('Add at least one teammate'),
      },
      onSubmit: (values) => setDone(values),
    })

    if (done) {
      return (
        <pre style={{ padding: 16, background: 'var(--color-bg-sunk)', borderRadius: 6, fontSize: 12 }}>
          {JSON.stringify(done, null, 2)}
        </pre>
      )
    }

    return (
      <div style={{ width: 520 }}>
        <StepForm
          form={form}
          steps={[
            {
              label: 'Account',
              fields: ['name', 'email'],
              content: (
                <Form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <FormField label="Your name" required bind={form.field('name')}>
                    <Input placeholder="Ada Lovelace" />
                  </FormField>
                  <FormField label="Email" required bind={form.field('email')}>
                    <Input type="email" placeholder="ada@example.com" />
                  </FormField>
                </Form>
              ),
            },
            {
              label: 'Workspace',
              fields: ['project', 'region'],
              content: (
                <Form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <FormField label="Project name" required bind={form.field('project')}>
                    <Input placeholder="acme-staging" />
                  </FormField>
                  <FormField label="Region" required bind={form.field('region')}>
                    <Select options={regions} placeholder="Choose a region…" />
                  </FormField>
                </Form>
              ),
            },
            {
              label: 'Team',
              fields: ['reviewers', 'notify'],
              nextLabel: 'Create project',
              content: (
                <Form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <FormField label="Invite reviewers" required bind={form.field('reviewers')}>
                    <Select multiple options={teamMembers} placeholder="Add teammates…" clearable />
                  </FormField>
                  <FormField label="Email me on review" bind={form.field('notify')}>
                    <Switch />
                  </FormField>
                </Form>
              ),
            },
          ]}
        />
      </div>
    )
  },
}

export const Vertical: Story = {
  render: () => (
    <div style={{ width: 520, display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32 }}>
      <StepForm
        orientation="vertical"
        steps={[
          { label: 'Source',  content: <p style={{ margin: 0 }}>Pick a Git provider.</p> },
          { label: 'Build',   content: <p style={{ margin: 0 }}>Detected: Next.js (App Router).</p> },
          { label: 'Deploy',  content: <p style={{ margin: 0 }}>Ready to ship.</p> },
        ]}
      />
    </div>
  ),
}
