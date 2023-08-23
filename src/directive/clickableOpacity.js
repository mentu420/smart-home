/**
 * use
 * <button v-clickable-opacity="msg" >点击复制</button>
 * **/

const onTouchStart = (event, opacity) => {
  event.target.style.opacity = opacity
}

const onTouchEnd = (event) => {
  event.target.style.opacity = 1
}

export default {
  beforeMount(el, binding) {
    el.targetContent = binding.value || 0.5
    el.style.opacity = 1
    el.addEventListener('touchstart', (e) => onTouchStart(e, el.targetContent))
    el.addEventListener('touchend', onTouchEnd)
  },
  update(el, binding) {
    // 实时更新最新的目标内容
    el.targetContent = binding.value
  },
  unmounted(el) {
    el.removeEventListener('touchstart', (e) => onTouchStart(e, el.targetContent))
    el.removeEventListener('touchend', onTouchEnd)
  },
}
