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

// 原生调用 ios 返回两个参数，第一个是网络图片路径，第二个是本地文件路径，android只返回一个参数本地图片路径
function getPhotolocalDone(src, dir) {
  const image = dir || src
  if (materialImages.value[image]) return
  materialImages.value = { ...materialImages.value, [attrs.src]: image }
  console.log('图片最终路径', image)
}
// 原生方法挂载
window.getPhotolocalDone = getPhotolocalDone

// 先获取缓存本地资源路径，没有就下载图片
const onLoad = (key) => {
  const dir = materialImages.value[key]
  if (dir && !dir.includes('http')) return
  window?.jdwl?.getPhotolocal(key, key)
}

watch(
  () => attrs,
  (val) => {
    if (!val.src) return
    onLoad(val.src)
  },
  { immediate: true }
)

const src = computed(() => materialImages.value[attrs?.src] || attrs?.src)
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
