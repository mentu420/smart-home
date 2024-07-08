<script setup>
import { computed, ref, useAttrs, watch } from 'vue'
import { getPhoto, takePhoto } from '@/utils/native/nativeApi'
import { setNativeMethods } from '@/utils/native/fn'

const attrs = useAttrs()
const props = defineProps({
  actions: { type: Array, default: () => [] },
  compressor: { type: String, default: '0' }, //是否压缩图片
  maxlength: { type: [String, Number], default: 0 },
})
const emits = defineEmits(['select', 'afterRead'])

const show = ref(false)

const innerActions = [
  {
    name: '相机',
    icon: 'video',
    type: 'onAppCamera',
    nativeCallback: (base64) => {
      console.log('相机结果', base64)
      emits('afterRead', [base64])
    },
  },
  {
    name: '相册',
    icon: 'photo',
    type: 'onAppAlbum',
    nativeCallback: (base64List) => {
      console.log('相册结果', base64List)
      emits('afterRead', base64List)
    },
  },
]

/**
 * 3: this.onAppResume,
        4: this.onAppPause,
        5: this.onAppCamera,
        6: this.onAppCamera
 * **/
window.onMessage = (type, base64) => {
  console.log(type, base64)
}

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

function open() {
  show.value = true
}

function onSelect(action, index) {
  if (action.disabled || action.loading) return
  emits('select', action, index)

  if (action.type === 'onAppCamera') {
    // 调用原生相机
    takePhoto(props.compressor, action.type)
    //onAppCamera 原生回调
  } else if (action.type === 'onAppAlbum') {
    getPhoto(Number(props.maxlength), props.compressor, action.type)
    //onMessage 原生调用
  }
}

defineExpose({ open, close })
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
