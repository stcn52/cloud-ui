import { useState } from 'react'
import {
  Banner,
  Button,
  CommandPalette,
  Table,
  toast,
  type CommandItem,
} from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

// The palette takes a flat `items` array — not children — because it owns the
// filter + keyboard nav. We define items once up here and reuse across demos.
const basicItems: CommandItem[] = [
  { id: 'deploy-api',    label: 'Deploy api-gateway to production', onSelect: () => toast.success('Deploying api-gateway…') },
  { id: 'deploy-auth',   label: 'Deploy auth-service to production', onSelect: () => toast.success('Deploying auth-service…') },
  { id: 'rollback',      label: 'Rollback last deploy',              onSelect: () => toast.warn('Rolled back') },
  { id: 'view-deploys',  label: 'View all deployments',              onSelect: () => toast.info('Opening deployments') },
  { id: 'invite',        label: 'Invite teammate',                   onSelect: () => toast('Invite dialog would open') },
]

const groupedItems: CommandItem[] = [
  { id: 'deploy-api',    group: 'Actions',   label: 'Deploy api-gateway',     shortcut: '⌘↵', onSelect: () => toast.success('Deploying…') },
  { id: 'rollback',      group: 'Actions',   label: 'Rollback last deploy',   shortcut: '⌘⇧R', onSelect: () => toast.warn('Rolled back') },
  { id: 'invite',        group: 'Actions',   label: 'Invite teammate',        onSelect: () => toast('Invite dialog') },
  { id: 'api-gateway',   group: 'Resources', label: 'api-gateway · Healthy',  onSelect: () => toast.info('Navigate to api-gateway') },
  { id: 'auth-service',  group: 'Resources', label: 'auth-service · Healthy', onSelect: () => toast.info('Navigate to auth-service') },
  { id: 'ingest-worker', group: 'Resources', label: 'ingest-worker · Degraded', onSelect: () => toast.warn('ingest-worker is degraded') },
]

export default function CommandPalettePage() {
  return (
    <article className="page">
      <h1>CommandPalette</h1>
      <p>
        Modal keyboard-driven launcher. Fuzzy-filter over a flat list of items, arrow-keys to
        navigate, Enter to select, Escape to close.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Power-user shortcuts (<code>⌘K</code>) and "run command" flows. Not for ordinary menus —
        use <code>Popover</code> or <code>Dropdown</code>.
      </Banner>

      <Banner tone="info" title="API shape" style={{ margin: '16px 0' }}>
        <code>CommandPalette</code> is declarative over <em>data</em>, not <em>children</em>. You
        pass an <code>items</code> array of{' '}
        <code>{'{ id, label, group?, icon?, shortcut?, onSelect? }'}</code>. The palette handles
        grouping, filtering, and keyboard nav for you.
      </Banner>

      <h2>Basic</h2>
      <p>
        Controlled <code>open</code> + <code>onClose</code>. The trigger is whatever you want — a
        button, a keyboard shortcut, or both.
      </p>
      <BasicDemo />

      <h2>Grouped items</h2>
      <p>
        Set <code>group</code> on an item to render a section header. Items without a group appear
        at the top.
      </p>
      <GroupedDemo />

      <h2>Custom placeholder + empty label</h2>
      <CustomCopyDemo />

      <h2>CommandPalette API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>Controlled visibility. Required.</td></tr>
          <tr><td><code>onClose</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Called on Escape, backdrop click, or after a selection.</td></tr>
          <tr><td><code>items</code></td><td><code>CommandItem[]</code></td><td>—</td><td>Flat array. Grouping is derived from each item's <code>group</code>.</td></tr>
          <tr><td><code>placeholder</code></td><td><code>string</code></td><td>locale</td><td>Search input placeholder.</td></tr>
          <tr><td><code>emptyLabel</code></td><td><code>ReactNode</code></td><td>locale</td><td>Text shown when no items match.</td></tr>
          <tr><td><code>filter</code></td><td><code>(item, query) =&gt; boolean</code></td><td>substring match</td><td>Override the default matcher.</td></tr>
        </tbody>
      </Table>

      <h2>CommandItem</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>id</code></td><td><code>string</code></td><td>React key. Must be unique within <code>items</code>.</td></tr>
          <tr><td><code>label</code></td><td><code>string</code></td><td>Displayed text. The default filter matches against this.</td></tr>
          <tr><td><code>group</code></td><td><code>string?</code></td><td>Section heading. Items with the same group are rendered together.</td></tr>
          <tr><td><code>icon</code></td><td><code>ReactNode?</code></td><td>Leading icon.</td></tr>
          <tr><td><code>shortcut</code></td><td><code>ReactNode?</code></td><td>Right-aligned hint (e.g. <code>⌘↵</code>).</td></tr>
          <tr><td><code>onSelect</code></td><td><code>() =&gt; void</code></td><td>Called on click / Enter. The palette closes immediately after.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}

function BasicDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Demo
      code={`const [open, setOpen] = useState(false)

const items: CommandItem[] = [
  { id: 'deploy-api', label: 'Deploy api-gateway to production',
    onSelect: () => toast.success('Deploying…') },
  { id: 'rollback', label: 'Rollback last deploy',
    onSelect: () => toast.warn('Rolled back') },
  // …
]

<Button onClick={() => setOpen(true)}>Open palette</Button>
<CommandPalette
  open={open}
  onClose={() => setOpen(false)}
  items={items}
/>`}
    >
      <Button onClick={() => setOpen(true)}>Open palette</Button>
      <CommandPalette open={open} onClose={() => setOpen(false)} items={basicItems} />
    </Demo>
  )
}

function GroupedDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Demo
      code={`const items: CommandItem[] = [
  { id: 'deploy-api',   group: 'Actions',   label: 'Deploy api-gateway',     shortcut: '⌘↵' },
  { id: 'rollback',     group: 'Actions',   label: 'Rollback last deploy',   shortcut: '⌘⇧R' },
  { id: 'api-gateway',  group: 'Resources', label: 'api-gateway · Healthy'  },
  { id: 'ingest-worker',group: 'Resources', label: 'ingest-worker · Degraded' },
]

<CommandPalette open={open} onClose={...} items={items} />`}
    >
      <Button onClick={() => setOpen(true)}>Open grouped palette</Button>
      <CommandPalette open={open} onClose={() => setOpen(false)} items={groupedItems} />
    </Demo>
  )
}

function CustomCopyDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Demo
      code={`<CommandPalette
  open={open}
  onClose={() => setOpen(false)}
  items={items}
  placeholder="Jump to a service…"
  emptyLabel="No services match."
/>`}
    >
      <Button intent="outline" onClick={() => setOpen(true)}>
        Open with custom copy
      </Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        items={basicItems}
        placeholder="Jump to a service…"
        emptyLabel="No services match."
      />
    </Demo>
  )
}
