import type { ComponentType } from 'react'

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

// 01 · Foundations
import ConfigProviderPage from './pages/components/ConfigProvider'

// 02 · Primitives
import AvatarPage from './pages/components/Avatar'
import BadgePage from './pages/components/Badge'
import ButtonPage from './pages/components/Button'
import CheckboxPage from './pages/components/Checkbox'
import CodeChipPage from './pages/components/CodeChip'
import ColorPickerPage from './pages/components/ColorPicker'
import DateChipPage from './pages/components/DateChip'
import DividerPage from './pages/components/Divider'
import FileInputPage from './pages/components/FileInput'
import FormPage from './pages/components/Form'
import FormStepsPage from './pages/components/FormSteps'
import InputPage from './pages/components/Input'
import KbdPage from './pages/components/Kbd'
import LinkPage from './pages/components/Link'
import NumberStepperPage from './pages/components/NumberStepper'
import OtpInputPage from './pages/components/OtpInput'
import PillPage from './pages/components/Pill'
import RadioPage from './pages/components/Radio'
import RadioGroupPage from './pages/components/RadioGroup'
import RatingPage from './pages/components/Rating'
import SelectPage from './pages/components/Select'
import SliderPage from './pages/components/Slider'
import SpinnerPage from './pages/components/Spinner'
import StepFormPage from './pages/components/StepForm'
import SwitchPage from './pages/components/Switch'
import TextareaPage from './pages/components/Textarea'
import ToggleGroupPage from './pages/components/ToggleGroup'

// 03 · Data display
import CardPage from './pages/components/Card'
import DonutPage from './pages/components/Donut'
import FilterChipPage from './pages/components/FilterChip'
import GaugePage from './pages/components/Gauge'
import KpiPage from './pages/components/Kpi'
import LogLinePage from './pages/components/LogLine'
import PipelinePage from './pages/components/Pipeline'
import ProgressPage from './pages/components/Progress'
import SavedViewsPage from './pages/components/SavedViews'
import SkeletonPage from './pages/components/Skeleton'
import SparklinePage from './pages/components/Sparkline'
import TablePage from './pages/components/Table'

// 04 · Navigation
import BreadcrumbsPage from './pages/components/Breadcrumbs'
import CardTabsPage from './pages/components/CardTabs'
import MiniTabsPage from './pages/components/MiniTabs'
import PaginationPage from './pages/components/Pagination'
import SegmentedPage from './pages/components/Segmented'
import TabsPage from './pages/components/Tabs'

// 05 · Overlays
import BannerPage from './pages/components/Banner'
import CommandPalettePage from './pages/components/CommandPalette'
import ContextMenuPage from './pages/components/ContextMenu'
import DialogPage from './pages/components/Dialog'
import DrawerPage from './pages/components/Drawer'
import EmptyPage from './pages/components/Empty'
import PopoverPage from './pages/components/Popover'
import ToastPage from './pages/components/Toast'
import TooltipPage from './pages/components/Tooltip'

// 06 · Advanced
import AccordionPage from './pages/components/Accordion'
import CascaderPage from './pages/components/Cascader'
import CopyFieldPage from './pages/components/CopyField'
import DatePickerPage from './pages/components/DatePicker'
import DatePickerInputPage from './pages/components/DatePickerInput'
import DropdownPage from './pages/components/Dropdown'
import NxTablePage from './pages/components/NxTable'
import PromptInputPage from './pages/components/PromptInput'
import TagInputPage from './pages/components/TagInput'
import TransferPage from './pages/components/Transfer'
import TreePage from './pages/components/Tree'

