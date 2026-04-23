import type { ComponentType } from 'react'
import TODOPage from './pages/components/_TODO'

export interface RouteDef {
  path: string
  title: string
  section: 'docs' | 'design' | 'components'
  category?: string
  Component: ComponentType
}

// Docs
import Installation from './pages/docs/Installation.mdx'
import Theming from './pages/docs/Theming.mdx'
import Changelog from './pages/docs/Changelog'

// Design
import Color from './pages/design/Color'
import Typography from './pages/design/Typography'
import Density from './pages/design/Density'
import Motion from './pages/design/Motion'

// Components overview
import ComponentsOverview from './pages/components/Overview'

// Components — flagship (already written)
import ButtonPage from './pages/components/Button'
import InputPage from './pages/components/Input'
import ToastPage from './pages/components/Toast'

// Components — stubs replaced by agents
import ConfigProviderPage from './pages/components/ConfigProvider'
import AvatarPage from './pages/components/Avatar'
import CheckboxPage from './pages/components/Checkbox'
import KbdPage from './pages/components/Kbd'
import PillPage from './pages/components/Pill'
import RadioPage from './pages/components/Radio'
import RadioGroupPage from './pages/components/RadioGroup'
import SelectPage from './pages/components/Select'
import SwitchPage from './pages/components/Switch'
import TextareaPage from './pages/components/Textarea'

import CardPage from './pages/components/Card'
import KpiPage from './pages/components/Kpi'
import LogLinePage from './pages/components/LogLine'
import PipelinePage from './pages/components/Pipeline'
import ProgressPage from './pages/components/Progress'
import SkeletonPage from './pages/components/Skeleton'
import TablePage from './pages/components/Table'

import BreadcrumbsPage from './pages/components/Breadcrumbs'
import PaginationPage from './pages/components/Pagination'
import SegmentedPage from './pages/components/Segmented'
import TabsPage from './pages/components/Tabs'
import CardTabsPage from './pages/components/CardTabs'

import BannerPage from './pages/components/Banner'
import CommandPalettePage from './pages/components/CommandPalette'
import DialogPage from './pages/components/Dialog'
import DrawerPage from './pages/components/Drawer'
import EmptyPage from './pages/components/Empty'
import PopoverPage from './pages/components/Popover'
import TooltipPage from './pages/components/Tooltip'

import CascaderPage from './pages/components/Cascader'
import CopyFieldPage from './pages/components/CopyField'
import DatePickerPage from './pages/components/DatePicker'
import DatePickerInputPage from './pages/components/DatePickerInput'
import DropdownPage from './pages/components/Dropdown'
import TagInputPage from './pages/components/TagInput'
import TreePage from './pages/components/Tree'

