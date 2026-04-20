import type { RouteObject } from 'react-router-dom'
import { ComingSoon, Layout } from './Layout'
import { OverviewPage } from './pages/Overview'
import { ButtonPage } from './pages/Button'
import { InputPage } from './pages/Input'
import { CheckboxPage } from './pages/Checkbox'
import { SelectPage } from './pages/Select'
import { PillPage } from './pages/Pill'
import { AvatarPage } from './pages/Avatar'
import { KbdPage } from './pages/Kbd'
import { KpiPage } from './pages/Kpi'
import { CardPage } from './pages/Card'
import { TablePage } from './pages/Table'
import { ChartsPage } from './pages/Charts'
import { LogsPage } from './pages/Logs'
import { PipelinePage } from './pages/Pipeline'
import { ProgressPage } from './pages/Progress'
import { SkeletonPage } from './pages/Skeleton'
import { TabsPage } from './pages/Tabs'
import { SegmentedPage } from './pages/Segmented'
import { CrumbsPage } from './pages/Crumbs'
import { PaginationPage } from './pages/Pagination'
import { BannerPage } from './pages/Banner'
import { TooltipPage } from './pages/Tooltip'
import { ToastPage } from './pages/Toast'
import { DialogPage } from './pages/Dialog'
import { DrawerPage } from './pages/Drawer'
import { PopoverPage } from './pages/Popover'
import { PalettePage } from './pages/Palette'
import { DropdownPage } from './pages/Dropdown'
import { TreePage } from './pages/Tree'
import { CascaderPage } from './pages/Cascader'
import { DatePickerPage } from './pages/DatePicker'
import { TagInputPage } from './pages/TagInput'
import { CopyFieldPage } from './pages/CopyField'
import { ColorPage } from './pages/Color'
import { TypographyPage } from './pages/Typography'
import { SpacingPage } from './pages/Spacing'
import { RadiusPage } from './pages/Radius'
import { ElevationPage } from './pages/Elevation'
import { categories } from './nav'

const pages: Record<string, () => JSX.Element> = {
  'primitives/button': ButtonPage,
  'primitives/input': InputPage,
  'primitives/checkbox': CheckboxPage,
  'primitives/select': SelectPage,
  'primitives/pill': PillPage,
  'primitives/avatar': AvatarPage,
  'primitives/kbd': KbdPage,
  'data/kpi': KpiPage,
  'data/card': CardPage,
  'data/table': TablePage,
  'data/charts': ChartsPage,
  'data/logs': LogsPage,
  'data/pipeline': PipelinePage,
  'data/progress': ProgressPage,
  'data/skeleton': SkeletonPage,
  'navigation/tabs': TabsPage,
  'navigation/segmented': SegmentedPage,
  'navigation/crumbs': CrumbsPage,
  'navigation/pagination': PaginationPage,
  'overlays/banner': BannerPage,
  'overlays/tooltip': TooltipPage,
  'overlays/toast': ToastPage,
  'overlays/dialog': DialogPage,
  'overlays/drawer': DrawerPage,
  'overlays/popover': PopoverPage,
  'overlays/palette': PalettePage,
  'advanced/dropdown': DropdownPage,
  'advanced/tree': TreePage,
  'advanced/cascader': CascaderPage,
  'advanced/datepicker': DatePickerPage,
  'advanced/taginput': TagInputPage,
  'advanced/copyfield': CopyFieldPage,
  'foundations/color': ColorPage,
  'foundations/typography': TypographyPage,
  'foundations/spacing': SpacingPage,
  'foundations/radius': RadiusPage,
  'foundations/elevation': ElevationPage,
}

const childRoutes: RouteObject[] = []
for (const cat of categories) {
  for (const item of cat.items) {
    const key = `${cat.slug}/${item.slug}`
    const Page = pages[key]
    childRoutes.push({
      path: key,
      element: Page ? <Page /> : <ComingSoon name={item.label} />,
    })
  }
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [{ index: true, element: <OverviewPage /> }, ...childRoutes],
  },
]
