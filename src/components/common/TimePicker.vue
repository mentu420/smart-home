<script setup>
import { ref, reactive, computed, useAttrs, useSlots } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: () => ['12', '00', '00'],
  },
})

const emits = defineEmits(['update:modelValue', 'select'])

const attrs = useAttrs()
const slots = useSlots()
const scopeData = ref(null) // 打开picker时传的数据

const showPicker = ref(false)

const currentTime = computed({
  get: () => props.modelValue,
  set: (val) => {
    if (attrs['onUpdate:modelValue']) emits('update:modelValue', val)
  },
})

function open(data) {
  showPicker.value = true
  scopeData.value = data
}

function close() {
  showPicker.value = false
}

function onConfirm(values) {
  console.log(123)
  close()
  emits('select', values, scopeData.value)
}

defineExpose({ open, close })
</script>

<template>
  <van-popup v-model:show="showPicker" round position="bottom" teleport="body">
    <van-time-picker
      v-model="currentTime"
      v-bind="attrs"
      @cancel="showPicker = false"
      @confirm="onConfirm"
    >
      <template v-for="(_, scopeSlotName) in slots" :key="scopeSlotName" #[scopeSlotName]="scope">
        <slot :name="scopeSlotName" v-bind="scope" />
      </template>
    </van-time-picker>
  </van-popup>
</template>
