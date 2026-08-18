import { useMemo, useState } from 'react'
import { PageHead } from './Nav'
import { ACTIVITY_LIBRARY, ACTIVITY_THEMES, AGE_BANDS, DOMAINS, type AgeBand } from '../data/content'

export default function LibraryView({ band }: { band: AgeBand }) {
  const [domain, setDomain] = useState('全部')
  const [theme, setTheme] = useState('全部')
  const [query, setQuery] = useState('')
  const [bandFilter, setBandFilter] = useState('current')

  const filtered = useMemo(() => {
    return ACTIVITY_LIBRARY.filter((a) => {
      if (bandFilter === 'current' && a.band !== band.key) return false
      if (bandFilter !== 'current' && bandFilter !== 'all' && a.band !== bandFilter) return false
      if (domain !== '全部' && a.domain !== domain) return false
      if (theme !== '全部' && a.theme !== theme) return false
      if (query && !a.title.includes(query)) return false
      return true
    })
  }, [band.key, bandFilter, domain, theme, query])

  return (
    <>
      <PageHead
        title="活动库"
        desc="按发展领域和主题双筛选，全部使用真实生活物品，实物操作优于玩具。"
      />
      <div className="toolbar">
        <select className="select" value={bandFilter} onChange={(e) => setBandFilter(e.target.value)}>
          <option value="current">当前年龄段</option>
          <option value="all">全部年龄段</option>
          {AGE_BANDS.map((b) => (
            <option key={b.key} value={b.key}>{b.name}</option>
          ))}
        </select>
        <select className="select" value={domain} onChange={(e) => setDomain(e.target.value)}>
          <option value="全部">全部领域</option>
          {DOMAINS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select className="select" value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="全部">全部主题</option>
          {ACTIVITY_THEMES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          className="select"
          style={{ minWidth: 160, flex: 1 }}
          placeholder="搜索活动名称"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div style={{ fontSize: 12, color: '#8b7a89', marginBottom: 12 }}>
        共 {filtered.length} 个活动
      </div>
      {filtered.length === 0 ? (
        <div className="empty">没有匹配的活动，换个筛选试试。</div>
      ) : (
        <div className="card-grid">
          {filtered.map((a) => (
            <div className="entry-card" key={a.id}>
              <div className="entry-tags">
                <span className="tag">{a.domain}</span>
                <span className="tag">{a.theme}</span>
                <span className="tag">{a.months}</span>
              </div>
              <h3 className="entry-title">{a.title}</h3>
              <div className="entry-meta">准备：{a.materials}</div>
              <p className="entry-how">{a.how}</p>
              <p className="entry-safety">安全：{a.safety}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
