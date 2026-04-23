import { Avatar, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function AvatarPage() {
  return (
    <article className="page">
      <h1>Avatar</h1>
      <p>
        Small identity badge showing initials, an icon, or a short token. Three sizes, circle or
        square.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        A user, team, or project identifier in lists, nav, and headers. Not for large profile
        photos — use a plain <code>&lt;img&gt;</code> with your own styling for that. Keep the
        content to 1–2 characters.
      </Banner>

      <h2>Sizes</h2>
      <Demo
        code={`<Avatar size="sm">CY</Avatar>
<Avatar size="md">CY</Avatar>
<Avatar size="lg">CY</Avatar>`}
      >
        <Avatar size="sm">CY</Avatar>
        <Avatar size="md">CY</Avatar>
        <Avatar size="lg">CY</Avatar>
      </Demo>

      <h2>Shapes</h2>
      <Demo
        code={`<Avatar shape="circle">K</Avatar>
<Avatar shape="square">K</Avatar>`}
      >
        <Avatar shape="circle">K</Avatar>
        <Avatar shape="square">K</Avatar>
      </Demo>

      <h2>In a row</h2>
      <Demo
        code={`<Avatar>AB</Avatar>
<Avatar>CD</Avatar>
<Avatar>EF</Avatar>
<Avatar>+3</Avatar>`}
      >
        <Avatar>AB</Avatar>
        <Avatar>CD</Avatar>
        <Avatar>EF</Avatar>
        <Avatar>+3</Avatar>
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Diameter and font size.</td></tr>
          <tr><td><code>shape</code></td><td><code>'circle' | 'square'</code></td><td><code>'circle'</code></td><td>Rounded corners vs. full circle.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Initials, a short token, or an icon. Keep it to 1–2 characters.</td></tr>
          <tr><td><code>...rest</code></td><td><code>HTMLAttributes&lt;HTMLDivElement&gt;</code></td><td>—</td><td>Standard div props (<code>title</code>, <code>onClick</code>, etc.).</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
