<template>
  <svg class="icon" aria-hidden="true">
    <use class="icon-use" :xlink:href="`#icon-${icon}`"></use>
  </svg>
</template>

<script>
import '@/assets/iconfonts/iconfont.js'

export default {
  name: 'IconFont',
  props: {
    icon: {
      type: String,
      default: 'warn',
    },
    size: {
      type: [String, Number],
      default: '20px',
    },
    color: {
      type: String,
      default: '#333',
    },
  },
  computed: {
    fontsize() {
      if (typeof this.size === 'number') return this.size + 'px'
      return this.size
    },
    currentColor() {
      if (!this.color) return '#007aff'
      return this.color
    },
  },
}
</script>

<style lang="scss" scoped>
.icon {
  font-size: v-bind(fontsize);
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
  fill: v-bind(currentColor);
}
</style>
