import { useState } from 'react'
import {
  QueryBuilder,
  queryToString,
  emptyGroup,
  type QueryField,
  type QueryGroup,
  Table,
  Banner,
} from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const fields: QueryField[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'cpu', label: 'vCPUs', type: 'number' },
  { name: 'region', label: 'Region', type: 'select', options: [
    { value: 'us-east-1', label: 'us-east-1' },
    { value: 'us-west-2', label: 'us-west-2' },
    { value: 'eu-west-1', label: 'eu-west-1' },
  ] },
  { name: 'status', label: 'Status', type: 'select', options: [
    { value: 'running', label: 'running' },
    { value: 'stopped', label: 'stopped' },
    { value: 'error', label: 'error' },
  ] },
  { name: 'managed', label: 'Managed', type: 'boolean' },
  { name: 'created', label: 'Created', type: 'date' },
]

function BasicQueryDemo() {
  const [q, setQ] = useState<QueryGroup>({
    ...emptyGroup('and'),
    rules: [
      { id: 'r1', field: 'region', op: 'eq', value: 'us-east-1' },
      { id: 'r2', field: 'cpu', op: 'gte', value: '8' },
    ],
  })
  return (
    <div style={{ width: 620, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ border: '1px solid var(--color-line)', borderRadius: 8, background: 'var(--color-bg-elev)', padding: 16 }}>
        <QueryBuilder fields={fields} value={q} onChange={setQ} />
      </div>
      <pre style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)', background: 'var(--color-bg-sunk)', borderRadius: 6, border: '1px solid var(--color-line)', padding: 12, whiteSpace: 'pre-wrap' }}>
        {queryToString(q, fields)}
      </pre>
    </div>
  )
}

function NestedQueryDemo() {
  const [q, setQ] = useState<QueryGroup>({
    id: 'g0', combinator: 'and',
    rules: [
      { id: 'r1', field: 'status', op: 'eq', value: 'running' },
      { id: 'g1', combinator: 'or', rules: [
        { id: 'r2', field: 'region', op: 'eq', value: 'us-east-1' },
        { id: 'r3', field: 'region', op: 'eq', value: 'us-west-2' },
      ] },
    ],
  })
  return (
    <div style={{ width: 660, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ border: '1px solid var(--color-line)', borderRadius: 8, background: 'var(--color-bg-elev)', padding: 16 }}>
        <QueryBuilder fields={fields} value={q} onChange={setQ} maxDepth={3} />
      </div>
      <pre style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)', background: 'var(--color-bg-sunk)', borderRadius: 6, border: '1px solid var(--color-line)', padding: 12, whiteSpace: 'pre-wrap' }}>
        {queryToString(q, fields)}
      </pre>
    </div>
  )
}

function FlatQueryDemo() {
  const [q, setQ] = useState<QueryGroup>(emptyGroup('or'))
  return (
    <div style={{ width: 580, border: '1px solid var(--color-line)', borderRadius: 8, background: 'var(--color-bg-elev)', padding: 16 }}>
      <QueryBuilder fields={fields} value={q} onChange={setQ} allowGroups={false} />
    </div>
  )
}

