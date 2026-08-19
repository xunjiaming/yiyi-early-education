import { bundledAudioUrl } from '../data/songs'
import { loadSongAudio, speakSequence, stopSpeaking } from './speech'

let currentAudio: HTMLAudioElement | null = null
let currentSequence: { cancel: () => void } | null = null

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function stopTaskAudio(): void {
  if (currentSequence) {
    currentSequence.cancel()
    currentSequence = null
  } else {
    stopSpeaking()
  }
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
}

export async function playSongAudio(title: string): Promise<boolean> {
  stopTaskAudio()
  const id = slug(title)
  let uploaded: string | null = null
  try {
    uploaded = await loadSongAudio(id)
  } catch {
    // IndexedDB 被限制（无痕 / 个别内置浏览器）时仍可播放内置音频
  }
  const bundled = bundledAudioUrl(id)
  const src = uploaded || bundled
  if (!src) return false
  const audio = new Audio(src)
  currentAudio = audio
  try {
    await audio.play()
    return true
  } catch {
    if (!uploaded && bundled) return false
    stopTaskAudio()
    return false
  }
}

export function playSpeechAudio(texts: string[]): void {
  stopTaskAudio()
  currentSequence = speakSequence(texts)
}
