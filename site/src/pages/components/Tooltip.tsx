import { Banner, Button, Table, Tooltip } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function TooltipPage() {
  return (
    <article className="page">
      <h1>Tooltip</h1>
      <p>
        A small hint label that appears on hover or keyboard focus of the wrapped element. The
        tooltip is portaled, so it escapes any <code>overflow: hidden</code> ancestor, and it flips
        to the opposite side when the preferred placement doesn't fit the viewport.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        A short label for an icon-only control or a truncated value. Not for long explanations —
        put those inline or in a <code>Popover</code>. Don't hide critical information in a
        tooltip.
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

      <h2>Placements</h2>
      <p>
        Pass <code>placement</code> to choose a preferred side. The tooltip auto-flips to the
        opposite side when it would overflow the viewport.
      </p>
      <Demo
        code={`<Tooltip placement="top"    tip="Top tip"><Button intent="outline">Top</Button></Tooltip>
<Tooltip placement="right"  tip="Right tip"><Button intent="outline">Right</Button></Tooltip>
<Tooltip placement="bottom" tip="Bottom tip"><Button intent="outline">Bottom</Button></Tooltip>
<Tooltip placement="left"   tip="Left tip"><Button intent="outline">Left</Button></Tooltip>`}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: '24px 8px' }}>
          <Tooltip placement="top" tip="Top tip">
            <Button intent="outline">Top</Button>
          </Tooltip>
          <Tooltip placement="right" tip="Right tip">
            <Button intent="outline">Right</Button>
          </Tooltip>
          <Tooltip placement="bottom" tip="Bottom tip">
            <Button intent="outline">Bottom</Button>
          </Tooltip>
          <Tooltip placement="left" tip="Left tip">
            <Button intent="outline">Left</Button>
          </Tooltip>
        </div>
      </Demo>

      <h2>Collision detection</h2>
      <p>
        The trigger below sits right up against the top of its container. The preferred{' '}
        <code>top</code> placement won't fit, so the tooltip flips to <code>bottom</code>{' '}
        automatically.
      </p>
      <Demo
        code={`<div style={{ paddingTop: 0 }}>
  <Tooltip placement="top" tip="Flipped because top doesn't fit">
    <Button intent="outline">Hover me</Button>
  </Tooltip>
</div>`}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: 0 }}>
          <Tooltip placement="top" tip="Flipped because top doesn't fit">
            <Button intent="outline">Hover me</Button>
          </Tooltip>
        </div>
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
          <tr><td><code>placement</code></td><td><code>'top' | 'bottom' | 'left' | 'right'</code></td><td><code>'top'</code></td><td>Preferred side. Flips to the opposite side on overflow.</td></tr>
          <tr><td><code>offset</code></td><td><code>number</code></td><td><code>6</code></td><td>Pixels between the trigger and the tooltip.</td></tr>
          <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>Force-visible. Useful for tests or demos.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>The element the tooltip describes.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
