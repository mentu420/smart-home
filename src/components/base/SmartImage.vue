<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref, useAttrs, useSlots, watch } from 'vue'
import materialStore from '@/store/materialStore'

defineOptions({ name: 'SmartImage' })

const attrs = useAttrs()
const { materialImages } = storeToRefs(materialStore())

// 原生调用
function getPhotolocalDone(ora, localUrl) {
  if (materialImages.value[ora]) return
  console.log('原生读取图片完成', ora, localUrl)
  materialImages.value = { ...materialImages.value, [ora]: localUrl }
}
// 原生方法挂载
window.getPhotolocalDone = getPhotolocalDone

// 先获取缓存本地资源路径，没有就下载图片
const onLoad = (key) => {
  if (materialImages.value[key]) return
  window?.jdwl?.getPhotolocal(key, key)
}

watch(
  () => attrs,
  (val) => {
    if (!val.src) return
    console.log('开始获取图片', val.src)
    onLoad(val.src)
  },
  { immediate: true }
)

const src = computed(() => {
  console.log('本地已经有图片', materialImages.value[attrs?.src])
  return materialImages.value[attrs?.src] || attrs?.src
})
</script>

<template>
  <van-image v-bind="attrs" :src="src">
    <template #error>
      <slot name="error"></slot>
    </template>
  </van-image>
</template>
