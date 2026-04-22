import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
  Segmented,
  Kbd,
  Pill,
  Breadcrumbs,
  Breadcrumb,
  CommandPalette,
  type CommandItem as CmdItem,
  type Theme,
  type Size,
} from '@stcn52/cloud-ui'
import { routes } from '../routes'

interface ShellProps {
  theme: Theme
  onThemeChange: (t: Theme) => void
  size: Size
  onSizeChange: (s: Size) => void
  children: ReactNode
}

export function Shell({ theme, onThemeChange, size, onSizeChange, children }: ShellProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const topLinks: Array<{ to: string; label: string; match: (p: string) => boolean }> = [
    { to: '/components',        label: 'Components', match: (p) => p.startsWith('/components') },
    { to: '/design/color',      label: 'Design',     match: (p) => p.startsWith('/design') },
    { to: '/docs/installation', label: 'Docs',       match: (p) => p.startsWith('/docs') },
  ]

  const paletteItems: CmdItem[] = routes.map((r) => ({
    id: r.path,
    label: r.title,
    group: r.section.charAt(0).toUpperCase() + r.section.slice(1),
    onSelect: () => {
      navigate(r.path)
      setPaletteOpen(false)
    },
  }))

  const isHome = pathname === '/'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'var(--color-bg-elev)',
          borderBottom: '1px solid var(--color-line)',
          backdropFilter: 'saturate(180%) blur(8px)',
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            padding: '0 20px',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <NavLink
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 700,
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontSize: 15,
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background:
                  'linear-gradient(135deg, var(--color-accent), oklch(0.58 0.15 280))',
              }}
            />
            @stcn52/cloud-ui
          </NavLink>
          <Pill tone="neutral">v0.3.0</Pill>

          <nav style={{ display: 'flex', gap: 4, marginLeft: 16 }}>
            {topLinks.map((link) => {
              const active = link.match(pathname)
              return (
                <Button
                  key={link.to}
                  intent={active ? 'subtle' : 'ghost'}
                  size="sm"
                  onClick={() => navigate(link.to)}
                >
                  {link.label}
                </Button>
              )
            })}
          </nav>

          <div style={{ flex: 1 }} />

          <Button
            intent="outline"
            size="sm"
            onClick={() => setPaletteOpen(true)}
          >
            <span style={{ color: 'var(--color-text-dim)', fontWeight: 400 }}>Search docs…</span>
            &nbsp;&nbsp;<Kbd>⌘K</Kbd>
          </Button>

          <Segmented
            size="sm"
            value={theme}
            onChange={(v) => onThemeChange(v as Theme)}
            options={[
              { value: 'light', label: '☀' },
              { value: 'dark', label: '☾' },
            ]}
          />

          <Segmented
            size="sm"
            value={size}
            onChange={(v) => onSizeChange(v as Size)}
            options={[
              { value: 'compact', label: 'S' },
              { value: 'normal', label: 'M' },
              { value: 'comfortable', label: 'L' },
            ]}
          />

          <Button
            intent="ghost"
            size="sm"
            onClick={() => window.open('https://github.com/stcn52/cloud-ui', '_blank')}
          >
            GitHub
          </Button>
          <Button
            intent="outline"
            size="sm"
            onClick={() => {
              const url = `${import.meta.env.BASE_URL}storybook/`
              window.open(url, '_blank')
            }}
          >
            Storybook →
          </Button>
        </div>
      </header>

      {isHome ? (
        <main style={{ flex: 1 }}>{children}</main>
      ) : (
        <div
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '240px 1fr',
            gap: 32,
            padding: '24px 20px',
            flex: 1,
          }}
        >
          <DocSidebar />
          <div style={{ minWidth: 0 }}>
            <TopBreadcrumbs />
            {children}
          </div>
        </div>
      )}

      <footer
        style={{
          borderTop: '1px solid var(--color-line)',
          padding: '20px',
          textAlign: 'center',
          color: 'var(--color-text-dim)',
          fontSize: 12,
        }}
      >
        MIT · Built entirely with @stcn52/cloud-ui itself ·{' '}
        <a href="https://github.com/stcn52/cloud-ui" style={{ color: 'var(--color-accent)' }}>
          GitHub
        </a>
      </footer>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        items={paletteItems}
        placeholder="Jump to docs, design, or components…"
      />
    </div>
  )
}

function DocSidebar() {
  const { pathname } = useLocation()
  const section: 'docs' | 'design' | 'components' =
    pathname.startsWith('/docs')
      ? 'docs'
      : pathname.startsWith('/design')
        ? 'design'
        : 'components'

  const sectionTitle = {
    docs: 'Documentation',
    design: 'Design Language',
    components: 'Components',
  }[section]

  const items = routes.filter((r) => r.section === section)

  return (
    <aside>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          marginBottom: 12,
        }}
      >
        {sectionTitle}
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((r) => (
          <NavLink
            key={r.path}
            to={r.path}
            end
            style={({ isActive }: { isActive: boolean }) => ({
              display: 'block',
              padding: '6px 10px',
              borderRadius: 6,
              fontSize: 13,
              textDecoration: 'none',
              color: isActive ? 'var(--color-accent-ink)' : 'var(--color-text-muted)',
              background: isActive ? 'var(--color-accent-weak)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
              transition: 'background 120ms',
            })}
          >
            {r.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

function TopBreadcrumbs() {
  const { pathname } = useLocation()
  if (pathname === '/') return null
  const section = pathname.split('/')[1]
  const sectionLabel = section.charAt(0).toUpperCase() + section.slice(1)
  const pageRoute = routes.find((r) => r.path === pathname)

  return (
    <Breadcrumbs style={{ marginBottom: 20 }}>
      <Breadcrumb>
        <NavLink to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Home
        </NavLink>
      </Breadcrumb>
      <Breadcrumb>{sectionLabel}</Breadcrumb>
      {pageRoute && <Breadcrumb leaf>{pageRoute.title}</Breadcrumb>}
    </Breadcrumbs>
  )
}
