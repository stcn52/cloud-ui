import { Banner, PopoverItem, PopoverSeparator, Table, useContextMenu } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const iconCopy = (
  <svg viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)
const iconRename = (
  <svg viewBox="0 0 24 24">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
)
const iconTrash = (
  <svg viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M6 6l1 14h10l1-14" />
  </svg>
)

function BasicContextMenuDemo() {
  const menu = useContextMenu(
    <>
      <PopoverItem icon={iconCopy} shortcut="⌘C">Copy</PopoverItem>
      <PopoverItem icon={iconRename} shortcut="F2">Rename</PopoverItem>
      <PopoverSeparator />
      <PopoverItem icon={iconTrash} shortcut="⌫" danger>Delete</PopoverItem>
    </>,
  )
  return (
    <>
      <div
        onContextMenu={menu.open}
        style={{
          padding: '20px 28px',
          border: '1px dashed var(--color-line)',
          borderRadius: 8,
          background: 'var(--color-bg-elev)',
          color: 'var(--color-text-muted)',
          fontSize: 13,
          userSelect: 'none',
        }}
      >
        Right-click me
      </div>
      {menu.render()}
    </>
  )
}

function SharedSurfaceContextMenuDemo() {
  const rows = ['api-gateway', 'web-frontend', 'worker-pool']
  const menu = useContextMenu(
    <>
      <PopoverItem icon={iconCopy}>Duplicate</PopoverItem>
      <PopoverItem icon={iconRename}>Rename</PopoverItem>
      <PopoverItem
        submenu={
          <>
            <PopoverItem>Production</PopoverItem>
            <PopoverItem>Staging</PopoverItem>
            <PopoverItem>Preview</PopoverItem>
          </>
        }
      >
        Deploy to
      </PopoverItem>
      <PopoverSeparator />
      <PopoverItem icon={iconTrash} danger>Delete</PopoverItem>
    </>,
  )
  return (
    <>
      <div style={{ width: 240, border: '1px solid var(--color-line)', borderRadius: 8, overflow: 'hidden' }}>
        {rows.map((r, i) => (
          <div
            key={r}
            onContextMenu={menu.open}
            style={{
              padding: '8px 12px',
              fontSize: 13,
              color: 'var(--color-text)',
              borderTop: i ? '1px solid var(--color-line)' : undefined,
              cursor: 'context-menu',
            }}
          >
            {r}
          </div>
        ))}
      </div>
      {menu.render()}
    </>
  )
}

export default function ContextMenuPage() {
  return (
    <article className="page">
      <h1>useContextMenu</h1>
      <p>
        A hook for a mouse-anchored context menu. Call <code>useContextMenu(menu)</code> with the
        menu content; it returns a handle — spread <code>handle.open</code> onto an element's{' '}
        <code>onContextMenu</code>, and call <code>handle.render()</code> once in the tree. The same
        surface is reused for every target, so a list of N rows doesn't duplicate the menu in the
        DOM. The menu re-uses the <code>Popover</code> surface, so build it from <code>PopoverItem</code>{' '}
        / <code>PopoverSeparator</code> — including <code>submenu</code> for nested menus.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Right-click actions on rows, files, or canvas items. For a click-triggered overflow menu
        use <code>Popover</code> with <code>PopoverItem</code>; for a global keyboard-driven
        launcher use <code>CommandPalette</code>. (<code>NxTable</code> wires this up for you via{' '}
        <code>rowContextMenu</code>.)
      </Banner>

      <h2>Basic</h2>
      <p>
        It closes on outside click, Escape, scroll, or resize, and clamps itself inside the
        viewport so it never overflows the screen edge.
      </p>
      <Demo
        code={`function RightClickArea() {
  const menu = useContextMenu(
    <>
      <PopoverItem icon={<CopyIcon />}   shortcut="⌘C">Copy</PopoverItem>
      <PopoverItem icon={<RenameIcon />} shortcut="F2">Rename</PopoverItem>
      <PopoverSeparator />
      <PopoverItem icon={<TrashIcon />}  shortcut="⌫" danger>Delete</PopoverItem>
    </>,
  )
  return (
    <>
      <div onContextMenu={menu.open}>Right-click me</div>
      {menu.render()}
    </>
  )
}`}
      >
        <BasicContextMenuDemo />
      </Demo>

      <h2>One surface, many targets</h2>
      <p>
        Attach <code>menu.open</code> to every row's <code>onContextMenu</code> and call{' '}
        <code>menu.render()</code> just once — the portal subtree is shared. Nested menus work via{' '}
        <code>PopoverItem submenu</code>.
      </p>
      <Demo
        code={`const menu = useContextMenu(
  <>
    <PopoverItem icon={<DupIcon />}>Duplicate</PopoverItem>
    <PopoverItem icon={<RenameIcon />}>Rename</PopoverItem>
    <PopoverItem submenu={<>
      <PopoverItem>Production</PopoverItem>
      <PopoverItem>Staging</PopoverItem>
      <PopoverItem>Preview</PopoverItem>
    </>}>Deploy to</PopoverItem>
    <PopoverSeparator />
    <PopoverItem icon={<TrashIcon />} danger>Delete</PopoverItem>
  </>,
)

{rows.map((r) => <div key={r} onContextMenu={menu.open}>{r}</div>)}
{menu.render()}`}
      >
        <SharedSurfaceContextMenuDemo />
      </Demo>

      <h2>useContextMenu(menu)</h2>
      <Table>
        <thead>
          <tr><th>Argument</th><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>menu</code></td><td><code>ReactNode</code></td><td>Menu content — read on every render, so inline JSX is fine. Wrap large menus with expensive callbacks in <code>useMemo</code> to avoid re-mounting the portal subtree. Typically <code>PopoverItem</code> / <code>PopoverSeparator</code>.</td></tr>
        </tbody>
      </Table>

      <h2>ContextMenuHandle</h2>
      <Table>
        <thead>
          <tr><th>Member</th><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>open</code></td><td><code>(e: MouseEvent) =&gt; void</code></td><td>Spread onto the target's <code>onContextMenu</code>. Calls <code>preventDefault</code> and anchors the menu at the cursor.</td></tr>
          <tr><td><code>close</code></td><td><code>() =&gt; void</code></td><td>Close the menu programmatically.</td></tr>
          <tr><td><code>render</code></td><td><code>() =&gt; ReactNode</code></td><td>Renders the portaled menu surface. Call once anywhere in the subtree.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
