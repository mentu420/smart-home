<script setup>
import { ref } from 'vue'

import DateRepeatSheet from '@/components/common/DateRepeatSheet.vue'

const emits = defineEmits(['change'])

const show = ref(false)
const executionTime = ref(['12', '00'])
const timeRepeat = ref({})
const scopeData = ref({})

const open = (data) => {
  scopeData.value = data
  if (data.time) executionTime.value = data.time
  if (data.timeRepeat) timeRepeat.value = data.timeRepeat
  show.value = true
}

const close = () => (show.value = false)

const onConfirm = ({ selectedValues }) => {
  close()

  emits('change', { time: selectedValues.join(':'), timeRepeat: timeRepeat.value }, scopeData.value)
}

defineExpose({ open })
</script>

<template>
  <van-popup v-model:show="show" round safe-area-inset-bottom position="bottom">
    <div class="py-4">
      <van-time-picker v-model="executionTime" title="指定时间" @confirm="onConfirm" />
      <DateRepeatSheet v-model="timeRepeat" />
    </div>
  </van-popup>
</template>
