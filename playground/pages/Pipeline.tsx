import { PipeStep, Pipeline } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function PipelinePage() {
  return (
    <>
      <PageHeader
        kicker="03 · Data display"
        title="Pipeline"
        lede="Linear step sequence for CI/CD and other multi-stage flows. Four states: pending, running (spinner), ok, err."
      />

      <div className="demo">
        <div className="demo-label">CI / CD flow</div>
        <div className="demo-body">
          <Pipeline>
            <PipeStep status="ok">Clone · 2s</PipeStep>
            <PipeStep status="ok">Install · 48s</PipeStep>
            <PipeStep status="ok">Test · 1m 24s</PipeStep>
            <PipeStep status="running">Build · 0m 42s</PipeStep>
            <PipeStep>Deploy</PipeStep>
            <PipeStep>Smoke</PipeStep>
          </Pipeline>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">With failure</div>
        <div className="demo-body">
          <Pipeline>
            <PipeStep status="ok">Clone</PipeStep>
            <PipeStep status="ok">Install</PipeStep>
            <PipeStep status="err">Test · 14 failed</PipeStep>
            <PipeStep>Build</PipeStep>
            <PipeStep>Deploy</PipeStep>
          </Pipeline>
        </div>
      </div>
    </>
  )
}
