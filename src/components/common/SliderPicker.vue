<script setup>
import { ref, reactive, computed, useAttrs, useSlots } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['update:modelValue', 'confirm'])

const attrs = useAttrs()
const scopeData = ref(null)
const showPicker = ref(false)
const sliderValue = ref(0)

const popupAttrsKeys = ['click-overlay', 'click-close-icon', 'open', 'close', 'opened', 'closed']

const popupAttrs = computed(() =>
  Object.assign(
    { position: 'bottom', teleport: 'body', round: true },
    ...popupAttrsKeys.filter((key) => attrs[key]).map((key) => ({ [key]: attrs[key] }))
  )
)

function open(data) {
  showPicker.value = true
  scopeData.value = data
  sliderValue.value = data.modelValue || 0
}

function close() {
  showPicker.value = false
}

function onConfirm() {
  close()
  emits('confirm', sliderValue.value, scopeData.value)
}

defineExpose({ open, close })
</script>

<template>
  <van-popup v-model:show="showPicker" v-bind="popupAttrs">
    <van-cell :title="scopeData.title">
      <template #right-icon>
        <van-icon name="success" size="26" @click="onConfirm" />
      </template>
    </van-cell>
    <div class="h-[200px] pl-8 pr-10 flex justify-center items-center">
      <div class="flex-1">
        <van-slider v-model="sliderValue" v-bind="attrs" bar-height="4px">
          <template #button>
            <div class="px-4 py-1 rounded-full bg-[#e39334] text-white">{{ sliderValue }}</div>
          </template>
        </van-slider>
      </div>
    </div>
  </van-popup>
</template>
