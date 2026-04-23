import { Pipeline, PipelineStep, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function PipelinePage() {
  return (
    <article className="page">
      <h1>Pipeline</h1>
      <p>
        A horizontal chain of <code>PipelineStep</code>s for CI/CD-style progress: clone → install →
        test → build → deploy. Connectors between pending steps are dashed by default.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Linear, ordered flows where each step has a clear status. Not for branching graphs — use a
        DAG visualization. Not for "wizard steps" the user controls — use <code>Segmented</code> or{' '}
        <code>Tabs</code>.
      </Banner>

      <h2>In progress</h2>
      <Demo
        code={`<Pipeline>
  <PipelineStep status="ok">Clone · 2s</PipelineStep>
  <PipelineStep status="ok">Install · 48s</PipelineStep>
  <PipelineStep status="ok">Test · 1m 24s</PipelineStep>
  <PipelineStep status="running">Build · 0m 42s</PipelineStep>
  <PipelineStep>Deploy</PipelineStep>
  <PipelineStep>Smoke</PipelineStep>
</Pipeline>`}
      >
        <Pipeline>
          <PipelineStep status="ok">Clone · 2s</PipelineStep>
          <PipelineStep status="ok">Install · 48s</PipelineStep>
          <PipelineStep status="ok">Test · 1m 24s</PipelineStep>
          <PipelineStep status="running">Build · 0m 42s</PipelineStep>
          <PipelineStep>Deploy</PipelineStep>
          <PipelineStep>Smoke</PipelineStep>
        </Pipeline>
      </Demo>

      <h2>With a failure</h2>
      <p>
        Once a step fails, later steps stay pending. Colors change instantly so the user sees the
        failure without reading the label.
      </p>
      <Demo
        code={`<Pipeline>
  <PipelineStep status="ok">Clone</PipelineStep>
  <PipelineStep status="ok">Install</PipelineStep>
  <PipelineStep status="err">Test · 14 failed</PipelineStep>
  <PipelineStep>Build</PipelineStep>
  <PipelineStep>Deploy</PipelineStep>
</Pipeline>`}
      >
        <Pipeline>
          <PipelineStep status="ok">Clone</PipelineStep>
          <PipelineStep status="ok">Install</PipelineStep>
          <PipelineStep status="err">Test · 14 failed</PipelineStep>
          <PipelineStep>Build</PipelineStep>
          <PipelineStep>Deploy</PipelineStep>
        </Pipeline>
      </Demo>

      <h2>All complete</h2>
      <Demo
        code={`<Pipeline>
  <PipelineStep status="ok">Clone</PipelineStep>
  <PipelineStep status="ok">Install</PipelineStep>
  <PipelineStep status="ok">Test</PipelineStep>
  <PipelineStep status="ok">Build</PipelineStep>
  <PipelineStep status="ok">Deploy</PipelineStep>
</Pipeline>`}
      >
        <Pipeline>
          <PipelineStep status="ok">Clone</PipelineStep>
          <PipelineStep status="ok">Install</PipelineStep>
          <PipelineStep status="ok">Test</PipelineStep>
          <PipelineStep status="ok">Build</PipelineStep>
          <PipelineStep status="ok">Deploy</PipelineStep>
        </Pipeline>
      </Demo>

      <h2>Single state demos</h2>
      <p>
        Use a standalone <code>PipelineStep</code> as a status pill — no parent <code>Pipeline</code>{' '}
        required.
      </p>
      <Demo
        code={`<PipelineStep>Queued</PipelineStep>
<PipelineStep status="running">Deploying</PipelineStep>
<PipelineStep status="ok">Healthy</PipelineStep>
<PipelineStep status="err">Degraded</PipelineStep>`}
      >
        <PipelineStep>Queued</PipelineStep>
        <PipelineStep status="running">Deploying</PipelineStep>
        <PipelineStep status="ok">Healthy</PipelineStep>
        <PipelineStep status="err">Degraded</PipelineStep>
      </Demo>

      <h2>Solid pending connectors</h2>
      <p>
        Set <code>dashedPending={'{false}'}</code> to use solid connectors even between pending
        steps.
      </p>
      <Demo
        code={`<Pipeline dashedPending={false}>
  <PipelineStep status="ok">Clone</PipelineStep>
  <PipelineStep status="running">Install</PipelineStep>
  <PipelineStep>Test</PipelineStep>
  <PipelineStep>Build</PipelineStep>
</Pipeline>`}
      >
        <Pipeline dashedPending={false}>
          <PipelineStep status="ok">Clone</PipelineStep>
          <PipelineStep status="running">Install</PipelineStep>
          <PipelineStep>Test</PipelineStep>
          <PipelineStep>Build</PipelineStep>
        </Pipeline>
      </Demo>

      <h2>Pipeline API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td><code>PipelineStep</code> elements. Connectors are inserted between them automatically.</td></tr>
          <tr><td><code>dashedPending</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Dashes the connector leading into the first pending step and every pending step after.</td></tr>
        </tbody>
      </Table>

      <h2>PipelineStep API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>status</code></td><td><code>PipelineStepStatus</code> (<code>'pending' | 'running' | 'ok' | 'err'</code>)</td><td><code>'pending'</code></td><td>Colorway + dot vs. spinning indicator.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Step label — typically name and elapsed time.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
