import type { DayItem } from './content'

const FINE_7_9: DayItem[] = [
  { id: 'f79-1', title: '拇食指取大块', how: '把大块积木放在眼前，让宝宝用拇食指尝试捏取。', note: '物品大于拳头，防入口。' },
  { id: 'f79-2', title: '对敲积木', how: '两手各拿一块积木，让宝宝自己敲响。', note: '积木无尖角。' },
  { id: 'f79-3', title: '倒手换物', how: '把玩具从一只手换到另一只手。', note: '让宝宝自己完成。' },
  { id: 'f79-4', title: '撕纸探索', how: '给大张纸让宝宝自己撕、揉。', note: '用大张纸，防误食。' },
  { id: 'f79-5', title: '拉玩具', how: '让宝宝拉扯带短绳的安全玩具。', note: '绳子短且结实，不绕颈。' },
  { id: 'f79-6', title: '拍打桌面', how: '让宝宝在桌面或鼓面自己拍打出声音。', note: '桌面稳固。' },
  { id: 'f79-7', title: '盒中取物', how: '从浅盒里拿出大块物品。', note: '盒子浅、无夹手风险。' }
]

const LANG_7_9: DayItem[] = [
  { id: 'l79-1', title: '听懂简单词', how: '听到“球球 / 杯子”时妈妈指物并重复。', note: '每天重复同几个词。' },
  { id: 'l79-2', title: '做拜拜', how: '边说“再见”边挥手做给宝宝看。', note: '不要求立刻模仿。' },
  { id: 'l79-3', title: '模仿发声', how: '回应宝宝 ba-ba、da-da，等他自己再发声。', note: '给回应时间。' },
  { id: 'l79-4', title: '指认五官', how: '指着鼻子、眼睛、嘴巴慢慢说。', note: '边指边看宝宝。' },
  { id: 'l79-5', title: '玩具命名', how: '每次给玩具都说名字（球、铃、杯）。', note: '语言生活化。' },
  { id: 'l79-6', title: '洗澡互动', how: '洗澡时描述水温、毛巾、水花。', note: '跟随宝宝节奏。' }
]

const COG_7_9: DayItem[] = [
  { id: 'c79-1', title: '物体恒存', how: '用纱巾盖住玩具，问“球球呢？”再揭开。', note: '重复几次。' },
  { id: 'c79-2', title: '因果按键', how: '按亮小夜灯或按响玩具，看因果。', note: '玩具安全无噪音过大。' },
  { id: 'c79-3', title: '照镜子玩', how: '拍镜中的自己，听妈妈叫名字。', note: '镜子固定安全。' },
  { id: 'c79-4', title: '模仿拍手', how: '妈妈拍手，让宝宝看了之后自己试。', note: '不强迫模仿。' },
  { id: 'c79-5', title: '开关门', how: '反复开合柜门、抽屉，观察变化。', note: '防夹手，需在旁。' }
]

const MOTOR_7_9: DayItem[] = [
  { id: 'm79-1', title: '独坐', how: '垫上坐稳，前方放玩具自取自玩。', note: '坐久了就趴下休息。' },
  { id: 'm79-2', title: '坐爬转换', how: '从坐姿慢慢转成趴姿爬行。', note: '让宝宝自己转换。' },
  { id: 'm79-3', title: '爬行追玩具', how: '前方放玩具，让宝宝自己爬去拿。', note: '距离适中。' },
  { id: 'm79-4', title: '爬坡或隧道', how: '用纸箱、斜坡垫做低矮爬行通道。', note: '全程看护防倾倒。' },
  { id: 'm79-5', title: '扶站尝试', how: '扶着沙发或围栏尝试站一下。', note: '只做尝试，不强迫。' },
  { id: 'm79-6', title: '踢腿蹬床', how: '仰卧蹬腿，妈妈用手轻挡。', note: '宝宝自己用力。' }
]

