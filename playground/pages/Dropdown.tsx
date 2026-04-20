import { useState } from 'react'
import {
  Button,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownSearch,
  DropdownSeparator,
} from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

const serviceIcon = (
  <svg viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="6" rx="1" />
    <rect x="3" y="14" width="18" height="6" rx="1" />
  </svg>
)

const services = [
  { name: 'api-gateway', env: 'Production' },
  { name: 'api-auth', env: 'Production' },
  { name: 'internal-api', env: 'Production' },
  { name: 'api-gateway-stg', env: 'Staging', disabled: true },
]

export function DropdownPage() {
  const [query, setQuery] = useState('api')
  const [chosen, setChosen] = useState('api-gateway')

  const filtered = services.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
  const groups = Object.entries(
    filtered.reduce<Record<string, typeof services>>((acc, s) => {
      ;(acc[s.env] ??= []).push(s)
      return acc
    }, {}),
  )

  return (
    <>
      <PageHeader
        kicker="06 · Advanced"
        title="Dropdown"
        lede="Menus with icons, shortcuts, groups, and state. Reuses the Popover overlay for positioning and outside-click."
      />

      <div className="demo">
        <div className="demo-label">Service picker · filtered & grouped</div>
        <div className="demo-body" style={{ alignItems: 'flex-start' }}>
          <Dropdown trigger={<Button>{chosen} ▾</Button>}>
            <DropdownSearch value={query} onChange={setQuery} placeholder="Filter services…" />
            {groups.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
                No match
              </div>
            ) : (
              groups.map(([group, items]) => (
                <DropdownGroup key={group} label={group}>
                  {items.map((s) => (
                    <DropdownItem
                      key={s.name}
                      icon={serviceIcon}
                      checked={chosen === s.name}
                      active={chosen === s.name}
                      disabled={s.disabled}
                      onClick={() => setChosen(s.name)}
                    >
                      {s.name}
                    </DropdownItem>
                  ))}
                </DropdownGroup>
              ))
            )}
          </Dropdown>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">States (static preview)</div>
        <div className="demo-body">
          <div className="menu" style={{ width: 220, position: 'static', boxShadow: 'var(--shadow-sm)' }}>
            <DropdownItem>Default</DropdownItem>
            <DropdownItem active>Active</DropdownItem>
            <DropdownItem disabled>Disabled</DropdownItem>
            <DropdownSeparator />
            <DropdownItem danger>Destructive</DropdownItem>
          </div>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">Actions with shortcuts</div>
        <div className="demo-body">
          <Dropdown trigger={<Button iconOnly>⋯</Button>}>
            <DropdownItem
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              }
              shortcut="⌘↵"
            >
              New deployment
            </DropdownItem>
            <DropdownItem
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M4 6h12M4 10h16M4 14h10" />
                </svg>
              }
              shortcut="L"
            >
              View logs
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem
              icon={
                <svg viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M6 6l1 14h10l1-14" />
                </svg>
              }
              shortcut="⌫"
              danger
            >
              Delete…
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </>
  )
}
