<script setup>
import { ref } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: 'lamp-fill',
  },
  label: {
    type: String,
    default: '',
  },
  status: {
    type: [String, Number], //0 关 1 开 2离线
    default: 0,
  },
})

const emits = defineEmits(['click-right-icon'])

const openConfig = () => emits('click-right-icon')
</script>

<template>
  <div v-clickable-active class="rounded-lg bg-white p-3 space-y-2">
    <div class="flex justify-between">
      <slot name="icon">
        <IconFont class="text-primary" :icon="props.icon" />
      </slot>
      <slot name="right-icon">
        <IconFont class="text-gray-300 text-[10px]" icon="more-round" @click.stop="openConfig" />
      </slot>
    </div>
    <div>{{ props.label }}</div>
    <div class="text-sm text-gray-400">{{ ['关', '开', '离线'][props.status] }}</div>
  </div>
</template>
