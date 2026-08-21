import type { ReactNode } from 'react'

export type ViewKey = 'today' | 'library' | 'observe' | 'aids' | 'english' | 'daily' | 'mine'

export interface NavEntry {
  key: ViewKey
  label: string
  icon: string
}

export const NAV: NavEntry[] = [
  { key: 'today', label: '今日', icon: '📅' },
  { key: 'library', label: '活动库', icon: '🗂️' },
  { key: 'observe', label: '观察记录', icon: '📋' },
  { key: 'aids', label: '教具空间', icon: '🧩' },
  { key: 'english', label: '英文启蒙', icon: '🔊' },
  { key: 'daily', label: '日常记录', icon: '🍼' },
  { key: 'mine', label: '我的', icon: '👩' }
]

export function Sidebar({
  view,
  onChange
}: {
  view: ViewKey
  onChange: (key: ViewKey) => void
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">🎈</div>
        <div>
          <div className="brand-name">伊伊早教台</div>
          <div className="brand-sub">0-3 岁版</div>
        </div>
      </div>
      <nav className="nav-list">
        {NAV.map((item) => {
          const active = view === item.key
          return (
            <button
              key={item.key}
              className={`nav-item${active ? ' active' : ''}`}
              onClick={() => onChange(item.key)}
              aria-label={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </button>
          )
        })}
      </nav>
      <div className="footer-note">数据保存在本机，可到“我的”导出备份。</div>
    </aside>
  )
}

const PAGE_ICONS: Record<string, string> = {
  '今日早教': '📅',
  '活动库': '🗂️',
  '发育观察记录': '📋',
  '教具与空间': '🧩',
  '英文启蒙': '🔊',
  '日常记录': '🍼',
  '我的': '👩'
}

export function PageHead({ title, desc, extra }: { title: string; desc: ReactNode; extra?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1 className="page-title"><span className="page-icon">{PAGE_ICONS[title] || '🌸'}</span>{title}</h1>
        <p className="page-desc">{desc}</p>
      </div>
      {extra}
    </div>
  )
}
