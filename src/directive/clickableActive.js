/**
 * use
 * <tag v-clickable-active="{ color: 'red', fontSize: '16px' }" >点击复制</tag>
 *
 * @binding.value {object} 样式对象{ color: 'red', fontSize: '16px' }
 * **/

const setActiveStyle = (el, value) => {
  el.activeStyleObject = value || { opacity: 0.5 }
  el.oldStyleObject = Object.assign(
    {},
    ...Object.keys(el.activeStyleObject).map((key) => ({ [key]: el.style[key] }))
  )
}

const setStyle = (el, styleObject) => {
  Object.keys(styleObject).forEach((styleKey) => {
    el.style[styleKey] = styleObject[styleKey]
  })
}

export default {
  beforeMount(el, binding) {
    setActiveStyle(el, binding.value)

    el.addEventListener('touchstart', () => setStyle(el, el.activeStyleObject))
    el.addEventListener('touchend', () => setStyle(el, el.oldStyleObject))
  },
  update(el, binding) {
    console.log('123456', binding.value)
    setActiveStyle(el, binding.value)
  },
  unmounted(el) {
    el.removeEventListener('touchstart', () => {})
    el.removeEventListener('touchend', () => {})
  },
}
