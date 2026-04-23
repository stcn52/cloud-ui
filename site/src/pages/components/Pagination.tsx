import { useState } from 'react'
import { Pagination, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function BasicPaginationDemo() {
  const [page, setPage] = useState(3)
  return <Pagination current={page} total={485} pageSize={25} onChange={setPage} />
}

function SummaryPaginationDemo() {
  const [page, setPage] = useState(2)
  const total = 132
  const pageSize = 20
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono, monospace)' }}>
        Showing {start}–{end} of {total}
      </div>
      <Pagination current={page} total={total} pageSize={pageSize} onChange={setPage} />
    </div>
  )
}

function LargeDatasetDemo() {
  const [page, setPage] = useState(42)
  return <Pagination current={page} total={20_000} pageSize={25} siblingCount={5} onChange={setPage} />
}

function CustomLabelsDemo() {
  const [page, setPage] = useState(1)
  return (
    <Pagination
      current={page}
      total={50}
      pageSize={10}
      prevLabel="←"
      nextLabel="→"
      onChange={setPage}
    />
  )
}

export default function PaginationPage() {
  return (
    <article className="page">
      <h1>Pagination</h1>
      <p>
        Compact page selector with prev/next, numeric siblings, and collapsed ellipses for long
        ranges. Always controlled — the consumer owns the current page. The total is{' '}
        <strong>total rows</strong>, and <code>pageSize</code> determines page count.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Server-paged tables and lists where the total row count is known. For infinite scroll or
        cursor paging, render a load-more button instead.
      </Banner>

      <h2>Basic</h2>
      <p>
        Paginate 485 rows at 25 per page. <code>totalPages</code> is computed for you as{' '}
        <code>Math.ceil(total / pageSize)</code>.
      </p>
      <Demo
        code={`const [page, setPage] = useState(3)

<Pagination current={page} total={485} pageSize={25} onChange={setPage} />`}
      >
        <BasicPaginationDemo />
      </Demo>

      <h2>With a row-range summary</h2>
      <p>
        Pair the control with a summary like "Showing X–Y of Z" so users know where they are. The
        summary is plain text you compute from <code>current</code> and <code>pageSize</code>.
      </p>
      <Demo
        code={`const [page, setPage] = useState(2)
const total = 132
const pageSize = 20
const start = (page - 1) * pageSize + 1
const end = Math.min(page * pageSize, total)

<>
  <div>Showing {start}–{end} of {total}</div>
  <Pagination current={page} total={total} pageSize={pageSize} onChange={setPage} />
</>`}
      >
        <SummaryPaginationDemo />
      </Demo>

      <h2>Large dataset</h2>
      <p>
        With 20,000 rows at 25/page the middle pages collapse into <code>…</code> so the control
        stays on one line.
      </p>
      <Demo
        code={`<Pagination
  current={42}
  total={20_000}
  pageSize={25}
  siblingCount={5}
  onChange={setPage}
/>`}
      >
        <LargeDatasetDemo />
      </Demo>

      <h2>Custom prev/next labels</h2>
      <p>
        Defaults come from the active locale. Override per-instance with{' '}
        <code>prevLabel</code> / <code>nextLabel</code>.
      </p>
      <Demo
        code={`<Pagination
  current={1}
  total={50}
  pageSize={10}
  prevLabel="←"
  nextLabel="→"
  onChange={setPage}
/>`}
      >
        <CustomLabelsDemo />
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>current</code></td><td><code>number</code></td><td>—</td><td>Current page (1-based). Required.</td></tr>
          <tr><td><code>total</code></td><td><code>number</code></td><td>—</td><td>Total number of <strong>rows</strong> (not pages). Required.</td></tr>
          <tr><td><code>pageSize</code></td><td><code>number</code></td><td><code>10</code></td><td>Rows per page. Drives <code>totalPages = Math.ceil(total / pageSize)</code>.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(page: number) =&gt; void</code></td><td>—</td><td>Fires when the user picks a new page.</td></tr>
          <tr><td><code>siblingCount</code></td><td><code>number</code></td><td><code>5</code></td><td>Max numeric buttons shown (excluding prev/next/ellipsis).</td></tr>
          <tr><td><code>prevLabel</code></td><td><code>ReactNode</code></td><td>locale</td><td>Content of the previous button.</td></tr>
          <tr><td><code>nextLabel</code></td><td><code>ReactNode</code></td><td>locale</td><td>Content of the next button.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
