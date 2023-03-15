import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import { getStorage, removeStorage, setStorage } from '@/utils/storage.js'

export default defineStore('sceneStore', () => {
  // 统一token处理
  const sceneCreateItem = ref({})

  const updateSceneCreateItem = (palyload) =>
    (sceneCreateItem.value = { ...sceneCreateItem.value, ...palyload })

  const clearSceneCreateItem = () => (sceneCreateItem.value = {})

  return { sceneCreateItem, updateSceneCreateItem, clearSceneCreateItem }
})
