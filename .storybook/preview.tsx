import type { Preview, Decorator } from '@storybook/react-vite'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import { ConfigProvider, type Size, type Theme, en, zhCN } from '../src'
import '../src/styles/index.css'
import './preview.css'

const withConfigProvider: Decorator = (Story, context) => {
  const theme = (context.globals.theme ?? 'light') as Theme
  const size = (context.globals.size ?? 'normal') as Size
  const localeKey = (context.globals.locale ?? 'en') as 'en' | 'zh-CN'
  const locale = localeKey === 'zh-CN' ? zhCN : en

  return (
    <ConfigProvider theme={theme} size={size} locale={locale}>
      <Story />
    </ConfigProvider>
  )
}

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    size: {
      description: 'Density',
      defaultValue: 'normal',
      toolbar: {
        title: 'Size',
        icon: 'expand',
        items: [
          { value: 'compact', title: 'Compact' },
          { value: 'normal', title: 'Normal' },
          { value: 'comfortable', title: 'Comfortable' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Locale',
      defaultValue: 'en',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'zh-CN', title: '简体中文' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
    withConfigProvider,
  ],
}

export default preview
