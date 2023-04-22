const switchColumn = {
  text: '开关',
  value: 'switch',
  children: [
    { text: '开', value: 'on' },
    { text: '关', value: 'off' },
  ],
}

const brightnessColumn = {
  text: '亮度',
  value: 'brightness',
}

const colourTemperatureColumn = {
  text: '色温',
  value: 'colourTemperature',
}
const colourColumn = {
  text: '颜色',
  value: 'color',
  children: [
    { text: '红色', value: 'R' },
    { text: '绿色', value: 'G' },
    { text: '蓝色', value: 'B' },
    { text: '白色', value: 'W' },
  ],
}

const stopColumn = { text: '停', value: 'stop' }

const percentColumn = { text: '百分比', value: 'percent' }

const angleColumn = { text: '角度', value: 'angle' }

const fanColumn = {
  text: '风速',
  value: 'fan',
  children: [
    { text: '自动风速', value: 'auto' },
    { text: '高风速', value: 'high' },
    { text: '中风速', value: 'mid' },
    { text: '低风速', value: 'low' },
  ],
}

const airModeColumn = {
  text: '模式',
  value: 'mode',
  children: [
    { text: '自动模式', value: 'auto' },
    { text: '制冷模式', value: 'cool' },
    { text: '制热模式', value: 'hot' },
    { text: '通风模式', value: 'wind' },
    { text: '除湿模式', value: 'wet' },
  ],
}

const temperatureColumn = {
  text: '温度',
  value: 'temperature',
  children: [
    { text: '设置温度', value: 'setTemperature' },
    { text: '环境问题', value: 'currentTemperature' },
  ],
}

const codeColumn = {
  text: '代码',
  value: 'code',
  children: [{ text: '故障代码', value: 'code' }],
}

const underfloorModeColumn = {
  text: '模式',
  value: 'mode',
  children: [
    { text: '白天模式', value: 'day' },
    { text: '夜晚模式', value: 'night' },
    { text: '离家模式', value: 'leave' },
    { text: '自动模式', value: 'atuo' },
    { text: '手动模式', value: 'manual' },
  ],
}
const freshModeColumn = {
  text: '模式',
  value: 'mode',
  children: [
    { text: '新风模式', value: 'fresh' },
    { text: '横温模式', value: 'constant' },
    { text: '循环模式', value: 'loop' },
    { text: '自动模式', value: 'atuo' },
  ],
}

const palyColumn = {
  text: '播放控制',
  value: 'palyControl',
  children: [
    { text: '播放', value: 'play' },
    { text: '暂停', value: 'pause' },
  ],
}

const cutSongColumn = {
  text: '切歌',
  value: 'cutSong',
  children: [
    { text: '上一首', value: 'prev' },
    { text: '下一首', value: 'next' },
  ],
}

const musicModeColumn = {
  text: ' 播放模式 ',
  value: 'mode',
  children: [
    { text: '列表播放', value: 'list' },
    { text: '顺序播放', value: 'sequence' },
    { text: '随机播放', value: 'single' },
    { text: '单曲循环', value: 'random' },
    { text: '列表循环', value: 'loop' },
  ],
}

const volumeColumn = {
  text: ' 音量控制 ',
  value: 'volume',
  children: [
    { text: '音量加', value: 'up' },
    { text: '音量减', value: 'down' },
    { text: '设置音量', value: 'volume' },
  ],
}

const processColumn = {
  text: ' 进度 ',
  value: 'process',
  children: [{ text: '播放进度', value: 'process' }],
}

const listColumn = {
  text: ' 列表 ',
  value: 'list',
  children: [{ text: '歌曲列表', value: 'list' }],
}

const sourceColumn = {
  text: ' 音源 ',
  value: 'source',
  children: [
    { text: 'U盘播放', value: 'usb' },
    { text: '本地播放', value: 'local' },
    { text: 'FM', value: 'fm' },
    { text: '云音乐', value: 'cloud' },
  ],
}

const tunnelsColumn = {
  text: ' 分区 ',
  value: 'tunnels',
}

