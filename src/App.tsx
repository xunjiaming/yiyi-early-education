import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Sidebar, type ViewKey } from './components/Nav'
import TodayView from './components/TodayView'
import LibraryView from './components/LibraryView'
import ObserveView from './components/ObserveView'
import AidsView from './components/AidsView'
import EnglishView from './components/EnglishView'
import MineView from './components/MineView'
import { buildDay, monthAge, resolveAvailableBand, todayKey } from './data/content'
import {
  readDailyChecks,
  readObservationChecks,
  readProfile,
  writeDailyChecks,
  writeObservationChecks,
  writeProfile,
  exportBackup,
  importBackup,
  type BabyProfile
} from './lib/storage'

import { consumeInstallPrompt, getDeferredPrompt, subscribeInstallPrompt, type PwaInstallPromptEvent } from './lib/install'

export default function App() {
  const [view, setView] = useState<ViewKey>('today')
  const [profile, setProfile] = useState<BabyProfile>(readProfile)
  const [dailyChecks, setDailyChecks] = useState<Record<string, Record<string, boolean>>>(readDailyChecks)
  const [obsChecks, setObsChecks] = useState<Record<string, boolean>>(readObservationChecks)
  const [notice, setNotice] = useState('')
  const [installPrompt, setInstallPrompt] = useState<PwaInstallPromptEvent | null>(getDeferredPrompt)
  const [isStandalone, setIsStandalone] = useState(
    () => window.matchMedia('(display-mode: standalone)').matches
  )
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleInstalled() {
      setInstallPrompt(null)
      setIsStandalone(true)
      setNotice('已安装到桌面，可以像 App 一样使用。')
    }
    function handleDisplayMode() {
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    }
    window.addEventListener('appinstalled', handleInstalled)
    const media = window.matchMedia('(display-mode: standalone)')
    const subscribe = subscribeInstallPrompt((prompt) => setInstallPrompt(prompt))
    if (media.addEventListener) {
      media.addEventListener('change', handleDisplayMode)
    } else {
      media.addListener(handleDisplayMode)
    }
    return () => {
      window.removeEventListener('appinstalled', handleInstalled)
      subscribe()
      if (media.removeEventListener) {
        media.removeEventListener('change', handleDisplayMode)
      } else {
        media.removeListener(handleDisplayMode)
      }
    }
  }, [])

  const date = useMemo(() => new Date(), [])
  const ageMonths = monthAge(profile.birthDate)
  const { band, notice: bandNotice } = resolveAvailableBand(ageMonths)
  const dayKey = todayKey(date)
  const modules = useMemo(() => buildDay(date, band.key), [date, band.key])
  const dayStore = dailyChecks[dayKey] || {}

  function saveProfile(next: BabyProfile) {
    setProfile(next)
    writeProfile(next)
  }

  function toggleDaily(key: string) {
    const next = { ...dayStore, [key]: !dayStore[key] }
    const all = { ...dailyChecks, [dayKey]: next }
    setDailyChecks(all)
    writeDailyChecks(all)
  }

  function toggleObservation(id: string) {
    const next = { ...obsChecks, [id]: !obsChecks[id] }
    setObsChecks(next)
    writeObservationChecks(next)
  }

  function handleExport() {
    const data = exportBackup()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `yiyi-backup-${dayKey}.json`
    a.click()
    URL.revokeObjectURL(url)
    setNotice('已导出备份文件，请妥善保存。')
  }

  async function handleImport(file: File | null) {
    if (!file) return
    const text = await file.text()
    try {
      importBackup(text)
      setDailyChecks(readDailyChecks())
      setObsChecks(readObservationChecks())
      setNotice('导入成功，记录已恢复。')
    } catch (err) {
      setNotice(`导入失败：${(err as Error).message}`)
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  function clearNotice() {
    if (!notice) return
    window.setTimeout(() => setNotice(''), 4000)
  }

  async function handleInstall() {
    const promptEvent = installPrompt
    if (!promptEvent) {
      setNotice('当前浏览器没有提供安装按钮，请从浏览器菜单添加到主屏幕。')
      return
    }
    try {
      await promptEvent.prompt()
      const choice = await promptEvent.userChoice
      consumeInstallPrompt()
      setInstallPrompt(null)
      setNotice(choice.outcome === 'accepted' ? '已安装到桌面。' : '未完成安装，可从浏览器菜单再试。')
    } catch {
      consumeInstallPrompt()
      setInstallPrompt(null)
      setNotice('浏览器未允许安装，可从浏览器菜单添加到主屏幕。')
    }
  }

  const shared = {
    date,
    dayKey,
    dayStore,
    obsChecks,
    profile,
    nickname: profile.nickname,
    ageMonths,
    band,
    bandNotice,
    notice,
    onSaveProfile: saveProfile,
    onToggleDaily: toggleDaily,
    onToggleObs: toggleObservation,
    onExport: handleExport,
    onImport: handleImport,
    installAvailable: !!installPrompt,
    isStandalone,
    onInstall: handleInstall,
    clearNotice,
    navigate: setView
  }

  return (
    <div className="app">
      <Sidebar view={view} onChange={setView} />
      <main className="main">
        <div className="content">
          {view === 'today' && <TodayView {...shared} modules={modules} />}
          {view === 'library' && <LibraryView band={band} />}
          {view === 'observe' && <ObserveView {...shared} />}
          {view === 'aids' && <AidsView />}
          {view === 'english' && <EnglishView {...shared} />}
          {view === 'mine' && (
            <MineView {...shared} fileRef={fileRef as unknown as RefObject<HTMLInputElement>} />
          )}
        </div>
      </main>
    </div>
  )
}
