import { Banner, Button, Empty, Table } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const iconInbox = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
)

const iconSearch = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4-4" />
  </svg>
)

const iconError = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6M12 16v.5" />
  </svg>
)

export default function EmptyPage() {
  return (
    <article className="page">
      <h1>Empty</h1>
      <p>
        A polite stand-in for any surface with nothing to show. Title + description + optional
        icon and actions, centered on a neutral square.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Blank tables ("no clusters yet"), zero search results, and error placeholders. Each
        variant deserves its own copy — <em>"no items yet"</em>, <em>"no match"</em>, and{' '}
        <em>"something broke"</em> are three different moments.
      </Banner>

      <h2>No items yet</h2>
      <p>First-run state. Point the user at the primary action.</p>
      <Demo
        code={`<Empty
  icon={<InboxIcon />}
  title="No clusters yet"
  description="Spin up your first cluster to see health, logs, and deploys right here."
  actions={<Button intent="primary">Create cluster</Button>}
/>`}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Empty
            icon={iconInbox}
            title="No clusters yet"
            description="Spin up your first cluster to see health, logs, and deploys right here."
            actions={<Button intent="primary">Create cluster</Button>}
          />
        </div>
      </Demo>

      <h2>No results</h2>
      <p>Filter / search returned nothing. Offer a reset.</p>
      <Demo
        code={`<Empty
  icon={<SearchIcon />}
  title="No matching services"
  description={'Nothing matches "billing-v2" in the current region.'}
  actions={
    <>
      <Button intent="ghost">Clear filters</Button>
      <Button intent="outline">Switch region</Button>
    </>
  }
/>`}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Empty
            icon={iconSearch}
            title="No matching services"
            description={'Nothing matches "billing-v2" in the current region.'}
            actions={
              <>
                <Button intent="ghost">Clear filters</Button>
                <Button intent="outline">Switch region</Button>
              </>
            }
          />
        </div>
      </Demo>

      <h2>Error</h2>
      <p>
        Request failed or data is unavailable. Make the retry action the primary button.
      </p>
      <Demo
        code={`<Empty
  icon={<AlertIcon />}
  title="Couldn't load deployments"
  description="The metrics backend returned a 503. We'll try again, or you can retry now."
  actions={<Button intent="primary">Retry</Button>}
/>`}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Empty
            icon={iconError}
            title="Couldn't load deployments"
            description="The metrics backend returned a 503. We'll try again, or you can retry now."
            actions={<Button intent="primary">Retry</Button>}
          />
        </div>
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>title</code></td><td><code>ReactNode</code></td><td>—</td><td>Heading line.</td></tr>
          <tr><td><code>description</code></td><td><code>ReactNode</code></td><td>—</td><td>Muted second line. Max-width is capped for readability.</td></tr>
          <tr><td><code>icon</code></td><td><code>ReactNode</code></td><td>—</td><td>Rendered inside a rounded square at the top.</td></tr>
          <tr><td><code>actions</code></td><td><code>ReactNode</code></td><td>—</td><td>Bottom action row (buttons, links).</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Extra content rendered after <code>actions</code>.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