// 07 · More
import JsonViewerPage from './pages/components/JsonViewer'
import MentionPopoverPage from './pages/components/MentionPopover'
import NotificationCenterPage from './pages/components/NotificationCenter'
import QueryBuilderPage from './pages/components/QueryBuilder'

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
  { path: '/components/avatar',         title: 'Avatar',        section: 'components', category: 'Primitives', Component: AvatarPage },
  { path: '/components/badge',          title: 'Badge',         section: 'components', category: 'Primitives', Component: BadgePage },
  { path: '/components/button',         title: 'Button',        section: 'components', category: 'Primitives', Component: ButtonPage },
  { path: '/components/checkbox',       title: 'Checkbox',      section: 'components', category: 'Primitives', Component: CheckboxPage },
  { path: '/components/code-chip',      title: 'CodeChip',      section: 'components', category: 'Primitives', Component: CodeChipPage },
  { path: '/components/color-picker',   title: 'ColorPicker',   section: 'components', category: 'Primitives', Component: ColorPickerPage },
  { path: '/components/date-chip',      title: 'DateChip',      section: 'components', category: 'Primitives', Component: DateChipPage },
  { path: '/components/divider',        title: 'Divider',       section: 'components', category: 'Primitives', Component: DividerPage },
  { path: '/components/file-input',     title: 'FileInput',     section: 'components', category: 'Primitives', Component: FileInputPage },
  { path: '/components/form',           title: 'Form',          section: 'components', category: 'Primitives', Component: FormPage },
  { path: '/components/form-steps',     title: 'FormSteps',     section: 'components', category: 'Primitives', Component: FormStepsPage },
  { path: '/components/input',          title: 'Input',         section: 'components', category: 'Primitives', Component: InputPage },
  { path: '/components/kbd',            title: 'Kbd',           section: 'components', category: 'Primitives', Component: KbdPage },
  { path: '/components/link',           title: 'Link',          section: 'components', category: 'Primitives', Component: LinkPage },
  { path: '/components/number-stepper', title: 'NumberStepper', section: 'components', category: 'Primitives', Component: NumberStepperPage },
  { path: '/components/otp-input',      title: 'OtpInput',      section: 'components', category: 'Primitives', Component: OtpInputPage },
  { path: '/components/pill',           title: 'Pill',          section: 'components', category: 'Primitives', Component: PillPage },
  { path: '/components/radio',          title: 'Radio',         section: 'components', category: 'Primitives', Component: RadioPage },
  { path: '/components/radio-group',    title: 'RadioGroup',    section: 'components', category: 'Primitives', Component: RadioGroupPage },
  { path: '/components/rating',         title: 'Rating',        section: 'components', category: 'Primitives', Component: RatingPage },
  { path: '/components/select',         title: 'Select',        section: 'components', category: 'Primitives', Component: SelectPage },
  { path: '/components/slider',         title: 'Slider',        section: 'components', category: 'Primitives', Component: SliderPage },
  { path: '/components/spinner',        title: 'Spinner',       section: 'components', category: 'Primitives', Component: SpinnerPage },
  { path: '/components/step-form',      title: 'StepForm',      section: 'components', category: 'Primitives', Component: StepFormPage },
  { path: '/components/switch',         title: 'Switch',        section: 'components', category: 'Primitives', Component: SwitchPage },
  { path: '/components/textarea',       title: 'Textarea',      section: 'components', category: 'Primitives', Component: TextareaPage },
  { path: '/components/toggle-group',   title: 'ToggleGroup',   section: 'components', category: 'Primitives', Component: ToggleGroupPage },

  // 03 · Data display
  { path: '/components/card',        title: 'Card',       section: 'components', category: 'Data display', Component: CardPage },
  { path: '/components/donut',       title: 'Donut',      section: 'components', category: 'Data display', Component: DonutPage },
  { path: '/components/filter-chip', title: 'FilterChip', section: 'components', category: 'Data display', Component: FilterChipPage },
  { path: '/components/gauge',       title: 'Gauge',      section: 'components', category: 'Data display', Component: GaugePage },
  { path: '/components/kpi',         title: 'KPI',        section: 'components', category: 'Data display', Component: KpiPage },
  { path: '/components/log-line',    title: 'LogLine',    section: 'components', category: 'Data display', Component: LogLinePage },
  { path: '/components/pipeline',    title: 'Pipeline',   section: 'components', category: 'Data display', Component: PipelinePage },
  { path: '/components/progress',    title: 'Progress',   section: 'components', category: 'Data display', Component: ProgressPage },
  { path: '/components/saved-views', title: 'SavedViews', section: 'components', category: 'Data display', Component: SavedViewsPage },
  { path: '/components/skeleton',    title: 'Skeleton',   section: 'components', category: 'Data display', Component: SkeletonPage },
  { path: '/components/sparkline',   title: 'Sparkline',  section: 'components', category: 'Data display', Component: SparklinePage },
  { path: '/components/table',       title: 'Table',      section: 'components', category: 'Data display', Component: TablePage },

  // 04 · Navigation
  { path: '/components/breadcrumbs', title: 'Breadcrumbs', section: 'components', category: 'Navigation', Component: BreadcrumbsPage },
  { path: '/components/card-tabs',   title: 'CardTabs',    section: 'components', category: 'Navigation', Component: CardTabsPage },
  { path: '/components/mini-tabs',   title: 'MiniTabs',    section: 'components', category: 'Navigation', Component: MiniTabsPage },
  { path: '/components/pagination',  title: 'Pagination',  section: 'components', category: 'Navigation', Component: PaginationPage },
  { path: '/components/segmented',   title: 'Segmented',   section: 'components', category: 'Navigation', Component: SegmentedPage },
  { path: '/components/tabs',        title: 'Tabs',        section: 'components', category: 'Navigation', Component: TabsPage },

  // 05 · Overlays
  { path: '/components/banner',          title: 'Banner',         section: 'components', category: 'Overlays', Component: BannerPage },
  { path: '/components/command-palette', title: 'CommandPalette', section: 'components', category: 'Overlays', Component: CommandPalettePage },
  { path: '/components/context-menu',    title: 'useContextMenu', section: 'components', category: 'Overlays', Component: ContextMenuPage },
  { path: '/components/dialog',          title: 'Dialog',         section: 'components', category: 'Overlays', Component: DialogPage },
  { path: '/components/drawer',          title: 'Drawer',         section: 'components', category: 'Overlays', Component: DrawerPage },
  { path: '/components/empty',           title: 'Empty',          section: 'components', category: 'Overlays', Component: EmptyPage },
  { path: '/components/popover',         title: 'Popover',        section: 'components', category: 'Overlays', Component: PopoverPage },
  { path: '/components/toast',           title: 'Toast',          section: 'components', category: 'Overlays', Component: ToastPage },
  { path: '/components/tooltip',         title: 'Tooltip',        section: 'components', category: 'Overlays', Component: TooltipPage },

  // 06 · Advanced
  { path: '/components/accordion',         title: 'Accordion',       section: 'components', category: 'Advanced', Component: AccordionPage },
  { path: '/components/cascader',          title: 'Cascader',        section: 'components', category: 'Advanced', Component: CascaderPage },
  { path: '/components/copy-field',        title: 'CopyField',       section: 'components', category: 'Advanced', Component: CopyFieldPage },
  { path: '/components/date-picker',       title: 'DatePicker',      section: 'components', category: 'Advanced', Component: DatePickerPage },
  { path: '/components/date-picker-input', title: 'DatePickerInput', section: 'components', category: 'Advanced', Component: DatePickerInputPage },
  { path: '/components/dropdown',          title: 'Dropdown',        section: 'components', category: 'Advanced', Component: DropdownPage },
  { path: '/components/nx-table',          title: 'NxTable',         section: 'components', category: 'Advanced', Component: NxTablePage },
  { path: '/components/prompt-input',      title: 'PromptInput',     section: 'components', category: 'Advanced', Component: PromptInputPage },
  { path: '/components/tag-input',         title: 'TagInput',        section: 'components', category: 'Advanced', Component: TagInputPage },
  { path: '/components/transfer',          title: 'Transfer',        section: 'components', category: 'Advanced', Component: TransferPage },
  { path: '/components/tree',              title: 'Tree',            section: 'components', category: 'Advanced', Component: TreePage },

  // 07 · More
  { path: '/components/json-viewer',         title: 'JsonViewer',         section: 'components', category: 'More', Component: JsonViewerPage },
  { path: '/components/mention-popover',     title: 'MentionPopover',     section: 'components', category: 'More', Component: MentionPopoverPage },
  { path: '/components/notification-center', title: 'NotificationCenter', section: 'components', category: 'More', Component: NotificationCenterPage },
  { path: '/components/query-builder',       title: 'QueryBuilder',       section: 'components', category: 'More', Component: QueryBuilderPage },
]
