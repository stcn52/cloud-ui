import { Link, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function LinkPage() {
  return (
    <article className="page">
      <h1>Link</h1>
      <p>
        A styled <code>&lt;a&gt;</code> — underlined by default, three color intents, and an
        underline-on-hover <code>bare</code> mode. Forwards every native anchor attribute (
        <code>href</code>, <code>target</code>, <code>rel</code>, <code>onClick</code>, …).
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Inline navigation inside prose or a sentence. For a standalone call-to-action that should
        look like a button, use <code>&lt;Button as="a" href="…"&gt;</code> instead.
      </Banner>

      <h2>In prose</h2>
      <p>Links sit inline in body text and keep the underline so they're distinguishable from plain words.</p>
      <Demo
        code={`<p>
  Read the <Link href="/runbook">migration runbook</Link> before promoting to production.
  For quick rollouts, prefer the <Link href="/canary" intent="muted">canary strategy</Link>.
  See <Link href="/integrations">third-party integrations →</Link> for the full list.
</p>`}
      >
        <p style={{ margin: 0, lineHeight: 1.7, maxWidth: 540, fontSize: 13 }}>
          Read the <Link href="#">migration runbook</Link> before promoting to production. For quick
          rollouts, prefer the <Link href="#" intent="muted">canary strategy</Link>. See{' '}
          <Link href="#">third-party integrations →</Link> for the full provider list.
        </p>
      </Demo>

      <h2>Intents</h2>
      <p>
        <code>default</code> uses the accent color; <code>muted</code> blends into secondary text;{' '}
        <code>danger</code> is for destructive links (e.g. "delete this project").
      </p>
      <Demo
        code={`<Link href="#">Default</Link>
<Link href="#" intent="muted">Muted</Link>
<Link href="#" intent="danger">Danger</Link>`}
      >
        <Link href="#">Default</Link>
        <Link href="#" intent="muted">Muted</Link>
        <Link href="#" intent="danger">Danger</Link>
      </Demo>

      <h2>Bare</h2>
      <p>
        <code>bare</code> drops the underline until hover. Use it sparingly — an undecorated link
        reads as plain text — typically for nav lists where context already signals it's clickable.
      </p>
      <Demo code={`<Link href="#" bare>Bare (hover to reveal)</Link>`}>
        <Link href="#" bare>Bare (hover to reveal)</Link>
      </Demo>

      <h2>External</h2>
      <p>Pass <code>target</code> / <code>rel</code> like any anchor; the component doesn't add them for you.</p>
      <Demo
        code={`<Link href="https://example.com" target="_blank" rel="noreferrer">
  Open docs ↗
</Link>`}
      >
        <Link href="https://example.com" target="_blank" rel="noreferrer">
          Open docs ↗
        </Link>
      </Demo>

      <h2>Link API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>intent</code></td><td><code>'default' | 'muted' | 'danger'</code></td><td><code>'default'</code></td><td>Color role.</td></tr>
          <tr><td><code>bare</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hide the underline until hover.</td></tr>
          <tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Destination — plus any other native <code>&lt;a&gt;</code> attribute (<code>target</code>, <code>rel</code>, <code>onClick</code>, …).</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Link text / content.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
