export interface PwaInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

let deferredPrompt: PwaInstallPromptEvent | null = null
const listeners = new Set<(prompt: PwaInstallPromptEvent | null) => void>()

export function trackInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event as PwaInstallPromptEvent
    listeners.forEach((listener) => listener(deferredPrompt))
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    listeners.forEach((listener) => listener(null))
  })
}

export function getDeferredPrompt(): PwaInstallPromptEvent | null {
  return deferredPrompt
}

export function subscribeInstallPrompt(
  listener: (prompt: PwaInstallPromptEvent | null) => void
): () => void {
  listeners.add(listener)
  listener(deferredPrompt)
  return () => {
    listeners.delete(listener)
  }
}

export function consumeInstallPrompt(): PwaInstallPromptEvent | null {
  const prompt = deferredPrompt
  deferredPrompt = null
  return prompt
}
