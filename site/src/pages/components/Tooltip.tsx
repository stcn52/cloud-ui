import { Banner, Button, Table, Tooltip } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function TooltipPage() {
  return (
    <article className="page">
      <h1>Tooltip</h1>
      <p>
        A small hint label that appears on hover or keyboard focus of the wrapped element.
        CSS-only transition — no JavaScript, no portal.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        A short label for an icon-only control or a truncated value. Not for long explanations —
        put those inline or in a <code>Popover</code>. Don't hide critical information in a tooltip.
      </Banner>

      <Banner tone="info" title="One placement" style={{ margin: '16px 0' }}>
        This <code>Tooltip</code> renders above the trigger and centered horizontally. It has no{' '}
        <code>placement</code> prop. If you need a side-anchored label, use <code>Popover</code>{' '}
        with a hover trigger of your own.
      </Banner>

      <h2>Basic</h2>
      <Demo
        code={`<Tooltip tip="Deploy the current branch">
  <Button intent="primary">Deploy</Button>
</Tooltip>`}
      >
        <Tooltip tip="Deploy the current branch">
          <Button intent="primary">Deploy</Button>
        </Tooltip>
      </Demo>

      <h2>On an icon-only button</h2>
      <p>The most common case: label a control that has no visible text.</p>
      <Demo
        code={`<Tooltip tip="Settings">
  <Button iconOnly aria-label="Settings">
    <GearIcon />
  </Button>
</Tooltip>`}
      >
        <Tooltip tip="Settings">
          <Button iconOnly aria-label="Settings">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Button>
        </Tooltip>
      </Demo>

      <h2>Forced open</h2>
      <p>
        Set <code>open</code> to force the tooltip visible regardless of hover — handy for
        screenshots and tests.
      </p>
      <Demo
        code={`<Tooltip tip="This one is always visible" open>
  <Button intent="outline">Hover? Not needed.</Button>
</Tooltip>`}
      >
        <Tooltip tip="This one is always visible" open>
          <Button intent="outline">Hover? Not needed.</Button>
        </Tooltip>
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>tip</code></td><td><code>ReactNode</code></td><td>—</td><td>The label text shown on hover / focus.</td></tr>
          <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>Force-visible. Useful for tests or demos.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>The element the tooltip describes.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
