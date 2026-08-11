export interface Vehicle {
  id: string
  name: string
  english: string
  category: 'cars' | 'emergency' | 'construction'
  emoji: string
  color: string
  /** 一句话科普文案（幼儿版） */
  funFact: string
}

export interface Category {
  id: Vehicle['category']
  label: string
  emoji: string
}

export const CATEGORIES: Category[] = [
  { id: 'cars', label: '小汽车', emoji: '🚗' },
  { id: 'emergency', label: '特种车', emoji: '🚨' },
  { id: 'construction', label: '工程车', emoji: '🚧' },
]

export const VEHICLES: Vehicle[] = [
  // ── 小汽车 ──
  { id: 'car', name: '小汽车', english: 'Car', category: 'cars', emoji: '🚗', color: '#5B9BD5', funFact: '四个轮子跑得快，带我们去想去的地方。' },
  { id: 'suv', name: '越野车', english: 'SUV', category: 'cars', emoji: '🚙', color: '#ED7D31', funFact: '个子大、力气大，爬山也不怕。' },
  { id: 'sports-car', name: '跑车', english: 'Sports Car', category: 'cars', emoji: '🏎️', color: '#E74C3C', funFact: '长得低低的，跑起来像风一样快。' },
  { id: 'taxi', name: '出租车', english: 'Taxi', category: 'cars', emoji: '🚕', color: '#F4B942', funFact: '黄颜色，顶上有块牌子，招手它就来。' },
  // ── 特种车 ──
  { id: 'police-car', name: '警车', english: 'Police Car', category: 'emergency', emoji: '🚓', color: '#2C3E50', funFact: '警察叔叔开它抓坏人，灯一亮"呜哇呜哇"。' },
  { id: 'fire-truck', name: '消防车', english: 'Fire Truck', category: 'emergency', emoji: '🚒', color: '#C0392B', funFact: '红色的，着火的时候冲过去喷水救火。' },
  { id: 'ambulance', name: '救护车', english: 'Ambulance', category: 'emergency', emoji: '🚑', color: '#E8F8F5', funFact: '有人生病了，它亮着灯飞快送去医院。' },
  { id: 'bus', name: '公交车', english: 'Bus', category: 'emergency', emoji: '🚌', color: '#27AE60', funFact: '长长的，能装好多人，一起出门真热闹。' },
  // ── 工程车 ──
  { id: 'dump-truck', name: '翻斗车', english: 'Dump Truck', category: 'construction', emoji: '🚛', color: '#F39C12', funFact: '后面的大斗一翘，沙子石头哗啦啦倒出来。' },
  { id: 'bulldozer', name: '推土机', english: 'Bulldozer', category: 'construction', emoji: '🚜', color: '#E67E22', funFact: '前面有大铲子，把土堆推得平平的。' },
  { id: 'crane', name: '吊车', english: 'Crane', category: 'construction', emoji: '🏗️', color: '#8E44AD', funFact: '长长的吊臂，能把很重的东西吊得高高的。' },
  { id: 'excavator', name: '挖掘机', english: 'Excavator', category: 'construction', emoji: '💛', color: '#F39C12', funFact: '长长的手臂会挖土，工地干活的主力。' },
  { id: 'tractor', name: '拖拉机', english: 'Tractor', category: 'construction', emoji: '🚜', color: '#16A085', funFact: '农民伯伯开它犁地，种出好吃的粮食。' },
]

export const vehicleById = (id: string): Vehicle | undefined =>
  VEHICLES.find((v) => v.id === id)

export const vehiclesByCategory = (cat: Vehicle['category']): Vehicle[] =>
  VEHICLES.filter((v) => v.category === cat)
