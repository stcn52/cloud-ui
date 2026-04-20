import { Breadcrumb, Breadcrumbs } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function CrumbsPage() {
  return (
    <>
      <PageHeader
        kicker="04 · Navigation"
        title="Breadcrumbs"
        lede="Show hierarchy without taking space. Trailing item is the current page (bold); everything before is a link-style span."
      />

      <div className="demo">
        <div className="demo-label">Path</div>
        <div className="demo-body">
          <Breadcrumbs>
            <Breadcrumb>Workspaces</Breadcrumb>
            <Breadcrumb>Linden Labs</Breadcrumb>
            <Breadcrumb>Services</Breadcrumb>
            <Breadcrumb leaf>api-gateway</Breadcrumb>
          </Breadcrumbs>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">Shallow</div>
        <div className="demo-body">
          <Breadcrumbs>
            <Breadcrumb>Linden</Breadcrumb>
            <Breadcrumb leaf>Overview</Breadcrumb>
          </Breadcrumbs>
        </div>
      </div>
    </>
  )
}
