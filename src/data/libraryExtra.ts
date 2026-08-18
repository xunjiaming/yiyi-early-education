import type { DayItem, LibraryEntry } from './content'
import { EXTRA_FINE, EXTRA_LANG, EXTRA_COG, EXTRA_MOTOR } from './pools712'
import { EXTRA_FINE_13_36, EXTRA_LANG_13_36, EXTRA_COG_13_36, EXTRA_MOTOR_13_36 } from './pools1336'

function themeFor(title: string): LibraryEntry['theme'] {
  if (/颜色|涂色|蜡笔|描画|画圆|串珠排序/.test(title)) return '颜色'
  if (/唱|儿歌|歌|拍手|韵律|节奏/.test(title)) return '韵律'
  if (/五官|身体|五官物品|跑|跳|走|站|骑|攀|平衡|抛|接|踢|球|楼梯|台阶|滑梯|爬架|独坐|翻身|俯卧/.test(title)) return '身体'
  if (/自然|户外|树叶|天气|攀爬|隧道|爬坡/.test(title)) return '自然'
  if (/听|声音|发声|开关灯|按键|模仿发声/.test(title)) return '声音'
  if (/撕|揉|摸|触|水|倒水|布|撕贴|翻页|翻书/.test(title)) return '触感'
  return '日常物品'
}

function materialsFor(title: string): string {
  if (/豆|舀|勺/.test(title)) return '碗、大勺、黄豆或红豆'
  if (/水|倒/.test(title)) return '小杯、大盆、防水垫'
  if (/积木|建构|搭|结构/.test(title)) return '圆角积木'
  if (/书|绘本|故事|翻页|翻书/.test(title)) return '厚纸板书或绘本'
  if (/贴|纸|剪|画|涂|描|拼图|笔/.test(title)) return '纸张、安全剪刀、画笔或拼图'
  if (/珠|串/.test(title)) return '大珠子、粗绳'
  if (/盖|杯|套/.test(title)) return '宽口瓶、杯子、盖子'
  if (/球/.test(title)) return '软球或大球'
  if (/走|站|跑|跳|爬|攀|平衡|滑梯|楼梯|台阶|骑|车|抛|接|踢/.test(title)) return '软垫、开阔空间、低矮器械'
  if (/说|听|字|词|句|短|指令|指认|命名|回应|模仿|提问|描述|叙述|复述|回答|故事|儿歌|唱/.test(title)) return '妈妈的声音与日常场景'
  if (/颜色|红|蓝|黄|配对/.test(title)) return '不同颜色的生活物品'
  if (/大小|多少|长短|排序|分类|逻辑|日常规则|多步指令/.test(title)) return '可比较的实物、收纳筐'
  if (/藏|找|躲|记忆/.test(title)) return '玩具、毛巾或盒子'
  if (/自然|户外|树叶|天气|光影/.test(title)) return '户外或天然物品'
  if (/五官|身体|镜/.test(title)) return '安全镜子、妈妈的脸'
  if (/开门|抽屉|盒|柜|拉链|扣|衣夹/.test(title)) return '抽屉、盒子、衣物或衣夹'
  return '随手可得的日常物品'
}

function buildLibrary(
  prefix: string,
  band: string,
  months: string,
  domain: LibraryEntry['domain'],
  items: DayItem[]
): LibraryEntry[] {
  return items.map((item, i) => ({
    id: `${prefix}-${i + 1}`,
    title: item.title,
    band,
    domain,
    theme: themeFor(item.title),
    months,
    materials: materialsFor(item.title),
    how: item.how,
    safety: item.note || '全程看护、安全为先。'
  }))
}

export const EXTRA_LIBRARY: LibraryEntry[] = [
  ...buildLibrary('p79', '7-9m', '7-9月', '精细动作', EXTRA_FINE['7-9m']),
  ...buildLibrary('p79l', '7-9m', '7-9月', '语言认知', EXTRA_LANG['7-9m']),
  ...buildLibrary('p79c', '7-9m', '7-9月', '语言认知', EXTRA_COG['7-9m']),
  ...buildLibrary('p79m', '7-9m', '7-9月', '大运动', EXTRA_MOTOR['7-9m']),
  ...buildLibrary('p101', '10-12m', '10-12月', '精细动作', EXTRA_FINE['10-12m']),
  ...buildLibrary('p101l', '10-12m', '10-12月', '语言认知', EXTRA_LANG['10-12m']),
  ...buildLibrary('p101c', '10-12m', '10-12月', '语言认知', EXTRA_COG['10-12m']),
  ...buildLibrary('p101m', '10-12m', '10-12月', '大运动', EXTRA_MOTOR['10-12m']),
  ...buildLibrary('p131', '13-18m', '13-18月', '精细动作', EXTRA_FINE_13_36['13-18m']),
  ...buildLibrary('p131l', '13-18m', '13-18月', '语言认知', EXTRA_LANG_13_36['13-18m']),
  ...buildLibrary('p131c', '13-18m', '13-18月', '语言认知', EXTRA_COG_13_36['13-18m']),
  ...buildLibrary('p131m', '13-18m', '13-18月', '大运动', EXTRA_MOTOR_13_36['13-18m']),
  ...buildLibrary('p191', '19-24m', '19-24月', '精细动作', EXTRA_FINE_13_36['19-24m']),
  ...buildLibrary('p191l', '19-24m', '19-24月', '语言认知', EXTRA_LANG_13_36['19-24m']),
  ...buildLibrary('p191c', '19-24m', '19-24月', '语言认知', EXTRA_COG_13_36['19-24m']),
  ...buildLibrary('p191m', '19-24m', '19-24月', '大运动', EXTRA_MOTOR_13_36['19-24m']),
  ...buildLibrary('p251', '25-30m', '25-30月', '精细动作', EXTRA_FINE_13_36['25-30m']),
  ...buildLibrary('p251l', '25-30m', '25-30月', '语言认知', EXTRA_LANG_13_36['25-30m']),
  ...buildLibrary('p251c', '25-30m', '25-30月', '语言认知', EXTRA_COG_13_36['25-30m']),
  ...buildLibrary('p251m', '25-30m', '25-30月', '大运动', EXTRA_MOTOR_13_36['25-30m']),
  ...buildLibrary('p311', '31-36m', '31-36月', '精细动作', EXTRA_FINE_13_36['31-36m']),
  ...buildLibrary('p311l', '31-36m', '31-36月', '语言认知', EXTRA_LANG_13_36['31-36m']),
  ...buildLibrary('p311c', '31-36m', '31-36月', '语言认知', EXTRA_COG_13_36['31-36m']),
  ...buildLibrary('p311m', '31-36m', '31-36月', '大运动', EXTRA_MOTOR_13_36['31-36m'])
]
