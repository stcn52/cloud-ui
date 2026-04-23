import { useState } from 'react'
import {
  Dropdown,
  DropdownItem,
  DropdownGroup,
  DropdownSeparator,
  DropdownSearch,
  Button,
  Table,
  Banner,
} from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const EditIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
)
const CopyIcon = (
  <svg viewBox="0 0 24 24">
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </svg>
)
const ArchiveIcon = (
  <svg viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
    <path d="M10 12h4" />
  </svg>
)
const TrashIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
)

export default function DropdownPage() {
  const [checked, setChecked] = useState<'asc' | 'desc' | 'created'>('created')
  const [search, setSearch] = useState('')
  const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-southeast-1']
  const filtered = regions.filter((r) => r.toLowerCase().includes(search.toLowerCase()))

  return (
    <article className="page">
      <h1>Dropdown</h1>
      <p>
        A menu anchored to a trigger button. Built on <code>Popover</code>, adds standard menu item
        styling (icon + label + shortcut or submenu affordance), group headings, separators, and an
        optional in-menu search box.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Row/entity actions, overflow "…" menus, grouped filters, and keyboard-friendly pickers. For
        a full-page command launcher use <code>CommandPalette</code>. For a free-form popover surface
        use <code>Popover</code> directly.
      </Banner>

      <h2>Basic menu</h2>
      <Demo
        code={`<Dropdown trigger={<Button intent="outline">Actions ▾</Button>}>
  <DropdownItem icon={<EditIcon />} shortcut="⌘E">Edit</DropdownItem>
  <DropdownItem icon={<CopyIcon />} shortcut="⌘D">Duplicate</DropdownItem>
  <DropdownItem icon={<ArchiveIcon />}>Archive</DropdownItem>
  <DropdownSeparator />
  <DropdownItem icon={<TrashIcon />} danger shortcut="⌫">Delete</DropdownItem>
</Dropdown>`}
      >
        <Dropdown trigger={<Button intent="outline">Actions ▾</Button>}>
          <DropdownItem icon={EditIcon} shortcut="⌘E">Edit</DropdownItem>
          <DropdownItem icon={CopyIcon} shortcut="⌘D">Duplicate</DropdownItem>
          <DropdownItem icon={ArchiveIcon}>Archive</DropdownItem>
          <DropdownSeparator />
          <DropdownItem icon={TrashIcon} danger shortcut="⌫">Delete</DropdownItem>
        </Dropdown>
      </Demo>

      <h2>Groups + checked state</h2>
      <p>
        Use <code>DropdownGroup</code> for section headings and <code>checked</code> on an item for
        a single-select radio-like pattern.
      </p>
      <Demo
        code={`const [sort, setSort] = useState<'asc' | 'desc' | 'created'>('created')

<Dropdown trigger={<Button intent="outline">Sort by ▾</Button>}>
  <DropdownGroup label="Alphabetical">
    <DropdownItem checked={sort === 'asc'}  onClick={() => setSort('asc')}>A → Z</DropdownItem>
    <DropdownItem checked={sort === 'desc'} onClick={() => setSort('desc')}>Z → A</DropdownItem>
  </DropdownGroup>
  <DropdownSeparator />
  <DropdownGroup label="Time">
    <DropdownItem checked={sort === 'created'} onClick={() => setSort('created')}>Newest</DropdownItem>
  </DropdownGroup>
</Dropdown>`}
      >
        <Dropdown trigger={<Button intent="outline">Sort by ▾</Button>}>
          <DropdownGroup label="Alphabetical">
            <DropdownItem checked={checked === 'asc'} onClick={() => setChecked('asc')}>A → Z</DropdownItem>
            <DropdownItem checked={checked === 'desc'} onClick={() => setChecked('desc')}>Z → A</DropdownItem>
          </DropdownGroup>
          <DropdownSeparator />
          <DropdownGroup label="Time">
            <DropdownItem checked={checked === 'created'} onClick={() => setChecked('created')}>Newest</DropdownItem>
          </DropdownGroup>
        </Dropdown>
      </Demo>

      <h2>Searchable menu</h2>
      <p>
        Drop a <code>DropdownSearch</code> above the items and filter the list yourself. Great for
        picking from a list of regions, tags, or teammates.
      </p>
      <Demo
        code={`const [search, setSearch] = useState('')
const filtered = regions.filter(r => r.includes(search))

<Dropdown trigger={<Button intent="outline">Region ▾</Button>}>
  <DropdownSearch value={search} onChange={setSearch} placeholder="Filter regions…" />
  {filtered.map(r => <DropdownItem key={r}>{r}</DropdownItem>)}
</Dropdown>`}
      >
        <Dropdown trigger={<Button intent="outline">Region ▾</Button>}>
          <DropdownSearch value={search} onChange={setSearch} placeholder="Filter regions…" />
          {filtered.length === 0 ? (
            <div style={{ padding: '8px 10px', fontSize: 12, color: 'var(--color-text-dim)' }}>
              No matches
            </div>
          ) : (
            filtered.map((r) => <DropdownItem key={r}>{r}</DropdownItem>)
          )}
        </Dropdown>
      </Demo>

      <h2>Placement + custom width</h2>
      <Demo
        code={`<Dropdown
  trigger={<Button>End-aligned ▾</Button>}
  placement="bottom-end"
  width={320}
>
  <DropdownItem>Item in a wider menu</DropdownItem>
  <DropdownItem>Another item</DropdownItem>
</Dropdown>`}
      >
        <Dropdown
          trigger={<Button>End-aligned ▾</Button>}
          placement="bottom-end"
          width={320}
        >
          <DropdownItem>Item in a wider menu</DropdownItem>
          <DropdownItem>Another item</DropdownItem>
        </Dropdown>
      </Demo>

      <h2>Dropdown API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>trigger</code></td><td><code>ReactElement</code></td><td>—</td><td>Single element; receives <code>onClick</code> + <code>ref</code> to drive the popover.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Menu contents. Typically <code>DropdownItem</code>, groups, separators.</td></tr>
          <tr><td><code>placement</code></td><td><code>PopoverPlacement</code></td><td><code>'bottom-start'</code></td><td>One of <code>bottom-start</code>, <code>bottom-end</code>, <code>bottom</code>, <code>top-start</code>, <code>top-end</code>, <code>top</code>.</td></tr>
          <tr><td><code>offset</code></td><td><code>number</code></td><td><code>6</code></td><td>Gap between trigger and menu, in px.</td></tr>
          <tr><td><code>width</code></td><td><code>number | string</code></td><td><code>240</code></td><td>Fixed menu width.</td></tr>
          <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>Controlled open state. Uncontrolled if omitted.</td></tr>
          <tr><td><code>onOpenChange</code></td><td><code>(open: boolean) =&gt; void</code></td><td>—</td><td>Notified on open/close (outside click, ESC, toggle).</td></tr>
        </tbody>
      </Table>

      <h2>DropdownItem API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>icon</code></td><td><code>ReactNode</code></td><td>—</td><td>Leading icon (SVG).</td></tr>
          <tr><td><code>shortcut</code></td><td><code>ReactNode</code></td><td>—</td><td>Trailing monospace hint. Hidden if <code>checked</code> or <code>submenu</code> is set.</td></tr>
          <tr><td><code>checked</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a trailing check mark. Use for single-select menus.</td></tr>
          <tr><td><code>active</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Persistent highlight (current page, current filter).</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Muted + non-interactive.</td></tr>
          <tr><td><code>danger</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Red text for destructive actions (Delete, Revoke, …).</td></tr>
          <tr><td><code>submenu</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a trailing ›. Purely visual — wire up the submenu yourself.</td></tr>
          <tr><td><code>onClick</code></td><td><code>(e: MouseEvent) =&gt; void</code></td><td>—</td><td>Standard click handler.</td></tr>
        </tbody>
      </Table>

      <h2>Helpers</h2>
      <Table>
        <thead>
          <tr><th>Export</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td><code>DropdownGroup</code></td><td>Optional small-caps <code>label</code> above a set of items.</td></tr>
          <tr><td><code>DropdownSeparator</code></td><td>Thin horizontal line between sections.</td></tr>
          <tr><td><code>DropdownSearch</code></td><td>Filter input rendered at the top of the menu. You still filter the items.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
