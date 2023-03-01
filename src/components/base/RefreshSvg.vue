<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  size: {
    type: [Number, String],
    default: 20,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:loading', 'click'])

const refreshing = computed({
  get: () => props.loading,
  set: (val) => emits('update:loading', val),
})

const fontsize = computed(() => {
  if (typeof props.size === 'number') return props.size + 'px'
  return props.size
})

const onClick = () => {
  refreshing.value = true
  emits('click')
}
</script>

<template>
  <svg viewBox="0 0 50 50" class="loading-svg" @click="onClick">
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      class="path"
      :class="{ active: refreshing }"
    ></circle>
    <polyline
      v-if="!refreshing"
      class="polyline"
      points="
            35 0
            40 12
            30 15
        "
    ></polyline>
  </svg>
</template>

<style scoped lang="scss">
.loading-svg {
  font-size: v-bind(fontsize);
  width: 2em; /*设置svg显示区域大小*/
  height: 2em;
  cursor: pointer;
}

.path {
  stroke: #fff; /*给画笔设置一个颜色*/
  stroke-width: 4; /*设置线条的宽度*/
  stroke-dasharray: 110, 126; /*设置实现长95，虚线长126*/
  stroke-dashoffset: 0; /*设置虚线的偏移位置*/
  &.active {
    animation: loading-dash 1.5s ease-in-out infinite;
  }
}
.polyline {
  stroke: #fff;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 126;
    stroke-dashoffset: 0;
  }
  to {
    stroke-dasharray: 126, 6;
    stroke-dashoffset: -120px;
  }
}
</style>
