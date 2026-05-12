import { Form, FormField, useForm, required, minLength, email, Input, Select, Switch, Button, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const REGIONS = [
  { value: 'us-east-1', label: 'us-east-1 (N. Virginia)' },
  { value: 'us-west-2', label: 'us-west-2 (Oregon)' },
  { value: 'eu-west-1', label: 'eu-west-1 (Ireland)' },
]

function ValidationDemo() {
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
        <Select options={REGIONS} placeholder="Choose a region…" />
      </FormField>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="submit" intent="primary" loading={form.isSubmitting}>Submit</Button>
        <Button type="button" intent="ghost" onClick={() => form.reset()}>Reset</Button>
      </div>
    </Form>
  )
}

function CrossFieldDemo() {
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
}

function SwitchFieldDemo() {
  const form = useForm({
    initialValues: { project: '', notify: true },
    rules: { project: required() },
    onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
  })
  return (
    <Form onSubmit={form.submit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
      <FormField label="Project name" required bind={form.field('project')}>
        <Input placeholder="acme-staging" />
      </FormField>
      <FormField label="Notify on deploy" bind={form.field('notify')}>
        <Switch />
      </FormField>
      <Button type="submit" intent="primary">Create</Button>
    </Form>
  )
}

export default function FormPage() {
  return (
    <article className="page">
      <h1>Form</h1>
      <p>
        A headless form layer: <code>useForm</code> owns values, errors and validation; <code>Form</code>{' '}
        is a thin <code>&lt;form&gt;</code> wrapper that calls <code>preventDefault</code> for you; and{' '}
        <code>FormField</code> binds one control into a labelled <code>Field</code>, injecting{' '}
        <code>value</code> / <code>onChange</code> / <code>onBlur</code> / <code>invalid</code>{' '}
        automatically. Built-in validators (<code>required</code>, <code>minLength</code>,{' '}
        <code>maxLength</code>, <code>pattern</code>, <code>email</code>) ship alongside.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Any form that needs per-field validation, blur/typing error feedback, and an async submit. For a
        single throwaway input, just use <code>Input</code> with local state and a <code>Field</code> for
        the label. For a multi-step wizard wrap your <code>useForm</code> in <code>StepForm</code>.
      </Banner>

      <h2>Validation</h2>
      <p>
        Errors appear after a field blurs and re-validate as the user types. The Submit button calls{' '}
        <code>form.submit</code> which runs <code>validateAll()</code> and then your <code>onSubmit</code>{' '}
        if everything passes. <code>FormField</code> reads <code>label</code>, <code>required</code> and{' '}
        <code>hint</code> straight through to <code>Field</code>.
      </p>
      <Demo
        code={`const form = useForm({
  initialValues: { name: '', email: '', region: undefined as string | undefined },
  rules: {
    name: [required(), minLength(2, 'At least 2 characters')],
    email: [required(), email()],
    region: required('Pick a region'),
  },
  onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
})

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
  <Button type="submit" intent="primary" loading={form.isSubmitting}>Submit</Button>
  <Button type="button" intent="ghost" onClick={() => form.reset()}>Reset</Button>
</Form>`}
      >
        <ValidationDemo />
      </Demo>

      <h2>Cross-field validation</h2>
      <p>
        The <code>validate</code> option runs after the per-field <code>rules</code> and may flag any
        field — password confirmation, date ranges, dependent fields. Return{' '}
        <code>{'{ field: message }'}</code> for failures, or <code>undefined</code> when all good.
      </p>
      <Demo
        code={`const form = useForm({
  initialValues: { password: '', confirm: '' },
  rules: {
    password: [required(), minLength(8, 'At least 8 characters')],
    confirm: required(),
  },
  validate: (v) => (v.confirm && v.confirm !== v.password ? { confirm: 'Passwords do not match' } : undefined),
  onSubmit: () => alert('Password set'),
})

<Form onSubmit={form.submit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
  <FormField label="Password" required bind={form.field('password')}>
    <Input type="password" />
  </FormField>
  <FormField label="Confirm password" required bind={form.field('confirm')}>
    <Input type="password" />
  </FormField>
  <Button type="submit" intent="primary">Set password</Button>
</Form>`}
      >
        <CrossFieldDemo />
      </Demo>

      <h2>Boolean fields</h2>
      <p>
        When a field's value is a boolean, <code>FormField</code> injects <code>checked</code> instead of{' '}
        <code>value</code> — so <code>Switch</code> and <code>Checkbox</code> bind the same way as any
        text control.
      </p>
      <Demo
        code={`const form = useForm({
  initialValues: { project: '', notify: true },
  rules: { project: required() },
  onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
})

<FormField label="Project name" required bind={form.field('project')}>
  <Input placeholder="acme-staging" />
</FormField>
<FormField label="Notify on deploy" bind={form.field('notify')}>
  <Switch />
</FormField>`}
      >
        <SwitchFieldDemo />
      </Demo>

      <h2>i18n</h2>
      <p>
        Built-in validators called <em>without</em> a <code>msg</code> argument resolve through the
        active <code>ConfigProvider</code> locale's <code>form</code> message block — so the toolbar
        locale toggle "just works". Need a message outside that block? Pass{' '}
        <code>(ctx) =&gt; string</code> to any validator to wire i18next / react-intl / your own
        dictionary; the library never imports a translator.
      </p>

      <h2>Form API</h2>
      <p>Plus all native <code>&lt;form&gt;</code> attributes except <code>onSubmit</code> (overridden below).</p>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>onSubmit</code></td><td><code>(e: FormEvent&lt;HTMLFormElement&gt;) =&gt; void</code></td><td>—</td><td>Wire to <code>useForm().submit</code>. The wrapper calls <code>e.preventDefault()</code> first and sets <code>noValidate</code>.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Form contents — typically <code>FormField</code>s and a submit button.</td></tr>
        </tbody>
      </Table>

      <h2>FormField API</h2>
      <p>Plus the layout props of <code>Field</code> (<code>label</code>, <code>hint</code>, <code>required</code>, <code>optional</code>, …); <code>error</code> is supplied from <code>bind</code>.</p>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>bind</code></td><td><code>FieldBindings&lt;V&gt;</code></td><td>—</td><td>Result of <code>form.field(name)</code>. Required.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactElement</code></td><td>—</td><td>A single control. Receives <code>value</code> (or <code>checked</code> for booleans), <code>onChange</code>, <code>onBlur</code>, <code>invalid</code>; existing handlers are chained. Native input/textarea events are adapted to a plain value.</td></tr>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td>—</td><td>Field label.</td></tr>
          <tr><td><code>hint</code></td><td><code>ReactNode</code></td><td>—</td><td>Helper text, shown when there's no error.</td></tr>
          <tr><td><code>required</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Red <code>*</code> after the label (visual only — validation comes from <code>rules</code>).</td></tr>
        </tbody>
      </Table>

      <h2>useForm</h2>
      <p>
        <code>useForm(options)</code> — <code>options</code> is{' '}
        <code>{'{ initialValues, rules?, validate?, onSubmit? }'}</code> where <code>rules</code> maps
        each field name to a <code>Validator</code> or array of them, <code>validate</code> is the
        cross-field check, and <code>onSubmit</code> runs after <code>validateAll()</code> passes.
        Returns:
      </p>
      <Table>
        <thead>
          <tr><th>Member</th><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>values</code></td><td><code>Values</code></td><td>Current field values.</td></tr>
          <tr><td><code>errors</code></td><td><code>Partial&lt;Record&lt;keyof Values, string&gt;&gt;</code></td><td>Active error messages by field.</td></tr>
          <tr><td><code>touched</code></td><td><code>Partial&lt;Record&lt;keyof Values, boolean&gt;&gt;</code></td><td>Which fields have been blurred / validated.</td></tr>
          <tr><td><code>isValid</code></td><td><code>boolean</code></td><td><code>true</code> when there are no errors.</td></tr>
          <tr><td><code>isSubmitting</code></td><td><code>boolean</code></td><td><code>true</code> while <code>submit()</code>'s <code>onSubmit</code> is awaiting.</td></tr>
          <tr><td><code>field(name)</code></td><td><code>(name) =&gt; FieldBindings</code></td><td>Bindings for one field — feed to <code>FormField</code>'s <code>bind</code>, or spread onto a control directly.</td></tr>
          <tr><td><code>setValue(name, value)</code></td><td><code>(name, value) =&gt; void</code></td><td>Set a field; re-validates it if already touched.</td></tr>
          <tr><td><code>setError(name, error)</code></td><td><code>(name, error?) =&gt; void</code></td><td>Set or clear an error manually (e.g. server-side).</td></tr>
          <tr><td><code>setTouched(name, touched?)</code></td><td><code>(name, touched?) =&gt; void</code></td><td>Mark a field touched (default <code>true</code>); validates it when set.</td></tr>
          <tr><td><code>validateAll()</code></td><td><code>() =&gt; boolean</code></td><td>Validate every field, mark all touched, return validity.</td></tr>
          <tr><td><code>validateFields(names)</code></td><td><code>(names) =&gt; boolean</code></td><td>Validate just the named fields (plus cross-field rules touching them).</td></tr>
          <tr><td><code>reset(next?)</code></td><td><code>(next?: Values) =&gt; void</code></td><td>Reset to <code>initialValues</code>, or to <code>next</code> if given.</td></tr>
          <tr><td><code>submit(e?)</code></td><td><code>(e?) =&gt; Promise&lt;void&gt;</code></td><td>Calls <code>e?.preventDefault()</code>, then <code>validateAll()</code>, then <code>onSubmit</code>. Use as <code>&lt;Form onSubmit={'{form.submit}'}&gt;</code>.</td></tr>
        </tbody>
      </Table>

      <h2>Built-in validators</h2>
      <p>
        Each takes an optional <code>msg</code> — a literal string, a <code>(ctx) =&gt; string</code>{' '}
        callback, or omitted (falls through to the locale's <code>form</code> block).
      </p>
      <Table>
        <thead>
          <tr><th>Validator</th><th>Signature</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>required</code></td><td><code>(msg?) =&gt; Validator</code></td><td>Rejects <code>undefined</code>, <code>null</code>, empty/whitespace strings, and empty arrays.</td></tr>
          <tr><td><code>minLength</code></td><td><code>(n, msg?) =&gt; Validator</code></td><td>Requires <code>length &gt;= n</code> (string or array).</td></tr>
          <tr><td><code>maxLength</code></td><td><code>(n, msg?) =&gt; Validator</code></td><td>Requires <code>length &lt;= n</code>.</td></tr>
          <tr><td><code>pattern</code></td><td><code>(re, msg?) =&gt; Validator</code></td><td>Requires the value to match <code>re</code>. Empty values pass (compose with <code>required</code>).</td></tr>
          <tr><td><code>email</code></td><td><code>(msg?) =&gt; Validator</code></td><td>Basic email shape; flags IME artefacts (full-width <code>＠</code> / <code>．</code>) and stray whitespace via <code>ctx.reason</code>.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
