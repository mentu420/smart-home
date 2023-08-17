<script setup>
import { useAttrs } from 'vue'

import './assets/iconfont.js'

const props = defineProps({
  icon: {
    type: String,
    default: 'close',
  },
})
const attrs = useAttrs()
</script>

<template>
  <svg class="icon" aria-hidden="true" v-bind="attrs">
    <use :xlink:href="`#icon-${props.icon}`"></use>
  </svg>
</template>

<style lang="scss" scoped>
.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
