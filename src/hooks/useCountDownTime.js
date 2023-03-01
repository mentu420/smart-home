// 用于倒计时，返回秒数
/**
 * @props
 * @key sessionStorage 存储的key
 * @duration 倒计时时长，默认60秒
 * @s 秒数 如果为空则获取倒计时秒数
 * **/

const useCountDownTime = ({ key, duration = 60, seconds }) => {
  if (seconds) {
    const result = JSON.stringify({ time: new Date().getTime(), s: seconds })
    sessionStorage.setItem(key, result)
  } else {
    const downTime = sessionStorage.getItem(key)
    if (!downTime) return 0
    sessionStorage.removeItem(key)
    const { time, s } = JSON.parse(downTime)
    const now = new Date().getTime()
    const timeDiff = (now - time) / 1000 //时差 秒
    const result = timeDiff - duration >= 0 ? 0 : s - timeDiff
    return result
  }
}

export default useCountDownTime
