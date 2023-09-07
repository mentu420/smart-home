<script setup>
import { ref, computed, watch } from 'vue'

import deviceStore from '@/store/deviceStore'
import { debounce } from '@/utils/common'

const { useGetDeviceItem, deviceUseList } = deviceStore()

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['change'])

const min = ref(0)
const max = ref(100)

const deviceItem = computed(() => useGetDeviceItem(props.id), {
  onTrack(e) {
    const { columns = [] } = e.target
    if (columns.length == 0) return
    const { useValueRange = '0,100' } = columns.find((item) => item.use == 'percent') || {}
    const [minValue, maxValue] = useValueRange.split(',')
    min.value = minValue
    max.value = maxValue
  },
  onTrigger(e) {
    console.log('onTrigger', e)
  },
})
const config = ref({ degree: 0, stop: true, on: false, off: false })

const theme = '#e39334'

const onDeviceChange = debounce(() => {
  emits('change', config.value)
}, 500)

const toggle = () => {
  config.value = { ...config.value, stop: true, on: false, off: false }
  onDeviceChange()
}

const onLower = () => {
  config.value = { ...config.value, stop: false, on: false, off: true }
  onDeviceChange()
}

const onIncrease = () => {
  config.value = { ...config.value, stop: false, on: true, off: false }
  onDeviceChange()
}

const onSliderChange = (value) => {
  config.value = { ...config.value, degree: value }
  onDeviceChange()
}
</script>

<template>
  <van-cell-group style="background: transparent" inset :border="false">
    <van-cell class="mt-4 rounded-xl" center :border="false">
      <template #icon>
        <IconFont
          :class="config.off ? 'text-primary' : 'text-gray-400'"
          icon="curtain-off"
          @click="onLower"
        />
      </template>
      <div class="flex items-center justify-center leading-none">
        <IconFont
          :class="config.stop ? 'text-primary' : 'text-gray-400'"
          icon="stop"
          @click="toggle"
        />
      </div>

      <template #right-icon>
        <IconFont
          :class="config.on ? 'text-primary' : 'text-gray-400'"
          icon="curtain-on"
          @click="onIncrease"
        />
      </template>
    </van-cell>
    <van-cell
      v-if="deviceUseList(props.id)?.includes('percent')"
      class="mt-4 rounded-xl"
      center
      title="开合度"
      :label="`${config.degree}%`"
      :border="false"
      title-style="flex:0 0 auto"
    >
      <div class="h-10 p-4 pl-8">
        <van-slider v-model="config.degree" :min="min" :max="max" @change="onSliderChange" />
      </div>
    </van-cell>
  </van-cell-group>
</template>
