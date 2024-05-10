declare type CalendarItemType = {
  dayObject: dayjs.Dayjs
  dayStr: string
  isExtraDay: boolean
  isToday: boolean
  selected: boolean
}

declare type FundItem = {
  // 发布日期
  releaseDate: string
  // 状态
  status: number
  // 状态描述
  statusDesc: string
  // 名称
  name: string
  // 系列名
  seriesName: string
  // 标签
  tag: string
  // 收益率
  rateOfReturn: number
  // 投资周期
  duration: number
  // 剩余数量
  remainingQuantity: number
  // 起投金额
  minimumInvestment: number
  // 风险系数
  riskLevel: number
  // 风险描述
  riskDesc: string
}
