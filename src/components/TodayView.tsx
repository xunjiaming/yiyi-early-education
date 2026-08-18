import { CheckRow } from './CheckRow'
import { themeOf, type AgeBand, type DayModule } from '../data/content'
import { useEffect } from 'react'
import { Volume2 } from 'lucide-react'
import type { PlayTaskAudio } from '../data/content'
import { playSongAudio, playSpeechAudio, stopTaskAudio } from '../lib/player'
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
  useEffect(() => () => stopTaskAudio(), [])

  function playTask(audio: PlayTaskAudio) {
    if (audio.kind === 'song') void playSongAudio(audio.title)
    else playSpeechAudio(audio.texts)
  }

  return (
    <>
      <div className="today-header">
        <div className="today-date">{dayKey} · 本周主题</div>
        <h1 className="today-greeting">下午好，{nickname} 👶</h1>
        <div className="today-band">{band.name} · {band.stage}</div>
        <div className="today-badges">
          <span className="theme-badge">🎀 {theme}</span>
          <span className="theme-badge">✅ 今日完成 {done}/{total}</span>
        </div>
        <div className="progress today-progress">
          <div className="progress-fill" style={{ width: `${Math.round((done / total) * 100)}%` }} />
        </div>
      </div>

      <div className="profile-strip">
        <span className="chip">{nickname}</span>
        <span className="chip">约 {ageMonths} 个多月</span>
        <span className="chip">{band.name}</span>
        <span className="chip">{band.stage}</span>
        <span className="chip">每天下午约 1 小时</span>
      </div>

      {bandNotice && (
        <div className="note-banner" style={{ marginBottom: 14 }}>{bandNotice}</div>
      )}

      {modules.map((mod) => {
        const modDone = mod.items.filter((it) => dayStore[`${mod.id}-${it.id}`]).length
        return (
          <section className="module-card" key={mod.id}>
            <div className="module-head">
              <span className="m-icon">{MODULE_ICONS[mod.id] || '🌸'}</span>
              <div className="module-title-wrap">
                <div>
                  <h2 className="module-title">{mod.title}</h2>
                  <div className="module-sub">{mod.subtitle}</div>
                </div>
              </div>
              <span className={`m-check${modDone === mod.items.length ? ' done' : ''}`}>
                {modDone === mod.items.length ? '✓' : `${modDone}/${mod.items.length}`}
              </span>
            </div>
            <div className="module-body">
              {mod.items.map((it) => {
                const audio = it.audio
                return (
                  <div className="task-line" key={it.id}>
                    <CheckRow
                      done={!!dayStore[`${mod.id}-${it.id}`]}
                      onToggle={onToggleDaily}
                      itemKey={`${mod.id}-${it.id}`}
                      title={it.title}
                      how={it.how}
                      note={it.note}
                      accent={mod.accent}
                    />
                    {mod.id === 'eng' && audio && (
                      <button className="task-speaker" title="播放音频" aria-label="播放音频" onClick={() => playTask(audio)}>
                        <Volume2 size={17} />
                      </button>
                    )}
                  </div>
                )
              })}
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

const MODULE_ICONS: Record<string, string> = {
  fine: '✋',
  lang: '🗣️',
  cog: '🧠',
  eng: '🔊',
  motor: '🏃',
  care: '📋'
}
