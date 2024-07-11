<script setup>
import { inject, watchEffect, ref, useAttrs, watch } from 'vue'
import { getPhoto, takePhoto } from '@/utils/native/nativeApi'
import { convertFiles } from '@/utils/dealImg'

const attrs = useAttrs()
const props = defineProps({
  actions: { type: Array, default: () => [] },
  compressor: { type: String, default: '0' }, //是否压缩图片
  maxlength: { type: [String, Number], default: 0 },
})
const emit = defineEmits(['select', 'afterRead'])

const show = ref(false)

const nativeFiles = inject('nativeFiles')

watch(
  () => nativeFiles.value,
  async (val, oldVal) => {
    if (val && val !== oldVal) {
      try {
        const files = await Promise.all(
          val.map(async (base64) => {
            const content = `data:image/jpeg;base64,${base64}`
            const file = await convertFiles(content)
            console.log('convertFiles', file.name)
            return { content, file, message: '', status: 'uploading' }
          })
        )
        console.log('files', files)
        emit('afterRead', files)
      } catch (error) {
        console.error('Error processing files:', error)
      }
    }
  }
)

const innerActions = [
  {
    name: '相机',
    icon: 'video',
    type: 'onAppCamera',
    nativeCallback: (base64) => {
      console.log('相机结果', base64)
      emit('afterRead', [base64])
    },
  },
  {
    name: '相册',
    icon: 'photo',
    type: 'onAppAlbum',
    nativeCallback: (base64List) => {
      console.log('相册结果', base64List)
      emit('afterRead', base64List)
    },
  },
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

function open() {
  show.value = true
}

function onSelect(action, index) {
  if (action.disabled || action.loading) return
  emit('select', action, index)

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
