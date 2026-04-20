import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { categories } from './nav'
import { cx } from './cx'

type Theme = 'light' | 'dark'

export function Layout() {
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => {
    document.body.dataset.theme = theme
  }, [theme])

  return (
    <>
      <div className="lib-tools">
        <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>
          Light
        </button>
        <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}>
          Dark
        </button>
      </div>

      <div className="lib">
        <aside className="lib-nav">
          <div className="lib-brand">
            <div className="lib-mark" />
            <span className="name">cloud-ui</span>
            <span className="tag">v0.1</span>
          </div>

          <div className="lib-section">
            <div className="lib-title">Library</div>
            <NavLink
              to="/"
              end
              className={({ isActive }: { isActive: boolean }) => cx('lib-link', isActive && 'active')}
            >
              Overview
            </NavLink>
          </div>

          {categories.map((cat) => (
            <div className="lib-section" key={cat.slug}>
              <div className="lib-title">
                {cat.num} · {cat.title}
              </div>
              {cat.items.length === 0 && (
                <div className="lib-link" style={{ color: 'var(--text-dim)', cursor: 'default' }}>
                  <em style={{ fontStyle: 'normal', opacity: 0.6 }}>coming soon</em>
                </div>
              )}
              {cat.items.map((item) => (
                <NavLink
                  key={item.slug}
                  to={`/${cat.slug}/${item.slug}`}
                  className={({ isActive }: { isActive: boolean }) =>
                    cx('lib-link', isActive && 'active', !item.done && 'lib-link-todo')
                  }
                >
                  {item.label}
                  {!item.done && <span className="todo-dot" />}
                </NavLink>
              ))}
            </div>
          ))}
        </aside>

        <main className="lib-main">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export function PageHeader({
  kicker,
  title,
  lede,
}: {
  kicker: ReactNode
  title: ReactNode
  lede?: ReactNode
}) {
  return (
    <header className="lib-head">
      <div className="lib-kicker">{kicker}</div>
      <h1 className="lib-h1">{title}</h1>
      {lede && <p className="lib-lede">{lede}</p>}
    </header>
  )
}

export function ComingSoon({ name }: { name: string }) {
  return (
    <>
      <PageHeader
        kicker="Placeholder"
        title={name}
        lede={
          <>
            Not built yet. See the original HTML reference in{' '}
            <Link to="/" className="mono" style={{ textDecoration: 'underline' }}>
              overview
            </Link>
            .
          </>
        }
      />
      <div className="demo">
        <div className="demo-label">Status</div>
        <div className="demo-body">
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
            This component will be added in a later pass.
          </span>
        </div>
      </div>
    </>
  )
}
