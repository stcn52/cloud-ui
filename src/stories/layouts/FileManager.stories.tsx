import { useRef, useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  CardTab,
  CardTabs,
  Checkbox,
  ConfigProvider,
  Dialog,
  DialogBody,
  DialogFoot,
  DialogHead,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownSeparator,
  Empty,
  Field,
  Input,
  Pagination,
  PopoverItem,
  PopoverSeparator,
  Segmented,
  Select,
  Tab,
  Table,
  Tabs,
  Tooltip,
  useContextMenu,
  zhCN,
} from '../..'

const meta: Meta = {
  title: '08 · Layouts/File manager',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '宝塔面板文件管理器的 1:1 还原。演示：CardTabs 多标签、useContextMenu（右键 + 子菜单）、属性对话框、文件内容搜索对话框、常驻工具栏 + 行内操作。',
      },
    },
  },
}
export default meta
type Story = StoryObj

// ── file-type icons ─────────────────────────────────────────────────────
const FolderIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f0c14b">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
)
const ZipIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <rect x="1" y="1" width="7" height="7" fill="#f44336" />
    <rect x="8" y="1" width="7" height="7" fill="#4caf50" />
    <rect x="1" y="8" width="7" height="7" fill="#ffc107" />
    <rect x="8" y="8" width="7" height="7" fill="#2196f3" />
  </svg>
)
const ShellIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="#4a9eff" />
    <text x="4" y="16" fill="white" fontSize="8" fontFamily="monospace" fontWeight="bold">
      SH
    </text>
  </svg>
)

