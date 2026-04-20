import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

export default defineConfig(() => {
  const isLib = process.env.BUILD_MODE === 'lib'

  if (!isLib) {
    return {
      plugins: [react(), tailwindcss()],
      root: resolve(__dirname, 'playground'),
      server: { port: 5173, open: true },
      resolve: {
        alias: {
          '@stcn52/cloud-ui': resolve(__dirname, 'src/index.ts'),
        },
      },
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      dts({
        include: ['src'],
        exclude: ['playground', '**/*.test.*', '**/*.stories.*', '.storybook'],
        tsconfigPath: './tsconfig.build.json',
        rollupTypes: true,
      }),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'CloudUI',
        formats: ['es', 'cjs'],
        fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime',
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) return 'styles.css'
            return assetInfo.name ?? 'asset-[hash][extname]'
          },
        },
      },
      cssCodeSplit: false,
      sourcemap: true,
      emptyOutDir: true,
    },
  }
})
