<script setup>
import { computed } from 'vue'

import './iconfont.js'

const props = defineProps({
  icon: {
    type: String,
    default: 'close',
  },
  size: {
    type: [String, Number],
    default: '1.4em',
  },
  color: {
    type: String,
    default: '#333',
  },
})

const fontsize = computed(() => {
  if (typeof this.size === 'number') return this.size + 'px'
  return this.size
})

const currentColor = computed(() => {
  if (!this.color) return 'currentColor'
  return this.color
})
</script>

<template>
  <svg class="icon" aria-hidden="true">
    <use class="icon-use" :xlink:href="`#icon-${icon}`"></use>
  </svg>
</template>

<style lang="scss" scoped>
.icon {
  font-size: v-bind(fontsize);
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
  fill: v-bind(currentColor);
  display: inline-block;
}
</style>
