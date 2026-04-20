import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { en, type Locale } from '../locale/en'

export type Theme = 'light' | 'dark'
export type Size = 'compact' | 'normal' | 'comfortable'

export interface ConfigValue {
  theme: Theme
  size: Size
  locale: Locale
}

const defaultConfig: ConfigValue = {
  theme: 'light',
  size: 'normal',
  locale: en,
}

const ConfigContext = createContext<ConfigValue>(defaultConfig)

export interface ConfigProviderProps {
  /** Theme: 'light' | 'dark'. Drives the `data-theme` attribute on the mounted element. */
  theme?: Theme
  /** Component density: 'compact' | 'normal' | 'comfortable'. Drives `data-size`. */
  size?: Size
  /** Locale object (use `en`, `zhCN`, or supply a custom one matching `Locale`). */
  locale?: Locale
  /**
   * Target for the theme/size attributes. Defaults to a wrapping `<div>`.
   * Set to 'body' to write attributes to document.body instead (useful at the
   * app root).
   */
  target?: 'wrapper' | 'body'
  children?: ReactNode
}

export function ConfigProvider({
  theme = 'light',
  size = 'normal',
  locale = en,
  target = 'wrapper',
  children,
}: ConfigProviderProps) {
  const value = useMemo<ConfigValue>(() => ({ theme, size, locale }), [theme, size, locale])

  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (target !== 'body') return
    const prevTheme = document.body.dataset.theme
    const prevSize = document.body.dataset.size
    document.body.dataset.theme = theme
    document.body.dataset.size = size
    return () => {
      if (prevTheme) document.body.dataset.theme = prevTheme
      else delete document.body.dataset.theme
      if (prevSize) document.body.dataset.size = prevSize
      else delete document.body.dataset.size
    }
  }, [theme, size, target])

  if (target === 'body') {
    return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  }

  return (
    <ConfigContext.Provider value={value}>
      <div ref={wrapperRef} data-theme={theme} data-size={size}>
        {children}
      </div>
    </ConfigContext.Provider>
  )
}

export function useConfig(): ConfigValue {
  return useContext(ConfigContext)
}

export function useLocale(): Locale {
  return useContext(ConfigContext).locale
}

export function useTheme(): Theme {
  return useContext(ConfigContext).theme
}

export function useSize(): Size {
  return useContext(ConfigContext).size
}
