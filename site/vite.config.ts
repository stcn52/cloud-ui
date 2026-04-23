import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/cloud-ui/' : '/',
  plugins: [
    { enforce: 'pre', ...mdx({ include: /\.mdx$/ }) },
    react({ include: /\.(jsx|tsx|mdx)$/ }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}))
