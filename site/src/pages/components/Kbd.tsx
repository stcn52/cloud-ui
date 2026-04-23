import { Kbd, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function KbdPage() {
  return (
    <article className="page">
      <h1>Kbd</h1>
      <p>
        Styled <code>&lt;kbd&gt;</code> element for keyboard shortcut hints — monospace, subtle
        border, muted text.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Inline shortcut hints next to menu items, tooltips, and help text. Not for literal typed
        input — use <code>&lt;code&gt;</code>. One key per <code>Kbd</code>; compose combos by
        placing several side by side with a separator.
      </Banner>

      <h2>Single keys</h2>
      <Demo
        code={`<Kbd>⌘</Kbd>
<Kbd>K</Kbd>
<Kbd>Esc</Kbd>
<Kbd>Enter</Kbd>`}
      >
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
        <Kbd>Esc</Kbd>
        <Kbd>Enter</Kbd>
      </Demo>

      <h2>Combinations</h2>
      <Demo
        code={`<span>
  <Kbd>⌘</Kbd> + <Kbd>K</Kbd>
</span>
<span>
  <Kbd>Shift</Kbd> + <Kbd>?</Kbd>
</span>`}
      >
        <span>
          <Kbd>⌘</Kbd> + <Kbd>K</Kbd>
        </span>
        <span>
          <Kbd>Shift</Kbd> + <Kbd>?</Kbd>
        </span>
      </Demo>

      <h2>Inline in prose</h2>
      <Demo
        code={`<p>Press <Kbd>⌘</Kbd><Kbd>K</Kbd> to open the command palette.</p>`}
      >
        <p style={{ margin: 0 }}>
          Press <Kbd>⌘</Kbd><Kbd>K</Kbd> to open the command palette.
        </p>
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Key label — one key, symbol, or short word.</td></tr>
          <tr><td><code>...rest</code></td><td><code>HTMLAttributes&lt;HTMLElement&gt;</code></td><td>—</td><td>Standard DOM props passed to the <code>&lt;kbd&gt;</code> element.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
