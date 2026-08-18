import { EXTRA_FINE, EXTRA_LANG, EXTRA_COG, EXTRA_MOTOR } from './pools712'
import { OBSERVATION_7_9, OBSERVATION_10_12 } from './observation712'
import { EXTRA_FINE_13_36, EXTRA_LANG_13_36, EXTRA_COG_13_36, EXTRA_MOTOR_13_36 } from './pools1336'
import { OBSERVATION_13_18, OBSERVATION_19_24, OBSERVATION_25_30, OBSERVATION_31_36 } from './observation1336'
import { EXTRA_LIBRARY } from './libraryExtra'
import { ENGLISH_BY_BAND, type EnglishSet } from './englishExtra'
export interface DayItem {
  id: string
  title: string
  how: string
  note?: string
}

export interface DayModule {
  id: string
  title: string
  accent: string
  subtitle: string
  items: DayItem[]
}

export interface WeeklyTheme {
  key: string
  name: string
  desc: string
  idea: string
}

export interface AgeBand {
  key: string
  name: string
  minMonths: number
  maxMonths: number
  stage: string
  desc: string
  available: boolean
}

export const WEEKLY_THEMES: WeeklyTheme[] = [
  { key: 'color', name: '颜色视觉周', desc: '用合适的颜色刺激视觉', idea: '红白黑或对应月龄颜色布置' },
  { key: 'sound', name: '声音节奏周', desc: '听觉敏感期，磨耳朵为主', idea: '摇铃、轻哼、儿歌' },
  { key: 'touch', name: '触感材质周', desc: '认识不同触感', idea: '棉、绒、布料、安全材质' },
  { key: 'body', name: '宝宝身体周', desc: '认识五官和四肢', idea: '指五官、玩手脚' },
  { key: 'daily', name: '日常物品周', desc: '身边物品的看摸玩', idea: '碗、勺、毛巾、球' },
  { key: 'nature', name: '自然光影周', desc: '光影与自然变化', idea: '窗光影、树叶、户外' },
  { key: 'rhythm', name: '亲子互动周', desc: '躲猫猫、摇抱、一起做动作', idea: '纱巾躲猫猫、亲子操、儿歌' }
]

export const DOMAINS = ['精细动作', '大运动', '语言认知', '感官探索', '生活技能', '亲子互动'] as const
export const ACTIVITY_THEMES = ['颜色', '声音', '触感', '身体', '日常物品', '自然', '韵律'] as const

export const AGE_BANDS: AgeBand[] = [
  { key: '0-3m', name: '0-3个月', minMonths: 0, maxMonths: 3, stage: '感官唤醒期', desc: '追视、触觉、听声、微笑联结', available: true },
  { key: '4-6m', name: '4-6个月', minMonths: 4, maxMonths: 6, stage: '翻身 · 前坐期', desc: '翻身、肘撑、够物、咿呀对话', available: true },
  { key: '7-9m', name: '7-9个月', minMonths: 7, maxMonths: 9, stage: '独坐 · 爬行期', desc: '独坐、爬行、拇指取物、模仿', available: true },
  { key: '10-12m', name: '10-12个月', minMonths: 10, maxMonths: 12, stage: '扶站 · 扶走期', desc: '扶走、拇食指捏、有意识叫爸妈', available: true },
  { key: '13-18m', name: '13-18个月', minMonths: 13, maxMonths: 18, stage: '学步 · 初语言期', desc: '独走、初词、涂鸦、独立进食', available: true },
  { key: '19-24m', name: '19-24个月', minMonths: 19, maxMonths: 24, stage: '词汇爆发 · 跑跳期', desc: '跑跳、短句、分类、自理', available: true },
  { key: '25-30m', name: '25-30个月', minMonths: 25, maxMonths: 30, stage: '模仿 · 自理 · 社交期', desc: '剪刀、平衡、句子、如厕、分享', available: true },
  { key: '31-36m', name: '31-36个月', minMonths: 31, maxMonths: 36, stage: '入园准备期', desc: '叙述、数概念、自理、情绪社交', available: true }
]

export function monthAge(birthDate: string, now: Date = new Date()): number {
  if (!birthDate) return 4
  const d = new Date(birthDate)
  if (isNaN(d.getTime())) return 4
  let m = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
  if (now.getDate() < d.getDate()) m -= 1
  return Math.max(0, m)
}

