import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ConfigProvider, Toaster } from '@stcn52/cloud-ui'
import type { Theme, Size } from '@stcn52/cloud-ui'
import { Shell } from './components/Shell'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { routes } from './routes'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')

export function App() {
  const [theme, setTheme] = useState<Theme>(() =>
    (document.documentElement.dataset.theme as Theme) || 'light',
  )
  const [size, setSize] = useState<Size>(() =>
    (document.documentElement.dataset.size as Size) || 'normal',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('cloud-ui-theme', theme) } catch {}
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.size = size
    try { localStorage.setItem('cloud-ui-size', size) } catch {}
  }, [size])

  return (
    <BrowserRouter basename={base}>
      <ConfigProvider theme={theme} size={size} target="body">
        <ScrollToTop />
        <Shell theme={theme} onThemeChange={setTheme} size={size} onSizeChange={setSize}>
          <Routes>
            <Route path="/" element={<Home />} />
            {routes.map((r) => (
              <Route key={r.path} path={r.path} element={<r.Component />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Shell>
        <Toaster position="bottom-right" />
      </ConfigProvider>
    </BrowserRouter>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
