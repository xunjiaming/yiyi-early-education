export interface BundledSong {
  title: string
  file: string
}

// 内置真实儿歌音频（公共领域 / CC 许可录音，来源与许可见 README）
// key 与歌曲标题的 slug 一致，Play 时按整合后的文件名取 public/audio 下的资源
export const BUNDLED_SONG_AUDIO: Record<string, BundledSong> = {
  'the-itsy-bitsy-spider': { title: 'The Itsy Bitsy Spider', file: 'itsy-bitsy-spider.mp3' },
  'twinkle-twinkle-little-star': { title: 'Twinkle, Twinkle, Little Star', file: 'twinkle.mp3' },
  'row-row-row-your-boat': { title: 'Row, Row, Row Your Boat', file: 'row-boat.mp3' },
  'old-macdonald-had-a-farm': { title: 'Old MacDonald Had a Farm', file: 'old-macdonald.mp3' },
  'three-little-kittens': { title: 'Three Little Kittens', file: 'three-little-kittens.mp3' },
  'london-bridge-is-falling-down': { title: 'London Bridge Is Falling Down', file: 'london-bridge.mp3' }
}

export function bundledAudioUrl(id: string): string | null {
  const song = BUNDLED_SONG_AUDIO[id]
  return song ? `${import.meta.env.BASE_URL}audio/${song.file}` : null
}