export function bandForAgeMonths(months: number): AgeBand {
  const hit = AGE_BANDS.find((b) => months >= b.minMonths && months <= b.maxMonths)
  return hit || AGE_BANDS[AGE_BANDS.length - 1]
}

export function resolveAvailableBand(months: number): { band: AgeBand; notice: string } {
  const exact = bandForAgeMonths(months)
  if (exact.available) {
    return { band: exact, notice: '' }
  }
  if (exact.minMonths < 4) {
    const fallback = AGE_BANDS.find((b) => b.key === '0-3m')!
    return { band: fallback, notice: '当前版本已覆盖 0-3 岁，更多内容将按高质量标准持续更新。' }
  }
  const fallback = AGE_BANDS.find((b) => b.key === '4-6m')!
  return { band: fallback, notice: '当前版本已覆盖 0-3 岁，更多内容将按高质量标准持续更新。' }
}

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date.getTime() - start.getTime()) / 86400000)
}

function pickFrom<T>(arr: T[], offset: number, count: number): T[] {
  const out: T[] = []
  if (arr.length === 0) return out
  for (let i = 0; i < count; i++) {
    out.push(arr[(offset + i) % arr.length])
  }
  return out
}

function isoWeekOf(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function themeOf(date: Date = new Date()): WeeklyTheme {
  return WEEKLY_THEMES[(isoWeekOf(date) - 1) % WEEKLY_THEMES.length]
}

const FINE_0_3: DayItem[] = [
  { id: 'f03-1', title: '触碰不同材质', how: '用棉布、绒布、毛巾轻轻碰宝宝手心，让他感受不同触感。', note: '布料大于拳头，无松散线头。' },
  { id: 'f03-2', title: '轻握摇铃', how: '把轻摇铃放到宝宝手心，让他被动握住片刻。', note: '不强迫，握不住就放松。' },
  { id: 'f03-3', title: '看手玩手', how: '让宝宝仰卧自由看自己的小手小脚。', note: '妈妈不做打扰，只陪着。' },
  { id: 'f03-4', title: '抓妈妈手指', how: '把手指递给宝宝，让他自主抓住。', note: '跟随宝宝节奏。' },
  { id: 'f03-5', title: '摸自己小脚', how: '帮宝宝把小手放到小脚上，让他触感探索。', note: '轻柔、不强迫。' }
]

const LANG_0_3: DayItem[] = [
  { id: 'l03-1', title: '温柔旁白', how: '喂奶、换尿布时用温柔的语调慢慢描述正在做的事。', note: '语速慢、表情丰富。' },
  { id: 'l03-2', title: '面对面“啊”声', how: '凑近宝宝，发出“啊～”并等他的反应。', note: '给回应时间。' },
  { id: 'l03-3', title: '轻声哼唱', how: '轻轻哼一首摇篮曲或童谣。', note: '营造安静氛围。' },
  { id: 'l03-4', title: '听儿歌', how: '播放轻柔儿歌，让宝宝躺着听。', note: '音量低、时间短。' },
  { id: 'l03-5', title: '描述动作', how: '边说边做：“妈妈拍拍你，拍拍你。”', note: '动作轻柔。' }
]

const COG_0_3: DayItem[] = [
  { id: 'c03-1', title: '黑白红追视', how: '拿黑白红卡片在宝宝眼前 30 厘米慢速移动，让他追视。', note: '速度慢，不疲劳。' },
  { id: 'c03-2', title: '声源寻找', how: '在宝宝侧前方轻唤名字或摇铃，看他是否转头找声源。', note: '一次一个方向。' },
  { id: 'c03-3', title: '注视人脸', how: '靠近宝宝，让他看清妈妈的脸和表情。', note: '保持开心的表情。' },
  { id: 'c03-4', title: '触摸凉暖', how: '用温毛巾和凉勺轻轻碰手心，感受温差。', note: '温度适宜。' },
  { id: 'c03-5', title: '看光影', how: '让宝宝看窗边柔和的光影变化。', note: '避免强光直射眼睛。' }
]

const MOTOR_0_3: DayItem[] = [
  { id: 'm03-1', title: '俯卧短时抬头', how: '让宝宝短时俯卧，练习抬头。', note: '时间短、全程看护。' },
  { id: 'm03-2', title: '仰卧自由动四肢', how: '让宝宝仰卧自由伸展活动四肢。', note: '不束缚、不帮动。' },
  { id: 'm03-3', title: '轻柔摇抱', how: '抱着宝宝轻轻左右摇摆。', note: '幅度小、支撑头颈。' },
  { id: 'm03-4', title: '追视移动物', how: '拿红球慢速移动让宝宝眼睛追看。', note: '锻炼视觉与颈部。' },
  { id: 'm03-5', title: '肚皮时间', how: '俯卧时在垫上放一面安全镜子或玩具。', note: '短时多次。' }
]

const FINE_0_0_6: Record<string, DayItem[]> = {
  '0-3m': FINE_0_3,
  '4-6m': [
    { id: 'fine1', title: '抓握摇铃', how: '把轻摇铃递到宝宝手心，让他自己抓住自主晃动。', note: '不帮忙、不催促，摇累了就停。' },
    { id: 'fine2', title: '双手抱软球', how: '把一只轻软球放在宝宝胸前，让他自己用双手抱住。', note: '球要大于拳头，避免入口。' },
    { id: 'fine3', title: '趴卧伸手够纱巾', how: '宝宝趴着时，在伸手可及处放一条红纱巾，让他自主伸手去够和抓。', note: '保持专注，不打断。' },
    { id: 'fine4', title: '撕纸巾探索', how: '给宝宝一张大纸巾或手帕，让他自己抓、揉、撕。', note: '用大张纸张，避免误食碎屑。' },
    { id: 'fine5', title: '抓住妈妈手指', how: '把食指伸给宝宝，让他自主抓住，抓一会儿松一会儿。', note: '跟随宝宝节奏来回玩。' },
    { id: 'fine6', title: '握住拨浪鼓', how: '让宝宝自己握住拨浪鼓，听声音、看晃动。', note: '大人不帮他摇，让他自己探索。' },
    { id: 'fine7', title: '摸不同布料', how: '准备棉布、绒布、毛巾各一片，让宝宝自己摸和抓。', note: '布料大于拳头，无松散线头。' }
  ]
}

const LANG_0_6: Record<string, DayItem[]> = {
  '0-3m': LANG_0_3,
  '4-6m': [
    { id: 'lang1', title: '换尿布旁白', how: '边换边慢慢说：“宝宝躺好啦，妈妈帮你换尿布，先左脚，再右脚。”', note: '语速慢、表情丰富。' },
    { id: 'lang2', title: '喂奶旁白', how: '喂奶时轻声说：“伊伊在喝奶啦，香香的，慢慢喝。”', note: '旁边白、轻声，不急不赶。' },
    { id: 'lang3', title: '咿呀对话', how: '宝宝发出“啊咕”时，妈妈模仿回应“啊咕！宝宝在说话啦！”', note: '有来有回，像聊天一样。' },
    { id: 'lang4', title: '洗澡对话', how: '洗澡时说：“水热热的，小脚丫踢水，扑通扑通。”', note: '跟随宝宝动作描述。' },
    { id: 'lang5', title: '指物命名', how: '指着身边物品说：灯灯、球球、水水、鼻子、眼睛。', note: '每天重复同几个词。' },
    { id: 'lang6', title: '穿脱衣服旁白', how: '穿衣服时说：“先伸小手，穿过袖子，衣服穿好啦。”', note: '边说边做，节奏放慢。' },
    { id: 'lang7', title: '出门看世界', how: '抱着宝宝外出时指着说：树叶、花花、小鸟、云朵。', note: '见什么说什么，不考宝宝。' },
    { id: 'lang8', title: '睡前轻声对话', how: '睡前轻声说：“伊伊今天玩得很开心，天黑了，该睡觉啦，晚安。”', note: '语速放慢，语调温柔。' }
  ]
}

const COG_0_6: Record<string, DayItem[]> = {
  '0-3m': COG_0_3,
  '4-6m': [
    { id: 'cog1', title: '红球追视', how: '拿一只大红球，在宝宝眼前慢慢左右移动，让他眼睛跟着看。', note: '速度慢，距离约 30 厘米。' },
    { id: 'cog2', title: '声源找方向', how: '在宝宝侧前方轻摇铃或叫名字，看他会不会转头寻找。', note: '每次只做一个方向。' },
    { id: 'cog3', title: '照镜子互动', how: '抱着宝宝照镜子，指着镜里的人说：“这是伊伊，这是妈妈。”', note: '让宝宝自己看和伸手碰。' },
    { id: 'cog4', title: '纱巾躲猫猫', how: '用纱巾遮住自己脸，再“哇”地露出，让宝宝等一等、看一看。', note: '反复几次，等宝宝示意。' },
    { id: 'cog5', title: '触摸不同材质', how: '让宝宝手摸凉勺、软布、光滑碗，感受不同触感。', note: '每样都安全、无小零件。' },
    { id: 'cog6', title: '看黑白红挂图', how: '把黑白红图挂墙上，让宝宝躺着或抱着看，强调视觉刺激。', note: '环境布置，不做闪卡训练。' }
  ]
}

const MOTOR_0_6: Record<string, DayItem[]> = {
  '0-3m': MOTOR_0_3,
  '4-6m': [
    { id: 'mot1', title: '俯卧抬头', how: '让宝宝自己在垫上俯卧，抬头看前方玩具，抬头累了就休息。', note: '全程不扶、不催促。' },
    { id: 'mot2', title: '辅助翻身', how: '宝宝侧躺时，用手轻轻搭在他臀背，引导他自主翻过去。', note: '只做轻微辅助，让宝宝主动用力。' },
    { id: 'mot3', title: '轻柔摇抱', how: '抱着宝宝左右轻轻摇摆，唱一首歌，感受前庭平衡。', note: '幅度小、节奏慢。' },
    { id: 'mot4', title: '抱姿看世界', how: '竖抱或斜抱宝宝，带他看到家里和高处的东西。', note: '支撑好头颈。' },
    { id: 'mot5', title: '踢腿蹬床', how: '让宝宝仰卧自己蹬腿，大人用手轻挡小脚让他踢。', note: '宝宝自己用力，不帮踢。' },
    { id: 'mot6', title: '趴卧够玩具', how: '宝宝俯卧时，前方放玩具，让他自己趴着够、抓。', note: '玩具距离稍远一点，鼓励伸手。' },
    { id: 'mot7', title: '亲子空中操', how: '仰卧托住宝宝，轻轻做屈伸腿、摇手臂动作。', note: '动作柔和，跟随宝宝回应。' }
  ]
}

export const SONG_POOL = [
  'Hello Song',
  'Peek a Boo',
  'Itsy Bitsy Spider',
  'Wheels on the Bus',
  'One Little Finger',
  'If You\'re Happy'
]

export const PHRASE_POOL = [
  'Good morning, sweetie!',
  'Peek-a-boo! I see you.',
  'Let\'s clap your hands.',
  'This is red.',
  'Where is your tummy?',
  'Hello, baby. Hello!',
  'Wave bye-bye.',
  'What a lovely smile!'
]

export const TPR_POOL = [
  { title: '拍手', how: '妈妈边说 clap clap 边拍手，让宝宝看动作、听节奏。', phrase: 'Clap clap clap!' },
  { title: '再见挥手', how: '边挥手边说 bye-bye，做给宝宝看。', phrase: 'Bye-bye!' },
  { title: '躲猫猫', how: '双手遮脸再打开，配合 peek-a-boo。', phrase: 'Peek-a-boo!' },
  { title: '摸摸小肚子', how: '轻拍宝宝小肚子说 pat pat，做给宝宝看。', phrase: 'Pat pat pat!' },
  { title: '碰碰小脚', how: '捏捏宝宝小脚说 toes，让他感受自己的身体。', phrase: 'Little toes!' },
  { title: '张开小手', how: '慢慢张开手掌说 open，做给宝宝看。', phrase: 'Open, open!' }
]

const DEFAULT_ENGLISH: EnglishSet = { songs: SONG_POOL, phrases: PHRASE_POOL, tprs: TPR_POOL }

export function resolveEnglishSet(bandKey: string): EnglishSet {
  return ENGLISH_BY_BAND[bandKey] || DEFAULT_ENGLISH
}


const CARE_POOL: string[] = [
  '观察：宝宝今天有没有对你笑出声？',
  '观察：趴卧抬头能坚持多久？有没有明显进步？',
  '观察：宝宝咿呀说话多不多？有没有回应你？',
  '提醒：趴卧练习全程看护，旁边不放软枕。',
  '提醒：内容节奏慢一点，宝宝困了就睡。',
  '提醒：玩具大于拳头，远离小零件和绳索。'
]

export function buildDay(date: Date = new Date(), bandKey: string = '4-6m'): DayModule[] {
  const doy = dayOfYear(date)
  const theme = themeOf(date)
  const fine = pickFrom(FINE_0_0_6[bandKey] || EXTRA_FINE[bandKey] || EXTRA_FINE_13_36[bandKey] || FINE_0_0_6['4-6m'], doy, 3)
  const lang = pickFrom(LANG_0_6[bandKey] || EXTRA_LANG[bandKey] || EXTRA_LANG_13_36[bandKey] || LANG_0_6['4-6m'], doy + 5, 2)
  const cog = pickFrom(COG_0_6[bandKey] || EXTRA_COG[bandKey] || EXTRA_COG_13_36[bandKey] || COG_0_6['4-6m'], doy + 8, 2)
  const motor = pickFrom(MOTOR_0_6[bandKey] || EXTRA_MOTOR[bandKey] || EXTRA_MOTOR_13_36[bandKey] || MOTOR_0_6['4-6m'], doy + 12, 3)
  const eng = resolveEnglishSet(bandKey)
  const song = eng.songs[doy % eng.songs.length]
  const phrase = eng.phrases[doy % eng.phrases.length]
  const phrase2 = eng.phrases[(doy + 3) % eng.phrases.length]
  const tpr = eng.tprs[doy % eng.tprs.length]
  const care = pickFrom(CARE_POOL, doy + 3, 2)

  return [
    {
      id: 'fine',
      title: '精细动作',
      accent: '#4f8ef7',
      subtitle: '抓握 · 触觉',
      items: fine
    },
    {
      id: 'lang',
      title: '语言启蒙',
      accent: '#f2994a',
      subtitle: '旁白 · 回应 · 咿呀',
      items: lang
    },
    {
      id: 'cog',
      title: '认知启蒙',
      accent: '#27ae60',
      subtitle: '追视 · 触摸 · 互动',
      items: cog
    },
    {
      id: 'eng',
      title: '英文启蒙',
      accent: '#9b59b6',
      subtitle: '磨耳朵 · 短句 · TPR',
      items: [
        { id: 'eng1', title: `今晚磨耳朵：${song}`, how: '播放这首歌音频给宝宝听，只磨耳朵，不做任何引导。', note: theme.name },
        { id: 'eng2', title: '亲子口语', how: `妈妈慢慢说：${phrase}，再说一遍：${phrase2}。`, note: '不用宝宝听懂，听语调即可。' },
        { id: 'eng3', title: `TPR 动作：${tpr.title}`, how: `${tpr.how}` }
      ]
    },
    {
      id: 'motor',
      title: '大运动+感统',
      accent: '#e67e22',
      subtitle: '趴卧 · 翻身 · 摇抱',
      items: motor
    },
    {
      id: 'care',
      title: '发育观察&提醒',
      accent: '#16a085',
      subtitle: '今日观察与安全',
      items: care.map((text, i) => ({ id: `care${i}`, title: text, how: '' }))
    }
  ]
}

export interface LibraryEntry {
  id: string
  title: string
  band: string
  domain: (typeof DOMAINS)[number]
  theme: (typeof ACTIVITY_THEMES)[number]
  months: string
  materials: string
  how: string
  safety: string
}

const BASE_ACTIVITY_LIBRARY: LibraryEntry[] = [
  { id: 'a0', title: '触碰不同材质', band: '0-3m', domain: '感官探索', theme: '触感', months: '0-3月', materials: '棉布、绒布、毛巾', how: '轻轻碰手心感受不同触感。', safety: '布料大于拳头，无线头。' },
  { id: 'a1', title: '抓握摇铃', band: '4-6m', domain: '精细动作', theme: '声音', months: '4-6月', materials: '轻摇铃', how: '让宝宝自己抓握、晃动、听声。', safety: '摇铃无小零件，大于拳头。' },
  { id: 'a2', title: '双手抱软球', band: '4-6m', domain: '精细动作', theme: '颜色', months: '4-6月', materials: '红软球', how: '把红软球放在胸前，让宝宝双手抱住。', safety: '球大于拳头。' },
  { id: 'a3', title: '趴卧够纱巾', band: '4-6m', domain: '精细动作', theme: '触感', months: '4-6月', materials: '红纱巾', how: '俯卧时前方放纱巾，让宝宝伸手够。', safety: '全程看护，旁边无遮挡。' },
  { id: 'a4', title: '撕纸巾', band: '4-6m', domain: '精细动作', theme: '日常物品', months: '4-6月', materials: '大纸巾、手帕', how: '让宝宝自己抓、揉、撕。', safety: '用大纸张，防止入口。' },
  { id: 'a5', title: '俯卧抬头', band: '0-3m', domain: '大运动', theme: '身体', months: '0-6月', materials: '爬行垫、小玩具', how: '俯卧看前方玩具，抬头累了就休息。', safety: '全程看护，不用枕头垫高。' },
  { id: 'a6', title: '辅助翻身', band: '4-6m', domain: '大运动', theme: '身体', months: '4-6月', materials: '爬行垫', how: '宝宝侧躺时轻搭臀背，引导主动翻身。', safety: '只做轻微辅助，让宝宝主动用力。' },
  { id: 'a7', title: '轻柔摇抱', band: '0-3m', domain: '大运动', theme: '韵律', months: '0-6月', materials: '妈妈的怀抱', how: '左右轻轻摇摆，配合儿歌。', safety: '幅度小、支撑头颈。' },
  { id: 'a8', title: '红球追视', band: '4-6m', domain: '语言认知', theme: '颜色', months: '4-6月', materials: '大红球', how: '慢速左右移动红球，让宝宝追视。', safety: '速度慢，距离约 30 厘米。' },
  { id: 'a9', title: '黑白红追视', band: '0-3m', domain: '语言认知', theme: '颜色', months: '0-3月', materials: '黑白红卡片', how: '慢速移动卡片，让宝宝注视追视。', safety: '环境布置，非闪卡训练。' },
  { id: 'a10', title: '声源找方向', band: '0-3m', domain: '语言认知', theme: '声音', months: '0-6月', materials: '摇铃、铃铛', how: '在侧前方轻摇铃，看宝宝找声源。', safety: '一次只做一个方向。' },
  { id: 'a11', title: '纱巾躲猫猫', band: '4-6m', domain: '语言认知', theme: '韵律', months: '4-6月', materials: '红纱巾', how: '遮脸再露出，配合 wow 声。', safety: '纱巾薄、远离口鼻。' },
  { id: 'a12', title: '触摸凉暖', band: '0-3m', domain: '感官探索', theme: '触感', months: '0-6月', materials: '凉勺、暖毛巾', how: '让宝宝手摸凉勺和暖毛巾，感受温度差。', safety: '温度适宜，不冷热刺激。' },
  { id: 'a13', title: '看黑白红挂图', band: '0-3m', domain: '感官探索', theme: '颜色', months: '0-3月', materials: '黑白红图', how: '躺着或抱着看挂图，视觉刺激。', safety: '环境布置，非闪卡训练。' },
  { id: 'a14', title: '窗户光影', band: '0-3m', domain: '感官探索', theme: '自然', months: '0-6月', materials: '窗户、阳光', how: '让宝宝看窗边光影变化。', safety: '避免阳光直射眼睛。' },
  { id: 'a15', title: '指物命名', band: '4-6m', domain: '语言认知', theme: '日常物品', months: '4-6月', materials: '身边物品', how: '指灯、球、鼻子，反复说同几个词。', safety: '无特殊风险。' },
  { id: 'a16', title: '咿呀对话', band: '4-6m', domain: '语言认知', theme: '韵律', months: '4-6月', materials: '妈妈的回应', how: '模仿宝宝的咿呀声，有来有回。', safety: '无特殊风险。' },
  { id: 'a17', title: '肚子时间', band: '0-3m', domain: '大运动', theme: '身体', months: '0-3月', materials: '爬行垫、安全镜子', how: '俯卧短时练习，前方放镜子或玩具。', safety: '短时多次，全程看护。' }
]

export const ACTIVITY_LIBRARY: LibraryEntry[] = [...BASE_ACTIVITY_LIBRARY, ...EXTRA_LIBRARY]

export interface AidItem {
  name: string
  use: string
}

export const TEACHING_AIDS: { category: string; icon: string; items: AidItem[] }[] = [
  {
    category: '家居物品',
    icon: '🏠',
    items: [
      { name: '红纱巾', use: '躲猫猫、够物、视觉追踪' },
      { name: '轻摇铃', use: '抓握、听声、把玩' },
      { name: '不锈钢勺、小碗', use: '触感、把玩日常物品' },
      { name: '安全镜子', use: '照镜子、认识五官' },
      { name: '棉布、绒布、毛巾', use: '不同触感探索' }
    ]
  },
  {
    category: '食物类',
    icon: '🍊',
    items: [
      { name: '橙子、苹果', use: '看、闻、摸，不入口' },
      { name: '干净树叶', use: '看、摸自然物品' },
      { name: '无糖酸奶瓶（洗净）', use: '仅作瓶身把玩，不入口' }
    ]
  },
  {
    category: '低成本进阶',
    icon: '⭐',
    items: [
      { name: '不同材质球', use: '抓握、追视、触觉' },
      { name: '安抚巾', use: '抓握、安抚、触感' },
      { name: '布书', use: '翻书前的手眼探索' },
      { name: '安全牙胶', use: '啃咬期口唇满足' }
    ]
  },
  {
    category: 'DIY 教具',
    icon: '🛠️',
    items: [
      { name: '密封感官瓶', use: '摇晃、看流动、听声' },
      { name: '纱巾降落伞', use: '感官刺激、视觉追踪' },
      { name: '纸筒传声筒', use: '听觉探索、吹气互动' },
      { name: '黑白红视觉挂图', use: '环境布置，非闪卡训练' }
    ]
  }
]

export interface SpaceZone {
  name: string
  purpose: string
  setup: string
}

export const SPACE_ZONES: SpaceZone[] = [
  { name: '运动区', purpose: '趴卧、翻身、蹬腿', setup: '爬行垫铺开，旁放一面安全落地镜和少量玩具。' },
  { name: '操作区', purpose: '抓握、把玩日常物品', setup: '低矮玩具筐，放摇铃、软球、纱巾，宝宝伸手可及。' },
  { name: '感官区', purpose: '触觉、听觉、视觉刺激', setup: '不同布料篮、密封感官瓶、黑白红挂图。' },
  { name: '阅读角', purpose: '看布书、听妈妈读', setup: '软垫和抱枕区，放 2 本布书，不追求翻页。' },
  { name: '收纳区', purpose: '收玩具、保持整洁', setup: '低柜加安全锁，常用教具分类摆放，危险物品放高。' }
]

export const SAFETY_CHECKLIST: string[] = [
  '所有玩具都大于拳头，无小零件、无尖锐边角',
  '摇铃、拨浪鼓无松动小件，无松散绳索',
  '插座加盖保护，尖锐桌角装防护垫',
  '床上不放多余软枕、毛绒玩具和厚被',
  '爬行垫干净，活动区每天清洁',
  '趴卧、翻身全程在旁看护，不用枕头垫头',
  '防晒避免阳光直射眼睛',
  '所有物品远离口鼻，除母乳或配方奶外不额外进食'
]

export interface ObservationItem {
  id: string
  label: string
}

export interface ObservationCategory {
  key: string
  name: string
  accent: string
  items: ObservationItem[]
}

export const OBSERVATION_0_3: ObservationCategory[] = [
  {
    key: 'motor',
    name: '大运动',
    accent: '#e67e22',
    items: [
      { id: 'm0-1', label: '俯卧时能短暂抬头' },
      { id: 'm0-2', label: '能转动头部追看' },
      { id: 'm0-3', label: '仰卧时能自由活动四肢' },
      { id: 'm0-4', label: '被轻柔抱着时头颈有依靠感' },
      { id: 'm0-5', label: '看到移动物会追视' }
    ]
  },
  {
    key: 'fine',
    name: '精细动作',
    accent: '#4f8ef7',
    items: [
      { id: 'f0-1', label: '有抓握反射' },
      { id: 'f0-2', label: '手碰到物体会张开或握住' },
      { id: 'f0-3', label: '会看自己的手' },
      { id: 'f0-4', label: '握妈妈手指片刻' },
      { id: 'f0-5', label: '会触摸不同材质' }
    ]
  },
  {
    key: 'lang',
    name: '语言',
    accent: '#f2994a',
    items: [
      { id: 'l0-1', label: '听到声音会转头或眨眼' },
      { id: 'l0-2', label: '会发出“啊/咕”等声音' },
      { id: 'l0-3', label: '会被逗得微笑' },
      { id: 'l0-4', label: '能安静听妈妈说话和儿歌' },
      { id: 'l0-5', label: '对妈妈声音有反应' }
    ]
  },
  {
    key: 'cog',
    name: '认知',
    accent: '#27ae60',
    items: [
      { id: 'c0-1', label: '眼睛能追视移动物' },
      { id: 'c0-2', label: '会寻找声音来源' },
      { id: 'c0-3', label: '会注视人脸' },
      { id: 'c0-4', label: '对高对比图案有注意' },
      { id: 'c0-5', label: '会转头寻找熟悉声音' }
    ]
  },
  {
    key: 'social',
    name: '社交情绪',
    accent: '#9b59b6',
    items: [
      { id: 's0-1', label: '被逗会有表情反应' },
      { id: 's0-2', label: '会用哭声表达需求' },
      { id: 's0-3', label: '能进行眼神交流' },
      { id: 's0-4', label: '对妈妈的笑有回应' },
      { id: 's0-5', label: '困或饿时有明显信号' }
    ]
  }
]

export const OBSERVATION_4M: ObservationCategory[] = [
  {
    key: 'motor',
    name: '大运动',
    accent: '#e67e22',
    items: [
      { id: 'm1', label: '俯卧时能挺起头和前胸' },
      { id: 'm2', label: '能肘支撑趴一会儿' },
      { id: 'm3', label: '能从侧躺翻向仰卧或俯卧' },
      { id: 'm4', label: '仰卧时会玩手、抬腿' },
      { id: 'm5', label: '被拉坐时头能基本挺稳' }
    ]
  },
  {
    key: 'fine',
    name: '精细动作',
    accent: '#4f8ef7',
    items: [
      { id: 'f1', label: '会伸手主动抓物' },
      { id: 'f2', label: '能用双手抱住软球' },
      { id: 'f3', label: '会抓住摇铃晃动' },
      { id: 'f4', label: '会看手、玩手' },
      { id: 'f5', label: '会抓握妈妈手指' }
    ]
  },
  {
    key: 'lang',
    name: '语言',
    accent: '#f2994a',
    items: [
      { id: 'l1', label: '会发出咿呀声' },
      { id: 'l2', label: '听到声音会转头' },
      { id: 'l3', label: '会笑出声' },
      { id: 'l4', label: '会模仿妈妈发出类似音节' },
      { id: 'l5', label: '能安静听妈妈说话和儿歌' }
    ]
  },
  {
    key: 'cog',
    name: '认知',
    accent: '#27ae60',
    items: [
      { id: 'c1', label: '眼睛能追视移动的玩具到 180 度' },
      { id: 'c2', label: '会寻找声音来源' },
      { id: 'c3', label: '看镜子会有反应' },
      { id: 'c4', label: '玩躲猫猫时会等一等、有期待' },
      { id: 'c5', label: '会伸手碰看到的物品' }
    ]
  },
  {
    key: 'social',
    name: '社交情绪',
    accent: '#9b59b6',
    items: [
      { id: 's1', label: '会被逗笑、笑得开心' },
      { id: 's2', label: '认识并偏爱妈妈' },
      { id: 's3', label: '会用哭和表情表达需求' },
      { id: 's4', label: '对陌生人有观察或认生表现' },
      { id: 's5', label: '能跟人进行眼神交流' }
    ]
  }
]

export const OBSERVATION_BY_BAND: Record<string, ObservationCategory[]> = {
  '0-3m': OBSERVATION_0_3,
  '4-6m': OBSERVATION_4M,
  '7-9m': OBSERVATION_7_9,
  '10-12m': OBSERVATION_10_12,
  '13-18m': OBSERVATION_13_18,
  '19-24m': OBSERVATION_19_24,
  '25-30m': OBSERVATION_25_30,
  '31-36m': OBSERVATION_31_36
}
