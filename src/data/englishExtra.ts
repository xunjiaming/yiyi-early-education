export interface TprAction {
  title: string
  how: string
  phrase: string
}

export interface EnglishSet {
  songs: string[]
  phrases: string[]
  tprs: TprAction[]
}

export const ENGLISH_BY_BAND: Record<string, EnglishSet> = {
  '7-9m': {
    songs: ['The Itsy Bitsy Spider', 'Twinkle, Twinkle, Little Star', 'Row, Row, Row Your Boat', 'Old MacDonald Had a Farm', 'Three Little Kittens', 'London Bridge Is Falling Down'],
    phrases: [
      'Good morning, sweetie!',
      'Wave bye-bye.',
      'Peek-a-boo! I see you.',
      'Where is your nose?',
      'That is a ball.'
    ],
    tprs: [
      { title: '拍手', how: '妈妈边说 clap clap 边拍手，让宝宝看动作、听节奏。', phrase: 'Clap clap clap!' },
      { title: '再见挥手', how: '边挥手边说 bye-bye，做给宝宝看。', phrase: 'Bye-bye!' },
      { title: '躲猫猫', how: '双手遮脸再打开，配合 peek-a-boo。', phrase: 'Peek-a-boo!' },
      { title: '摸摸小肚子', how: '轻拍宝宝小肚子说 pat pat，做给宝宝看。', phrase: 'Pat pat pat!' }
    ]
  },
  '10-12m': {
    songs: ['The Itsy Bitsy Spider', 'Twinkle, Twinkle, Little Star', 'Row, Row, Row Your Boat', 'Old MacDonald Had a Farm', 'Three Little Kittens', 'London Bridge Is Falling Down'],
    phrases: [
      'Give me the ball.',
      'Where is your nose?',
      'Look! A red ball.',
      'Wave bye-bye.',
      'Clap your hands.'
    ],
    tprs: [
      { title: '拍手', how: '妈妈边说 clap clap 边拍手，让宝宝看动作、听节奏。', phrase: 'Clap clap clap!' },
      { title: '再见挥手', how: '边挥手边说 bye-bye，做给宝宝看。', phrase: 'Bye-bye!' },
      { title: '碰碰小脚', how: '捏捏宝宝小脚说 toes，让他感受自己的身体。', phrase: 'Little toes!' },
      { title: '指指鼻子', how: '指着宝宝鼻子说 nose，再指妈妈的。', phrase: 'Touch your nose!' },
      { title: '张开小手', how: '慢慢张开手掌说 open，做给宝宝看。', phrase: 'Open, open!' }
    ]
  },
  '13-18m': {
    songs: ['The Itsy Bitsy Spider', 'Twinkle, Twinkle, Little Star', 'Row, Row, Row Your Boat', 'Old MacDonald Had a Farm', 'Three Little Kittens', 'London Bridge Is Falling Down'],
    phrases: [
      'Where is your nose?',
      'Give me the ball, please.',
      'I see a dog.',
      'Look at the red apple.',
      'Come here, baby.'
    ],
    tprs: [
      { title: '摸摸头', how: '边摸头边说 touch head，宝宝看和听。', phrase: 'Touch your head!' },
      { title: '拍拍肚子', how: '轻拍肚子说 pat tummy，做给宝宝看。', phrase: 'Pat your tummy!' },
      { title: '走一走', how: '站着慢慢走几步说 walk walk，宝宝跟着看。', phrase: 'Walk, walk, walk!' },
      { title: '给球', how: '把球递给宝宝说 give，再伸手要。', phrase: 'Give me the ball!' }
    ]
  },
  '19-24m': {
    songs: ['The Itsy Bitsy Spider', 'Twinkle, Twinkle, Little Star', 'Row, Row, Row Your Boat', 'Old MacDonald Had a Farm', 'Three Little Kittens', 'London Bridge Is Falling Down'],
    phrases: [
      'What do you see?',
      'I see a big dog.',
      'Put the ball in the box.',
      'Do you want some water?',
      'Let\'s wash your hands.'
    ],
    tprs: [
      { title: '跳一跳', how: '妈妈轻轻跳并说 jump jump，宝宝看和听。', phrase: 'Jump, jump!' },
      { title: '转圈圈', how: '慢慢转一圈说 turn around，动作放慢。', phrase: 'Turn around!' },
      { title: '拍手', how: '边说 clap 边拍手，宝宝可看不做。', phrase: 'Clap, clap!' },
      { title: '收起来', how: '边说 put away 边把玩具放进筐。', phrase: 'Put away!' }
    ]
  },
  '25-30m': {
    songs: ['The Itsy Bitsy Spider', 'Twinkle, Twinkle, Little Star', 'Row, Row, Row Your Boat', 'Old MacDonald Had a Farm', 'Three Little Kittens', 'London Bridge Is Falling Down'],
    phrases: [
      'What color is this?',
      'It is a big red car.',
      'Can you put the toys away?',
      'Please say thank you.',
      'Let\'s take turns.'
    ],
    tprs: [
      { title: '摸红色', how: '指着红色物品说 red，让宝宝看和摸。', phrase: 'Touch red!' },
      { title: '排队', how: '妈妈示范排队走，说 line up。', phrase: 'Line up!' },
      { title: '单脚站', how: '扶稳单脚站一下，说 one foot。', phrase: 'Stand on one foot!' },
      { title: '慢下来', how: '放慢动作说 slow down，让节奏安静下来。', phrase: 'Slow down!' }
    ]
  },
  '31-36m': {
    songs: ['The Itsy Bitsy Spider', 'Twinkle, Twinkle, Little Star', 'Row, Row, Row Your Boat', 'Old MacDonald Had a Farm', 'Three Little Kittens', 'London Bridge Is Falling Down'],
    phrases: [
      'What is this?',
      'I am three years old.',
      'Would you like some water?',
      'Let\'s go outside.',
      'The sun is shining today.'
    ],
    tprs: [
      { title: '传球', how: '把软球轻轻递给宝宝说 pass，宝宝可参与。', phrase: 'Pass the ball!' },
      { title: '举起手', how: '双手举起说 hands up，做给宝宝看。', phrase: 'Hands up!' },
      { title: '转圈圈', how: '慢慢转一圈说 turn around，宝宝可尝试。', phrase: 'Turn around!' },
      { title: '安静片刻', how: '竖起手指说 quiet，配合安静游戏。', phrase: 'Quiet, please!' }
    ]
  }
}
