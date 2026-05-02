import './styles/index.css'

// Config, locales, hooks
export {
  ConfigProvider,
  useConfig,
  useLocale,
  useTheme,
  useSize,
  type ConfigProviderProps,
  type ConfigValue,
  type Theme,
  type Size,
} from './context/ConfigProvider'
export { en, zhCN, type Locale } from './locale'

// 02 · Primitives
export * from './components/Button'
export * from './components/Input'
export * from './components/Checkbox'
export * from './components/Radio'
export * from './components/Switch'
export * from './components/Select'
export * from './components/Textarea'
export * from './components/Pill'
export * from './components/Avatar'
export * from './components/Kbd'
export * from './components/Slider'
export * from './components/NumberStepper'
export * from './components/OtpInput'
export * from './components/ToggleGroup'
export * from './components/Spinner'
export * from './components/Divider'
export * from './components/Link'
export * from './components/CodeChip'
export * from './components/Rating'
export * from './components/FileInput'
export * from './components/ColorPicker'
export * from './components/DateChip'
export * from './components/FormSteps'

// 03 · Data display
export * from './components/Card'
export * from './components/Kpi'
export * from './components/Table'
export * from './components/Progress'
export * from './components/Skeleton'
export * from './components/Pipeline'
export * from './components/LogLine'
export * from './components/FilterChip'
export * from './components/SavedViews'
export * from './components/Sparkline'

// 04 · Navigation
export * from './components/Tabs'
export * from './components/MiniTabs'
export * from './components/Segmented'
export * from './components/Breadcrumbs'
export * from './components/Pagination'

// 05 · Overlays & feedback
export * from './components/Banner'
export * from './components/Tooltip'
export * from './components/Toast'
export * from './components/Empty'
export * from './components/Dialog'
export * from './components/Drawer'
export * from './components/Popover'
export * from './components/CommandPalette'
export * from './components/ContextMenu'

// 06 · Advanced controls
export * from './components/Dropdown'
export * from './components/Tree'
export * from './components/Cascader'
export * from './components/DatePicker'
export * from './components/TagInput'
export * from './components/CopyField'
