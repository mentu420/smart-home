<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'

const route = useRoute()
const router = useRouter()
const checked = ref('1')
const showConfig = ref(false)
const configType = ref(0)
const light = ref(0)
const colorPickerRef = ref(null)

const openConfig = (index) => {
  configType.value = index
  showConfig.value = true
}
const color = reactive({
  hue: 90,
  saturation: 100,
  luminosity: 50,
  alpha: 1,
  gradientColors: ['to right', '#FB8C1A', '#FAF6F7'],
  gradientType: 'linear',
})

onMounted(() => {
  console.log('colorPickerRef', colorPickerRef.value)
})
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="设备配置" />

    <van-radio-group v-model="checked" class="mt-4">
      <van-cell-group inset>
        <van-cell clickable title="开" @click="checked = '1'">
          <template #right-icon>
            <van-radio name="1"> </van-radio>
          </template>
        </van-cell>
        <div class="pl-2">
          <van-cell clickable title="亮度" is-link @click="openConfig(0)"></van-cell>
          <van-cell clickable title="色温" is-link @click="openConfig(1)"></van-cell>
        </div>
        <van-cell clickable title="关" @click="checked = '2'">
          <template #right-icon>
            <van-radio name="2"> </van-radio>
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>

    <div class="fixed bottom-4 left-0 right-0 p-6">
      <van-button type="primary" block round @click="router.push({ path: '/smartSceneCreate' })">
        下一步
      </van-button>
    </div>

    <van-popup v-model:show="showConfig" round teleport="body" position="bottom">
      <ul class="py-4">
        <li v-if="configType == 0">
          <van-cell title="亮度" :boder="false">
            <template #right-icon>
              <van-icon name="success" size="26" @click="showConfig = false" />
            </template>
          </van-cell>
          <div class="flex h-40 items-center justify-center p-8">
            <div class="w-full">
              <van-slider v-model="light" min="1">
                <template #button>
                  <div class="w-10 rounded-full bg-white py-1 text-center text-theme-color shadow">
                    {{ light }}
                  </div>
                </template>
              </van-slider>
            </div>
          </div>
        </li>
        <li v-else>
          <van-cell title="色温">
            <template #right-icon>
              <van-icon name="success" size="26" @click="showConfig = false" />
            </template>
          </van-cell>
          <div class="flex items-center justify-center p-8">
            <color-picker ref="colorPickerRef" v-bind="color">
              <template #default="{ angle }">
                <div>
                  <p>颜色</p>
                  <p>{{ Math.round(angle) }}</p>
                </div>
              </template>
            </color-picker>
          </div>
        </li>
      </ul>
    </van-popup>
  </div>
</template>
