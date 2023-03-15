<script setup>
import { ref, reactive, computed, useAttrs, useSlots } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: () => ['12', '00', '00'],
  },
})

const emits = defineEmits(['update:modelValue'])

const attrs = useAttrs()
const slots = useSlots()

const showPicker = ref(false)

const currentTime = computed({
  get: () => props.modelValue,
  set: (val) => {
    if (attrs['onUpdate:modelValue']) emits('update:modelValue', val)
  },
})

const slotsKeys = computed(() =>
  Object.keys(slots).filter((key) =>
    ['default', 'title', 'confirm', 'cancel', 'option', 'columns-top', 'columns-bottom'].includes(
      key
    )
  )
)

const open = () => (showPicker.value = true)

const close = () => (showPicker.value = false)

defineExpose({ open, close })
</script>

<template>
  <van-popup v-model:show="showPicker" round position="bottom" teleport="body">
    <van-time-picker v-model="currentTime" v-bind="attrs" @cancel="showPicker = false">
      <template v-for="slotName of slotsKeys" #[slotName]>
        <slot :name="slotName"></slot>
      </template>
    </van-time-picker>
  </van-popup>
</template>