export default [
  {
    name: 'lamp',
    text: '灯',
    classify: '100',
    category: ['100001', '100002', '100003', '100004'],
    icon: 'tips',
    100001: switchColumn,
    100002: {
      aliasName: '调光灯',
      columns: [switchColumn, brightnessColumn],
    },
    100003: {
      aliasName: '色温灯',
      columns: [switchColumn, brightnessColumn, colourTemperatureColumn],
    },
    100004: {
      aliasName: 'RGBW',
      columns: [switchColumn, brightnessColumn, colourColumn],
    },
  },
  {
    name: 'curtain',
    text: '窗帘',
    classify: '101',
    category: ['101001', '101002', '101003', '101004', '101005', '101006', '101007', '101008'],
    icon: 'rectangle-tear',
    101001: {
      aliasName: '开关窗帘',
      columns: [switchColumn],
    },
    101002: {
      aliasName: '开关停窗帘',
      columns: [switchColumn, stopColumn],
    },
    101003: {
      aliasName: '百分比窗帘',
      columns: [switchColumn, stopColumn, percentColumn],
    },
    101004: {
      aliasName: '调角窗帘',
      columns: [switchColumn, stopColumn, angleColumn],
    },
    101005: {
      aliasName: '杜亚窗帘电机',
      columns: [switchColumn, stopColumn, percentColumn],
    },
    101006: {
      aliasName: '奥科窗帘电机',
      columns: [switchColumn, stopColumn, percentColumn],
    },
    101007: {
      aliasName: '威士达窗帘电机',
      columns: [switchColumn, stopColumn, percentColumn],
    },
    101008: {
      aliasName: '创明窗帘电机',
      columns: [switchColumn, stopColumn, percentColumn],
    },
  },
  {
    name: 'ariCooler',
    text: '空调',
    classify: '102',
    category: ['102001', '102002', '102003', '102004', '102005'],
    icon: 'air-conditioning',
    102001: {
      aliasName: '简易空调',
      columns: [switchColumn],
    },
    102002: {
      aliasName: '常规空调',
      columns: [switchColumn, fanColumn, airModeColumn, temperatureColumn, codeColumn],
    },
    102003: {
      aliasName: 'HAVC空调',
      columns: [
        switchColumn,
        { ...switchColumn, text: '阀门开关', value: 'valueSwitch' },
        fanColumn,
        airModeColumn,
        temperatureColumn,
        codeColumn,
      ],
    },
    102004: {
      aliasName: '大金空调',
      columns: [switchColumn, fanColumn, airModeColumn, temperatureColumn, codeColumn],
    },
    102005: {
      aliasName: '日立空调',
      columns: [switchColumn, fanColumn, airModeColumn, temperatureColumn, codeColumn],
    },
  },
  {
    name: 'underfloorHeat',
    text: '地暖',
    classify: '103',
    category: ['103001', '103002', '103003'],
    icon: 'boiler',
    103001: {
      aliasName: '简易地暖',
      columns: [switchColumn],
    },
    103002: {
      aliasName: '常规地暖',
      columns: [switchColumn, underfloorModeColumn, temperatureColumn],
    },
    103003: {
      aliasName: '阀门地暖',
      columns: [
        switchColumn,
        { ...switchColumn, text: '阀门开关', value: 'valueSwitch' },
        underfloorModeColumn,
        temperatureColumn,
      ],
    },
  },
  {
    name: 'freshAir',
    text: '新风',
    classify: '104',
    category: ['104001', '104002', '104003', '104004'],
    icon: 'whirlwind',
    104001: {
      aliasName: '开关新风',
      columns: [switchColumn],
    },
    104002: {
      aliasName: '常规新风',
      columns: [switchColumn, freshModeColumn, fanColumn],
    },
    104003: {
      aliasName: '无风速新风',
      columns: [switchColumn, freshModeColumn],
    },
    104004: {
      aliasName: '无模式新风',
      columns: [switchColumn, fanColumn],
    },
  },
  {
    name: 'music',
    text: '音乐',
    classify: '105',
    category: ['105001', '105002', '105003'],
    icon: 'music',
    105001: {
      aliasName: '全功能音乐',
      columns: [
        palyColumn,
        cutSongColumn,
        musicModeColumn,
        volumeColumn,
        processColumn,
        listColumn,
        sourceColumn,
        tunnelsColumn,
      ],
    },
    105002: {
      aliasName: '普通音乐带分区',
      columns: [palyColumn, cutSongColumn, musicModeColumn, volumeColumn, tunnelsColumn],
    },
    105003: {
      aliasName: '普通音乐不带分区',
      columns: [palyColumn, cutSongColumn, musicModeColumn, volumeColumn],
    },
  },
]
