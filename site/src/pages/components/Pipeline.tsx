import { Pipeline, PipeStep, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function PipelinePage() {
  return (
    <article className="page">
      <h1>Pipeline</h1>
      <p>
        A horizontal chain of <code>PipeStep</code>s for CI/CD-style progress: clone → install →
        test → build → deploy. Connectors between pending steps are dashed by default.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Linear, ordered flows where each step has a clear status. Not for branching graphs — use a
        DAG visualization. Not for "wizard steps" the user controls — use <code>Segmented</code> or
        <code>Tabs</code>.
      </Banner>

      <h2>In progress</h2>
      <Demo
        code={`<Pipeline>
  <PipeStep status="ok">Clone · 2s</PipeStep>
  <PipeStep status="ok">Install · 48s</PipeStep>
  <PipeStep status="ok">Test · 1m 24s</PipeStep>
  <PipeStep status="running">Build · 0m 42s</PipeStep>
  <PipeStep>Deploy</PipeStep>
  <PipeStep>Smoke</PipeStep>
</Pipeline>`}
      >
        <Pipeline>
          <PipeStep status="ok">Clone · 2s</PipeStep>
          <PipeStep status="ok">Install · 48s</PipeStep>
          <PipeStep status="ok">Test · 1m 24s</PipeStep>
          <PipeStep status="running">Build · 0m 42s</PipeStep>
          <PipeStep>Deploy</PipeStep>
          <PipeStep>Smoke</PipeStep>
        </Pipeline>
      </Demo>

      <h2>With a failure</h2>
      <Demo
        code={`<Pipeline>
  <PipeStep status="ok">Clone</PipeStep>
  <PipeStep status="ok">Install</PipeStep>
  <PipeStep status="err">Test · 14 failed</PipeStep>
  <PipeStep>Build</PipeStep>
  <PipeStep>Deploy</PipeStep>
</Pipeline>`}
      >
        <Pipeline>
          <PipeStep status="ok">Clone</PipeStep>
          <PipeStep status="ok">Install</PipeStep>
          <PipeStep status="err">Test · 14 failed</PipeStep>
          <PipeStep>Build</PipeStep>
          <PipeStep>Deploy</PipeStep>
        </Pipeline>
      </Demo>

      <h2>All complete</h2>
      <Demo
        code={`<Pipeline>
  <PipeStep status="ok">Clone</PipeStep>
  <PipeStep status="ok">Install</PipeStep>
  <PipeStep status="ok">Test</PipeStep>
  <PipeStep status="ok">Build</PipeStep>
  <PipeStep status="ok">Deploy</PipeStep>
</Pipeline>`}
      >
        <Pipeline>
          <PipeStep status="ok">Clone</PipeStep>
          <PipeStep status="ok">Install</PipeStep>
          <PipeStep status="ok">Test</PipeStep>
          <PipeStep status="ok">Build</PipeStep>
          <PipeStep status="ok">Deploy</PipeStep>
        </Pipeline>
      </Demo>

      <h2>Solid pending connectors</h2>
      <p>
        Set <code>dashedPending={'{false}'}</code> to use solid connectors even between pending
        steps.
      </p>
      <Demo
        code={`<Pipeline dashedPending={false}>
  <PipeStep status="ok">Clone</PipeStep>
  <PipeStep status="running">Install</PipeStep>
  <PipeStep>Test</PipeStep>
  <PipeStep>Build</PipeStep>
</Pipeline>`}
      >
        <Pipeline dashedPending={false}>
          <PipeStep status="ok">Clone</PipeStep>
          <PipeStep status="running">Install</PipeStep>
          <PipeStep>Test</PipeStep>
          <PipeStep>Build</PipeStep>
        </Pipeline>
      </Demo>

      <h2>Pipeline API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td><code>PipeStep</code> elements. Connectors are inserted between them automatically.</td></tr>
          <tr><td><code>dashedPending</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Dashes the connector leading into the first pending step and every pending step after.</td></tr>
        </tbody>
      </Table>

      <h2>PipeStep API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>status</code></td><td><code>'pending' | 'running' | 'ok' | 'err'</code></td><td><code>'pending'</code></td><td>Colorway + dot vs. spinning indicator.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Step label — typically name and elapsed time.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
