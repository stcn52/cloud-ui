import { Link } from 'react-router-dom'
import { PageHeader } from '../Layout'
import { categories } from '../nav'

export function OverviewPage() {
  const total = categories.reduce((n, c) => n + c.items.length, 0)
  const done = categories.reduce((n, c) => n + c.items.filter((i) => i.done).length, 0)

  return (
    <>
      <PageHeader
        kicker="Component library"
        title="@stcn52/cloud-ui"
        lede={
          <>
            React + TS port of the NextCli design system. Tailwind v4 as the utility layer; tokens
            and components rendered from the original CSS — one to one.
          </>
        }
      />

      <div className="stats">
        <div className="stat">
          <div className="n">{categories.length}</div>
          <div className="l">Parts</div>
        </div>
        <div className="stat">
          <div className="n">
            {done}
            <span style={{ color: 'var(--text-dim)', fontSize: 14 }}> / {total}</span>
          </div>
          <div className="l">Components</div>
        </div>
        <div className="stat">
          <div className="n">2</div>
          <div className="l">Themes</div>
        </div>
        <div className="stat">
          <div className="n">0</div>
          <div className="l">JS deps</div>
        </div>
      </div>

      <div className="parts">
        {categories.map((c) => (
          <Link className="part" key={c.slug} to={`/${c.slug}/${c.items[0]?.slug ?? ''}`}>
            <span className="n">{c.num}</span>
            <h3>{c.title}</h3>
            <p style={{ minHeight: 24 }}>
              {c.items.length} component{c.items.length === 1 ? '' : 's'}
            </p>
            <div className="list">
              {c.items.slice(0, 6).map((i) => (
                <span key={i.slug} className="pill">
                  {i.label}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
