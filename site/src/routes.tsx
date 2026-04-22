import type { ComponentType } from 'react'

export interface RouteDef {
  path: string
  title: string
  section: 'docs' | 'design' | 'components'
  Component: ComponentType
}

// Lazy imports wrapped as components (simpler than React.lazy for static export)
import Installation from './pages/docs/Installation.mdx'
import Theming from './pages/docs/Theming.mdx'
import Color from './pages/design/Color'
import Typography from './pages/design/Typography'
import Density from './pages/design/Density'
import Motion from './pages/design/Motion'
import ComponentsOverview from './pages/components/Overview'
import ButtonPage from './pages/components/Button'
import InputPage from './pages/components/Input'
import ToastPage from './pages/components/Toast'

export const routes: RouteDef[] = [
  { path: '/docs/installation', title: 'Installation', section: 'docs', Component: Installation },
  { path: '/docs/theming',      title: 'Theming',      section: 'docs', Component: Theming },

  { path: '/design/color',      title: 'Color',      section: 'design', Component: Color },
  { path: '/design/typography', title: 'Typography', section: 'design', Component: Typography },
  { path: '/design/density',    title: 'Density',    section: 'design', Component: Density },
  { path: '/design/motion',     title: 'Motion',     section: 'design', Component: Motion },

  { path: '/components',         title: 'Overview', section: 'components', Component: ComponentsOverview },
  { path: '/components/button',  title: 'Button',   section: 'components', Component: ButtonPage },
  { path: '/components/input',   title: 'Input',    section: 'components', Component: InputPage },
  { path: '/components/toast',   title: 'Toast',    section: 'components', Component: ToastPage },
]

export function getSidebar(section: RouteDef['section']) {
  return routes.filter((r) => r.section === section)
}
