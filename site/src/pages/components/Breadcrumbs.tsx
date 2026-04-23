import { Breadcrumbs, BreadcrumbItem, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function BreadcrumbsPage() {
  return (
    <article className="page">
      <h1>Breadcrumbs</h1>
      <p>
        A horizontal trail of navigation anchors showing where the current page sits in a hierarchy.
        The last <code>BreadcrumbItem</code> is auto-promoted to <code>leaf</code> styling — no flag
        needed.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Deep nested resources (project {'›'} service {'›'} deployment) where the user benefits from
        one-click jumps to any ancestor. For a two-level site, a plain back button is usually enough.
      </Banner>

      <h2>Standard trail</h2>
      <p>
        Notice the last item has no <code>leaf</code> prop — it still renders bolder because
        the parent auto-detects the final child.
      </p>
      <Demo
        code={`<Breadcrumbs>
  <BreadcrumbItem>Projects</BreadcrumbItem>
  <BreadcrumbItem>api-gateway</BreadcrumbItem>
  <BreadcrumbItem>us-east-1</BreadcrumbItem>
</Breadcrumbs>`}
      >
        <Breadcrumbs>
          <BreadcrumbItem>Projects</BreadcrumbItem>
          <BreadcrumbItem>api-gateway</BreadcrumbItem>
          <BreadcrumbItem>us-east-1</BreadcrumbItem>
        </Breadcrumbs>
      </Demo>

      <h2>Custom separator</h2>
      <p>
        Override the default chevron by passing any <code>ReactNode</code> as <code>separator</code>.
      </p>
      <Demo
        code={`<Breadcrumbs separator="/">
  <BreadcrumbItem>org</BreadcrumbItem>
  <BreadcrumbItem>repo</BreadcrumbItem>
  <BreadcrumbItem>main</BreadcrumbItem>
</Breadcrumbs>`}
      >
        <Breadcrumbs separator="/">
          <BreadcrumbItem>org</BreadcrumbItem>
          <BreadcrumbItem>repo</BreadcrumbItem>
          <BreadcrumbItem>main</BreadcrumbItem>
        </Breadcrumbs>
      </Demo>

      <h2>Explicit leaf override</h2>
      <p>
        Pass <code>leaf={'{false}'}</code> on the last item to opt out of the auto-promotion, or
        <code>leaf</code> on a middle item to force the leaf style. Useful for intermediate headings
        you want visually emphasized.
      </p>
      <Demo
        code={`<Breadcrumbs>
  <BreadcrumbItem><a href="/projects">Projects</a></BreadcrumbItem>
  <BreadcrumbItem leaf>api-gateway</BreadcrumbItem>
  <BreadcrumbItem leaf={false}>Settings</BreadcrumbItem>
</Breadcrumbs>`}
      >
        <Breadcrumbs>
          <BreadcrumbItem><a href="#">Projects</a></BreadcrumbItem>
          <BreadcrumbItem leaf>api-gateway</BreadcrumbItem>
          <BreadcrumbItem leaf={false}>Settings</BreadcrumbItem>
        </Breadcrumbs>
      </Demo>

      <h2>Breadcrumbs API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>separator</code></td><td><code>ReactNode</code></td><td>chevron icon</td><td>Rendered between every pair of children.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>A list of <code>&lt;BreadcrumbItem&gt;</code> elements.</td></tr>
        </tbody>
      </Table>

      <h2>BreadcrumbItem API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>leaf</code></td><td><code>boolean</code></td><td>auto</td><td>Force bolder, higher-contrast text. When omitted, the last child of <code>Breadcrumbs</code> is auto-promoted.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Label content; usually a string or a link.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
