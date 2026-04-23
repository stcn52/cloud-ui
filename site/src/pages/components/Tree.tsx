import { useState } from 'react'
import { Tree, type TreeNode, Table, Banner, Pill } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const FolderIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
  </svg>
)
const FileIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
)

const fileTree: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: FolderIcon,
    children: [
      {
        id: 'src/components',
        label: 'components',
        icon: FolderIcon,
        meta: '37',
        children: [
          { id: 'src/components/Button.tsx', label: 'Button.tsx', icon: FileIcon, meta: '4 kB' },
          { id: 'src/components/Input.tsx', label: 'Input.tsx', icon: FileIcon, meta: '3 kB' },
          { id: 'src/components/Toast.tsx', label: 'Toast.tsx', icon: FileIcon, meta: '7 kB' },
        ],
      },
      {
        id: 'src/hooks',
        label: 'hooks',
        icon: FolderIcon,
        children: [
          { id: 'src/hooks/useContextMenu.ts', label: 'useContextMenu.ts', icon: FileIcon, meta: '1 kB' },
        ],
      },
      { id: 'src/index.ts', label: 'index.ts', icon: FileIcon, meta: '2 kB' },
    ],
  },
  {
    id: 'docs',
    label: 'docs',
    icon: FolderIcon,
    children: [
      { id: 'docs/README.md', label: 'README.md', icon: FileIcon, meta: '6 kB' },
    ],
  },
  { id: 'package.json', label: 'package.json', icon: FileIcon, meta: '1 kB' },
]

const simple: TreeNode[] = [
  {
    id: 'platform',
    label: 'Platform',
    children: [
      { id: 'platform.gateway', label: 'api-gateway' },
      { id: 'platform.auth', label: 'auth-service' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    children: [
      { id: 'data.warehouse', label: 'warehouse' },
      { id: 'data.etl', label: 'etl-pipeline' },
    ],
  },
]

function ControlledDemo() {
  const [selected, setSelected] = useState<string | null>('src/components/Button.tsx')
  const [expanded, setExpanded] = useState<string[]>(['src', 'src/components'])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 360 }}>
      <Tree
        data={fileTree}
        expanded={expanded}
        onExpandedChange={setExpanded}
        selected={selected}
        onSelectedChange={(v) => setSelected(typeof v === 'string' || v === null ? v : null)}
      />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-muted)' }}>
        selected = <Pill tone="info">{selected ?? 'null'}</Pill>
      </div>
    </div>
  )
}

function MultiDemo() {
  const [selected, setSelected] = useState<string[]>(['src/components/Input.tsx'])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 360 }}>
      <Tree
        data={fileTree}
        selectionMode="multiple"
        defaultExpanded={['src', 'src/components']}
        selected={selected}
        onSelectedChange={(v) => setSelected(Array.isArray(v) ? v : [])}
      />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-muted)' }}>
        selected = <Pill tone="info">[{selected.join(', ') || 'empty'}]</Pill>
      </div>
    </div>
  )
}

function CheckboxDemo() {
  const [selected, setSelected] = useState<string[]>([])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 360 }}>
      <Tree
        data={fileTree}
        selectionMode="checkbox"
        defaultExpanded={['src', 'src/components']}
        selected={selected}
        onSelectedChange={(v) => setSelected(Array.isArray(v) ? v : [])}
      />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-muted)' }}>
        leaves checked = <Pill tone="info">{selected.length}</Pill>
      </div>
    </div>
  )
}