const FINE_10_12: DayItem[] = [
  { id: 'f101-1', title: '拇食指捏大块', how: '捏起大块积木或软木塞。', note: '物品大于拳头。' },
  { id: 'f101-2', title: '翻厚纸板书', how: '自己一页页翻硬纸板书。', note: '厚页书耐啃咬。' },
  { id: 'f101-3', title: '盖瓶盖', how: '把盖子盖到瓶口再拿开。', note: '瓶口大于拳头。' },
  { id: 'f101-4', title: '开抽屉或开盒', how: '拉开柜门、抽屉找东西。', note: '防夹手，抽屉锁除外。' },
  { id: 'f101-5', title: '放取积木', how: '把积木放进杯子再倒出来。', note: '杯子稳固不倾倒。' },
  { id: 'f101-6', title: '舀物', how: '用大勺舀豆类，妈妈在旁。', note: '豆类看护防入口。' },
  { id: 'f101-7', title: '套杯', how: '把套杯套进去再拿出来。', note: '杯子无破损边缘。' }
]

const LANG_10_12: DayItem[] = [
  { id: 'l101-1', title: '听名回应', how: '叫名字时转头看。', note: '每次只叫一次，给时间。' },
  { id: 'l101-2', title: '有意识叫爸妈', how: '示范“妈妈、爸爸”，不纠正。', note: '不考不逼。' },
  { id: 'l101-3', title: '指认物品', how: '听到“灯灯”就指。', note: '从熟悉的物品开始。' },
  { id: 'l101-4', title: '模仿词汇', how: '跟说 ba、ma、wa 等音。', note: '以玩为主。' },
  { id: 'l101-5', title: '挥手再见', how: '说“再见”时挥手做给宝宝看。', note: '日常出门时做。' },
  { id: 'l101-6', title: '一步指令', how: '说“拿来球球”等一步指令并示范。', note: '做对就笑，不做不催。' }
]

const COG_10_12: DayItem[] = [
  { id: 'c101-1', title: '指认日常物品', how: '指灯、球、杯、鞋并说名字。', note: '重复巩固。' },
  { id: 'c101-2', title: '简单配对', how: '两两配对相同物品。', note: '用熟悉的物品。' },
  { id: 'c101-3', title: '因果探索', how: '按开关开灯、开合手电筒。', note: '大人操作，宝宝观察。' },
  { id: 'c101-4', title: '藏找巩固', how: '把玩具藏进盒里再打开找。', note: '从简单盒开始。' },
  { id: 'c101-5', title: '颜色初识', how: '指着红、蓝、黄物品看。', note: '只输入不考。' }
]

const MOTOR_10_12: DayItem[] = [
  { id: 'm101-1', title: '扶站', how: '扶着围栏或沙发站一会儿。', note: '站累就坐。' },
  { id: 'm101-2', title: '独站尝试', how: '妈妈轻扶后放手数秒。', note: '只在软垫上。' },
  { id: 'm101-3', title: '扶走', how: '扶围栏或推小车走几步。', note: '路线无障碍。' },
  { id: 'm101-4', title: '蹲下站起', how: '捡起地上的玩具站起来。', note: '让宝宝自己完成。' },
  { id: 'm101-5', title: '投球', how: '手掌抓大球放进筐里。', note: '筐口大、位置低。' },
  { id: 'm101-6', title: '上矮台阶', how: '扶着上下低矮台阶或垫子。', note: '全程看护。' }
]

export const EXTRA_FINE: Record<string, DayItem[]> = {
  '7-9m': FINE_7_9,
  '10-12m': FINE_10_12
}

export const EXTRA_LANG: Record<string, DayItem[]> = {
  '7-9m': LANG_7_9,
  '10-12m': LANG_10_12
}

export const EXTRA_COG: Record<string, DayItem[]> = {
  '7-9m': COG_7_9,
  '10-12m': COG_10_12
}

export const EXTRA_MOTOR: Record<string, DayItem[]> = {
  '7-9m': MOTOR_7_9,
  '10-12m': MOTOR_10_12
}
