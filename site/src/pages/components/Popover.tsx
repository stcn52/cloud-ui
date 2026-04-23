import {
  Banner,
  Button,
  Popover,
  PopoverItem,
  PopoverSeparator,
  Table,
} from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const iconPlus = (
  <svg viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const iconDeploy = (
  <svg viewBox="0 0 24 24">
    <polyline points="16 12 12 8 8 12" />
    <line x1="12" y1="16" x2="12" y2="8" />
  </svg>
)
const iconTrash = (
  <svg viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M6 6l1 14h10l1-14" />
  </svg>
)

export default function PopoverPage() {
  return (
    <article className="page">
      <h1>Popover</h1>
      <p>
        Anchored floating panel. Accepts any <code>content</code>, positions itself relative to
        the trigger, closes on outside click / Escape. Ships with <code>PopoverItem</code> and{' '}
        <code>PopoverSeparator</code> for the common menu case, including hover submenus.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Row actions, overflow menus, and inline pickers. For global keyboard-driven commands,
        use <code>CommandPalette</code>. For a permanent label, use <code>Tooltip</code>.
      </Banner>

      <h2>Menu</h2>
      <p>
        Wrap a trigger (any element). The popover clones it, injects a click handler, and flips
        visibility on click.
      </p>
      <Demo
        code={`<Popover
  trigger={<Button>Actions ▾</Button>}
  content={
    <>
      <PopoverItem icon={<PlusIcon />}   shortcut="⌘D">Duplicate</PopoverItem>
      <PopoverItem icon={<DeployIcon />} shortcut="⌘↵">Deploy</PopoverItem>
      <PopoverSeparator />
      <PopoverItem icon={<TrashIcon />}  shortcut="⌫" danger>Delete</PopoverItem>
    </>
  }
/>`}
      >
        <Popover
          trigger={<Button>Actions ▾</Button>}
          content={
            <>
              <PopoverItem icon={iconPlus} shortcut="⌘D">Duplicate</PopoverItem>
              <PopoverItem icon={iconDeploy} shortcut="⌘↵">Deploy</PopoverItem>
              <PopoverSeparator />
              <PopoverItem icon={iconTrash} shortcut="⌫" danger>Delete</PopoverItem>
            </>
          }
        />
      </Demo>

      <h2>Submenu</h2>
      <p>
        Pass <code>submenu</code> on a <code>PopoverItem</code> to open a nested menu on hover. The
        parent shows a chevron instead of a shortcut.
      </p>
      <Demo
        code={`<Popover
  trigger={<Button>File ▾</Button>}
  content={
    <>
      <PopoverItem>New</PopoverItem>
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
      <PopoverItem danger>Delete</PopoverItem>
    </>
  }
/>`}
      >
        <Popover
          trigger={<Button>File ▾</Button>}
          content={
            <>
              <PopoverItem icon={iconPlus}>New</PopoverItem>
              <PopoverItem
                icon={iconDeploy}
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
            </>
          }
        />
      </Demo>

      <h2>Custom content</h2>
      <p>
        Set <code>surface={'{false}'}</code> if your content brings its own styling. Otherwise you
        get the default elevated card.
      </p>
      <Demo
        code={`<Popover
  trigger={<Button intent="outline">About</Button>}
  content={
    <div style={{ padding: 12, maxWidth: 220 }}>
      <div style={{ fontWeight: 600 }}>api-gateway</div>
      <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
        v143 · us-east-1 · 2 regions
      </div>
    </div>
  }
/>`}
      >
        <Popover
          trigger={<Button intent="outline">About</Button>}
          content={
            <div style={{ padding: 12, maxWidth: 220 }}>
              <div style={{ fontWeight: 600 }}>api-gateway</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 4 }}>
                v143 · us-east-1 · 2 regions
              </div>
            </div>
          }
        />
      </Demo>

      <h2>Placement</h2>
      <Demo
        code={`<Popover placement="bottom-start" trigger={<Button>bottom-start</Button>} content={...} />
<Popover placement="bottom"       trigger={<Button>bottom</Button>}       content={...} />
<Popover placement="bottom-end"   trigger={<Button>bottom-end</Button>}   content={...} />
<Popover placement="top-start"    trigger={<Button>top-start</Button>}    content={...} />
<Popover placement="top"          trigger={<Button>top</Button>}          content={...} />
<Popover placement="top-end"      trigger={<Button>top-end</Button>}      content={...} />`}
      >
        {(['bottom-start', 'bottom', 'bottom-end', 'top-start', 'top', 'top-end'] as const).map((p) => (
          <Popover
            key={p}
            placement={p}
            trigger={<Button size="sm" intent="outline">{p}</Button>}
            content={<div style={{ padding: 10, fontSize: 12 }}>Placement: {p}</div>}
          />
        ))}
      </Demo>

      <h2>Popover API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>trigger</code></td><td><code>ReactElement</code></td><td>—</td><td>Single element. Popover clones it and adds click + ref.</td></tr>
          <tr><td><code>content</code></td><td><code>ReactNode</code></td><td>—</td><td>What to render inside the floating panel.</td></tr>
          <tr><td><code>placement</code></td><td><code>'bottom-start' | 'bottom' | 'bottom-end' | 'top-start' | 'top' | 'top-end'</code></td><td><code>'bottom-start'</code></td><td>Anchor alignment.</td></tr>
          <tr><td><code>offset</code></td><td><code>number</code></td><td><code>6</code></td><td>Pixels between trigger and panel.</td></tr>
          <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>Controlled visibility. Leave undefined for uncontrolled.</td></tr>
          <tr><td><code>onOpenChange</code></td><td><code>(open: boolean) =&gt; void</code></td><td>—</td><td>Fires on every visibility change.</td></tr>
          <tr><td><code>closeOnOutside</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Close on click outside the panel and trigger.</td></tr>
          <tr><td><code>closeOnEscape</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Close on Escape.</td></tr>
          <tr><td><code>surface</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Apply default card styles. Disable when content is styled itself.</td></tr>
        </tbody>
      </Table>

      <h2>PopoverItem API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>icon</code></td><td><code>ReactNode</code></td><td>—</td><td>Leading icon.</td></tr>
          <tr><td><code>shortcut</code></td><td><code>ReactNode</code></td><td>—</td><td>Right-aligned hint. Hidden when <code>submenu</code> is set.</td></tr>
          <tr><td><code>danger</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Red text + destructive hover.</td></tr>
          <tr><td><code>submenu</code></td><td><code>ReactNode</code></td><td>—</td><td>Opens a nested menu to the right on hover.</td></tr>
          <tr><td><code>onClick</code></td><td><code>(e: MouseEvent) =&gt; void</code></td><td>—</td><td>Standard click handler.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
