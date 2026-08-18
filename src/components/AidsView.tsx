import { PageHead } from './Nav'
import { SAFETY_CHECKLIST, SPACE_ZONES, TEACHING_AIDS } from '../data/content'

export default function AidsView() {
  return (
    <>
      <PageHead
        title="教具与空间"
        desc="全部极简低成本、随手可得，优先家居物品和真实食材，无需专门购买玩具。"
      />
      <div className="mode-section-title">教具清单</div>
      {TEACHING_AIDS.map((cat) => (
        <div className="aid-category" key={cat.category}>
          <h3 className="aid-title">
            <span>{cat.icon}</span>
            {cat.category}
          </h3>
          <div className="aid-list">
            {cat.items.map((item) => (
              <div className="aid-item" key={item.name}>
                <h4 className="aid-name">{item.name}</h4>
                <p className="aid-use">{item.use}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mode-section-title" style={{ marginTop: 24 }}>五大功能区空间布置</div>
      {SPACE_ZONES.map((zone) => (
        <div className="zone-card" key={zone.name}>
          <h3 className="zone-name">{zone.name}</h3>
          <p className="zone-purpose">用途：{zone.purpose}</p>
          <p className="zone-setup">{zone.setup}</p>
        </div>
      ))}

      <div className="safety-box">
        <h3 className="safety-title">安全检查清单</h3>
        <ul className="safety-list">
          {SAFETY_CHECKLIST.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  )
}
