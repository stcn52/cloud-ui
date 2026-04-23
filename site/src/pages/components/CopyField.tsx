import { useState } from 'react'
import { CopyField, Button, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const EyeIcon = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

function MaskedKeyDemo() {
  const full = 'ak_live_9f2c11b67d51ce71'
  const masked = 'ak_live_••••••••••••••71'
  const [revealed, setRevealed] = useState(false)
  return (
    <CopyField
      value={full}
      extras={
        <Button
          size="xs"
          iconOnly
          intent="ghost"
          aria-label={revealed ? 'Hide' : 'Reveal'}
          onClick={() => setRevealed((r) => !r)}
        >
          {EyeIcon}
        </Button>
      }
    >
      {revealed ? full : masked}
    </CopyField>
  )
}

export default function CopyFieldPage() {
  return (
    <article className="page">
      <h1>CopyField</h1>
      <p>
        An inline, monospace-styled value with a one-click copy button and a transient "Copied"
        confirmation. Designed for IDs, secrets, commands, and URLs.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Any short string the user will paste somewhere: an install command, an API key, a resource
        id. For large blocks of text prefer a pre-formatted code block with its own copy button.
      </Banner>

      <h2>Children as the source of truth</h2>
      <p>
        If <code>value</code> is omitted, the displayed <code>children</code> are extracted to
        plain text (recursively) and copied on click. Handy for one-liners like install commands.
      </p>
      <Demo
        code={`<CopyField>pnpm add @stcn52/cloud-ui</CopyField>`}
      >
        <CopyField>pnpm add @stcn52/cloud-ui</CopyField>
      </Demo>

      <h2>Explicit value</h2>
      <p>
        Pass <code>value</code> when you want it to match <code>children</code> exactly — good for
        long resource ids and URLs.
      </p>
      <Demo
        code={`<CopyField value="pnpm add @stcn52/cloud-ui">
  pnpm add @stcn52/cloud-ui
</CopyField>`}
      >
        <CopyField value="pnpm add @stcn52/cloud-ui">pnpm add @stcn52/cloud-ui</CopyField>
      </Demo>

      <h2>Masked value</h2>
      <p>
        The displayed <code>children</code> and the clipboard <code>value</code> can differ —
        useful for API keys and other secrets where you only show a preview.
      </p>
      <Demo
        code={`<CopyField value="ak_live_9f2c11b67d51ce71">
  ak_live_••••••••••••••71
</CopyField>`}
      >
        <CopyField value="ak_live_9f2c11b67d51ce71">ak_live_••••••••••••••71</CopyField>
      </Demo>

      <h2>Reveal toggle via <code>extras</code></h2>
      <p>
        The <code>extras</code> slot sits just before the copy button. Use it for a reveal button,
        a regenerate button, or any secondary trailing control.
      </p>
      <Demo
        code={`const [revealed, setRevealed] = useState(false)

<CopyField
  value="ak_live_9f2c11b67d51ce71"
  extras={
    <Button size="xs" iconOnly intent="ghost" onClick={() => setRevealed(r => !r)}>
      <EyeIcon />
    </Button>
  }
>
  {revealed ? 'ak_live_9f2c11b67d51ce71' : 'ak_live_••••••••••••••71'}
</CopyField>`}
      >
        <MaskedKeyDemo />
      </Demo>

      <h2>Custom labels + feedback duration</h2>
      <Demo
        code={`<CopyField
  value="arn:aws:iam::0987:role/gateway"
  copyLabel="Copy ARN"
  copiedLabel="ARN copied"
  feedbackDuration={2500}
>
  arn:aws:iam::0987:role/gateway
</CopyField>`}
      >
        <CopyField
          value="arn:aws:iam::0987:role/gateway"
          copyLabel="Copy ARN"
          copiedLabel="ARN copied"
          feedbackDuration={2500}
        >
          arn:aws:iam::0987:role/gateway
        </CopyField>
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Text written to the clipboard. Falls back to the plain-text extraction of <code>children</code>.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Visible value. May differ from <code>value</code> for masking/truncation.</td></tr>
          <tr><td><code>feedbackDuration</code></td><td><code>number</code></td><td><code>1400</code></td><td>Milliseconds the "Copied" confirmation stays visible.</td></tr>
          <tr><td><code>extras</code></td><td><code>ReactNode</code></td><td>—</td><td>Extra trailing controls (reveal, regenerate, …). Rendered before the copy button.</td></tr>
          <tr><td><code>copiedLabel</code></td><td><code>ReactNode</code></td><td>locale default</td><td>Success label shown after copy.</td></tr>
          <tr><td><code>copyLabel</code></td><td><code>string</code></td><td>locale default</td><td><code>aria-label</code> for the copy button.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
