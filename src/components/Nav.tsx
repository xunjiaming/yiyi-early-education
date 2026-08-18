import { CalendarDays, ClipboardCheck, LayoutGrid, Puzzle, Speaker, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

export type ViewKey = 'today' | 'library' | 'observe' | 'aids' | 'english' | 'mine'

export interface NavEntry {
  key: ViewKey
  label: string
  icon: LucideIcon
  color: string
  bg: string
}

export const NAV: NavEntry[] = [
  { key: 'today', label: '今日', icon: CalendarDays, color: '#4f8ef7', bg: '#eef4ff' },
  { key: 'library', label: '活动库', icon: LayoutGrid, color: '#27ae60', bg: '#e8f6ee' },
  { key: 'observe', label: '观察记录', icon: ClipboardCheck, color: '#f2994a', bg: '#fdf3e7' },
  { key: 'aids', label: '教具空间', icon: Puzzle, color: '#e67e22', bg: '#fdeee0' },
  { key: 'english', label: '英文启蒙', icon: Speaker, color: '#9b59b6', bg: '#f3ecfa' },
  { key: 'mine', label: '我的', icon: User, color: '#16a085', bg: '#e6f5f1' }
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
          <div className="brand-name">之之早教台</div>
          <div className="brand-sub">0-3 岁版</div>
        </div>
      </div>
      <nav className="nav-list">
        {NAV.map((item) => {
          const active = view === item.key
          const Icon = item.icon
          return (
            <button
              key={item.key}
              className={`nav-item${active ? ' active' : ''}`}
              style={
                active
                  ? ({ '--nav-bg': item.bg, '--nav-color': item.color } as CSSProperties)
                  : undefined
              }
              onClick={() => onChange(item.key)}
              aria-label={item.label}
            >
              <span className="nav-icon">
                <Icon size={20} color={item.color} />
              </span>
              <span className="nav-text">{item.label}</span>
            </button>
          )
        })}
      </nav>
      <div className="footer-note">数据保存在本机，可到“我的”导出备份。</div>
    </aside>
  )
}

export function PageHead({ title, desc, extra }: { title: string; desc: ReactNode; extra?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-desc">{desc}</p>
      </div>
      {extra}
    </div>
  )
}
