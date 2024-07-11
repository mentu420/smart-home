<script setup>
import { inject, watchEffect, ref, useAttrs, watch, computed } from 'vue'
import { getPhoto, takePhoto } from '@/utils/native/nativeApi'
import { convertFiles } from '@/utils/dealImg'
import { filesUploader, controller } from '@/hooks/useUploader'
import { showDialog } from 'vant'
import { NATIVE_FILES } from '@/enums/nativeEnums'

const attrs = useAttrs()
const props = defineProps({
  show: { type: Boolean, default: false },
  actions: { type: Array, default: () => [] }, // 更多actions
  maxlength: { type: [String, Number], default: 0 },
  uploadOptions: { type: Object, default: () => {} },
  oneMaxCount: { type: Number, default: 1 },
  // 是否自动上传
  autoUpload: { type: Boolean, default: true },
  // 文件后缀 ['.pdf','.doc'] 配合accept使用，有些安装机型不支持 accept="image/*,.pdf" 写法
  fileExtension: { type: Array, default: () => [] },
  compressor: { type: String, default: '0' }, //是否压缩图片 0 压缩，1 原图
})
const emit = defineEmits(['afterRead', 'success', 'update:show'])

const visible = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val),
})
const nativeFiles = inject(NATIVE_FILES)

watch(
  () => nativeFiles.value,
  async (val, oldVal) => {
    if (val && val !== oldVal) {
      try {
        // sheetActions.value = sheetActions.value.map((item) => ({ ...item, loading: true }))
        const files = await Promise.all(
          val.map(async (base64) => {
            const content = `data:image/jpeg;base64,${base64}`
            const file = await convertFiles(content)
            return { content, file, message: '', status: 'uploading' }
          })
        )
        emit('afterRead', files)
        if (!props.autoUpload) return
        const fileList = await filesUploader(files, props.uploadOptions, {
          accept: attrs.accept,
          oneMaxCount: props.oneMaxCount,
          compressor: props.compressor,
          fileExtension: props.fileExtension,
        })
        emit('success', fileList)
      } catch (error) {
        console.error('Error processing files:', error)
      } finally {
        // sheetActions.value = sheetActions.value.map((item) => ({ ...item, loading: false }))
      }
    }
  }
)

const innerActions = [
  {
    name: '相机',
    icon: 'video',
    loading: false,
    callback: (action) => {
      takePhoto(props.compressor)
    },
  },
  {
    name: '相册',
    icon: 'photo',
    loading: false,
    callback: (action) => {
      getPhoto(Number(props.maxlength), props.compressor)
    },
  },
]

const sheetActions = ref(innerActions)

// watchEffect(() => {
//   sheetActions.value = [...(props.actions ?? []), ...sheetActions.value]
// })

const onBeforeClose = () => {
  if (sheetActions.value.some((action) => action.loading)) {
    showDialog({ title: '提示', message: '文件上传中...' })
    return false
  }
  return true
}

const onCancel = () => {
  console.log('取消请求', attrs)
  controller.abort('Canceled')
}
</script>

<template>
  <van-action-sheet
    v-model:show="visible"
    v-bind="attrs"
    :actions="[...(props.actions ?? []), ...sheetActions]"
    :close-on-click-overlay="false"
    :before-close="onBeforeClose"
    cancel-text="取消"
    close-on-click-action
    teleport="#app"
    @cancel="onCancel"
  />
</template>
