import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: async (config) => {
    // When building for GitHub Pages, Storybook is served from /cloud-ui/storybook/
    if (process.env.STORYBOOK_BASE) {
      config.base = process.env.STORYBOOK_BASE
    }
    return config
  },
}

export default config