export default function TreePage() {
  return (
    <article className="page">
      <h1>Tree</h1>
      <p>
        A hierarchical list with click-to-expand branches, three selection modes (single,
        multiple, checkbox), and keyboard navigation (<kbd>Enter</kbd>/<kbd>Space</kbd> select,{' '}
        <kbd>←</kbd>/<kbd>→</kbd> collapse and expand).
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Deep, browsable trees: file explorers, nav trees, org charts, resource namespaces. For
        picking across 2–4 known levels use <code>Cascader</code> instead — it has a flatter UI.
      </Banner>

      <h2>Single (default)</h2>
      <p>
        The default mode — one id at a time. Clicking a row selects it (and toggles expansion for
        branches). <code>selected</code> is <code>string | null</code>.
      </p>
      <Demo
        code={`<Tree
  data={fileTree}
  defaultExpanded={['src', 'src/components']}
  defaultSelected="src/components/Button.tsx"
/>`}
      >
        <Tree
          data={fileTree}
          defaultExpanded={['src', 'src/components']}
          defaultSelected="src/components/Button.tsx"
          style={{ width: 360 }}
        />
      </Demo>

      <h2>Controlled (single)</h2>
      <p>
        Own either or both of <code>expanded</code> and <code>selected</code>. Listeners still
        fire in both modes.
      </p>
      <Demo
        code={`const [selected, setSelected] = useState<string | null>('src/components/Button.tsx')
const [expanded, setExpanded] = useState<string[]>(['src', 'src/components'])

<Tree
  data={fileTree}
  expanded={expanded}
  onExpandedChange={setExpanded}
  selected={selected}
  onSelectedChange={(v) => setSelected(typeof v === 'string' || v === null ? v : null)}
/>`}
      >
        <ControlledDemo />
      </Demo>

      <h2>Multiple selection</h2>
      <p>
        <code>selectionMode="multiple"</code> lets the user toggle any row into a set. Click to
        add/remove — <code>selected</code> is <code>string[]</code>.
      </p>
      <Demo
        code={`const [selected, setSelected] = useState<string[]>([])

<Tree
  data={fileTree}
  selectionMode="multiple"
  defaultExpanded={['src', 'src/components']}
  selected={selected}
  onSelectedChange={(v) => setSelected(Array.isArray(v) ? v : [])}
/>`}
      >
        <MultiDemo />
      </Demo>

      <h2>Checkbox mode (with indeterminate parents)</h2>
      <p>
        <code>selectionMode="checkbox"</code> renders a checkbox per row. Toggling a parent casc­ades
        to every leaf descendant. Selection is stored as the set of <em>leaf</em> ids — parent
        state (<code>checked</code> / <code>indeterminate</code>) is derived automatically.
      </p>
      <Demo
        code={`const [selected, setSelected] = useState<string[]>([])

<Tree
  data={fileTree}
  selectionMode="checkbox"
  defaultExpanded={['src', 'src/components']}
  selected={selected}
  onSelectedChange={(v) => setSelected(Array.isArray(v) ? v : [])}
/>`}
      >
        <CheckboxDemo />
      </Demo>

      <h2>Minimal (no icons, no meta)</h2>
      <Demo
        code={`<Tree
  data={[
    { id: 'platform', label: 'Platform', children: [
      { id: 'p.gw',   label: 'api-gateway' },
      { id: 'p.auth', label: 'auth-service' },
    ]},
    { id: 'data', label: 'Data', children: [
      { id: 'd.wh',  label: 'warehouse' },
      { id: 'd.etl', label: 'etl-pipeline' },
    ]},
  ]}
/>`}
      >
        <Tree data={simple} defaultExpanded={['platform']} style={{ width: 280 }} />
      </Demo>

      <h2>Tree API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>data</code></td><td><code>TreeNode[]</code></td><td>—</td><td>Root nodes.</td></tr>
          <tr><td><code>selectionMode</code></td><td><code>'single' | 'multiple' | 'checkbox'</code></td><td><code>'single'</code></td><td>How rows become selected. Determines the shape of <code>selected</code>.</td></tr>
          <tr><td><code>expanded</code></td><td><code>string[]</code></td><td>—</td><td>Controlled set of open node ids.</td></tr>
          <tr><td><code>defaultExpanded</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>Uncontrolled initial set.</td></tr>
          <tr><td><code>onExpandedChange</code></td><td><code>(ids: string[]) =&gt; void</code></td><td>—</td><td>Fires on every branch toggle.</td></tr>
          <tr><td><code>selected</code></td><td><code>string | null | string[]</code></td><td>—</td><td>Controlled selection. <code>string | null</code> for single mode, <code>string[]</code> for multiple / checkbox.</td></tr>
          <tr><td><code>defaultSelected</code></td><td><code>string | null | string[]</code></td><td>mode default</td><td>Uncontrolled initial selection.</td></tr>
          <tr><td><code>onSelectedChange</code></td><td><code>(value: string | null | string[]) =&gt; void</code></td><td>—</td><td>Fires on every selection change. Shape depends on <code>selectionMode</code>.</td></tr>
          <tr><td><code>onSelect</code></td><td><code>(id: string, node: TreeNode) =&gt; void</code></td><td>—</td><td>Legacy per-row callback; still fires for every mode.</td></tr>
        </tbody>
      </Table>

      <h2>TreeNode</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>id</code></td><td><code>string</code></td><td>Stable, unique id used for expansion + selection state.</td></tr>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td>Row text.</td></tr>
          <tr><td><code>icon</code></td><td><code>ReactNode</code></td><td>Optional leading glyph (SVG).</td></tr>
          <tr><td><code>meta</code></td><td><code>ReactNode</code></td><td>Right-aligned monospace metadata (size, count, …).</td></tr>
          <tr><td><code>children</code></td><td><code>TreeNode[]</code></td><td>Nested nodes. Empty or missing = leaf.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
