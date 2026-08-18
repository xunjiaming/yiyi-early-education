import { useState } from 'react'
import { Download, Home, Smartphone, Upload } from 'lucide-react'
import { PageHead } from './Nav'
import { AGE_BANDS, bandForAgeMonths, type AgeBand } from '../data/content'
import type { BabyProfile } from '../lib/storage'

interface MineViewProps {
  profile: BabyProfile
  ageMonths: number
  band: AgeBand
  bandNotice: string
  onSaveProfile: (next: BabyProfile) => void
  fileRef: React.RefObject<HTMLInputElement>
  onExport: () => void
  onImport: (file: File | null) => void
  notice: string
  clearNotice: () => void
}

export default function MineView({
  profile,
  ageMonths,
  band,
  bandNotice,
  onSaveProfile,
  fileRef,
  onExport,
  onImport,
  notice,
  clearNotice
}: MineViewProps) {
  const [nickname, setNickname] = useState(profile.nickname)
  const [birthDate, setBirthDate] = useState(profile.birthDate)
  const nextBand = bandForAgeMonths(ageMonths + 1)

  function submitProfile() {
    onSaveProfile({ nickname: nickname.trim() || '之之', birthDate })
    clearNotice()
  }

  return (
    <>
      <PageHead
        title="我的"
        desc="宝宝档案、数据备份与添加到手机桌面说明。"
      />
      <div className="setting-card">
        <h2 className="setting-title">宝宝档案</h2>
        <p className="setting-text">
          当前：{band.name}（{band.stage}），约 {ageMonths} 个多月。生日日期用于自动判定月龄并切换内容。
        </p>
        <div className="action-bar">
          <input
            className="select"
            style={{ minWidth: 120, flex: 1 }}
            placeholder="昵称"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <input
            className="select"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          <button className="btn primary" onClick={submitProfile}>保存档案</button>
        </div>
        {bandNotice && <div className="note-banner" style={{ marginTop: 12 }}>{bandNotice}</div>}
        <p className="setting-text" style={{ marginTop: 10 }}>
          下一月龄预告：约 {ageMonths + 1} 个月后将进入 {nextBand.name}（{nextBand.stage}）。
        </p>
      </div>

      <div className="setting-card">
        <h2 className="setting-title">数据备份</h2>
        <p className="setting-text">
          勾选记录和观察记录都保存在本机。建议定期导出备份，换手机后可导入恢复。
        </p>
        <div className="action-bar">
          <button className="btn primary" onClick={() => { onExport(); clearNotice() }}>
            <Download size={15} /> 导出备份
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            <Upload size={15} /> 导入备份
          </button>
          <input
            ref={fileRef}
            className="file-input"
            type="file"
            accept="application/json"
            onChange={(e) => { onImport(e.target.files?.[0] || null); clearNotice() }}
          />
        </div>
        {notice && <div className="note-banner" style={{ marginTop: 12 }}>{notice}</div>}
      </div>

      <div className="setting-card">
        <h2 className="setting-title">添加到手机桌面</h2>
        <p className="setting-text">
          用手机浏览器打开本页面，在浏览器菜单里选择“添加到主屏幕”或“添加到桌面”，图标会出现在桌面，像 App 一样使用。OPPO 手机浏览器支持此功能。
        </p>
        <div className="action-bar">
          <span className="chip"><Smartphone size={14} /> 手机</span>
          <span className="chip"><Home size={14} /> 桌面快捷方式</span>
        </div>
      </div>

      <div className="setting-card">
        <h2 className="setting-title">年龄段覆盖</h2>
        <p className="setting-text">
          系统按出生日期自动切换到对应年龄段。当前已覆盖 0-3 岁 8 个成长阶段，每日内容、观察重点和教具清单都会随月龄变化。
        </p>
        <p className="setting-text" style={{ fontSize: 12, color: '#7a7f87' }}>
          已规划：{AGE_BANDS.map((b) => b.name).join(' · ')}
        </p>
      </div>
    </>
  )
}
