export default {
  beforeMount(el, binding) {
    const cb = binding.value
    el.$duration = binding.arg || 1500 // 获取长按时长, 默认3秒执行长按事件
    if (typeof cb !== 'function') return console.warn('v-press指令必须接收一个回调函数')
    let timer = null
    const add = (e) => {
      // 排除点击与右键情况, event.button: 0-左键  2-右键
      if (e.type === 'click' && e.button !== 0) return
      e.preventDefault()
      if (timer === null) {
        timer = setTimeout(() => {
          cb(e)
          timer = null
        }, el.$duration)
      }
    }
    const cancel = () => {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
    }

    // 添加计时器
    el.addEventListener('mousedown', add)
    el.addEventListener('touchstart', add)
    // 取消计时器
    el.addEventListener('click', cancel)
    el.addEventListener('mouseout', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)
  },
  updated(el, binding) {
    // 可以实时更新时长
    el.$duration = binding.arg
  },
  unmounted(el) {
    el.removeEventListener('mousedown', () => {})
    el.removeEventListener('touchstart', () => {})
    el.removeEventListener('click', () => {})
    el.removeEventListener('mouseout', () => {})
    el.removeEventListener('touchend', () => {})
    el.removeEventListener('touchcancel', () => {})
  },
}
