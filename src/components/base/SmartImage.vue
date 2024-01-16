<script setup>
import { computed, ref, useAttrs } from 'vue'

import { acceptFileValidate, imageTypes } from '@/utils/common'

defineOptions({ name: 'SmartImage' })

const attrs = useAttrs()
const localImage = ref('')

const _attrs = computed(() => ({
  ...attrs,
  src: localImage.value == '' ? attrs?.src : localImage.value,
}))

const emits = defineEmits(['load', 'error'])

const onLoad = (e) => {
  emits('load')
}

function getPhotolocalDone(ora, localUrl) {
  localImage.value = localUrl
}

const onError = (e) => {
  if (acceptFileValidate(attrs.src, imageTypes)) window?.jdwl?.getPhotolocal(attrs.src, 'img1')
  emits('error', e)
}
</script>

<template>
  <van-image v-bind="_attrs" @load="onLoad" @error="onError" />
</template>
