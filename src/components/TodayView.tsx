import { CheckCircle2, Timer } from 'lucide-react'
import { CheckRow } from './CheckRow'
import { themeOf, type AgeBand, type DayModule } from '../data/content'
import type { ViewKey } from './Nav'

interface TodayViewProps {
  modules: DayModule[]
  dayKey: string
  dayStore: Record<string, boolean>
  nickname: string
  ageMonths: number
  band: AgeBand
  bandNotice: string
  onToggleDaily: (key: string) => void
  onExport: () => void
  navigate: (key: ViewKey) => void
}

export default function TodayView({
  modules,
  dayKey,
  dayStore,
  nickname,
  ageMonths,
  band,
  bandNotice,
  onToggleDaily,
  onExport,
  navigate
}: TodayViewProps) {
  const total = modules.reduce((n, m) => n + m.items.length, 0)
  const done = modules.reduce(
    (n, m) => n + m.items.filter((it) => dayStore[`${m.id}-${it.id}`]).length,
    0
  )
  const theme = themeOf(new Date()).name

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">今日早教</h1>
          <p className="page-desc">内容按月龄自动适配，点击每一项即可打勾，勾选会保存在本机。</p>
        </div>
        <span className="chip">
          <CheckCircle2 size={14} /> {done}/{total}
        </span>
      </div>

      <div className="profile-strip">
        <span className="chip">{nickname}</span>
        <span className="chip">约 {ageMonths} 个多月</span>
        <span className="chip">{band.name}</span>
        <span className="chip">{band.stage}</span>
        <span className="chip">
          <Timer size={14} /> 每天下午约 1 小时
        </span>
      </div>

      {bandNotice && (
        <div className="note-banner" style={{ marginBottom: 14 }}>{bandNotice}</div>
      )}

      <div className="theme-banner">
        <div className="theme-week">{dayKey} · 本周主题</div>
        <div className="theme-title">{theme}</div>
        <p className="theme-desc">今天所处年龄段：{band.name}（{band.desc}）。每天内容按日期自动轮换，同一个月龄的玩法重复巩固。</p>
      </div>

      {modules.map((mod) => {
        const modDone = mod.items.filter((it) => dayStore[`${mod.id}-${it.id}`]).length
        const pct = Math.round((modDone / mod.items.length) * 100)
        return (
          <section className="module-card" key={mod.id}>
            <div className="module-head">
              <span className="dot" style={{ background: mod.accent }} />
              <div>
                <h2 className="module-title">{mod.title}</h2>
                <div className="module-sub">{mod.subtitle}</div>
              </div>
              <div className="progress" style={{ marginLeft: 'auto', width: 90, flex: '0 0 auto' }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: mod.accent }} />
              </div>
            </div>
            <div className="module-body">
              {mod.items.map((it) => (
                <CheckRow
                  key={it.id}
                  done={!!dayStore[`${mod.id}-${it.id}`]}
                  onToggle={onToggleDaily}
                  itemKey={`${mod.id}-${it.id}`}
                  title={it.title}
                  how={it.how}
                  note={it.note}
                  accent={mod.accent}
                />
              ))}
            </div>
          </section>
        )
      })}

      <div className="setting-card">
        <h2 className="setting-title">今日小结</h2>
        <p className="setting-text">
          今日完成 {done} / {total} 项。早教重在陪伴，不考核、不催促，宝宝困了就及时休息。
        </p>
        <div className="action-bar">
          <button className="btn" onClick={onExport}>导出备份</button>
          <button className="btn" onClick={() => navigate('observe')}>去记观察记录</button>
          <button className="btn" onClick={() => navigate('english')}>英文启蒙</button>
        </div>
      </div>
    </>
  )
}
