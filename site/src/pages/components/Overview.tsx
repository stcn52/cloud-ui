import { Card, Pill } from '@stcn52/cloud-ui'
import { Link } from 'react-router-dom'

interface Entry { name: string; slug: string; description?: string }
interface Category { title: string; components: Entry[] }

const categories: Category[] = [
  {
    title: '01 · Foundations',
    components: [
      { name: 'ConfigProvider', slug: 'config-provider', description: 'Theme, density, locale context' },
    ],
  },
  {
    title: '02 · Primitives',
    components: [
      { name: 'Avatar',   slug: 'avatar' },
      { name: 'Button',   slug: 'button' },
      { name: 'Checkbox', slug: 'checkbox' },
      { name: 'Input',    slug: 'input' },
      { name: 'Kbd',      slug: 'kbd' },
      { name: 'Pill',     slug: 'pill' },
      { name: 'Radio',    slug: 'radio' },
      { name: 'Select',   slug: 'select' },
      { name: 'Switch',   slug: 'switch' },
      { name: 'Textarea', slug: 'textarea' },
    ],
  },
  {
    title: '03 · Data display',
    components: [
      { name: 'Card',     slug: 'card' },
      { name: 'KPI',      slug: 'kpi' },
      { name: 'LogLine',  slug: 'log-line' },
      { name: 'Pipeline', slug: 'pipeline' },
      { name: 'Progress', slug: 'progress' },
      { name: 'Skeleton', slug: 'skeleton' },
      { name: 'Table',    slug: 'table' },
    ],
  },
  {
    title: '04 · Navigation',
    components: [
      { name: 'Breadcrumbs', slug: 'breadcrumbs' },
      { name: 'Pagination',  slug: 'pagination' },
      { name: 'Segmented',   slug: 'segmented' },
      { name: 'Tabs',        slug: 'tabs' },
      { name: 'CardTabs',    slug: 'card-tabs' },
    ],
  },
  {
    title: '05 · Overlays',
    components: [
      { name: 'Banner',         slug: 'banner' },
      { name: 'CommandPalette', slug: 'command-palette' },
      { name: 'Dialog',         slug: 'dialog' },
      { name: 'Drawer',         slug: 'drawer' },
      { name: 'Empty',          slug: 'empty' },
      { name: 'Popover',        slug: 'popover' },
      { name: 'Toast',          slug: 'toast' },
      { name: 'Tooltip',        slug: 'tooltip' },
    ],
  },
  {
    title: '06 · Advanced',
    components: [
      { name: 'Cascader',   slug: 'cascader' },
      { name: 'CopyField',  slug: 'copy-field' },
      { name: 'DatePicker', slug: 'date-picker' },
      { name: 'Dropdown',   slug: 'dropdown' },
      { name: 'TagInput',   slug: 'tag-input' },
      { name: 'Tree',       slug: 'tree' },
    ],
  },
]

const total = categories.reduce((n, c) => n + c.components.length, 0)

export default function ComponentsOverview() {
  return (
    <article className="page">
      <h1>Components</h1>
      <p>All {total} components, organized into six categories.</p>

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
            {cat.components.map((c) => (
              <Link key={c.name} to={`/components/${c.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