// ── inline SVG toolbar icons ───────────────────────────────────────────
function Icn({ children, size = 14 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

const I_UPLOAD_TB = <Icn><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Icn>
const I_PLUS_TB   = <Icn><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icn>
const I_SEARCH_TB = <Icn><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icn>
const I_STAR_TB   = <Icn><polygon points="12 2 15 9 22 9 17 14 19 22 12 18 5 22 7 14 2 9 9 9" /></Icn>
const I_SHARE_TB  = <Icn><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" /></Icn>
const I_TERM      = <Icn><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></Icn>
const I_LOG       = <Icn><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /></Icn>
const I_DISK      = <Icn><ellipse cx="12" cy="12" rx="10" ry="3" /><path d="M2 12v6c0 1.7 4.5 3 10 3s10-1.3 10-3v-6" /></Icn>
const I_SHIELD    = <Icn><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z" /></Icn>
const I_SYNC      = <Icn><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M20 15a9 9 0 0 1-15 3M4 9a9 9 0 0 1 15-3" /></Icn>
const I_COPY_TB   = <Icn><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></Icn>
const I_CUT_TB    = <Icn><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></Icn>
const I_ZIP_TB    = <Icn><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M10 4v16" /></Icn>
const I_KEY_TB    = <Icn><circle cx="8" cy="15" r="3.5" /><path d="M11 13l9-9" /></Icn>
const I_TRASH_TB  = <Icn><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></Icn>
const I_REFRESH   = <Icn><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></Icn>
const I_ARROW_L   = <Icn><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></Icn>
const I_CHEV_DN   = <Icn size={10}><polyline points="6 9 12 15 18 9" /></Icn>
const I_SORT      = <Icn size={10}><polyline points="8 9 12 5 16 9" /><polyline points="16 15 12 19 8 15" /></Icn>
const I_LOCK      = <Icn size={10}><rect x="6" y="10" width="12" height="10" rx="1.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Icn>

// ── popover menu icons (colored) ───────────────────────────────────────
const mkC = (children: ReactNode, color: string) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)
const I_DOWN    = mkC(<><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>, '#2196f3')
const I_SPLIT   = mkC(<><circle cx="12" cy="12" r="8" /><path d="M12 4v16" /></>, '#2196f3')
const I_STAR    = mkC(<polygon points="12 2 15 9 22 9 17 14 19 22 12 18 5 22 7 14 2 9 9 9" />, '#ffc107')
const I_SHARE   = mkC(<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" /></>, '#4caf50')
const I_PIN     = mkC(<path d="M12 2l2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6z" />, '#ffc107')
const I_UPLOAD  = mkC(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>, '#2196f3')
const I_KEY     = mkC(<><circle cx="8" cy="15" r="3.5" /><path d="M11 13l9-9" /></>, '#ffc107')
const I_COPY    = mkC(<><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>, '#90a4ae')
const I_CUT     = mkC(<><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></>, '#42a5f5')
const I_RENAME  = mkC(<><line x1="12" y1="20" x2="21" y2="20" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" /></>, '#42a5f5')
const I_TRASH_R = mkC(<><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>, '#f44336')
const I_ZIP_R   = mkC(<><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M10 4v16" /></>, '#9e9e9e')
const I_UNZIP   = mkC(<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M8 12h8M12 8v8" /></>, '#9c27b0')
const I_DUP     = mkC(<><rect x="8" y="8" width="12" height="12" rx="2" /><rect x="4" y="4" width="12" height="12" rx="2" /></>, '#90a4ae')
const I_MAIL    = mkC(<><rect x="2" y="5" width="20" height="14" rx="2" /><polyline points="22 7 12 13 2 7" /></>, '#2196f3')
const I_INFO    = mkC(<><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><circle cx="12" cy="8" r="0.5" fill="currentColor" /></>, '#ff9800')
const I_CONV    = mkC(<><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></>, '#4caf50')

// ── paid-feature badge (💎 企) ─────────────────────────────────────────
function ProBadge() {
  return (
    <span
      className="inline-block text-[9px] font-bold text-[#9a6b12] px-1 py-px rounded-sm"
      style={{
        background: 'linear-gradient(135deg, #fff4c4, #e8c874)',
        border: '1px solid #c9a259',
        lineHeight: 1.2,
      }}
    >
      企
    </span>
  )
}

// ── inline row action (green text link, like 宝塔) ─────────────────────
function RowLink({ children, danger, onClick }: { children: ReactNode; danger?: boolean; onClick?: () => void }) {
  return (
    <a
      className={
        'cursor-pointer hover:underline whitespace-nowrap ' +
        (danger ? 'text-err' : 'text-ok')
      }
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      {children}
    </a>
  )
}

// ── data ──────────────────────────────────────────────────────────────
interface Row {
  id: string
  icon: ReactNode
  name: string
  perm: string
  size: string
  sizeIsCalc?: boolean
  mtime: string
}
const rows: Row[] = [
  { id: '301', icon: FolderIcon, name: '301', perm: '755/www', size: '计算', sizeIsCalc: true, mtime: '2026-04-19 02:06:05' },
  { id: 'old', icon: FolderIcon, name: 'old', perm: '755/www', size: '计算', sizeIsCalc: true, mtime: '2026-04-19 02:05:13' },
  { id: 'gfw301', icon: ZipIcon, name: 'gfw301.zip', perm: '755/www', size: '26.04 MB', mtime: '2026-04-19 02:06:18' },
  { id: 'gfw3012023', icon: ZipIcon, name: 'gfw3012023.zip', perm: '755/root', size: '26.03 MB', mtime: '2026-04-19 01:38:30' },
  { id: 'gfw_install', icon: ShellIcon, name: 'gfw_install.sh', perm: '644/root', size: '3.75 KB', mtime: '2026-04-19 01:40:27' },
  { id: 'gfwcli', icon: ZipIcon, name: 'gfwcli.zip', perm: '755/root', size: '12.62 MB', mtime: '2026-04-19 02:03:28' },
]

export const BtPanel: Story = {
  render: () => (
    <ConfigProvider locale={zhCN}>
      <FileManager />
    </ConfigProvider>
  ),
}

function FileManager() {
  const [tabs, setTabs] = useState([
    { id: 'a', label: 'install' },
    { id: 'b', label: 'install' },
    { id: 'c', label: 'install' },
  ])
  const [activeTab, setActiveTab] = useState('c')
  const [selected, setSelected] = useState<Set<string>>(new Set(['gfw301']))
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [page, setPage] = useState(1)
  const [propsOpen, setPropsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // ── Marquee (drag-rectangle) selection ──────────────────────────────
  const tableAreaRef = useRef<HTMLDivElement>(null)
  const [marqueeRect, setMarqueeRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null)

  const onMarqueeDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ignore clicks on interactive cell content (checkbox, link, button).
    const t = e.target as HTMLElement
    if (t.closest('input, button, a, label')) return
    // Left button only.
    if (e.button !== 0) return
    const container = tableAreaRef.current
    if (!container) return
    const cRect = container.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const originLeft = startX - cRect.left
    const originTop = startY - cRect.top
    const baseline = new Set(e.shiftKey || e.ctrlKey || e.metaKey ? selected : [])
    let moved = false

    const onMove = (ev: MouseEvent) => {
      moved = true
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      const rect = {
        left: originLeft + Math.min(0, dx),
        top: originTop + Math.min(0, dy),
        width: Math.abs(dx),
        height: Math.abs(dy),
      }
      setMarqueeRect(rect)
      const mx1 = ev.clientX < startX ? ev.clientX : startX
      const my1 = ev.clientY < startY ? ev.clientY : startY
      const mx2 = ev.clientX > startX ? ev.clientX : startX
      const my2 = ev.clientY > startY ? ev.clientY : startY
      const rows = container.querySelectorAll<HTMLTableRowElement>('tr[data-row-id]')
      const next = new Set(baseline)
      rows.forEach((row) => {
        const rr = row.getBoundingClientRect()
        const intersects = rr.right > mx1 && rr.left < mx2 && rr.bottom > my1 && rr.top < my2
        const id = row.dataset.rowId
        if (!id) return
        if (intersects) next.add(id)
      })
      setSelected(next)
    }
    const onUp = () => {
      if (!moved) {
        // plain click on empty area = clear selection
        setSelected(new Set())
      }
      setMarqueeRect(null)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    e.preventDefault()
  }

  // Shared 18-item menu — used for right-click and for the row's "More ▾"
  const rowMenuItems = (
    <>
      <PopoverItem icon={I_DOWN}>下载</PopoverItem>
      <PopoverItem icon={I_SPLIT}>文件拆分</PopoverItem>
      <PopoverItem icon={I_STAR}>添加到收藏夹</PopoverItem>
      <PopoverItem icon={I_SHARE}>外链分享</PopoverItem>
      <PopoverItem icon={I_PIN}>置顶</PopoverItem>
      <PopoverSeparator />
      <PopoverItem
        icon={I_UPLOAD}
        submenu={
          <>
            <PopoverItem>上传到阿里云 OSS</PopoverItem>
            <PopoverItem>上传到腾讯云 COS</PopoverItem>
            <PopoverItem>上传到七牛云</PopoverItem>
            <PopoverItem>上传到 AWS S3</PopoverItem>
          </>
        }
      >
        上传到云存储
      </PopoverItem>
      <PopoverItem icon={I_KEY}>权限</PopoverItem>
      <PopoverSeparator />
      <PopoverItem icon={I_COPY}>复制</PopoverItem>
      <PopoverItem icon={I_CUT}>剪切</PopoverItem>
      <PopoverItem icon={I_RENAME}>重命名</PopoverItem>
      <PopoverItem icon={I_TRASH_R} danger>删除</PopoverItem>
      <PopoverSeparator />
      <PopoverItem icon={I_ZIP_R}>创建压缩</PopoverItem>
      <PopoverItem icon={I_UNZIP}>解压</PopoverItem>
      <PopoverItem icon={I_DUP}>创建副本</PopoverItem>
      <PopoverSeparator />
      <PopoverItem icon={I_MAIL}>发送到邮箱</PopoverItem>
      <PopoverItem icon={I_INFO} onClick={() => setPropsOpen(true)}>属性</PopoverItem>
    </>
  )
  const rowMenu = useContextMenu(rowMenuItems)

  // Batch-area context menu
  const batchMenu = useContextMenu(
    <>
      <PopoverItem icon={I_COPY}>复制</PopoverItem>
      <PopoverItem icon={I_CUT}>剪切</PopoverItem>
      <PopoverItem icon={I_KEY}>权限</PopoverItem>
      <PopoverItem icon={I_ZIP_R}>创建压缩</PopoverItem>
      <PopoverItem icon={I_CONV}>格式转换</PopoverItem>
      <PopoverItem icon={I_TRASH_R} danger>删除</PopoverItem>
    </>,
  )

  const toggleSel = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const allSelected = selected.size === rows.length
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)))

  const closeTab = (id: string) => {
    setTabs((t) => {
      const next = t.filter((x) => x.id !== id)
      if (activeTab === id && next.length) setActiveTab(next[next.length - 1].id)
      return next
    })
  }

  return (
    <div className="min-h-[780px] bg-bg text-text text-sm">
      {/* Tab bar — chrome style */}
      <div className="bg-bg-sunk pt-2 px-3">
        <CardTabs value={activeTab} onChange={setActiveTab}>
          {tabs.map((t) => (
            <CardTab
              key={t.id}
              id={t.id}
              closable
              icon={FolderIcon}
              onClose={() => closeTab(t.id)}
            >
              {t.label}
            </CardTab>
          ))}
          <button
            type="button"
            className="inline-grid place-items-center w-7 h-7 self-end mb-0.5 text-text-dim hover:text-text hover:bg-bg-elev rounded"
            onClick={() => setTabs((ts) => [...ts, { id: String(Math.random()), label: 'install' }])}
          >
            +
          </button>
        </CardTabs>
      </div>

      {/* Breadcrumb bar — each segment clickable with hover tooltip */}
      <div className="flex items-center gap-2 px-3 py-2 bg-bg-elev border-b border-line">
        <Button iconOnly size="sm" intent="ghost">{I_ARROW_L}</Button>
        <Breadcrumbs>
          {[
            { label: '根目录', path: '/' },
            { label: 'www', path: '/www' },
            { label: 'wwwroot', path: '/www/wwwroot' },
            { label: 'gf.btkaixin.icu', path: '/www/wwwroot/gf.btkaixin.icu' },
          ].map((seg) => (
            <BreadcrumbItem key={seg.path}>
              <Tooltip tip={seg.path}>
                <a className="text-text-muted hover:text-accent-ink cursor-pointer">{seg.label}</a>
              </Tooltip>
            </BreadcrumbItem>
          ))}
          <BreadcrumbItem leaf>
            <Tooltip tip="/www/wwwroot/gf.btkaixin.icu/install">
              <span>install</span>
            </Tooltip>
          </BreadcrumbItem>
        </Breadcrumbs>
        <Button iconOnly size="sm" intent="ghost">{I_REFRESH}</Button>
        <div className="ml-auto flex items-center gap-2">
          <div style={{ width: 260 }}>
            <Input size="sm" placeholder="搜索文件/目录" />
          </div>
          <label className="inline-flex items-center gap-1 text-xs text-text-muted whitespace-nowrap">
            <Checkbox /> 包含子目录
          </label>
          <Button iconOnly size="sm">{I_SEARCH_TB}</Button>
        </div>
      </div>

      {/* Main toolbar — all actions always visible */}
      <div className="flex items-center gap-1 px-3 py-2 bg-bg-elev border-b border-line flex-wrap">
        <Dropdown
          trigger={
            <Button intent="primary" size="sm">
              {I_UPLOAD_TB} 上传/下载 {I_CHEV_DN}
            </Button>
          }
          width={200}
        >
          <DropdownItem icon={I_UPLOAD_TB}>上传文件/文件夹</DropdownItem>
          <DropdownItem icon={<span style={{ color: '#2196f3' }}>🔗</span>}>URL 链接下载</DropdownItem>
          <DropdownSeparator />
          <DropdownGroup>
            <DropdownItem icon={<span>⚡</span>}>
              <span className="inline-flex items-center gap-1.5">
                百度云存储 <ProBadge />
              </span>
            </DropdownItem>
            <DropdownItem icon={<span>☁</span>}>
              <span className="inline-flex items-center gap-1.5">
                阿里云存储 <ProBadge />
              </span>
            </DropdownItem>
            <DropdownItem icon={<span>☁</span>}>
              <span className="inline-flex items-center gap-1.5">
                腾讯云存储 <ProBadge />
              </span>
            </DropdownItem>
            <DropdownItem icon={<span>🌸</span>}>
              <span className="inline-flex items-center gap-1.5">
                华为云存储 <ProBadge />
              </span>
            </DropdownItem>
          </DropdownGroup>
        </Dropdown>
        <Button size="sm">{I_PLUS_TB} 新建 {I_CHEV_DN}</Button>
        <Button size="sm" intent="ghost" onClick={() => setSearchOpen(true)}>{I_SEARCH_TB} 文件内容搜索</Button>
        <Button size="sm" intent="ghost">{I_STAR_TB} 收藏夹 {I_CHEV_DN}</Button>
        <Button size="sm" intent="ghost">{I_SHARE_TB} 分享列表</Button>
        <Button size="sm" intent="ghost">{I_TERM} 终端</Button>
        <Button size="sm" intent="ghost">{I_LOG} 文件操作记录</Button>
        <Button size="sm" intent="ghost">{I_DISK} /(根目录) 800.16 GB</Button>
        <span className="text-line-strong mx-1">|</span>
        <Button size="sm" intent="ghost">{I_SHIELD} 企业级防篡改</Button>
        <Button size="sm" intent="ghost">{I_SYNC} 文件同步</Button>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" intent="ghost">{I_COPY_TB} 复制</Button>
          <Button size="sm" intent="ghost">{I_CUT_TB} 剪切</Button>
          <Button size="sm" intent="ghost">{I_ZIP_TB} 压缩</Button>
          <Button size="sm" intent="ghost">{I_KEY_TB} 权限</Button>
          <Button size="sm" intent="ghost" className="text-err">{I_TRASH_TB} 删除</Button>
          <Button size="sm" intent="ghost">{I_TRASH_TB} 回收站</Button>
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: 'list', label: '☰' },
              { value: 'grid', label: '▦' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div
        ref={tableAreaRef}
        className="px-3 py-2 relative select-none"
        onMouseDown={onMarqueeDown}
        onContextMenu={(e) => {
          if (e.target === e.currentTarget && selected.size > 0) batchMenu.open(e)
        }}
      >
        {marqueeRect && (
          <div
            className="absolute pointer-events-none border border-dashed border-accent"
            style={{
              left: marqueeRect.left,
              top: marqueeRect.top,
              width: marqueeRect.width,
              height: marqueeRect.height,
              background: 'color-mix(in oklch, var(--color-accent) 8%, transparent)',
            }}
          />
        )}
        <Table>
          <thead>
            <tr>
              <th style={{ width: 32 }}>
                <Checkbox checked={allSelected} onChange={toggleAll} />
              </th>
              <th>
                <span className="inline-flex items-center gap-1">文件名称 {I_SORT}</span>
              </th>
              <th>企业级防篡改</th>
              <th>权限/所有者</th>
              <th>
                <span className="inline-flex items-center gap-1">大小 {I_SORT}</span>
              </th>
              <th>
                <span className="inline-flex items-center gap-1">修改时间 {I_SORT}</span>
              </th>
              <th>备注</th>
              <th style={{ width: 260 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isSel = selected.has(r.id)
              return (
                <tr
                  key={r.id}
                  data-row-id={r.id}
                  onContextMenu={(e) => rowMenu.open(e)}
                  style={isSel ? { background: 'color-mix(in oklch, var(--color-ok) 8%, transparent)' } : undefined}
                >
                  <td><Checkbox checked={isSel} onChange={() => toggleSel(r.id)} /></td>
                  <td>
                    <span className="inline-flex items-center gap-2">
                      {r.icon}
                      <a className="text-ok hover:underline cursor-pointer">{r.name}</a>
                    </span>
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1 text-text-muted text-xs">
                      未保护 {I_LOCK}
                    </span>
                  </td>
                  <td className="mono text-xs">{r.perm}</td>
                  <td>
                    {r.sizeIsCalc ? (
                      <a className="text-ok cursor-pointer hover:underline">{r.size}</a>
                    ) : (
                      <span className="mono text-xs">{r.size}</span>
                    )}
                  </td>
                  <td className="mono text-xs">{r.mtime}</td>
                  <td className="text-text-dim text-xs">—</td>
                  <td>
                    <span className="inline-flex items-center gap-3 text-xs">
                      <RowLink>复制</RowLink>
                      <RowLink>剪切</RowLink>
                      <RowLink>重命名</RowLink>
                      <RowLink>权限</RowLink>
                      <RowLink>压缩</RowLink>
                      <RowLink>解压</RowLink>
                      <RowLink danger>删除</RowLink>
                      <Dropdown
                        trigger={
                          <a className="text-ok cursor-pointer hover:underline whitespace-nowrap">
                            更多 ▾
                          </a>
                        }
                        placement="bottom-end"
                      >
                        {rowMenuItems}
                      </Dropdown>
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-line bg-bg-elev">
        <Checkbox checked={allSelected} onChange={toggleAll} />
        <div style={{ width: 160 }}>
          <Select
            defaultValue="-"
            options={[
              { value: '-', label: '请选择批量操作' },
              { value: '删除', label: '删除' },
              { value: '压缩', label: '压缩' },
              { value: '复制', label: '复制' },
              { value: '剪切', label: '剪切' },
            ]}
          />
        </div>
        <Button size="sm" intent="primary">批量操作</Button>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <Pagination current={page} total={50} pageSize={10} onChange={setPage} />
          <div style={{ width: 90 }}>
            <Select
              defaultValue="10"
              options={[
                { value: '10', label: '10 条/页' },
                { value: '50', label: '50 条/页' },
                { value: '500', label: '500 条/页' },
              ]}
            />
          </div>
          <span className="text-text-muted">共 46 条</span>
          <span className="text-text-muted">前往</span>
          <div style={{ width: 44 }}>
            <Input size="sm" defaultValue="1" />
          </div>
          <span className="text-text-muted">页</span>
        </div>
      </div>

      {rowMenu.render()}
      {batchMenu.render()}

      <PropsDialog open={propsOpen} onClose={() => setPropsOpen(false)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

// ── Properties dialog ─────────────────────────────────────────────
function PropsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'常规' | '详细信息' | '历史版本' | '权限'>('常规')
  return (
    <Dialog open={open} onClose={onClose} style={{ width: 560 }}>
      <DialogHead title={<>[ gfw301.zip ] - 文件属性</>} />
      <div className="px-4">
        <Tabs value={tab} onChange={(v) => setTab(v as typeof tab)}>
          {(['常规', '详细信息', '历史版本', '权限'] as const).map((t) => (
            <Tab key={t} id={t}>{t}</Tab>
          ))}
        </Tabs>
      </div>
      <DialogBody>
        {tab === '常规' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-14 rounded border border-line bg-bg-sunk grid place-items-center text-xl">📄</div>
              <Input defaultValue="gfw301.zip" />
            </div>
            <div className="h-px bg-line" />
            <div className="grid grid-cols-[90px_1fr] gap-y-2 text-sm">
              <span className="text-text-muted">类型：</span><span className="mono">zip</span>
              <span className="text-text-muted">文件路径：</span>
              <span className="mono flex items-center gap-1">
                /www/wwwroot/gadmin.btkaixin.net/install/gfw301.zip
                <Button iconOnly size="xs" intent="ghost">{I_COPY_TB}</Button>
              </span>
              <span className="text-text-muted">大小：</span><span className="mono">26.04 MB</span>
            </div>
            <div className="h-px bg-line" />
            <div className="grid grid-cols-[90px_1fr] gap-y-2 text-sm">
              <span className="text-text-muted">权限：</span><span className="mono">755</span>
              <span className="text-text-muted">所属组：</span><span className="mono">www</span>
              <span className="text-text-muted">所属用户：</span><span className="mono">www</span>
            </div>
            <div className="h-px bg-line" />
            <div className="grid grid-cols-[90px_1fr] gap-y-2 text-sm">
              <span className="text-text-muted">访问时间：</span><span className="mono">2026-04-19 02:06:18</span>
              <span className="text-text-muted">修改时间：</span><span className="mono">2026-04-19 02:06:18</span>
            </div>
          </div>
        )}
        {tab === '详细信息' && <div className="text-text-muted text-sm py-8 text-center">占位内容</div>}
        {tab === '历史版本' && <div className="text-text-muted text-sm py-8 text-center">占位内容</div>}
        {tab === '权限' && <div className="text-text-muted text-sm py-8 text-center">占位内容</div>}
      </DialogBody>
      <DialogFoot>
        <Button onClick={onClose}>取消</Button>
        <Button intent="primary">保存</Button>
      </DialogFoot>
    </Dialog>
  )
}

// ── Content search dialog ────────────────────────────────────────
function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  return (
    <Dialog open={open} onClose={onClose} style={{ width: 760 }}>
      <DialogHead title="文件内容搜索" />
      <DialogBody>
        <div className="flex items-center gap-2 mb-4">
          <div style={{ width: 110 }}>
            <Select
              defaultValue="常规"
              options={[
                { value: '常规', label: '常规搜索' },
                { value: '正则', label: '正则搜索' },
              ]}
            />
          </div>
          <div style={{ width: 90 }}>
            <Select
              defaultValue="文件"
              options={[
                { value: '文件', label: '文件' },
                { value: '文件夹', label: '文件夹' },
              ]}
            />
          </div>
          <Input
            placeholder="请输入搜索内容"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button size="sm" intent="ghost" style={{ fontFamily: 'serif' }}>Aa</Button>
          <Button size="sm" intent="ghost">[ab]</Button>
          <Button size="sm" intent="ghost">.*</Button>
          <Button size="sm" intent="primary">搜索</Button>
        </div>

        <Field label="目录">
          <div className="flex items-center gap-2">
            <Input defaultValue="/www/wwwroot/gf.btkaixin.icu/install" style={{ flex: 1 }} />
            <label className="inline-flex items-center gap-1 text-xs text-text-muted whitespace-nowrap">
              <Checkbox defaultChecked /> 包含子目录
            </label>
            <Button iconOnly size="sm">📁</Button>
          </div>
        </Field>
        <div className="mt-3">
          <Field label="文件后缀">
            <Input placeholder="选择或填写后缀类型，使用逗号分隔" />
          </Field>
        </div>

        <div className="mt-4 min-h-[280px] flex items-center justify-center border border-line rounded-md bg-bg-sunk">
          <Empty
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4-4" />
              </svg>
            }
            title="键入查找内容以在文件中查询"
            description="细致的选项可以有效地缩短检索时间"
          />
        </div>

        <ul className="text-xs text-text-muted list-disc pl-5 mt-3">
          <li>常规搜索仅支持查询 20MB 以下文件内容</li>
        </ul>
      </DialogBody>
    </Dialog>
  )
}
