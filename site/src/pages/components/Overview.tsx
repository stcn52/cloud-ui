import { Card, Pill } from '@stcn52/cloud-ui'
import { Link } from 'react-router-dom'

interface Entry { name: string; slug?: string; description?: string }
interface Category { title: string; components: Entry[] }

const categories: Category[] = [
  {
    title: '01 · Foundations',
    components: [{ name: 'ConfigProvider', description: 'Theme, density, locale context' }],
  },
  {
    title: '02 · Primitives',
    components: [
      { name: 'Avatar' },
      { name: 'Button', slug: 'button' },
      { name: 'Checkbox' },
      { name: 'Input', slug: 'input' },
      { name: 'Kbd' },
      { name: 'Pill' },
      { name: 'Radio' },
      { name: 'Select' },
      { name: 'Switch' },
      { name: 'Textarea' },
    ],
  },
  {
    title: '03 · Data display',
    components: [
      { name: 'Card' }, { name: 'KPI' }, { name: 'LogLine' }, { name: 'Pipeline' },
      { name: 'Progress' }, { name: 'Skeleton' }, { name: 'Table' },
    ],
  },
  {
    title: '04 · Navigation',
    components: [
      { name: 'Breadcrumbs' }, { name: 'Pagination' }, { name: 'Segmented' },
      { name: 'Tabs' }, { name: 'CardTabs' },
    ],
  },
  {
    title: '05 · Overlays',
    components: [
      { name: 'Banner' }, { name: 'CommandPalette' }, { name: 'Dialog' },
      { name: 'Drawer' }, { name: 'Empty' }, { name: 'Popover' },
      { name: 'Toast', slug: 'toast' }, { name: 'Tooltip' },
    ],
  },
  {
    title: '06 · Advanced',
    components: [
      { name: 'Cascader' }, { name: 'CopyField' }, { name: 'DatePicker' },
      { name: 'Dropdown' }, { name: 'TagInput' }, { name: 'Tree' },
    ],
  },
]

const total = categories.reduce((n, c) => n + c.components.length, 0)

export default function ComponentsOverview() {
  return (
    <article className="page">
      <h1>Components</h1>
      <p>
        All {total} components, organized into six categories. Items marked <em>docs pending</em>{' '}
        are shipped and working — see the{' '}
        <a href={`${import.meta.env.BASE_URL}storybook/`}>Storybook</a> for interactive demos until
        their dedicated pages land.
      </p>

      {categories.map((cat) => (
        <section key={cat.title} style={{ marginTop: 28 }}>
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
            {cat.title}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 10,
            }}
          >
            {cat.components.map((c) => {
              const inner = (
                <Card
                  style={{
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    cursor: c.slug ? 'pointer' : 'default',
                    opacity: c.slug ? 1 : 0.7,
                  }}
                >
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                  {c.slug
                    ? <Pill tone="info">docs</Pill>
                    : <Pill tone="neutral">pending</Pill>}
                </Card>
              )
              return c.slug ? (
                <Link key={c.name} to={`/components/${c.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {inner}
                </Link>
              ) : (
                <div key={c.name}>{inner}</div>
              )
            })}
          </div>
        </section>
      ))}
    </article>
  )
}