export const routes: RouteDef[] = [
  // Docs
  { path: '/docs/installation', title: 'Installation', section: 'docs', Component: Installation },
  { path: '/docs/theming',      title: 'Theming',      section: 'docs', Component: Theming },
  { path: '/docs/changelog',    title: 'Changelog',    section: 'docs', Component: Changelog },

  // Design
  { path: '/design/color',      title: 'Color',      section: 'design', Component: Color },
  { path: '/design/typography', title: 'Typography', section: 'design', Component: Typography },
  { path: '/design/density',    title: 'Density',    section: 'design', Component: Density },
  { path: '/design/motion',     title: 'Motion',     section: 'design', Component: Motion },

  // Components
  { path: '/components', title: 'Overview', section: 'components', Component: ComponentsOverview },

  // 01 · Foundations
  { path: '/components/config-provider', title: 'ConfigProvider', section: 'components', category: 'Foundations', Component: ConfigProviderPage },

  // 02 · Primitives
  { path: '/components/avatar',   title: 'Avatar',   section: 'components', category: 'Primitives', Component: AvatarPage },
  { path: '/components/button',   title: 'Button',   section: 'components', category: 'Primitives', Component: ButtonPage },
  { path: '/components/checkbox', title: 'Checkbox', section: 'components', category: 'Primitives', Component: CheckboxPage },
  { path: '/components/input',    title: 'Input',    section: 'components', category: 'Primitives', Component: InputPage },
  { path: '/components/kbd',      title: 'Kbd',      section: 'components', category: 'Primitives', Component: KbdPage },
  { path: '/components/pill',     title: 'Pill',     section: 'components', category: 'Primitives', Component: PillPage },
  { path: '/components/radio',        title: 'Radio',      section: 'components', category: 'Primitives', Component: RadioPage },
  { path: '/components/radio-group',  title: 'RadioGroup', section: 'components', category: 'Primitives', Component: RadioGroupPage },
  { path: '/components/select',   title: 'Select',   section: 'components', category: 'Primitives', Component: SelectPage },
  { path: '/components/switch',   title: 'Switch',   section: 'components', category: 'Primitives', Component: SwitchPage },
  { path: '/components/textarea', title: 'Textarea', section: 'components', category: 'Primitives', Component: TextareaPage },

  // 03 · Data display
  { path: '/components/card',     title: 'Card',     section: 'components', category: 'Data display', Component: CardPage },
  { path: '/components/kpi',      title: 'KPI',      section: 'components', category: 'Data display', Component: KpiPage },
  { path: '/components/log-line', title: 'LogLine',  section: 'components', category: 'Data display', Component: LogLinePage },
  { path: '/components/pipeline', title: 'Pipeline', section: 'components', category: 'Data display', Component: PipelinePage },
  { path: '/components/progress', title: 'Progress', section: 'components', category: 'Data display', Component: ProgressPage },
  { path: '/components/skeleton', title: 'Skeleton', section: 'components', category: 'Data display', Component: SkeletonPage },
  { path: '/components/table',    title: 'Table',    section: 'components', category: 'Data display', Component: TablePage },

  // 04 · Navigation
  { path: '/components/breadcrumbs', title: 'Breadcrumbs', section: 'components', category: 'Navigation', Component: BreadcrumbsPage },
  { path: '/components/pagination',  title: 'Pagination',  section: 'components', category: 'Navigation', Component: PaginationPage },
  { path: '/components/segmented',   title: 'Segmented',   section: 'components', category: 'Navigation', Component: SegmentedPage },
  { path: '/components/tabs',        title: 'Tabs',        section: 'components', category: 'Navigation', Component: TabsPage },
  { path: '/components/card-tabs',   title: 'CardTabs',    section: 'components', category: 'Navigation', Component: CardTabsPage },

  // 05 · Overlays
  { path: '/components/banner',           title: 'Banner',          section: 'components', category: 'Overlays', Component: BannerPage },
  { path: '/components/command-palette',  title: 'CommandPalette',  section: 'components', category: 'Overlays', Component: CommandPalettePage },
  { path: '/components/dialog',           title: 'Dialog',          section: 'components', category: 'Overlays', Component: DialogPage },
  { path: '/components/drawer',           title: 'Drawer',          section: 'components', category: 'Overlays', Component: DrawerPage },
  { path: '/components/empty',            title: 'Empty',           section: 'components', category: 'Overlays', Component: EmptyPage },
  { path: '/components/popover',          title: 'Popover',         section: 'components', category: 'Overlays', Component: PopoverPage },
  { path: '/components/toast',            title: 'Toast',           section: 'components', category: 'Overlays', Component: ToastPage },
  { path: '/components/tooltip',          title: 'Tooltip',         section: 'components', category: 'Overlays', Component: TooltipPage },

  // 06 · Advanced
  { path: '/components/cascader',    title: 'Cascader',   section: 'components', category: 'Advanced', Component: CascaderPage },
  { path: '/components/copy-field',  title: 'CopyField',  section: 'components', category: 'Advanced', Component: CopyFieldPage },
  { path: '/components/date-picker',        title: 'DatePicker',      section: 'components', category: 'Advanced', Component: DatePickerPage },
  { path: '/components/date-picker-input',  title: 'DatePickerInput', section: 'components', category: 'Advanced', Component: DatePickerInputPage },
  { path: '/components/dropdown',    title: 'Dropdown',   section: 'components', category: 'Advanced', Component: DropdownPage },
  { path: '/components/tag-input',   title: 'TagInput',   section: 'components', category: 'Advanced', Component: TagInputPage },
  { path: '/components/tree',        title: 'Tree',       section: 'components', category: 'Advanced', Component: TreePage },
]

// avoid "unused" warning for the placeholder
void TODOPage
