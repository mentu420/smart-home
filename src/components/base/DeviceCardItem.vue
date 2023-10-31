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

const emits = defineEmits(['click-right-icon', 'click-icon'])

const onRightIconClick = () => emits('click-right-icon')

const onIconClcik = () => emits('click-icon')
</script>

<template>
  <div v-clickable-active class="rounded-lg bg-white p-3 space-y-2 relative">
    <div class="flex justify-between">
      <slot name="icon">
        <IconFont
          :class="props.status == 1 ? 'text-primary' : 'text-gray-400'"
          :icon="props.icon"
          @click.stop="onIconClcik"
        />
      </slot>
      <slot name="right-icon">
        <!-- <IconFont
          class="text-gray-300 text-[10px]"
          icon="more-round"
          @click.stop="onRightIconClick"
        /> -->
      </slot>
    </div>
    <slot>
      <div>{{ props.label }}</div>
    </slot>
    <div class="text-sm text-gray-400">{{ ['关', '开', '离线'][props.status] }}</div>
  </div>
</template>
