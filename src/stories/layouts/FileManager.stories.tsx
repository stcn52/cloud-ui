import { useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Breadcrumb,
  Breadcrumbs,
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFoot,
  DialogHead,
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
  useContextMenu,
} from '../..'

const meta: Meta = {
  title: '08 · Layouts/File manager',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '宝塔面板文件管理器的完整实现：多标签、面包屑、工具栏、表格 + 复选、右键菜单（含子菜单）、属性对话框、文件内容搜索对话框、分页。用来验证 useContextMenu / Tab closable / PopoverItem submenu 三个新能力。',
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
    <text x="4" y="16" fill="white" fontSize="8" fontFamily="monospace" fontWeight="bold">SH</text>
  </svg>
)

// ── menu icons (colored) ────────────────────────────────────────────────
const mkIcon = (children: ReactNode, color: string) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)
const I_DOWN = mkIcon(<><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>, '#2196f3')
const I_SPLIT = mkIcon(<><circle cx="12" cy="12" r="8" /><path d="M12 4v16" /></>, '#2196f3')
const I_STAR = mkIcon(<polygon points="12 2 15 9 22 9 17 14 19 22 12 18 5 22 7 14 2 9 9 9" />, '#ffc107')
const I_SHARE = mkIcon(<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" /></>, '#4caf50')
const I_PIN = mkIcon(<path d="M12 2l2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6z" />, '#ffc107')
const I_UPLOAD = mkIcon(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>, '#2196f3')
const I_KEY = mkIcon(<><circle cx="8" cy="15" r="3.5" /><path d="M11 13l9-9" /></>, '#ffc107')
const I_COPY = mkIcon(<><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>, '#90a4ae')
const I_CUT = mkIcon(<><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></>, '#42a5f5')
const I_RENAME = mkIcon(<><line x1="12" y1="20" x2="21" y2="20" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" /></>, '#42a5f5')
const I_TRASH = mkIcon(<><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>, '#f44336')
const I_ZIP = mkIcon(<><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M10 4v16" /></>, '#9e9e9e')
const I_UNZIP = mkIcon(<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M8 12h8M12 8v8" /></>, '#9c27b0')
const I_DUP = mkIcon(<><rect x="8" y="8" width="12" height="12" rx="2" /><rect x="4" y="4" width="12" height="12" rx="2" /></>, '#90a4ae')
const I_MAIL = mkIcon(<><rect x="2" y="5" width="20" height="14" rx="2" /><polyline points="22 7 12 13 2 7" /></>, '#2196f3')
const I_INFO = mkIcon(<><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><circle cx="12" cy="8" r="0.5" fill="currentColor" /></>, '#ff9800')
const I_CONV = mkIcon(<><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></>, '#4caf50')

// ── sample data ─────────────────────────────────────────────────────────
interface Row {
  id: string
  icon: ReactNode
  name: string
  protect: string
  protectTone: 'ok' | 'warn'
  perm: string
  size: string
  sizeTone?: 'calc' | 'value'
  mtime: string
}
const rows: Row[] = [
  { id: '301', icon: FolderIcon, name: '301', protect: '未保护 🔒', protectTone: 'warn', perm: '755/www', size: '计算', sizeTone: 'calc', mtime: '2026-04-19 02:06:05' },
  { id: 'old', icon: FolderIcon, name: 'old', protect: '未保护 🔒', protectTone: 'warn', perm: '755/www', size: '计算', sizeTone: 'calc', mtime: '2026-04-19 02:05:13' },
  { id: 'gfw301', icon: ZipIcon, name: 'gfw301.zip', protect: '未保护 🔒', protectTone: 'warn', perm: '755/www', size: '26.04 MB', mtime: '2026-04-19 02:06:18' },
  { id: 'gfw3012023', icon: ZipIcon, name: 'gfw3012023.zip', protect: '未保护 🔒', protectTone: 'warn', perm: '755/root', size: '26.03 MB', mtime: '2026-04-19 01:38:30' },
  { id: 'gfw_install', icon: ShellIcon, name: 'gfw_install.sh', protect: '未保护 🔒', protectTone: 'warn', perm: '644/root', size: '3.75 KB', mtime: '2026-04-19 01:40:27' },
  { id: 'gfwcli', icon: ZipIcon, name: 'gfwcli.zip', protect: '未保护 🔒', protectTone: 'warn', perm: '755/root', size: '12.62 MB', mtime: '2026-04-19 02:03:28' },
]

export const BtPanel: Story = {
  render: () => {
    const [tabs, setTabs] = useState([
      { id: 'a', label: 'install' },
      { id: 'b', label: 'install' },
      { id: 'c', label: 'install' },
    ])
    const [activeTab, setActiveTab] = useState('c')
    const [selected, setSelected] = useState<Set<string>>(new Set(['gfw301']))
    const [hoverRow, setHoverRow] = useState<string | null>('gfw301')
    const [view, setView] = useState<'list' | 'grid'>('list')
    const [page, setPage] = useState(1)
    const [contextRow, setContextRow] = useState<string | null>(null)
    const [propsOpen, setPropsOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)

    // Row context menu (18 items)
    const rowMenu = useContextMenu(
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
        <PopoverItem icon={I_TRASH} danger>删除</PopoverItem>
        <PopoverSeparator />
        <PopoverItem icon={I_ZIP}>创建压缩</PopoverItem>
        <PopoverItem icon={I_UNZIP}>解压</PopoverItem>
        <PopoverItem icon={I_DUP}>创建副本</PopoverItem>
        <PopoverSeparator />
        <PopoverItem icon={I_MAIL}>发送到邮箱</PopoverItem>
        <PopoverItem
          icon={I_INFO}
          onClick={() => setPropsOpen(true)}
        >
          属性
        </PopoverItem>
      </>,
    )

    // Batch context menu (fewer items when right-clicking empty area with selection)
    const batchMenu = useContextMenu(
      <>
        <PopoverItem icon={I_COPY}>复制</PopoverItem>
        <PopoverItem icon={I_CUT}>剪切</PopoverItem>
        <PopoverItem icon={I_KEY}>权限</PopoverItem>
        <PopoverItem icon={I_ZIP}>创建压缩</PopoverItem>
        <PopoverItem icon={I_CONV}>格式转换</PopoverItem>
        <PopoverItem icon={I_TRASH} danger>删除</PopoverItem>
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
    const toggleAll = () =>
      setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)))

    const closeTab = (id: string) => {
      setTabs((t) => {
        const next = t.filter((x) => x.id !== id)
        if (activeTab === id && next.length) setActiveTab(next[next.length - 1].id)
        return next
      })
    }

    const hasSelection = selected.size > 0

    return (
      <div className="min-h-[780px] bg-bg text-text">
        {/* Tab bar */}
        <div className="flex items-center gap-1 px-3 pt-2 bg-bg-sunk">
          <Tabs className="border-b-0">
            {tabs.map((t) => (
              <Tab
                key={t.id}
                active={activeTab === t.id}
                closable
                onClick={() => setActiveTab(t.id)}
                onClose={() => closeTab(t.id)}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span>📁</span>
                  <span>{t.label}</span>
                </span>
              </Tab>
            ))}
          </Tabs>
          <Button
            iconOnly
            size="xs"
            intent="ghost"
            onClick={() => setTabs((t) => [...t, { id: String(Math.random()), label: 'install' }])}
          >
            +
          </Button>
        </div>

        {/* Breadcrumb bar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-bg-elev border-b border-line">
          <Button iconOnly size="sm" intent="ghost">←</Button>
          <Breadcrumbs>
            <Breadcrumb>根目录</Breadcrumb>
            <Breadcrumb>www</Breadcrumb>
            <Breadcrumb>wwwroot</Breadcrumb>
            <Breadcrumb>gf.btkaixin.icu</Breadcrumb>
            <Breadcrumb leaf>install</Breadcrumb>
          </Breadcrumbs>
          <Button iconOnly size="sm" intent="ghost">⟳</Button>
          <div className="ml-auto flex items-center gap-2">
            <Input size="sm" placeholder="搜索文件/目录" style={{ width: 260 }} />
            <label className="inline-flex items-center gap-1 text-xs text-text-muted">
              <Checkbox /> 包含子目录
            </label>
            <Button iconOnly size="sm">🔍</Button>
          </div>
        </div>

        {/* Main toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-bg-elev border-b border-line flex-wrap">
          <Button intent="primary" size="sm">⬆ 上传/下载 ▾</Button>
          <Button size="sm">＋ 新建 ▾</Button>
          <Button size="sm" intent="ghost" onClick={() => setSearchOpen(true)}>🔍 文件内容搜索</Button>
          <Button size="sm" intent="ghost">⭐ 收藏夹 ▾</Button>
          <Button size="sm" intent="ghost">分享列表</Button>
          <Button size="sm" intent="ghost">▸ 终端</Button>
          <Button size="sm" intent="ghost">📝 文件操作记录</Button>
          <Button size="sm" intent="ghost">📀 /(根目录) 800.16 GB</Button>
          <span className="text-text-dim">|</span>
          <Button size="sm" intent="ghost">🛡 企业级防篡改</Button>
          <Button size="sm" intent="ghost">⇄ 文件同步</Button>
          <div className="ml-auto flex items-center gap-1">
            {hasSelection && (
              <>
                <Button size="sm" intent="ghost">📋 复制</Button>
                <Button size="sm" intent="ghost">✂ 剪切</Button>
                <Button size="sm" intent="ghost">📦 压缩</Button>
                <Button size="sm" intent="ghost">🔑 权限</Button>
                <Button size="sm" intent="ghost" className="text-err">❌ 删除</Button>
              </>
            )}
            <Button size="sm" intent="ghost">🗑 回收站</Button>
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
          className="px-3 py-2"
          onContextMenu={(e) => {
            // right-click empty area: open batch menu if there's a selection
            if (e.target === e.currentTarget && hasSelection) {
              batchMenu.open(e)
            }
          }}
        >
          <Table>
            <thead>
              <tr>
                <th style={{ width: 32 }}>
                  <Checkbox checked={allSelected} onChange={toggleAll} />
                </th>
                <th>文件名称 ↕</th>
                <th>企业级防篡改</th>
                <th>权限/所有者</th>
                <th>大小 ↕</th>
                <th>修改时间 ↕</th>
                <th>备注</th>
                <th style={{ width: 220 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isSel = selected.has(r.id)
                const isHover = hoverRow === r.id
                return (
                  <tr
                    key={r.id}
                    onMouseEnter={() => setHoverRow(r.id)}
                    onMouseLeave={() => setHoverRow((h) => (h === r.id ? null : h))}
                    onContextMenu={(e) => {
                      setContextRow(r.id)
                      rowMenu.open(e)
                    }}
                    style={isSel ? { background: 'color-mix(in oklch, var(--color-ok) 8%, transparent)' } : undefined}
                  >
                    <td><Checkbox checked={isSel} onChange={() => toggleSel(r.id)} /></td>
                    <td>
                      <span className="inline-flex items-center gap-2">
                        {r.icon}
                        <a className="text-ok hover:underline cursor-pointer">{r.name}</a>
                      </span>
                    </td>
                    <td><span className="text-text-muted">{r.protect}</span></td>
                    <td className="mono">{r.perm}</td>
                    <td>
                      {r.sizeTone === 'calc'
                        ? <a className="text-ok cursor-pointer hover:underline">{r.size}</a>
                        : <span className="mono">{r.size}</span>
                      }
                    </td>
                    <td className="mono">{r.mtime}</td>
                    <td>{contextRow === r.id ? <span className="text-xs text-text-dim mono">right-clicked</span> : ''}</td>
                    <td>
                      {isHover ? (
                        <span className="flex items-center gap-1 text-xs text-ok">
                          <a className="cursor-pointer hover:underline">复制</a>
                          <a className="cursor-pointer hover:underline">剪切</a>
                          <a className="cursor-pointer hover:underline">重命名</a>
                          <a className="cursor-pointer hover:underline">权限</a>
                          <a className="cursor-pointer hover:underline">压缩</a>
                          <a className="cursor-pointer hover:underline">解压</a>
                          <a className="cursor-pointer hover:underline text-err">删除</a>
                          <a className="cursor-pointer hover:underline">更多 ▾</a>
                        </span>
                      ) : ''}
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
          <Select defaultValue="-">
            <option value="-">请选择批量操作</option>
            <option>删除</option>
            <option>压缩</option>
            <option>复制</option>
            <option>剪切</option>
          </Select>
          <Button size="sm">批量操作</Button>
          <div className="ml-auto flex items-center gap-2">
            <Pagination page={page} total={5} onChange={setPage} />
            <Select defaultValue="10">
              <option value="10">10 条/页</option>
              <option value="50">50 条/页</option>
              <option value="500">500 条/页</option>
            </Select>
            <span className="text-xs text-text-muted">共 46 条</span>
            <span className="text-xs text-text-muted">前往</span>
            <Input size="sm" defaultValue="1" style={{ width: 50 }} />
            <span className="text-xs text-text-muted">页</span>
          </div>
        </div>

        {/* Context menus render once */}
        {rowMenu.render()}
        {batchMenu.render()}

        {/* Properties dialog */}
        <PropsDialog open={propsOpen} onClose={() => setPropsOpen(false)} />

        {/* Search dialog */}
        <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    )
  },
}

// ── Properties dialog ─────────────────────────────────────────────
function PropsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'常规' | '详细信息' | '历史版本' | '权限'>('常规')
  return (
    <Dialog open={open} onClose={onClose} style={{ width: 560 }}>
      <DialogHead title={<>[ gfw301.zip ] - 文件属性</>} />
      <div className="px-4">
        <Tabs>
          {(['常规', '详细信息', '历史版本', '权限'] as const).map((t) => (
            <Tab key={t} active={t === tab} onClick={() => setTab(t)}>{t}</Tab>
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
                <Button iconOnly size="xs" intent="ghost">📋</Button>
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
          <Select defaultValue="常规">
            <option>常规搜索</option>
            <option>正则搜索</option>
          </Select>
          <Select defaultValue="文件">
            <option>文件</option>
            <option>文件夹</option>
          </Select>
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
