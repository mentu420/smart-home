<script setup>
import { computed, ref, useAttrs } from 'vue'

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
</script>

<template>
  <van-image v-bind="attrs" :src="localImage || attrs?.src" @load="onLoad" />
</template>
