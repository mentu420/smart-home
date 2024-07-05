<script setup>
import { computed, ref, useAttrs, watch } from 'vue'
import { getPhoto, takePhoto } from '@/utils/native/nativeApi'
import { setNativeMethods } from '@/utils/native/fn'

const attrs = useAttrs()
const props = defineProps({
  actions: { type: Array, default: () => [] },
  compressor: { type: string, default: '0' }, //是否压缩图片
  maxCount: { type: [String, Number], default: 0 },
})
const emits = defineEmits(['select'])

const show = ref(false)

function onAppCamera(base64) {}

function onAppAlbum(base64) {}

const innerActions = [
  { name: '相机', icon: 'cart-o', type: 'onAppCamera' },
  { name: '相册', icon: 'photo-o', type: 'onAppAlbum' },
]

const sheetActions = ref(innerActions)

watch(
  () => props.actions,
  (val) => {
    if (!val || Array.isArray(val)) return
    sheetActions.value = [...val, ...sheetActions.value]
  }
)

function close() {
  show.value = false
}

// setNativeMethods()

function onSelect(action, index) {
  if (action.disabled || action.loading) return
  emits('select', action, index)

  if (action.type === 'camera') {
    // 调用原生相机
    takePhoto(props.compressor, action.type)
    //onAppCamera 原生回调
  } else if (action.type === 'album') {
    getPhoto(Number(props.maxCount), props.compressor, action.type)
    //onMessage 原生调用
  }
}
</script>

<template>
  <van-action-sheet
    v-model:show="show"
    :actions="sheetActions"
    cancel-text="取消"
    close-on-click-action
    v-bind="attrs"
    teleport="#app"
    @cancel="close"
    @select="onSelect"
  />
</template>
