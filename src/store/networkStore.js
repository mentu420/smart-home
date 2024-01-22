import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'

export default defineStore('network', () => {
  const isOnline = ref(navigator.onLine)

  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
  }
  // 在应用程序启动时添加全局事件监听器
  const onInit = () => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  }
  // 在应用程序关闭时移除全局事件监听器
  const onReset = () => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  }

  onMounted(onInit)

  return { isOnline }
})
