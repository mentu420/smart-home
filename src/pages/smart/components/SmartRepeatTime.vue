<script setup>
import { ref, computed } from 'vue'
import { sortTimeArrayWithDayjs } from '@/utils/date'

import DateRepeatSheet from '@/components/common/DateRepeatSheet.vue'

const props = defineProps({
  type: { type: String, default: 'time' }, //time or timerange
})

const emits = defineEmits(['change'])

const show = ref(false)
const executionTime = ref(['12', '00'])
const timeRepeat = ref({})
const scopeData = ref({})
const startTime = ref(['12', '00'])
const endTime = ref(['12', '00'])
const innderProps = ref({})
const activeTab = ref(0)

const getProps = computed(() => ({ ...props, ...innderProps.value }))

const setProps = (props) => {
  innderProps.value = props
}

const open = (data) => {
  scopeData.value = data
  if (data.time) executionTime.value = data.time
  if (data.timeRange) {
    startTime.value = data.timeRange[0]?.split(':')
    endTime.value = data.timeRange[1]?.split(':')
  }
  if (data.activeTab) activeTab.value = data.activeTab
  if (data.timeRepeat) timeRepeat.value = data.timeRepeat
  show.value = true
}

const close = () => (show.value = false)

const onConfirm = (values = {}) => {
  close()
  const { selectedValues } = values
  const timerange = sortTimeArrayWithDayjs([startTime.value?.join(':'), endTime.value?.join(':')])
  emits(
    'change',
    { time: selectedValues?.join(':'), timerange, timeRepeat: timeRepeat.value },
    scopeData.value
  )
}

defineExpose({ open, setProps })
</script>

<template>
  <van-popup v-model:show="show" round safe-area-inset-bottom position="bottom">
    <div class="py-4">
      <van-time-picker
        v-if="getProps.type === 'time'"
        v-model="executionTime"
        title="指定时间"
        @confirm="onConfirm"
      />
      <van-picker-group
        v-else
        v-model:active-tab="activeTab"
        title="预约时间"
        :tabs="['开始时间', '结束时间']"
        next-step-text="下一步"
        @confirm="onConfirm"
        @cancel="close"
      >
        <van-time-picker v-model="startTime" />
        <van-time-picker v-model="endTime" />
      </van-picker-group>
      <DateRepeatSheet v-model="timeRepeat" />
    </div>
  </van-popup>
</template>
