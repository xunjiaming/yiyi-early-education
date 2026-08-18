export interface BackupData {
  app: string
  version: number
  exportedAt: string
  dailyChecks: Record<string, Record<string, boolean>>
  observationChecks: Record<string, boolean>
}

const DAILY_KEY = 'baby.dailyChecks.v1'
const OBS_KEY = 'baby.observationChecks.v1'

export function readDailyChecks(): Record<string, Record<string, boolean>> {
  try {
    const raw = localStorage.getItem(DAILY_KEY)
    return raw ? (JSON.parse(raw) as Record<string, Record<string, boolean>>) : {}
  } catch {
    return {}
  }
}

export function readObservationChecks(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(OBS_KEY)
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

export function writeDailyChecks(data: Record<string, Record<string, boolean>>): void {
  localStorage.setItem(DAILY_KEY, JSON.stringify(data))
}

export function writeObservationChecks(data: Record<string, boolean>): void {
  localStorage.setItem(OBS_KEY, JSON.stringify(data))
}

export function exportBackup(): BackupData {
  return {
    app: 'baby-education-workbench',
    version: 1,
    exportedAt: new Date().toISOString(),
    dailyChecks: readDailyChecks(),
    observationChecks: readObservationChecks()
  }
}

export function importBackup(json: string): void {
  const data = JSON.parse(json) as BackupData
  if (!data || data.app !== 'baby-education-workbench') {
    throw new Error('不是早教工作台的备份文件')
  }
  writeDailyChecks(data.dailyChecks || {})
  writeObservationChecks(data.observationChecks || {})
}

export interface BabyProfile {
  nickname: string
  birthDate: string
}

const PROFILE_KEY = 'baby.profile.v1'

const DEFAULT_PROFILE: BabyProfile = { nickname: '之之', birthDate: '' }

export function readProfile(): BabyProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return { ...DEFAULT_PROFILE }
    const data = JSON.parse(raw) as Partial<BabyProfile>
    return { nickname: data.nickname || DEFAULT_PROFILE.nickname, birthDate: data.birthDate || '' }
  } catch {
    return { ...DEFAULT_PROFILE }
  }
}

export function writeProfile(profile: BabyProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}
