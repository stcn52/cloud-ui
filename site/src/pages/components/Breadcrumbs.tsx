import { Breadcrumbs, Breadcrumb, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function BreadcrumbsPage() {
  return (
    <article className="page">
      <h1>Breadcrumbs</h1>
      <p>
        A horizontal trail of navigation anchors showing where the current page sits in a hierarchy.
        The last crumb is marked with <code>leaf</code> so it reads as the current location.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Deep nested resources (project {'›'} service {'›'} deployment) where the user benefits from
        one-click jumps to any ancestor. For a two-level site, a plain back button is usually enough.
      </Banner>

      <h2>Standard trail</h2>
      <Demo
        code={`<Breadcrumbs>
  <Breadcrumb>Projects</Breadcrumb>
  <Breadcrumb>api-gateway</Breadcrumb>
  <Breadcrumb leaf>us-east-1</Breadcrumb>
</Breadcrumbs>`}
      >
        <Breadcrumbs>
          <Breadcrumb>Projects</Breadcrumb>
          <Breadcrumb>api-gateway</Breadcrumb>
          <Breadcrumb leaf>us-east-1</Breadcrumb>
        </Breadcrumbs>
      </Demo>

      <h2>Custom separator</h2>
      <p>
        Override the default chevron by passing any <code>ReactNode</code> as <code>separator</code>.
      </p>
      <Demo
        code={`<Breadcrumbs separator="/">
  <Breadcrumb>org</Breadcrumb>
  <Breadcrumb>repo</Breadcrumb>
  <Breadcrumb leaf>main</Breadcrumb>
</Breadcrumbs>`}
      >
        <Breadcrumbs separator="/">
          <Breadcrumb>org</Breadcrumb>
          <Breadcrumb>repo</Breadcrumb>
          <Breadcrumb leaf>main</Breadcrumb>
        </Breadcrumbs>
      </Demo>

      <h2>Clickable crumbs</h2>
      <p>
        <code>Breadcrumb</code> is a plain <code>&lt;span&gt;</code> — wrap its children in
        an <code>&lt;a&gt;</code> or your router&apos;s link component to make it navigable.
      </p>
      <Demo
        code={`<Breadcrumbs>
  <Breadcrumb><a href="/projects">Projects</a></Breadcrumb>
  <Breadcrumb><a href="/projects/api-gateway">api-gateway</a></Breadcrumb>
  <Breadcrumb leaf>Settings</Breadcrumb>
</Breadcrumbs>`}
      >
        <Breadcrumbs>
          <Breadcrumb><a href="#">Projects</a></Breadcrumb>
          <Breadcrumb><a href="#">api-gateway</a></Breadcrumb>
          <Breadcrumb leaf>Settings</Breadcrumb>
        </Breadcrumbs>
      </Demo>

      <h2>Breadcrumbs API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>separator</code></td><td><code>ReactNode</code></td><td>chevron icon</td><td>Rendered between every pair of children.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>A list of <code>&lt;Breadcrumb&gt;</code> elements.</td></tr>
        </tbody>
      </Table>

      <h2>Breadcrumb API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>leaf</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Mark the current (last) crumb — applies bolder, higher-contrast text.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Label content; usually a string or a link.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
