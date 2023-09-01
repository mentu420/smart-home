<script setup>
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
const showLigth = ref(false)

const openColor = () => {
  colorPickerRef.value.open()
}

const colorConfig = reactive({
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

const onSave = () => {
  router.push({ path: '/smart-scene-create' })
}
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
          <van-cell clickable title="亮度" is-link @click="showLigth = true"></van-cell>
          <van-cell clickable title="色温" is-link @click="openColor"></van-cell>
        </div>
        <van-cell clickable title="关" @click="checked = '2'">
          <template #right-icon>
            <van-radio name="2"> </van-radio>
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <div class="h-24"></div>
    <div class="fixed bottom-0 left-0 right-0 bg-white px-6 py-4">
      <van-button type="primary" block round @click="onSave"> 下一步 </van-button>
    </div>

    <van-popup v-model:show="showLigth" round teleport="body" position="bottom">
      <ul class="py-4">
        <li>
          <van-cell title="亮度" :boder="false">
            <template #right-icon>
              <van-icon name="success" size="26" @click="showLigth = false" />
            </template>
          </van-cell>
          <div class="flex h-40 items-center justify-center p-8">
            <div class="w-full">
              <van-slider v-model="light" min="1">
                <template #button>
                  <div class="w-10 rounded-full bg-white py-1 text-center text-primary shadow">
                    {{ light }}
                  </div>
                </template>
              </van-slider>
            </div>
          </div>
        </li>
      </ul>
    </van-popup>
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
