import { useEffect, useRef, useState } from 'react'
import { Music, Play, StopCircle, Upload, Volume2 } from 'lucide-react'
import { PageHead } from './Nav'
import { resolveEnglishSet, themeOf, type AgeBand, type WeeklyTheme } from '../data/content'
import { loadSongAudio, saveSongAudio, speak, stopSpeaking } from '../lib/speech'
import { playMelody, stopMelody } from '../lib/melody'

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function EnglishView({ band }: { band: AgeBand }) {
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({})
  const fileRef = useRef<Record<string, HTMLInputElement | null>>({})
  const [speaking, setSpeaking] = useState(false)
  const todayTheme: WeeklyTheme = themeOf(new Date())
  const engSet = resolveEnglishSet(band.key)

  useEffect(() => {
    let cancelled = false
    const ids = engSet.songs.map((song) => slug(song))
    Promise.all(ids.map(async (id) => [id, await loadSongAudio(id)] as const)).then((pairs) => {
      const loaded: Record<string, string> = {}
      for (const [id, url] of pairs) if (url) loaded[id] = url
      if (!cancelled) setAudioUrls(loaded)
    })
    return () => { cancelled = true }
  }, [band.key])

  async function handleSongFile(id: string, file: File | null) {
    if (!file) return
    await saveSongAudio(id, file)
    const url = await loadSongAudio(id)
    setAudioUrls((prev) => ({ ...prev, [id]: url || '' }))
  }

  async function playSong(id: string, title: string) {
    const url = audioUrls[id]
    if (url) {
      const audio = new Audio(url)
      void audio.play().catch(() => playMelody(title))
      return
    }
    playMelody(title)
  }

  function speakPhrase(text: string) {
    speak(text)
    setSpeaking(true)
    setTimeout(() => setSpeaking(false), text.length * 90 + 400)
  }

  function handleStop() {
    stopSpeaking()
    stopMelody()
  }

  return (
    <>
      <PageHead
        title="英文启蒙"
        desc="只磨耳朵、建立画面对应，不认读、不拼写、无压力。妈妈做，宝宝看和听。"
        extra={
          <button className="btn" onClick={handleStop}><StopCircle size={16} /> 停止</button>
        }
      />

      <div className="setting-card">
        <h2 className="setting-title">本月做法</h2>
        <p className="setting-text">
          当前年龄段：{band.name}。核心是磨耳朵，不教认读、不背单词。短句用手机语音播报，儿歌可上传音频后播放，未上传也能播放内置轻旋律；播放时只给宝宝听声音，不给宝宝看屏幕。
        </p>
      </div>

      <div className="mode-section-title">磨耳朵歌单</div>
      <p style={{ fontSize: 12, color: '#7a7f87', marginTop: -8 }}>建议每周固定 1 至 2 首英文儿歌反复听。</p>
      {engSet.songs.map((song, i) => {
        const id = slug(song)
        return (
          <div className="eng-row" key={song} style={i > 0 ? { marginTop: -8 } : undefined}>
            <div className="eng-row-head">
              <div>
                <h3 className="eng-title"><Music size={15} style={{ display: 'inline', marginRight: 6, color: '#9b59b6' }} />{song}</h3>
                <p className="eng-desc">可上传你的音频文件播放，未上传时自动播放轻旋律</p>
              </div>
              <div className="action-bar" style={{ marginTop: 0 }}>
                <button className="btn" onClick={() => playSong(id, song)}>
                  <Play size={15} /> 播放
                </button>
                <button className="btn" onClick={() => fileRef.current?.[id]?.click()}>
                  <Upload size={15} /> 上传
                </button>
                <input
                  ref={(el) => { fileRef.current[id] = el }}
                  className="file-input"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleSongFile(id, e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>
        )
      })}

      <div className="mode-section-title">亲子口语（语音播报）</div>
      <div className="card-grid">
        {engSet.phrases.map((phrase) => (
          <div className="entry-card" key={phrase}>
            <h3 className="entry-title" style={{ color: '#9b59b6' }}>{phrase}</h3>
            <p className="entry-how">妈妈慢慢说给宝宝听，注重语调。</p>
            <button className="btn" onClick={() => speakPhrase(phrase)}>
              {speaking ? <Volume2 size={15} /> : <Play size={15} />} 播放
            </button>
          </div>
        ))}
      </div>

      <div className="mode-section-title">TPR 动作演示</div>
      <p style={{ fontSize: 12, color: '#7a7f87', marginTop: -8 }}>TPR 由妈妈边说边做动作，给宝宝看，不需要宝宝模仿。</p>
      {engSet.tprs.map((tpr) => (
        <div className="eng-row" key={tpr.title}>
          <div className="eng-row-head">
            <div>
              <h3 className="eng-title">{tpr.title} <span style={{ color: '#9b59b6', fontWeight: 500 }}>· {tpr.phrase}</span></h3>
              <p className="eng-desc">{tpr.how}</p>
            </div>
            <button className="btn" onClick={() => speakPhrase(tpr.phrase)}>
              <Volume2 size={15} /> 读
            </button>
          </div>
        </div>
      ))}

      <div className="note-banner" style={{ marginTop: 16 }}>
        本周主题：{todayTheme.name} · 当前年龄段 {band.name}。只磨耳朵，不给宝宝看屏幕，不考核、不定时。
      </div>
    </>
  )
}
