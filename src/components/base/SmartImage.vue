<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref, useAttrs, watch } from 'vue'

import networkStore from '@/store/networkStore'
import { acceptFileValidate, imageTypes } from '@/utils/common'

defineOptions({ name: 'SmartImage' })

const attrs = useAttrs()
const localImage = ref('')
const _attrs = computed(() => ({
  ...attrs,
  src: localImage.value == '' ? attrs?.src : localImage.value,
}))
const { isOnline } = storeToRefs(networkStore())

function getPhotolocalDone(ora, localUrl) {
  console.log('原生读取图片完成', localUrl)
  localImage.value = localUrl
}

watch(
  () => isOnline.value,
  (val) => {
    if (val || !acceptFileValidate(attrs.src, imageTypes)) return
    console.log('原生准备读取本地图片', attrs.src)
    window?.jdwl?.getPhotolocal(attrs.src, 'img1')
  }
)
</script>

<template>
  <van-image v-bind="_attrs" />
</template>
