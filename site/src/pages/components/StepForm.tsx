import { useState } from 'react'
import { StepForm, Form, FormField, useForm, required, email, Input, Select, Switch, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const REGIONS = [
  { value: 'us-east-1', label: 'us-east-1 (N. Virginia)' },
  { value: 'us-west-2', label: 'us-west-2 (Oregon)' },
  { value: 'eu-west-1', label: 'eu-west-1 (Ireland)' },
]

const TEAM = [
  { value: 'alex', label: 'Alex Chen' },
  { value: 'bri', label: 'Bri Tanaka' },
  { value: 'cal', label: 'Cal Robinson' },
  { value: 'dee', label: 'Dee Patel' },
]

type WizardValues = {
  name: string
  email: string
  project: string
  region: string | undefined
  reviewers: string[]
  notify: boolean
}

function WizardDemo() {
  const [done, setDone] = useState<WizardValues | null>(null)
  const form = useForm<WizardValues>({
    initialValues: { name: '', email: '', project: '', region: undefined, reviewers: [], notify: true },
    rules: {
      name: required(),
      email: [required(), email()],
      project: required(),
      region: required('Pick a region'),
      reviewers: required('Add at least one teammate'),
    },
    onSubmit: (values) => setDone(values),
  })

  if (done) {
    return (
      <pre style={{ padding: 16, background: 'var(--color-bg-sunk)', borderRadius: 6, fontSize: 12, margin: 0 }}>
        {JSON.stringify(done, null, 2)}
      </pre>
    )
  }

  return (
    <div style={{ width: 480 }}>
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
                  <Select options={REGIONS} placeholder="Choose a region…" />
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
                  <Select multiple options={TEAM} placeholder="Add teammates…" clearable />
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
}

function VerticalDemo() {
  return (
    <div style={{ width: 520, display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32 }}>
      <StepForm
        orientation="vertical"
        steps={[
          { label: 'Source', content: <p style={{ margin: 0 }}>Pick a Git provider.</p> },
          { label: 'Build', content: <p style={{ margin: 0 }}>Detected: Next.js (App Router).</p> },
          { label: 'Deploy', content: <p style={{ margin: 0 }}>Ready to ship.</p> },
        ]}
      />
    </div>
  )
}

export default function StepFormPage() {
  return (
    <article className="page">
      <h1>StepForm</h1>
      <p>
        A multi-step form layout: a <code>FormSteps</code> indicator on top, the active step's body in
        the middle, and Back / Next / Finish (and optional Cancel) on the bottom. Hand it a shared{' '}
        <code>useForm</code> and per-step <code>fields</code> and it runs partial validation between
        steps and calls <code>form.submit()</code> on Finish.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Onboarding flows, create-resource wizards, multi-page checkouts. For a single-page form use{' '}
        <code>Form</code> + <code>useForm</code> directly; for just the step indicator (no body / buttons)
        use <code>FormSteps</code>.
      </Banner>

      <h2>Wizard with a shared form</h2>
      <p>
        One <code>useForm</code> spans every step. Each step declares the <code>fields</code> it owns;
        before advancing, <code>StepForm</code> runs <code>form.validateFields(fields)</code> and stays
        put if it fails. The last step calls <code>form.submit()</code>, so <code>onSubmit</code> fires
        once with all collected values. Override the Next label per step via <code>nextLabel</code>.
      </p>
      <Demo
        code={`const form = useForm<WizardValues>({
  initialValues: { name: '', email: '', project: '', region: undefined, reviewers: [], notify: true },
  rules: {
    name: required(),
    email: [required(), email()],
    project: required(),
    region: required('Pick a region'),
    reviewers: required('Add at least one teammate'),
  },
  onSubmit: (values) => setDone(values),
})

<StepForm
  form={form}
  steps={[
    {
      label: 'Account',
      fields: ['name', 'email'],
      content: (
        <Form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormField label="Your name" required bind={form.field('name')}><Input /></FormField>
          <FormField label="Email" required bind={form.field('email')}><Input type="email" /></FormField>
        </Form>
      ),
    },
    {
      label: 'Workspace',
      fields: ['project', 'region'],
      content: (/* … */),
    },
    {
      label: 'Team',
      fields: ['reviewers', 'notify'],
      nextLabel: 'Create project',
      content: (/* … */),
    },
  ]}
/>`}
      >
        <WizardDemo />
      </Demo>

      <h2>Headless steps</h2>
      <p>
        Without a <code>form</code>, each step is just <code>{'{ label, content }'}</code> — give a
        step its own <code>validate()</code> (sync or async) when it needs a gate, e.g. a server probe.
        <code>content</code> may be a node or a render function receiving the active index.
      </p>
      <Demo
        code={`<StepForm
  orientation="vertical"
  steps={[
    { label: 'Source',  content: <p>Pick a Git provider.</p> },
    { label: 'Build',   content: <p>Detected: Next.js (App Router).</p> },
    { label: 'Deploy',  content: <p>Ready to ship.</p> },
  ]}
/>`}
      >
        <VerticalDemo />
      </Demo>

      <h2>StepForm API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>steps</code></td><td><code>StepFormStep[]</code></td><td>—</td><td>The steps, in order. Required.</td></tr>
          <tr><td><code>form</code></td><td><code>UseFormReturn&lt;Values&gt;</code></td><td>—</td><td>Shared <code>useForm</code> instance. When set, each step's <code>fields</code> drives partial validation and the final step calls <code>form.submit()</code>.</td></tr>
          <tr><td><code>current</code></td><td><code>number</code></td><td>—</td><td>Controlled active step (0-based).</td></tr>
          <tr><td><code>defaultCurrent</code></td><td><code>number</code></td><td><code>0</code></td><td>Uncontrolled initial step.</td></tr>
          <tr><td><code>onCurrentChange</code></td><td><code>(index: number) =&gt; void</code></td><td>—</td><td>Fires when the active step changes (Next / Back).</td></tr>
          <tr><td><code>onFinish</code></td><td><code>() =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>Runs after the last step's validation passes (in addition to <code>form.submit()</code> when a <code>form</code> is given) — use for navigation/UI side effects.</td></tr>
          <tr><td><code>onCancel</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Cancel handler shown on the first step. Hides the button if omitted.</td></tr>
          <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Indicator orientation.</td></tr>
          <tr><td><code>renderSteps</code></td><td><code>(props: {'{ current, labels }'}) =&gt; ReactNode</code></td><td>—</td><td>Replace the default <code>FormSteps</code> indicator entirely.</td></tr>
          <tr><td><code>backLabel</code></td><td><code>ReactNode</code></td><td><code>'Back'</code></td><td>Back button text.</td></tr>
          <tr><td><code>nextLabel</code></td><td><code>ReactNode</code></td><td><code>'Next'</code></td><td>Next button text (a step's own <code>nextLabel</code> wins).</td></tr>
          <tr><td><code>finishLabel</code></td><td><code>ReactNode</code></td><td><code>'Finish'</code></td><td>Label on the last step's primary button.</td></tr>
          <tr><td><code>cancelLabel</code></td><td><code>ReactNode</code></td><td><code>'Cancel'</code></td><td>Cancel button text.</td></tr>
        </tbody>
      </Table>

      <h2>StepFormStep</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td>—</td><td>Label in the step indicator. Required.</td></tr>
          <tr><td><code>content</code></td><td><code>ReactNode | ((index: number) =&gt; ReactNode)</code></td><td>—</td><td>The step body. Required.</td></tr>
          <tr><td><code>fields</code></td><td><code>ReadonlyArray&lt;keyof Values&gt;</code></td><td>—</td><td>Field names this step owns; advancing runs <code>form.validateFields(fields)</code> (requires a <code>form</code>).</td></tr>
          <tr><td><code>validate</code></td><td><code>() =&gt; boolean | Promise&lt;boolean&gt;</code></td><td>—</td><td>Custom guard, runs after <code>fields</code> validation. Return <code>false</code> to block advancing.</td></tr>
          <tr><td><code>nextLabel</code></td><td><code>ReactNode</code></td><td>—</td><td>Override the Next button label on this step.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
