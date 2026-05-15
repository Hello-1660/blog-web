/**
 * 日期转换
 * @param date 日期  1999-01-01T08:00:00:00
 * @return 格式化后的日期 1999-01-01 08:00
 */
export function formatDate(date: string): string {
  try {
    const dateArr = date.split('T')
    const year = dateArr[0]

    const timeArr = dateArr[1]!.split(':')
    const time = timeArr[0] + ':' + timeArr[1]

    return year + ' ' + time
  } catch (error) {
    return '1999-01-01 08:00'
  }
}