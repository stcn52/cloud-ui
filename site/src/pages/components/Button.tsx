import { Button, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function ButtonPage() {
  return (
    <article className="page">
      <h1>Button</h1>
      <p>
        Used for primary actions, destructive actions, and navigation triggers. Six intents, four
        sizes, three states.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        A user needs to trigger an action (submit, save, delete). Not for navigation within your
        app — prefer a styled <code>&lt;Link&gt;</code>.
      </Banner>

      <h2>Intents</h2>
      <Demo
        code={`<Button intent="primary">Primary</Button>
<Button intent="default">Default</Button>
<Button intent="outline">Outline</Button>
<Button intent="ghost">Ghost</Button>
<Button intent="subtle">Subtle</Button>
<Button intent="danger">Danger</Button>`}
      >
        <Button intent="primary">Primary</Button>
        <Button intent="default">Default</Button>
        <Button intent="outline">Outline</Button>
        <Button intent="ghost">Ghost</Button>
        <Button intent="subtle">Subtle</Button>
        <Button intent="danger">Danger</Button>
      </Demo>

      <h2>Sizes</h2>
      <Demo
        code={`<Button size="xs">xs</Button>
<Button size="sm">sm</Button>
<Button size="md">md</Button>
<Button size="lg">lg</Button>`}
      >
        <Button size="xs">xs</Button>
        <Button size="sm">sm</Button>
        <Button size="md">md</Button>
        <Button size="lg">lg</Button>
      </Demo>

      <h2>Loading</h2>
      <Demo code={`<Button intent="primary" loading>Deploying…</Button>`}>
        <Button intent="primary" loading>Deploying…</Button>
      </Demo>

      <h2>Disabled</h2>
      <Demo code={`<Button disabled>Can't touch this</Button>`}>
        <Button disabled>Can't touch this</Button>
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>intent</code></td><td><code>'default' | 'primary' | 'outline' | 'ghost' | 'subtle' | 'danger'</code></td><td><code>'default'</code></td><td>Visual weight + color role.</td></tr>
          <tr><td><code>size</code></td><td><code>'xs' | 'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Control height and text size.</td></tr>
          <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a spinner and disables the button.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Standard HTML disabled state.</td></tr>
          <tr><td><code>iconOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Square-ish padding, intended for icon-only triggers.</td></tr>
          <tr><td><code>onClick</code></td><td><code>(e: MouseEvent) =&gt; void</code></td><td>—</td><td>Click handler.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
