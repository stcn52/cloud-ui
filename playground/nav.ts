export interface NavItem {
  slug: string
  label: string
  done?: boolean
}

export interface NavCategory {
  num: string
  slug: string
  title: string
  items: NavItem[]
}

export const categories: NavCategory[] = [
  {
    num: '01',
    slug: 'foundations',
    title: 'Foundations',
    items: [
      { slug: 'color', label: 'Color', done: true },
      { slug: 'typography', label: 'Typography', done: true },
      { slug: 'spacing', label: 'Spacing', done: true },
      { slug: 'radius', label: 'Radius', done: true },
      { slug: 'elevation', label: 'Elevation', done: true },
    ],
  },
  {
    num: '02',
    slug: 'primitives',
    title: 'Primitives',
    items: [
      { slug: 'button', label: 'Button', done: true },
      { slug: 'input', label: 'Input', done: true },
      { slug: 'select', label: 'Select & Textarea', done: true },
      { slug: 'checkbox', label: 'Checkbox / Radio / Switch', done: true },
      { slug: 'pill', label: 'Pill & Badge', done: true },
      { slug: 'avatar', label: 'Avatar', done: true },
      { slug: 'kbd', label: 'Keyboard', done: true },
    ],
  },
  {
    num: '03',
    slug: 'data',
    title: 'Data display',
    items: [
      { slug: 'kpi', label: 'KPI', done: true },
      { slug: 'card', label: 'Card', done: true },
      { slug: 'table', label: 'Table', done: true },
      { slug: 'charts', label: 'Charts', done: true },
      { slug: 'logs', label: 'Logs', done: true },
      { slug: 'pipeline', label: 'Pipeline', done: true },
      { slug: 'progress', label: 'Progress & Ring', done: true },
      { slug: 'skeleton', label: 'Skeleton', done: true },
    ],
  },
  {
    num: '04',
    slug: 'navigation',
    title: 'Navigation',
    items: [
      { slug: 'tabs', label: 'Tabs', done: true },
      { slug: 'segmented', label: 'Segmented', done: true },
      { slug: 'crumbs', label: 'Breadcrumbs', done: true },
      { slug: 'pagination', label: 'Pagination', done: true },
    ],
  },
  {
    num: '05',
    slug: 'overlays',
    title: 'Overlays',
    items: [
      { slug: 'banner', label: 'Banner', done: true },
      { slug: 'tooltip', label: 'Tooltip', done: true },
      { slug: 'toast', label: 'Toast', done: true },
      { slug: 'dialog', label: 'Dialog', done: true },
      { slug: 'drawer', label: 'Drawer', done: true },
      { slug: 'popover', label: 'Popover', done: true },
      { slug: 'palette', label: 'Command palette', done: true },
    ],
  },
  {
    num: '06',
    slug: 'advanced',
    title: 'Advanced',
    items: [
      { slug: 'dropdown', label: 'Dropdown', done: true },
      { slug: 'tree', label: 'Tree', done: true },
      { slug: 'cascader', label: 'Cascader', done: true },
      { slug: 'datepicker', label: 'Date picker', done: true },
      { slug: 'taginput', label: 'Tag input', done: true },
      { slug: 'copyfield', label: 'Copy field', done: true },
    ],
  },
  {
    num: '07',
    slug: 'more',
    title: 'More',
    items: [],
  },
]
