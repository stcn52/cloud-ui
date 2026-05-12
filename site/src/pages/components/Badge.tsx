import type { ReactNode } from 'react'
import { Badge, Table, Banner, Button } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function IconBtn({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="inline-grid place-items-center w-8 h-8 rounded-sm border border-line bg-bg-elev text-text-muted hover:text-text hover:border-line-strong"
    >
      {children}
    </button>
  )
}

export default function BadgePage() {
  return (
    <article className="page">
      <h1>Badge</h1>
      <p>
        A small count or status dot. Render it standalone, or pass <code>children</code> and it anchors
        to the top-right corner of whatever you wrap — an icon button, an avatar, a tab label.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Signalling unread / pending items on an icon or nav entry (a count, or a bare "something new"
        dot). For an inline status label with text use <code>Pill</code>; for a removable token use a
        chip / <code>TagInput</code>.
      </Banner>

      <h2>Counts</h2>
      <p>
        Pass <code>count</code>. Values above <code>max</code> (default 99) collapse to{' '}
        <code>{'`{max}+`'}</code>. A zero count hides the badge unless you set <code>showZero</code>.
      </p>
      <Demo
        code={`<Badge count={1} />
<Badge count={8} />
<Badge count={42} />
<Badge count={128} />
<Badge count={9999} max={999} />
<Badge count={0} />
<Badge count={0} showZero />`}
      >
        <Badge count={1} />
        <Badge count={8} />
        <Badge count={42} />
        <Badge count={128} />
        <Badge count={9999} max={999} />
        <Badge count={0} />
        <Badge count={0} showZero />
      </Demo>

      <h2>Tones</h2>
      <p>Six tones map to the standard status colors.</p>
      <Demo
        code={`<Badge count={3} tone="err" />
<Badge count={3} tone="warn" />
<Badge count={3} tone="ok" />
<Badge count={3} tone="info" />
<Badge count={3} tone="accent" />
<Badge count={3} tone="neutral" />`}
      >
        <Badge count={3} tone="err" />
        <Badge count={3} tone="warn" />
        <Badge count={3} tone="ok" />
        <Badge count={3} tone="info" />
        <Badge count={3} tone="accent" />
        <Badge count={3} tone="neutral" />
      </Demo>

      <h2>Dot</h2>
      <p>
        Set <code>dot</code> for a bare marker with no number — "something changed" without a precise
        count. <code>count</code>, <code>max</code> and <code>showZero</code> are ignored in dot mode.
      </p>
      <Demo
        code={`<Badge dot />
<Badge dot tone="ok" />
<Badge dot size="sm" />`}
      >
        <Badge dot />
        <Badge dot tone="ok" />
        <Badge dot size="sm" />
      </Demo>

      <h2>Anchored to children</h2>
      <p>
        Wrap an element and the badge sits at its top-right corner with <code>pointer-events: none</code>{' '}
        so it never blocks clicks.
      </p>
      <Demo
        code={`<Badge count={3}>
  <IconBtn><BellIcon /></IconBtn>
</Badge>
<Badge count={128}>
  <IconBtn><BellIcon /></IconBtn>
</Badge>
<Badge dot tone="err">
  <Button size="sm">收件箱</Button>
</Badge>`}
      >
        <Badge count={3}>
          <IconBtn><BellIcon /></IconBtn>
        </Badge>
        <Badge count={128}>
          <IconBtn><BellIcon /></IconBtn>
        </Badge>
        <Badge dot tone="err">
          <Button size="sm">收件箱</Button>
        </Badge>
      </Demo>

      <h2>Sizes</h2>
      <p>
        Two sizes. With no explicit <code>size</code> it follows the global <code>ConfigProvider</code>{' '}
        density (<code>compact → sm</code>; otherwise <code>md</code>).
      </p>
      <Demo
        code={`<Badge count={5} size="sm" />
<Badge count={5} size="md" />`}
      >
        <Badge count={5} size="sm" />
        <Badge count={5} size="md" />
      </Demo>

      <h2>Badge API</h2>
      <p>Plus all native <code>&lt;span&gt;</code> attributes (applied to the badge element).</p>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>count</code></td><td><code>number</code></td><td>—</td><td>Number to display. Above <code>max</code> shows <code>{'`{max}+`'}</code>. Ignored when <code>dot</code>.</td></tr>
          <tr><td><code>max</code></td><td><code>number</code></td><td><code>99</code></td><td>Cap for the displayed number.</td></tr>
          <tr><td><code>dot</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Render a bare dot with no number.</td></tr>
          <tr><td><code>showZero</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Keep the badge visible when <code>count</code> is 0.</td></tr>
          <tr><td><code>tone</code></td><td><code>'err' | 'ok' | 'warn' | 'info' | 'accent' | 'neutral'</code></td><td><code>'err'</code></td><td>Color role.</td></tr>
          <tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td>—</td><td>Badge size. Omit to follow <code>ConfigProvider</code> density.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>When set, the badge anchors to this element's top-right corner; otherwise it renders standalone.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
