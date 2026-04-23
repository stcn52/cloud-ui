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
        onSelect={(id) => setSelected(id)}
      />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-muted)' }}>
        selected = <Pill tone="info">{selected ?? 'null'}</Pill>
      </div>
    </div>
  )
}

export default function TreePage() {
  return (
    <article className="page">
      <h1>Tree</h1>
      <p>
        A hierarchical list with click-to-expand branches, single selection, and keyboard
        navigation (<kbd>Enter</kbd>/<kbd>Space</kbd> select, <kbd>←</kbd>/<kbd>→</kbd> collapse and
        expand).
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Deep, browsable trees: file explorers, nav trees, org charts, resource namespaces. For
        picking across 2–4 known levels use <code>Cascader</code> instead — it has a flatter UI.
      </Banner>

      <h2>File tree (uncontrolled)</h2>
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

      <h2>Controlled (both axes)</h2>
      <p>
        Own either or both of <code>expanded</code> and <code>selected</code>. Listeners still fire
        in both modes.
      </p>
      <Demo
        code={`const [selected, setSelected] = useState<string | null>('src/components/Button.tsx')
const [expanded, setExpanded] = useState<string[]>(['src', 'src/components'])

<Tree
  data={fileTree}
  expanded={expanded}
  onExpandedChange={setExpanded}
  selected={selected}
  onSelect={(id) => setSelected(id)}
/>`}
      >
        <ControlledDemo />
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
          <tr><td><code>expanded</code></td><td><code>string[]</code></td><td>—</td><td>Controlled set of open node ids.</td></tr>
          <tr><td><code>defaultExpanded</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>Uncontrolled initial set.</td></tr>
          <tr><td><code>onExpandedChange</code></td><td><code>(ids: string[]) =&gt; void</code></td><td>—</td><td>Fires on every branch toggle.</td></tr>
          <tr><td><code>selected</code></td><td><code>string | null</code></td><td>—</td><td>Controlled selected id.</td></tr>
          <tr><td><code>defaultSelected</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Uncontrolled initial selection.</td></tr>
          <tr><td><code>onSelect</code></td><td><code>(id: string, node: TreeNode) =&gt; void</code></td><td>—</td><td>Fires on click or <kbd>Enter</kbd>/<kbd>Space</kbd>.</td></tr>
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

      <Banner tone="warn" title="Single selection only" style={{ margin: '16px 0' }}>
        <code>Tree</code> exposes one selected id at a time. Multi-select (checkbox tree) isn't
        built in — fork <code>renderTag</code>-style by handling selection yourself on top of{' '}
        <code>onSelect</code>.
      </Banner>
    </article>
  )
}
