import localforage from 'localforage'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const storeName = 'materialStore'

export default defineStore(storeName, () => {
  const materialImages = ref({}) //图片对象 key：网络url value:本地资源路径

  const init = async () => {
    const storeRes = JSON.parse(await localforage.getItem(storeName))
    materialImages.value = storeRes?.materialImages ?? {}
    console.log('静态资源初始化完成', materialImages.value)
  }

  return { materialImages, init }
})
