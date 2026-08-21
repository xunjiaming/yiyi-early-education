export type PoopConsistency = '' | '正常' | '稀' | '硬' | '水样'

export interface FeedLog {
  id: string
  type: 'feed'
  startAt: string
  endAt: string
  durationSec: number
  date: string
  note: string
}

export interface PoopLog {
  id: string
  type: 'poop'
  createdAt: string
  date: string
  consistency: PoopConsistency
  note: string
}

export type DailyLog = FeedLog | PoopLog
export type LogFilter = 'all' | 'feed' | 'poop'

export interface FeedingSession {
  startAt: string
}

const LOGS_KEY = 'baby.dailyLogs.v1'
const SESSION_KEY = 'baby.feedingSession.v1'

function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function toTimeLabel(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  if (m === 0) return `${s}秒`
  if (s === 0) return `${m}分`
  return `${m}分${s}秒`
}

export function formatDurationMin(sec: number): string {
  return (sec / 60).toFixed(1)
}

export function readLogs(): DailyLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw) as DailyLog[]
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}

export function writeLogs(logs: DailyLog[]): void {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs))
}

export function readSession(): FeedingSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as FeedingSession
    if (!s.startAt || isNaN(new Date(s.startAt).getTime())) return null
    return s
  } catch { return null }
}

export function writeSession(s: FeedingSession | null): void {
  if (!s) localStorage.removeItem(SESSION_KEY)
  else localStorage.setItem(SESSION_KEY, JSON.stringify(s))
}

export function addFeedLog(startAt: Date, endAt: Date, note: string): FeedLog {
  const durationSec = Math.max(0, Math.round((endAt.getTime() - startAt.getTime()) / 1000))
  const startKey = toDateKey(startAt)
  const log: FeedLog = {
    id: `feed_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type: 'feed',
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    durationSec,
    date: startKey,
    note: note.trim()
  }
  const logs = readLogs()
  logs.unshift(log)
  writeLogs(logs)
  return log
}

export function addPoopLog(createdAt: Date, consistency: PoopConsistency, note: string): PoopLog {
  const log: PoopLog = {
    id: `poop_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type: 'poop',
    createdAt: createdAt.toISOString(),
    date: toDateKey(createdAt),
    consistency,
    note: note.trim()
  }
  const logs = readLogs()
  logs.unshift(log)
  writeLogs(logs)
  return log
}

export function deleteLog(id: string): void {
  const logs = readLogs().filter(l => l.id !== id)
  writeLogs(logs)
}

export function canAddPoopWithoutConfirm(): boolean {
  const logs = readLogs()
  const lastPoop = logs.find(l => l.type === 'poop') as PoopLog | undefined
  if (!lastPoop) return true
  const last = new Date(lastPoop.createdAt).getTime()
  return Date.now() - last > 60_000
}



export interface DayAgg {
  date: string
  label: string
  feedCount: number
  feedMin: number
  poopCount: number
}

export function buildDayAggs(logs: DailyLog[], days: number, endDate: Date = new Date()): DayAgg[] {
  const map = new Map<string, DayAgg>()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(endDate)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    const key = toDateKey(d)
    const label = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    map.set(key, { date: key, label, feedCount: 0, feedMin: 0, poopCount: 0 })
  }
  for (const l of logs) {
    const agg = map.get(l.date)
    if (!agg) continue
    if (l.type === 'feed') { agg.feedCount += 1; agg.feedMin += (l as FeedLog).durationSec / 60 }
    else agg.poopCount += 1
  }
  return Array.from(map.values())
}

export function exportLogsCsv(logs: DailyLog[], startDate: string, endDate: string): void {
  const filtered = logs.filter(l => l.date >= startDate && l.date <= endDate)
    .slice().sort((a, b) => {
      const ta = a.type === 'feed' ? (a as FeedLog).startAt : (a as PoopLog).createdAt
      const tb = b.type === 'feed' ? (b as FeedLog).startAt : (b as PoopLog).createdAt
      return ta.localeCompare(tb)
    })
  const header = ['日期', '类型', '开始时间', '结束时间', '时长(分钟)', '性状', '备注']
  const rows = filtered.map(l => {
    if (l.type === 'feed') {
      const f = l as FeedLog
      return [f.date, '喝奶', toTimeLabel(new Date(f.startAt)), toTimeLabel(new Date(f.endAt)), formatDurationMin(f.durationSec), '', f.note.replace(/"/g, '""')]
    } else {
      const p = l as PoopLog
      return [p.date, '拉屎', toTimeLabel(new Date(p.createdAt)), '', '', p.consistency, p.note.replace(/"/g, '""')]
    }
  })
  const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\r\n')
  const bom = '\uFEFF'
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `yiyi-daily-${startDate}~${endDate}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

