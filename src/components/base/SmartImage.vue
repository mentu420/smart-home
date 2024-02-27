<script setup>
import { computed, ref, useAttrs, watch } from 'vue'

defineOptions({ name: 'SmartImage' })

const attrs = useAttrs()
const localImage = ref(null)

// 原生调用
function getPhotolocalDone(ora, localUrl) {
  console.log('原生读取图片完成', localUrl)
  localImage.value = localUrl
}

window.getPhotolocalDone = getPhotolocalDone

const onLoad = () => {
  window?.jdwl?.getPhotolocal(attrs.src, 'img1')
}

const src = computed(() => localImage.value || attrs?.src)
</script>

<template>
  <van-image v-bind="attrs" :src="src" @load="onLoad" />
  <van-image v-bind="attrs" :src="localImage" />
</template>
