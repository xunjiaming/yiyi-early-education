import { Check } from 'lucide-react'
import { PageHead } from './Nav'
import { OBSERVATION_BY_BAND, type AgeBand } from '../data/content'

interface ObserveViewProps {
  band: AgeBand
  ageMonths: number
  obsChecks: Record<string, boolean>
  onToggleObs: (id: string) => void
  onExport: () => void
}

export default function ObserveView({ band, ageMonths, obsChecks, onToggleObs, onExport }: ObserveViewProps) {
  const categories = OBSERVATION_BY_BAND[band.key] || OBSERVATION_BY_BAND['4-6m']
  const allItems = categories.flatMap((c) => c.items)
  const doneCount = allItems.filter((i) => obsChecks[i.id]).length
  const overall = Math.round((doneCount / allItems.length) * 100)

  return (
    <>
      <PageHead
        title="发育观察记录"
        desc={`当前年龄带：${band.name}（${band.stage}），约 ${ageMonths} 个多月。观察项随月龄自动切换。`}
        extra={
          <span className="chip">
            <Check size={14} /> {doneCount}/{allItems.length}
          </span>
        }
      />
      <div className="progress" style={{ backgroundColor: '#ffe0ec' }}>
        <div className="progress-fill" style={{ width: `${overall}%` }} />
      </div>
      <div className="obs-grid" style={{ marginTop: 12 }}>
        {categories.map((cat) => {
          const catDone = cat.items.filter((i) => obsChecks[i.id]).length
          return (
            <div className="obs-card" key={cat.key}>
              <div className="obs-head">
                <span style={{ color: cat.accent }}>{cat.name}</span>
                <span className="obs-count">{catDone}/{cat.items.length}</span>
              </div>
              <div className="obs-list">
                {cat.items.map((item) => {
                  const done = !!obsChecks[item.id]
                  return (
                    <div
                      key={item.id}
                      className={`obs-row${done ? ' done' : ''}`}
                      onClick={() => onToggleObs(item.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span
                        className="check-box"
                        style={done ? { background: cat.accent, borderColor: cat.accent } : undefined}
                      >
                        {done && <Check size={14} strokeWidth={3} />}
                      </span>
                      <span className="obs-label">{item.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <div className="action-bar" style={{ marginTop: 16 }}>
        <button className="btn primary" onClick={onExport}>导出记录</button>
      </div>
      <div className="note-banner" style={{ marginTop: 12 }}>
        以上为常见儿保观察参考，不做发育诊断，最终以儿保医生评估为准。跨越月龄后观察项会自动切换到新年龄带的版本。
      </div>
    </>
  )
}
