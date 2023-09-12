<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, computed, toRefs, watch } from 'vue'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import deviceStore from '@/store/deviceStore'
const { useGetDeviceItem, deviceUseList } = deviceStore()

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['update:modelValue', 'update:hue'])

const deviceItem = computed(() => useGetDeviceItem(props.id))

const config = ref({ brightness: 0, hue: 90 })

const brightness = ref(0)
const hue = ref(100)
const colorPickerRef = ref(null)

const status = computed(() => (brightness.value == 0 ? false : true))

const colorConfig = reactive({
  hue: 90,
  saturation: 100,
  luminosity: 50,
  alpha: 1,
  gradientColors: ['to right', '#FB8C1A', '#FAF6F7'],
  gradientType: 'linear',
})

const toggle = () => {
  brightness.value = brightness.value == 0 ? 100 : 0
}
</script>

<template>
  <div>
    <van-cell-group style="background: transparent" inset :border="false">
      <van-cell
        class="mt-4 rounded-xl"
        center
        :title="status ? '已开启' : '已关闭'"
        :border="false"
      >
        <template #right-icon>
          <IconFont
            :class="status ? 'text-primary' : 'text-gray-400'"
            icon="switch"
            @click="toggle"
          />
        </template>
      </van-cell>
      <van-cell
        v-if="deviceUseList(props.id)?.includes('brightness')"
        class="mt-4 rounded-xl"
        center
        title="亮度"
        :label="`${brightness}%`"
        :border="false"
        title-style="flex:0 0 auto"
      >
        <div class="h-10 p-4 pl-8">
          <van-slider v-model="brightness" />
        </div>
      </van-cell>
      <van-cell
        v-if="deviceUseList(props.id)?.includes('colourTemperature')"
        class="mt-4 rounded-xl"
        center
        title="色温"
        :label="`${hue}K`"
        clickable
        :border="false"
        @click="colorPickerRef.open()"
      >
        <template #right-icon>
          <span class="h-6 w-6 rounded-full bg-yellow-400"></span>
        </template>
      </van-cell>
    </van-cell-group>
    <ColorPicker ref="colorPickerRef" v-bind="colorConfig">
      <template #default="{ angle }">
        {{ angle }}
      </template>
    </ColorPicker>
  </div>
</template>
