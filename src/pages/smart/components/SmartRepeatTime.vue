<script setup>
import { ref } from 'vue'

import WeekRepeat from '@/components/common/WeekRepeat.vue'

const emits = defineEmits(['change'])

const show = ref(false)
const executionTime = ref(['12', '00'])
const weekChecked = ref([0, 1, 2, 3, 4, 5, 6])
const scopeData = ref({})

const open = (data) => {
  scopeData.value = data
  if (data.time) executionTime.value = data.time
  if (data.week) weekChecked.value = data.week
  show.value = true
}

const close = () => (show.value = false)

const onConfirm = ({ selectedValues }) => {
  close()

  emits('change', { time: selectedValues.join(':'), week: weekChecked.value }, scopeData.value)
}

defineExpose({ open })
</script>

<template>
  <van-popup v-model:show="show" round safe-area-inset-bottom position="bottom">
    <div class="py-4">
      <van-time-picker v-model="executionTime" title="指定时间" @confirm="onConfirm" />
      <WeekRepeat v-model="weekChecked" />
    </div>
  </van-popup>
</template>
