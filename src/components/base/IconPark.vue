<template>
  <render />
</template>
<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { h } from 'vue'

const props = defineProps({
  type: { type: String, required: true },
  theme: { type: String, default: 'outline' },
  size: {
    type: [Number, String],
    default: '1em',
  },
  spin: {
    type: Boolean,
    default: false,
  },
  fill: {
    type: [String, Array],
    default: () => ['currentColor'],
  },
  park: {
    type: Boolean,
    default: false,
  },
})

const render = () => {
  const params = {
    theme: props.theme,
    size: props.size,
    fill: Array.isArray(props.fill) ? props.fill : [props.fill],
    spin: props.spin,
    key: new Date().valueOf(), //解决组件不更新
  }
  return h(IconPark, { type: props.type, ...params })
}
</script>
