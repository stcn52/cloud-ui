import { FormSteps, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function FormStepsPage() {
  return (
    <article className="page">
      <h1>FormSteps</h1>
      <p>
        A numbered progress indicator for multi-step flows — completed steps fill green with a check,
        the active step takes the accent, the rest stay dim. Pure presentation: the parent owns the
        active index.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Showing "step N of M" above a wizard, onboarding flow, or checkout. For the full layout
        (indicator + body + Back/Next buttons) use <code>StepForm</code>, which renders a{' '}
        <code>FormSteps</code> internally. For a build/deploy run timeline use <code>Pipeline</code>.
      </Banner>

      <h2>Basic</h2>
      <p>
        Pass a <code>steps</code> array and the 0-based <code>current</code> index; state is derived
        automatically — anything before <code>current</code> is <code>done</code>, the index itself is{' '}
        <code>active</code>, the rest are <code>pending</code>.
      </p>
      <Demo
        code={`<FormSteps
  current={1}
  steps={[
    { label: 'Account' },
    { label: 'Workspace' },
    { label: 'Plan' },
    { label: 'Invite team' },
  ]}
/>`}
      >
        <FormSteps
          current={1}
          steps={[
            { label: 'Account' },
            { label: 'Workspace' },
            { label: 'Plan' },
            { label: 'Invite team' },
          ]}
        />
      </Demo>

      <h2>Vertical</h2>
      <p>
        Set <code>orientation="vertical"</code> to stack the steps — handy as a sidebar next to the
        step body.
      </p>
      <Demo
        code={`<FormSteps
  orientation="vertical"
  current={2}
  steps={[
    { label: 'Connect repository' },
    { label: 'Detect framework' },
    { label: 'Configure environment' },
    { label: 'Deploy preview' },
  ]}
/>`}
      >
        <FormSteps
          orientation="vertical"
          current={2}
          steps={[
            { label: 'Connect repository' },
            { label: 'Detect framework' },
            { label: 'Configure environment' },
            { label: 'Deploy preview' },
          ]}
        />
      </Demo>

      <h2>Explicit states</h2>
      <p>
        Set <code>state</code> on individual steps to override the auto-derived value — useful for
        branched workflows where some steps are skipped, optional, or marked done out of order. The
        connectors reflect the leading step's state.
      </p>
      <Demo
        code={`<FormSteps
  steps={[
    { label: 'Source', state: 'done' },
    { label: 'Build',  state: 'done' },
    { label: 'Test',   state: 'active' },
    { label: 'Deploy', state: 'pending' },
  ]}
/>`}
      >
        <FormSteps
          steps={[
            { label: 'Source', state: 'done' },
            { label: 'Build', state: 'done' },
            { label: 'Test', state: 'active' },
            { label: 'Deploy', state: 'pending' },
          ]}
        />
      </Demo>

      <h2>FormSteps API</h2>
      <p>Plus all native <code>&lt;div&gt;</code> attributes.</p>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>steps</code></td><td><code>readonly FormStep[]</code></td><td>—</td><td>The steps, in order. Required.</td></tr>
          <tr><td><code>current</code></td><td><code>number</code></td><td><code>0</code></td><td>0-based index of the active step; drives auto-derived state for steps that don't set their own.</td></tr>
          <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Layout direction.</td></tr>
        </tbody>
      </Table>

      <h2>FormStep</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td>—</td><td>Visible step label. Required.</td></tr>
          <tr><td><code>state</code></td><td><code>'pending' | 'active' | 'done'</code></td><td>derived from <code>current</code></td><td>Override the step's state explicitly.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
