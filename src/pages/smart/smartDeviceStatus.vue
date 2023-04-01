<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import AirCoolerTrigger from '@/components/common/AirCoolerTrigger.vue'
import ClickableOpacity from '@/components/layout/clickableOpacity.vue'
import deviceStore from '@/store/deviceStore'

const route = useRoute()
const router = useRouter()
const status = ref(true)
const light = ref(100)
const hue = ref(3000)
const colorPickerRef = ref(null)
const pause = ref(false)
const iconRef = ref(null)

const { deviceClassify } = storeToRefs(deviceStore())

const colorConfig = reactive({
  hue: 90,
  saturation: 100,
  luminosity: 50,
  alpha: 1,
  gradientColors: ['to right', '#FB8C1A', '#FAF6F7'],
  gradientType: 'linear',
})

const temp = ref(18)

onMounted(() => {
  console.log('iconRef', iconRef.value.parentElement)
})
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="设备名称">
      <template #right>
        <IconPark type="more" @click="router.push({ path: '/smartDeviceInfo' })" />
      </template>
    </HeaderNavbar>
    <section>
      <van-image
        width="100vw"
        height="100vw"
        fit="cover"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      />
      <van-cell-group style="background: transparent" inset :border="false">
        <van-cell
          class="mt-4 rounded-xl"
          center
          :title="status ? '已开启' : '已关闭'"
          :border="false"
        >
          <template #right-icon>
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full leading-none"
              :class="{ 'bg-theme-color': status }"
              @click="status = !status"
            >
              <IconPark size="24" type="power" theme="filled" :fill="status ? '#fff' : '#999'" />
            </div>
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group style="background: transparent" inset :border="false">
        <van-cell
          class="mt-4 rounded-xl"
          center
          :title="status ? '已开启' : '已关闭'"
          :border="false"
        >
          <template #right-icon>
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full leading-none"
              :class="{ 'bg-theme-color': status }"
              @click="status = !status"
            >
              <IconPark size="24" type="power" theme="filled" :fill="status ? '#fff' : '#999'" />
            </div>
          </template>
        </van-cell>
        <van-cell
          class="mt-4 rounded-xl"
          center
          title="亮度"
          :label="`${light}%`"
          :border="false"
          title-style="flex:0 0 auto"
        >
          <div class="h-10 p-4 pl-8">
            <van-slider v-model="light" @change="(value) => (status = value != 0)" />
          </div>
        </van-cell>
      </van-cell-group>
      <van-cell-group style="background: transparent" inset :border="false">
        <van-cell class="mt-4 rounded-xl" center :border="false">
          <template #icon>
            <iconpark-icon ref="iconRef" size="2em" name="tubiao-chuanglian"></iconpark-icon>
          </template>
          <div class="flex items-center justify-center">
            <van-icon
              size="3em"
              name="pause-circle"
              :color="pause ? '#e39334' : '#999'"
              @click="pause = !pause"
            />
          </div>
          <template #right-icon>
            <iconpark-icon size="2em" name="chuanglianguanbi"></iconpark-icon>
          </template>
        </van-cell>
        <van-cell
          class="mt-4 rounded-xl"
          center
          title="开合度"
          :label="`${light}%`"
          :border="false"
          title-style="flex:0 0 auto"
        >
          <div class="h-10 p-4 pl-8">
            <van-slider v-model="light" @change="(value) => (status = value != 0)" />
          </div>
        </van-cell>
      </van-cell-group>
      <van-cell-group style="background: transparent" inset :border="false">
        <van-cell
          class="mt-4 rounded-xl"
          center
          :title="status ? '已开启' : '已关闭'"
          :border="false"
        >
          <template #right-icon>
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full leading-none"
              :class="{ 'bg-theme-color': status }"
              @click="status = !status"
            >
              <IconPark size="24" type="power" theme="filled" :fill="status ? '#fff' : '#999'" />
            </div>
          </template>
        </van-cell>
        <van-cell
          class="mt-4 rounded-xl"
          center
          title="亮度"
          :label="`${light}%`"
          :border="false"
          title-style="flex:0 0 auto"
        >
          <div class="h-10 p-4 pl-8">
            <van-slider v-model="light" @change="(value) => (status = value != 0)" />
          </div>
        </van-cell>
        <van-cell
          class="mt-4 rounded-xl"
          center
          title="色温"
          :label="`${light}K`"
          clickable
          :border="false"
          @click="colorPickerRef.open()"
        >
          <template #right-icon>
            <span class="h-6 w-6 rounded-full bg-yellow-400"></span>
          </template>
        </van-cell>
      </van-cell-group>
      <AirCoolerTrigger v-model="temp" />
    </section>

    <ColorPicker ref="colorPickerRef" v-bind="colorConfig">
      <template #default="{ angle }">
        <div>
          <p>颜色</p>
          <p>{{ Math.round(angle) }}</p>
        </div>
      </template>
    </ColorPicker>
  </div>
</template>
