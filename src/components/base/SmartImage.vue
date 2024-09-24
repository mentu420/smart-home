<script setup>
import { computed, isRef, ref, useAttrs, useSlots, watch } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'
import { storeToRefs } from 'pinia'
import materialStore from '@/store/materialStore'

defineOptions({ name: 'SmartImage' })

const props = defineProps({
  compressOptions: {
    type: [Object, Boolean],
    default: () => ({
      quality: 0.7,
    }),
  },
})

const attrs = useAttrs()
const { materialImages } = storeToRefs(materialStore())

// 原生调用
function getPhotolocalDone(localUrl) {
  if (materialImages.value[localUrl]) return
  console.log('原生读取图片完成', localUrl)
  materialImages.value = { ...materialImages.value, [attrs.src]: localUrl }
  console.log('更新静态资源库', materialImages.value)
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
  const result = materialImages.value[attrs?.src] || attrs?.src
  console.log('图片最终路径', result)
  return result
})
</script>

<template>
  <van-image v-bind="attrs" :src="src">
    <template #error>
      <slot name="error">
        <van-icon class="!text-[32px]" name="photo-fail" />
      </slot>
    </template>
  </van-image>
</template>
