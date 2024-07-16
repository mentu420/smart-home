<script setup>
import { computed, isRef, ref, useAttrs, useSlots, watch } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'

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
const materialImages = ref(getStorage('materialImages') ?? {})

// 原生调用
function getPhotolocalDone(ora, localUrl) {
  if (materialImages.value[ora]) return
  // console.log('原生读取图片完成', ora, localUrl)
  materialImages.value = { ...materialImages.value, [ora]: localUrl }
  setStorage('materialImages', materialImages.value)
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
    // console.log('开始获取图片', val.src)
    onLoad(val.src)
  },
  { immediate: true }
)

const src = computed(() => {
  return materialImages.value[attrs?.src] || attrs?.src
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
