import { useState } from 'react'
import { Rating, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function InteractiveRatingDemo() {
  const [value, setValue] = useState(3)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Rating value={value} onChange={setValue} size="lg" />
      <span style={{ fontSize: 13 }}>{value}</span>
    </div>
  )
}

export default function RatingPage() {
  return (
    <article className="page">
      <h1>Rating</h1>
      <p>
        Star rating — a compact display of a 0–<code>max</code> score that accepts halves. Read-only by
        default; pass <code>onChange</code> to make it an interactive input where clicking the left or
        right half of a star picks a half or whole value.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Showing or capturing a 1–5 (or 1–10) quality score — reviews, feedback, satisfaction. For an
        arbitrary numeric input use <code>Input type="number"</code>; for a small fixed set of choices
        use <code>Segmented</code> or <code>RadioGroup</code>.
      </Banner>

      <h2>Display</h2>
      <p>
        Pass a <code>value</code>; fractional values render a half-filled star. The component renders a{' '}
        <code>role="img"</code> span with an accessible <code>{'`{value} of {max}`'}</code> label.
      </p>
      <Demo
        code={`<Rating value={4} />
<Rating value={4.2} />
<Rating value={3} />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <Rating value={4} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <Rating value={4.2} />
            <span style={{ color: 'var(--color-text-muted)' }}>4.2</span>
            <span style={{ color: 'var(--color-text-dim)' }}>· 1 248 reviews</span>
          </span>
          <Rating value={3} />
        </div>
      </Demo>

      <h2>Sizes</h2>
      <p>
        Three sizes. With no explicit <code>size</code> the component follows the global{' '}
        <code>ConfigProvider</code> density (<code>compact → sm</code>, <code>normal → md</code>,{' '}
        <code>comfortable → lg</code>).
      </p>
      <Demo
        code={`<Rating value={3} size="sm" />
<Rating value={3} size="md" />
<Rating value={3} size="lg" />`}
      >
        <Rating value={3} size="sm" />
        <Rating value={3} size="md" />
        <Rating value={3} size="lg" />
      </Demo>

      <h2>Interactive</h2>
      <p>
        Passing <code>onChange</code> turns the stars into a control: clicking a star's right half
        commits a whole number, the left half commits a half. Pass <code>readOnly</code> to keep the
        display non-interactive even with an <code>onChange</code> handler attached.
      </p>
      <Demo
        code={`const [value, setValue] = useState(3)

<Rating value={value} onChange={setValue} size="lg" />`}
      >
        <InteractiveRatingDemo />
      </Demo>

      <h2>Custom max</h2>
      <Demo
        code={`<Rating value={7} max={10} />`}
      >
        <Rating value={7} max={10} />
      </Demo>

      <h2>Rating API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>number</code></td><td>—</td><td>Current score, <code>0</code>–<code>max</code>. Accepts halves. Required.</td></tr>
          <tr><td><code>max</code></td><td><code>number</code></td><td><code>5</code></td><td>Total number of stars.</td></tr>
          <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td>—</td><td>Star size. Omit to follow <code>ConfigProvider</code> density.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(value: number) =&gt; void</code></td><td>—</td><td>When set, the rating becomes interactive; fires with the clicked half/whole value.</td></tr>
          <tr><td><code>readOnly</code></td><td><code>boolean</code></td><td><code>true</code> unless <code>onChange</code></td><td>Forces display-only even when <code>onChange</code> is provided.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
