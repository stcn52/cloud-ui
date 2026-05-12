import { Card, Pill } from '@stcn52/cloud-ui'
import { Link } from 'react-router-dom'
import { routes } from '../../routes'

// Section ordering + display labels. Anything not listed here is appended last.
const CATEGORY_ORDER: Array<{ key: string; label: string }> = [
  { key: 'Foundations',  label: '01 · Foundations' },
  { key: 'Primitives',   label: '02 · Primitives' },
  { key: 'Data display', label: '03 · Data display' },
  { key: 'Navigation',   label: '04 · Navigation' },
  { key: 'Overlays',     label: '05 · Overlays' },
  { key: 'Advanced',     label: '06 · Advanced' },
  { key: 'More',         label: '07 · More' },
]

interface Entry { name: string; path: string }
interface Category { label: string; components: Entry[] }

const componentRoutes = routes.filter((r) => r.section === 'components' && r.category)

const byCat = new Map<string, Entry[]>()
for (const r of componentRoutes) {
  const list = byCat.get(r.category!) ?? []
  list.push({ name: r.title, path: r.path })
  byCat.set(r.category!, list)
}

const categories: Category[] = []
for (const { key, label } of CATEGORY_ORDER) {
  const list = byCat.get(key)
  if (list?.length) { categories.push({ label, components: list }); byCat.delete(key) }
}
for (const [key, list] of byCat) categories.push({ label: key, components: list })

const total = componentRoutes.length

export default function ComponentsOverview() {
  return (
    <article className="page">
      <h1>Components</h1>
      <p>All {total} components, organized into {categories.length} categories.</p>

      {categories.map((cat) => (
        <section key={cat.label} style={{ marginTop: 28 }}>
          <h3
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              margin: '0 0 12px',
            }}
          >
            {cat.label}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 10,
            }}
          >
            {cat.components.map((c) => (
              <Link key={c.path} to={c.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card
                  style={{
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                  <Pill tone="info">docs</Pill>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </article>
  )
}
