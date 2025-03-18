import dayjs from 'dayjs'
// 时间范围排序
export function sortTimeArrayWithDayjs(arr) {
  // 获取当前日期
  const currentDate = dayjs().format('YYYY-MM-DD')
  // 解析两个时间为 Day.js 对象
  const time1 = dayjs(`${currentDate} ${arr[0]}`, 'YYYY-MM-DD HH:mm')
  const time2 = dayjs(`${currentDate} ${arr[1]}`, 'YYYY-MM-DD HH:mm')
  // 比较时间顺序（小的在前）
  console.log(time1, time2)
  return time1.isBefore(time2) || time1.isSame(time2) ? [arr[0], arr[1]] : [arr[1], arr[0]]
}