export default function QueryBuilderPage() {
  return (
    <article className="page">
      <h1>QueryBuilder</h1>
      <p>
        A visual rule builder — compose <code>AND</code> / <code>OR</code> conditions (and nested
        sub-groups) over a typed <code>fields</code> list. Each rule is a <em>field</em> +{' '}
        <em>operator</em> + <em>value</em>; the operator set and value editor adapt to the field
        type (<code>text</code> / <code>number</code> / <code>select</code> / <code>boolean</code> /{' '}
        <code>date</code>). The query is a plain serializable tree; the exported{' '}
        <code>queryToString</code> renders it as a readable expression.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Saved filters / segments / alert conditions where the user composes structured logic. For a
        couple of fixed filters, use <code>FilterChip</code> or a row of <code>Select</code>s
        instead.
      </Banner>

      <h2>Basic</h2>
      <p>
        Controlled via <code>value</code> + <code>onChange</code> (or uncontrolled via{' '}
        <code>defaultValue</code>); seed an empty tree with <code>emptyGroup('and')</code>. Toggle
        the root combinator, add conditions, and remove them inline. The <code>&lt;pre&gt;</code>{' '}
        below mirrors the live tree via <code>queryToString(query, fields)</code>.
      </p>
      <Demo
        code={`const [q, setQ] = useState<QueryGroup>({
  ...emptyGroup('and'),
  rules: [
    { id: 'r1', field: 'region', op: 'eq', value: 'us-east-1' },
    { id: 'r2', field: 'cpu', op: 'gte', value: '8' },
  ],
})

<QueryBuilder fields={fields} value={q} onChange={setQ} />
<pre>{queryToString(q, fields)}</pre>`}
      >
        <BasicQueryDemo />
      </Demo>

      <h2>Nested groups</h2>
      <p>
        "+ Group" nests an <code>AND</code>/<code>OR</code> sub-group (it starts with the opposite
        combinator of its parent) up to <code>maxDepth</code> levels — the classic "X AND (Y OR Z)"
        shape.
      </p>
      <Demo
        code={`<QueryBuilder
  fields={fields}
  value={q}
  onChange={setQ}
  maxDepth={3}
/>

// q:
// {
//   id: 'g0', combinator: 'and',
//   rules: [
//     { id: 'r1', field: 'status', op: 'eq', value: 'running' },
//     { id: 'g1', combinator: 'or', rules: [ /* region in (...) */ ] },
//   ],
// }`}
      >
        <NestedQueryDemo />
      </Demo>

      <h2>Flat only</h2>
      <p>
        <code>allowGroups={'{false}'}</code> keeps it to a single flat <code>AND</code>/<code>OR</code>{' '}
        list — no nesting, no "+ Group" button.
      </p>
      <Demo
        code={`<QueryBuilder fields={fields} value={q} onChange={setQ} allowGroups={false} />`}
      >
        <FlatQueryDemo />
      </Demo>

      <h2>QueryBuilder API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>fields</code></td><td><code>QueryField[]</code></td><td>—</td><td>The fields a rule can target. Required (must be non-empty).</td></tr>
          <tr><td><code>value</code></td><td><code>QueryGroup</code></td><td>—</td><td>Controlled query tree.</td></tr>
          <tr><td><code>defaultValue</code></td><td><code>QueryGroup</code></td><td><code>emptyGroup()</code></td><td>Uncontrolled initial tree.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(value: QueryGroup) =&gt; void</code></td><td>—</td><td>Fires with the new tree on any edit.</td></tr>
          <tr><td><code>allowGroups</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Allow nested AND/OR sub-groups.</td></tr>
          <tr><td><code>maxDepth</code></td><td><code>number</code></td><td><code>3</code></td><td>Max nesting depth (root = 0).</td></tr>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Merged onto the root <code>&lt;div&gt;</code>.</td></tr>
          <tr><td>…<code>HTMLAttributes</code></td><td><code>HTMLAttributes&lt;HTMLDivElement&gt;</code></td><td>—</td><td>Remaining div attributes (minus <code>onChange</code> / <code>defaultValue</code>).</td></tr>
        </tbody>
      </Table>

      <h2>Exports</h2>
      <Table>
        <thead>
          <tr><th>Export</th><th>Signature</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>queryToString</code></td><td><code>(node: QueryNode, fields: QueryField[]) =&gt; string</code></td><td>Render a query tree as a readable expression, e.g. <code>(Status is "running" AND (Region is "us-east-1" OR Region is "us-west-2"))</code>.</td></tr>
          <tr><td><code>emptyGroup</code></td><td><code>(combinator?: 'and' | 'or') =&gt; QueryGroup</code></td><td>Build a fresh empty group (with a generated id) — handy for seeding state.</td></tr>
        </tbody>
      </Table>

      <h2>QueryField</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Stable key (stored on each rule's <code>field</code>). Required.</td></tr>
          <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Display name in the field picker. Required.</td></tr>
          <tr><td><code>type</code></td><td><code>'text' | 'number' | 'select' | 'boolean' | 'date'</code></td><td>—</td><td>Drives the operator set and the value editor. Required.</td></tr>
          <tr><td><code>options</code></td><td><code>{'{ value: string; label: string }[]'}</code></td><td>—</td><td>Allowed values — required for <code>type: 'select'</code>.</td></tr>
        </tbody>
      </Table>

      <h2>QueryRule / QueryGroup</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>QueryRule.id</code></td><td><code>string</code></td><td>Unique node id.</td></tr>
          <tr><td><code>QueryRule.field</code></td><td><code>string</code></td><td>Which <code>QueryField.name</code> this rule targets.</td></tr>
          <tr><td><code>QueryRule.op</code></td><td><code>string</code></td><td>Operator key — one of the set for the field's type (e.g. <code>eq</code>, <code>contains</code>, <code>gte</code>, <code>before</code>, <code>empty</code>).</td></tr>
          <tr><td><code>QueryRule.value</code></td><td><code>string</code></td><td>The comparison value (always a string — parse per field type). Ignored for value-less ops like <code>empty</code>.</td></tr>
          <tr><td><code>QueryGroup.id</code></td><td><code>string</code></td><td>Unique node id.</td></tr>
          <tr><td><code>QueryGroup.combinator</code></td><td><code>'and' | 'or'</code></td><td>How this group's children are joined.</td></tr>
          <tr><td><code>QueryGroup.rules</code></td><td><code>(QueryRule | QueryGroup)[]</code></td><td>Children — rules and/or nested groups. <code>QueryNode</code> is the union of the two.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
