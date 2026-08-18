const NOTE_FREQ: Record<string, number> = {
  C4: 261.63,
  'C#4': 277.18,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0
}

const FALLBACK_MELODY: [string, number][] = [
  ['C4', 0.28], ['D4', 0.28], ['E4', 0.28], ['G4', 0.28],
  ['A4', 0.28], ['C5', 0.5], ['G4', 0.28], ['E4', 0.28], ['D4', 0.28], ['C4', 0.5]
]

const SONG_MELODIES: Record<string, [string, number][]> = {
  'bingo': [
    ['G4', 0.24], ['G4', 0.24], ['G4', 0.24], ['G4', 0.24], ['G4', 0.45],
    ['E4', 0.45], ['E4', 0.45], ['E4', 0.45],
    ['C4', 0.3], ['D4', 0.3], ['E4', 0.3], ['C4', 0.45]
  ],
  'itsy-bitsy-spider': [
    ['C4', 0.24], ['C4', 0.24], ['C4', 0.24], ['D4', 0.24],
    ['E4', 0.28], ['E4', 0.28], ['D4', 0.28], ['C4', 0.24],
    ['D4', 0.24], ['E4', 0.24], ['F4', 0.28], ['F4', 0.28],
    ['E4', 0.28], ['D4', 0.24], ['C4', 0.5]
  ],
  'wheels-on-the-bus': [
    ['C4', 0.24], ['C4', 0.24], ['C4', 0.24], ['D4', 0.3],
    ['E4', 0.3], ['E4', 0.3], ['D4', 0.3], ['C4', 0.24],
    ['D4', 0.24], ['E4', 0.24], ['F4', 0.3], ['F4', 0.3],
    ['E4', 0.3], ['D4', 0.24], ['C4', 0.5]
  ],
  'one-little-finger': [
    ['C4', 0.24], ['C4', 0.24], ['G4', 0.24], ['G4', 0.24],
    ['A4', 0.3], ['A4', 0.3], ['G4', 0.45], ['F4', 0.24],
    ['F4', 0.24], ['E4', 0.24], ['E4', 0.24], ['D4', 0.3],
    ['D4', 0.3], ['C4', 0.5]
  ],
  'head-shoulders-knees-and-toes': [
    ['C4', 0.22], ['C4', 0.22], ['D4', 0.22], ['E4', 0.22],
    ['E4', 0.4], ['D4', 0.3], ['D4', 0.4], ['E4', 0.3],
    ['E4', 0.3], ['C4', 0.5], ['G4', 0.3], ['E4', 0.3], ['C4', 0.6]
  ],
  'rain-rain-go-away': [
    ['E4', 0.24], ['G4', 0.24], ['G4', 0.3], ['E4', 0.3],
    ['F4', 0.24], ['D4', 0.24], ['E4', 0.5], ['D4', 0.24],
    ['C4', 0.24], ['D4', 0.24], ['E4', 0.3], ['C4', 0.5]
  ],
  'old-macdonald-had-a-farm': [
    ['C4', 0.24], ['C4', 0.24], ['C4', 0.24], ['G4', 0.3],
    ['A4', 0.3], ['A4', 0.3], ['G4', 0.45], ['E4', 0.3],
    ['G4', 0.3], ['G4', 0.3], ['E4', 0.5]
  ],
  'five-little-ducks': [
    ['C4', 0.24], ['D4', 0.24], ['E4', 0.24], ['F4', 0.24],
    ['G4', 0.3], ['G4', 0.3], ['A4', 0.3], ['A4', 0.3],
    ['G4', 0.5], ['E4', 0.3], ['C4', 0.5]
  ],
  'walking-walking': [
    ['G4', 0.24], ['G4', 0.24], ['A4', 0.24], ['G4', 0.24],
    ['C5', 0.4], ['B4', 0.4], ['G4', 0.5]
  ],
  'row-row-row-your-boat': [
    ['C4', 0.24], ['C4', 0.24], ['C4', 0.24], ['D4', 0.24],
    ['E4', 0.4], ['E4', 0.24], ['D4', 0.4], ['E4', 0.24],
    ['F4', 0.24], ['G4', 0.5], ['C5', 0.3], ['C5', 0.3],
    ['C5', 0.3], ['G4', 0.4], ['G4', 0.4], ['E4', 0.4],
    ['E4', 0.4], ['C4', 0.4], ['C4', 0.4], ['C4', 0.6]
  ],
  'open-shut-them': [
    ['C4', 0.24], ['C4', 0.24], ['G4', 0.24], ['G4', 0.24],
    ['E4', 0.3], ['E4', 0.3], ['C4', 0.45]
  ],
  'if-youre-happy': [
    ['C4', 0.24], ['C4', 0.24], ['D4', 0.24], ['E4', 0.24],
    ['C4', 0.4], ['C4', 0.24], ['D4', 0.24], ['E4', 0.4],
    ['E4', 0.24], ['F4', 0.24], ['G4', 0.4], ['G4', 0.24],
    ['F4', 0.24], ['E4', 0.24], ['D4', 0.24], ['C4', 0.5]
  ]
}

function melodyFor(title: string): [string, number][] {
  const key = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return SONG_MELODIES[key] || FALLBACK_MELODY
}

let activeSources: AudioScheduledSourceNode[] = []

export function playMelody(title: string): void {
  stopMelody()
  const ctx = new AudioContext()
  let t = ctx.currentTime + 0.05
  for (const [note, dur] of melodyFor(title)) {
    const freq = NOTE_FREQ[note]
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.22, t + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + dur)
    activeSources.push(osc)
    t += dur
  }
  window.setTimeout(() => {
    activeSources = []
    void ctx.close().catch(() => undefined)
  }, (t - ctx.currentTime) * 1000 + 300)
}

export function stopMelody(): void {
  for (const source of activeSources) {
    try {
      source.stop()
    } catch {
      // already stopped
    }
  }
  activeSources = []
}
