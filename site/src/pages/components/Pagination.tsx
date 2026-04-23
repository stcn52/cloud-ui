import { useState } from 'react'
import { Pagination, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function PaginationPage() {
  const [page, setPage] = useState(3)
  const [bigPage, setBigPage] = useState(12)

  return (
    <article className="page">
      <h1>Pagination</h1>
      <p>
        Compact page selector with prev/next, numeric siblings, and collapsed ellipses for long
        ranges. Always controlled — the consumer owns the current page.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Server-paged tables and lists where total count is known. For infinite scroll or cursor
        paging, render a load-more button instead.
      </Banner>

      <h2>Basic</h2>
      <p>
        Controlled by <code>page</code> + <code>onChange</code>. Click a number, prev, or next to
        move the cursor. Prev/next auto-disable at the edges.
      </p>
      <Demo
        code={`const [page, setPage] = useState(3)

<Pagination page={page} total={10} onChange={setPage} />`}
      >
        <Pagination page={page} total={10} onChange={setPage} />
      </Demo>

      <h2>Long range with ellipses</h2>
      <p>
        With a large <code>total</code>, middle pages collapse into <code>…</code> so the control
        stays one line wide. <code>siblingCount</code> controls how many numeric buttons show.
      </p>
      <Demo
        code={`<Pagination
  page={bigPage}
  total={42}
  siblingCount={5}
  onChange={setBigPage}
/>`}
      >
        <Pagination page={bigPage} total={42} siblingCount={5} onChange={setBigPage} />
      </Demo>

      <h2>Custom prev/next labels</h2>
      <p>
        Defaults come from the active locale. Override per-instance with{' '}
        <code>prevLabel</code> / <code>nextLabel</code>.
      </p>
      <Demo
        code={`<Pagination
  page={1}
  total={5}
  prevLabel="←"
  nextLabel="→"
  onChange={() => {}}
/>`}
      >
        <Pagination page={1} total={5} prevLabel="←" nextLabel="→" onChange={() => {}} />
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>page</code></td><td><code>number</code></td><td>—</td><td>Current page (1-based). Required.</td></tr>
          <tr><td><code>total</code></td><td><code>number</code></td><td>—</td><td>Total number of pages. Required.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(page: number) =&gt; void</code></td><td>—</td><td>Fires when the user picks a new page.</td></tr>
          <tr><td><code>siblingCount</code></td><td><code>number</code></td><td><code>5</code></td><td>Max numeric buttons shown (excluding prev/next/ellipsis).</td></tr>
          <tr><td><code>prevLabel</code></td><td><code>ReactNode</code></td><td>locale</td><td>Content of the previous button.</td></tr>
          <tr><td><code>nextLabel</code></td><td><code>ReactNode</code></td><td>locale</td><td>Content of the next button.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
