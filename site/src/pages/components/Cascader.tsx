import { useState } from 'react'
import { Cascader, Table, Banner, Pill } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const regions = [
  {
    value: 'us',
    label: 'United States',
    children: [
      {
        value: 'us-east-1',
        label: 'us-east-1',
        children: [
          { value: 'us-east-1a', label: 'us-east-1a' },
          { value: 'us-east-1b', label: 'us-east-1b' },
          { value: 'us-east-1c', label: 'us-east-1c' },
        ],
      },
      {
        value: 'us-west-2',
        label: 'us-west-2',
        children: [
          { value: 'us-west-2a', label: 'us-west-2a' },
          { value: 'us-west-2b', label: 'us-west-2b' },
        ],
      },
    ],
  },
  {
    value: 'eu',
    label: 'Europe',
    children: [
      {
        value: 'eu-west-1',
        label: 'eu-west-1',
        children: [
          { value: 'eu-west-1a', label: 'eu-west-1a' },
          { value: 'eu-west-1b', label: 'eu-west-1b' },
        ],
      },
      {
        value: 'eu-central-1',
        label: 'eu-central-1',
        children: [
          { value: 'eu-central-1a', label: 'eu-central-1a' },
        ],
      },
    ],
  },
  {
    value: 'ap',
    label: 'Asia Pacific',
    children: [
      {
        value: 'ap-southeast-1',
        label: 'ap-southeast-1',
        children: [
          { value: 'ap-southeast-1a', label: 'ap-southeast-1a' },
          { value: 'ap-southeast-1b', label: 'ap-southeast-1b' },
        ],
      },
    ],
  },
]

const categories = [
  {
    value: 'compute',
    label: 'Compute',
    children: [
      { value: 'vm', label: 'Virtual machines' },
      { value: 'k8s', label: 'Kubernetes' },
      { value: 'lambda', label: 'Serverless' },
    ],
  },
  {
    value: 'storage',
    label: 'Storage',
    children: [
      { value: 'object', label: 'Object' },
      { value: 'block', label: 'Block' },
      { value: 'file', label: 'File' },
    ],
  },
]

export default function CascaderPage() {
  const [path, setPath] = useState<string[]>(['us', 'us-east-1', 'us-east-1a'])

  return (
    <article className="page">
      <h1>Cascader</h1>
      <p>
        A column-based picker for hierarchical data. Each selection opens the next column to the
        right until you hit a leaf.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Picking one item from a strict, nameable tree: region → zone, category → subcategory,
        country → state → city. For deep, search-y trees use <code>Tree</code>. For flat lists use{' '}
        <code>Select</code>.
      </Banner>

      <h2>Controlled</h2>
      <Demo
        code={`const [path, setPath] = useState(['us', 'us-east-1', 'us-east-1a'])

<Cascader
  options={regions}
  value={path}
  onChange={setPath}
/>
// path is the current array of values, one per depth`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <Cascader options={regions} value={path} onChange={setPath} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-muted)' }}>
            path = <Pill tone="info">{path.join(' / ') || '—'}</Pill>
          </div>
        </div>
      </Demo>

      <h2>Uncontrolled + onSelect</h2>
      <p>
        Use <code>defaultValue</code> for initial state and <code>onSelect</code> to react only when
        a leaf has been reached — useful when you want to close a popover on pick.
      </p>
      <Demo
        code={`<Cascader
  options={categories}
  defaultValue={['compute', 'k8s']}
  onSelect={(path) => console.log('picked leaf:', path)}
/>`}
      >
        <Cascader
          options={categories}
          defaultValue={['compute', 'k8s']}
          onSelect={(path) => console.log('picked leaf:', path)}
        />
      </Demo>

      <h2>Custom column width</h2>
      <Demo
        code={`<Cascader
  options={regions}
  defaultValue={['eu']}
  columnWidth={140}
/>`}
      >
        <Cascader options={regions} defaultValue={['eu']} columnWidth={140} />
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>options</code></td><td><code>CascaderOption[]</code></td><td>—</td><td>Root level options. Each may have <code>children</code>.</td></tr>
          <tr><td><code>value</code></td><td><code>string[]</code></td><td>—</td><td>Controlled path. Each entry is the <code>value</code> at that depth.</td></tr>
          <tr><td><code>defaultValue</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>Uncontrolled initial path.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(path: string[]) =&gt; void</code></td><td>—</td><td>Fires on every click — branch or leaf.</td></tr>
          <tr><td><code>onSelect</code></td><td><code>(path: string[]) =&gt; void</code></td><td>—</td><td>Fires only when a leaf (no <code>children</code>) is picked.</td></tr>
          <tr><td><code>columnWidth</code></td><td><code>number</code></td><td><code>180</code></td><td>Pixel width of each column.</td></tr>
        </tbody>
      </Table>

      <h2>CascaderOption</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>string</code></td><td>Stable id used in the path array.</td></tr>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td>What renders in the column row.</td></tr>
          <tr><td><code>children</code></td><td><code>CascaderOption[]</code></td><td>If present and non-empty, this row is a branch — picking it opens the next column instead of committing.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
