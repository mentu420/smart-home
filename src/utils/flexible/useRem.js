import { onActivated, ref } from 'vue'

import useWinResize from './useWinResize'
/**
 *
 *
 */
export default function useSize() {
  const htmlFontSize = ref(16)
  const setRem = () => {
    const baseSize = window.screen.width >= 768 ? 10 : 16
    const uiWidth = 375
    const clientWidth = document.documentElement.clientWidth
    const scale = clientWidth / uiWidth
    const fontSize = parseInt(baseSize * Math.min(scale, 2)) + 'px'
    htmlFontSize.value = fontSize
    if (window.document) {
      window.document.documentElement.style.fontSize = fontSize
    }
  }
  useWinResize(setRem)
  onActivated(() => {
    setRem()
  })
  return {
    htmlFontSize,
  }
}
