import { useState } from 'react'
import { OtpInput, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function BasicOtpDemo() {
  const [v, setV] = useState('')
  return <OtpInput value={v} onChange={setV} />
}

function InProgressOtpDemo() {
  const [v, setV] = useState('429')
  return <OtpInput value={v} onChange={setV} />
}

function CompleteOtpDemo() {
  const [v, setV] = useState('429018')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
      <OtpInput value={v} onChange={setV} />
      <span style={{ fontSize: 12, color: 'var(--color-ok)' }}>Verified · signing you in…</span>
    </div>
  )
}

function ErrorOtpDemo() {
  const [v, setV] = useState('429000')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
      <OtpInput value={v} onChange={setV} invalid />
      <span style={{ fontSize: 12, color: 'var(--color-err)' }}>Invalid code · 2 attempts remaining</span>
    </div>
  )
}

function FourDigitOtpDemo() {
  const [v, setV] = useState('')
  return <OtpInput value={v} onChange={setV} length={4} />
}

export default function OtpInputPage() {
  return (
    <article className="page">
      <h1>OtpInput</h1>
      <p>
        A row of single-character cells for one-time codes and verification PINs. Auto-advances on
        type, backspaces to the previous cell, supports arrow-key navigation, and accepts a pasted
        full code into any cell. Value is a plain string.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Entering a short fixed-length code from email / SMS / an authenticator app. For arbitrary
        secrets or passwords use <code>Input type="password"</code>; this component is intentionally
        single-line and length-bounded.
      </Banner>

      <h2>Basic</h2>
      <p>
        Controlled via <code>value</code> + <code>onChange</code>. <code>value</code> is the string
        entered so far — it doesn't have to be padded to <code>length</code>.
      </p>
      <Demo
        code={`const [v, setV] = useState('')

<OtpInput value={v} onChange={setV} />`}
      >
        <BasicOtpDemo />
      </Demo>

      <h2>In progress</h2>
      <p>Filled cells get the accent treatment; the rest stay neutral.</p>
      <Demo
        code={`const [v, setV] = useState('429')

<OtpInput value={v} onChange={setV} autoFocus />`}
      >
        <InProgressOtpDemo />
      </Demo>

      <h2>Complete</h2>
      <p>Pair with a status line once the code is full and validated server-side.</p>
      <Demo
        code={`<OtpInput value="429018" onChange={setV} />
<span>Verified · signing you in…</span>`}
      >
        <CompleteOtpDemo />
      </Demo>

      <h2>Invalid</h2>
      <p>
        Set <code>invalid</code> to turn every cell red. Drive it from your verify response, not from
        cell content.
      </p>
      <Demo
        code={`<OtpInput value={v} onChange={setV} invalid />
<span>Invalid code · 2 attempts remaining</span>`}
      >
        <ErrorOtpDemo />
      </Demo>

      <h2>Custom length</h2>
      <p>
        Set <code>length</code> for codes other than 6. The mid separator only shows for even
        lengths unless you force it via <code>separator</code>.
      </p>
      <Demo code={`<OtpInput value={v} onChange={setV} length={4} />`}>
        <FourDigitOtpDemo />
      </Demo>

      <h2>Sizes</h2>
      <Demo
        code={`<OtpInput size="sm" value="42" onChange={setV} length={4} />
<OtpInput size="md" value="42" onChange={setV} length={4} />
<OtpInput size="lg" value="42" onChange={setV} length={4} />`}
      >
        <OtpInput size="sm" value="42" onChange={() => {}} length={4} />
        <OtpInput size="md" value="42" onChange={() => {}} length={4} />
        <OtpInput size="lg" value="42" onChange={() => {}} length={4} />
      </Demo>

      <h2>OtpInput API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>The code entered so far. Required.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Fires with the new string on every cell edit or paste.</td></tr>
          <tr><td><code>length</code></td><td><code>number</code></td><td><code>6</code></td><td>Number of cells.</td></tr>
          <tr><td><code>separator</code></td><td><code>boolean | string</code></td><td>—</td><td>Show a divider between halves. Defaults to a dash when <code>length</code> is even; pass a string to use a custom glyph, or <code>false</code> to suppress it.</td></tr>
          <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Applies the error border + color to all cells.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Dims and disables every cell.</td></tr>
          <tr><td><code>autoFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Focuses the first cell on mount.</td></tr>
          <tr><td><code>inputMode</code></td><td><code>'numeric' | 'text'</code></td><td><code>'numeric'</code></td><td><code>'numeric'</code> rejects non-digit characters and hints a numeric keyboard.</td></tr>
          <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Cell size. Omit to follow <code>ConfigProvider</code> density.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
