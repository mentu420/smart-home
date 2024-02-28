<script setup>
import { useRect } from '@vant/use'
import { ref, computed } from 'vue'

import { getPlacement } from './useTrigger'

const props = defineProps({
  actions: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['change', 'update:modelValue'])

const modeRef = ref(null)
const showMode = ref(false)

const placement = computed(() => getPlacement(modeRef.value))

const use = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})

const currentModeItem = computed(() => props.actions.find((action) => action.useEn == use.value))

function onModelSelect(action) {
  if (props.disabled) return
  use.value = action.useEn
  showMode.value = false
  emits('change', action)
}

function onToggle() {
  if (props.disabled) return
  showMode.value = !showMode.value
}
</script>

<template>
  <div ref="modeRef" class="mode w-full">
    <van-popover v-model:show="showMode" :placement="placement" trigger="manual">
      <template #reference>
        <div class="flex w-full items-center justify-between p-3" @click="onToggle">
          <div class="mr-4 flex-shrink-0">
            <p>{{ props.title }}</p>
            <p class="text-xs text-gray-400">{{ currentModeItem?.useCn }}</p>
          </div>
          <IconFont :icon="`${currentModeItem?.use}-${currentModeItem?.useEn}`" />
        </div>
      </template>
      <van-cell-group>
        <van-cell
          v-for="modeItem in actions"
          :key="modeItem.useEn"
          :title="modeItem?.useCn"
          clickable
          @click="onModelSelect(modeItem)"
        >
          <template #icon>
            <IconFont class="mr-2" :icon="`${modeItem?.use}-${modeItem?.useEn}`" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-popover>
  </div>
</template>

<style lang="scss" scoped>
.mode:deep(.van-popover__wrapper) {
  display: block;
  width: 100%;
}
</style>
