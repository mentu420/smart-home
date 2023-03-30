<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import ClickableOpacity from '@/components/layout/clickableOpacity.vue'

const route = useRoute()
const router = useRouter()
const status = ref(true)
const light = ref(100)
const hue = ref(3000)
const colorPickerRef = ref(null)

const colorConfig = reactive({
  hue: 90,
  saturation: 100,
  luminosity: 50,
  alpha: 1,
  gradientColors: ['to right', '#FB8C1A', '#FAF6F7'],
  gradientType: 'linear',
})
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="设备名称">
      <template #right>
        <icon-park type="more" @click="router.push({ path: '/smartDeviceInfo' })" />
      </template>
    </HeaderNavbar>
    <section>
      <van-image
        width="100vw"
        height="100vw"
        fit="cover"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      />
      <div class="p-4">
        <ClickableOpacity class="mb-4 flex items-center justify-between rounded-lg bg-white p-3">
          <div>
            {{ status ? '已开启' : '已关闭' }}
          </div>
          <div @click="status = !status">
            <div
              v-if="status"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-theme-color"
            >
              <icon-park size="24" type="power" theme="filled" fill="#fff" />
            </div>
            <div v-else class="flex h-10 w-10 items-center justify-center">
              <icon-park size="24" type="power" theme="filled" fill="#999" />
            </div>
          </div>
        </ClickableOpacity>
        <ClickableOpacity class="mb-4 flex items-center justify-between rounded-lg bg-white p-3">
          <div class="mr-4 flex-shrink-0">
            <p>亮度</p>
            <p class="text-xs text-gray-400">{{ light }}%</p>
          </div>
          <div class="flex-1 px-4">
            <van-slider v-model="light" />
          </div>
        </ClickableOpacity>
        <ClickableOpacity
          class="mb-4 flex items-center justify-between rounded-lg bg-white p-3"
          @click="colorPickerRef.open()"
        >
          <div class="mr-4 flex-shrink-0">
            <p>色温</p>
            <p class="text-xs text-gray-400">{{ hue }}K</p>
          </div>
          <div class="px-4">
            <p class="h-4 w-4 rounded-full bg-yellow-400"></p>
          </div>
        </ClickableOpacity>
        <ClickableOpacity class="mb-4 flex items-center justify-around rounded-lg bg-white p-3">
          <div>
            <van-icon name="minus" />
          </div>
          <div class="mr-4 flex-shrink-0 text-center">
            <p>16℃</p>
            <p class="text-xs text-gray-400">目标温度</p>
          </div>
          <div>
            <van-icon name="plus" />
          </div>
        </ClickableOpacity>
        <div class="flex justify-between space-x-4">
          <ClickableOpacity
            class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white p-3"
          >
            <div class="mr-4 flex-shrink-0">风速</div>
            <div class="px-4">
              <icon-park type="windmill-two" />
            </div>
          </ClickableOpacity>
          <ClickableOpacity
            class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white p-3"
          >
            <div class="mr-4 flex-shrink-0">
              <p>模式</p>
              <p class="text-xs text-gray-400">通风</p>
            </div>
            <div class="px-4">
              <icon-park type="air-conditioning" />
            </div>
          </ClickableOpacity>
        </div>
      </div>
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
