import { useEffect, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Input } from '../Input'
import { Select } from '../Select'
import { Switch } from '../Switch'
import { Segmented } from '../Segmented'
import { Form, FormField } from './Form'
import { useForm, required, minLength, email } from './useForm'

const meta = {
  title: '02 · Primitives/Form',
  component: Form,
  tags: ['autodocs'],
} satisfies Meta<typeof Form>

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

export const Validation: Story = {
  parameters: {
    docs: { description: { story: '`useForm` provides headless validation. Field errors show after blur and re-validate as the user types. The Submit button triggers `validateAll()`.' } },
  },
  render: () => {
    const form = useForm({
      initialValues: { name: '', email: '', region: undefined as string | undefined },
      rules: {
        name: [required(), minLength(2, 'At least 2 characters')],
        email: [required(), email()],
        region: required('Pick a region'),
      },
      onSubmit: (values) => {
        alert(`Submitted:\n${JSON.stringify(values, null, 2)}`)
      },
    })

    return (
      <Form onSubmit={form.submit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
        <FormField label="Name" required bind={form.field('name')}>
          <Input placeholder="Ada Lovelace" />
        </FormField>
        <FormField label="Email" required bind={form.field('email')}>
          <Input type="email" placeholder="ada@example.com" />
        </FormField>
        <FormField label="Region" required bind={form.field('region')}>
          <Select options={regions} placeholder="Choose a region…" />
        </FormField>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="submit" intent="primary" loading={form.isSubmitting}>Submit</Button>
          <Button type="button" intent="ghost" onClick={() => form.reset()}>Reset</Button>
        </div>
      </Form>
    )
  },
}

export const CrossFieldValidation: Story = {
  parameters: {
    docs: { description: { story: 'The `validate` option runs after the field rules and can flag any field — useful for password confirmation, date ranges, etc.' } },
  },
  render: () => {
    const form = useForm({
      initialValues: { password: '', confirm: '' },
      rules: {
        password: [required(), minLength(8, 'At least 8 characters')],
        confirm: required(),
      },
      validate: (v) => (v.confirm && v.confirm !== v.password ? { confirm: 'Passwords do not match' } : undefined),
      onSubmit: () => alert('Password set'),
    })
    return (
      <Form onSubmit={form.submit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
        <FormField label="Password" required bind={form.field('password')}>
          <Input type="password" />
        </FormField>
        <FormField label="Confirm password" required bind={form.field('confirm')}>
          <Input type="password" />
        </FormField>
        <Button type="submit" intent="primary">Set password</Button>
      </Form>
    )
  },
}

/* -------------------------------------------------------------------------- */
/* i18n                                                                        */
/*                                                                             */
/* Two layers, pick whichever fits:                                            */
/*   1. **Toolbar locale** — built-in validators (`required`, `email`, …)      */
/*      called *without* a `msg` arg automatically use `Locale['form']`.       */
/*      Switch the toolbar between English / 中文 to see this story's errors  */
/*      re-localise.                                                            */
/*   2. **Custom callback** — pass `(ctx) => string` to any validator to wire  */
/*      i18next, react-intl, or a project dictionary. The library never        */
/*      imports a translator; bring your own.                                   */
/* -------------------------------------------------------------------------- */

export const I18nLocaleToggle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'No custom messages — every validator falls back to `Locale.form`. Use the **Locale** toolbar control above (English / 中文) and watch errors re-localise. Try `2222222＠gmail.com` to see the full-width-character branch fire.',
      },
    },
  },
  render: () => {
    const form = useForm({
      initialValues: { name: '', email: '' },
      rules: {
        name: [required(), minLength(2)],
        email: [required(), email()],
      },
      onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
    })
    return (
      <Form onSubmit={form.submit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
        <FormField label="Name" required bind={form.field('name')}>
          <Input placeholder="Ada Lovelace" />
        </FormField>
        <FormField label="Email" required bind={form.field('email')}>
          <Input placeholder="ada@example.com" />
        </FormField>
        <Button type="submit" intent="primary">Submit</Button>
      </Form>
    )
  },
}

const customDict = {
  en: { tooShort: (n: number) => `Need at least ${n} chars — yours is too short.` },
  zh: { tooShort: (n: number) => `太短了,至少 ${n} 个字符。` },
} as const

export const I18nCustomCallback: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `(ctx) => string` when you need messages outside `Locale.form` — project copy, i18next/react-intl integration, or domain-specific phrasing. Toggle the in-page Segmented to see the override.',
      },
    },
  },
  render: () => {
    const [lang, setLang] = useState<'en' | 'zh'>('en')
    const t = customDict[lang]
    const form = useForm({
      initialValues: { handle: '' },
      rules: {
        handle: [required(), minLength(3, ({ limit }) => t.tooShort(limit))],
      },
    })
    // Re-localise messages already shown when the user toggles language.
    const firstMount = useRef(true)
    useEffect(() => {
      if (firstMount.current) { firstMount.current = false; return }
      const dirty = Object.keys(form.errors) as (keyof typeof form.values)[]
      if (dirty.length > 0) form.validateFields(dirty)
    }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
        <Segmented
          value={lang}
          onChange={setLang}
          options={[
            { value: 'en', label: 'English' },
            { value: 'zh', label: '中文' },
          ]}
        />
        <FormField label={lang === 'en' ? 'Handle' : '用户名'} required bind={form.field('handle')}>
          <Input placeholder="ada" />
        </FormField>
      </div>
    )
  },
}

export const WithMultiSelect: Story = {
  parameters: {
    docs: { description: { story: 'A `multiple` Select binds to a `string[]` field. `required()` treats an empty array as missing.' } },
  },
  render: () => {
    const form = useForm({
      initialValues: { reviewers: [] as string[], notify: true },
      rules: {
        reviewers: required('Pick at least one reviewer'),
      },
      onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
    })
    return (
      <Form onSubmit={form.submit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
        <FormField label="Reviewers" required bind={form.field('reviewers')}>
          <Select multiple options={teamMembers} placeholder="Add reviewers…" clearable />
        </FormField>
        <FormField label="Notify on submit" bind={form.field('notify')}>
          <Switch />
        </FormField>
        <Button type="submit" intent="primary">Open PR</Button>
      </Form>
    )
  },
}
