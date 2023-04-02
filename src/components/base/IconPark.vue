<template>
  <render />
</template>
<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { h, useAttrs } from 'vue'

const attrs = useAttrs()

const render = () => {
  const config = {
    ...attrs,
    key: new Date().valueOf(), //解决组件不更新
  }
  return h(IconPark, config)
}
</script>
