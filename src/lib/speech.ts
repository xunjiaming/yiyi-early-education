let supported: boolean | null = null

function speechSupported(): boolean {
  if (supported !== null) return supported
  supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  return supported
}

export function speak(text: string, rate = 0.78): boolean {
  if (!speechSupported()) return false
  const synth = window.speechSynthesis
  synth.cancel()
  const voices = synth.getVoices()
  const voice = voices.find((v) => /en[-_]/i.test(v.lang) && /us|united states|american/i.test(v.name + v.lang))
    || voices.find((v) => /^en/i.test(v.lang)) || null
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'en-US'
  if (voice) utter.voice = voice
  utter.rate = rate
  utter.pitch = 1.05
  synth.speak(utter)
  return true
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel()
}

const DB_NAME = 'baby-audio'
const STORE = 'songs'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveSongAudio(id: string, blob: Blob): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(blob, id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function loadSongAudio(id: string): Promise<string | null> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(id)
    req.onsuccess = () => {
      const blob = req.result as Blob | undefined
      resolve(blob ? URL.createObjectURL(blob) : null)
    }
    req.onerror = () => reject(req.error)
  })
}
