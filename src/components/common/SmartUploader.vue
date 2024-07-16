<script setup>
import { ref, reactive, computed, useAttrs, useSlots } from 'vue'
import { showConfirmDialog, showDialog, showToast } from 'vant'

import { AUDIO_TYPES } from '@/enums/fileType'
import {
  acceptFileValidate,
  videoTypes,
  imageTypes,
  isObjectString,
  stringToArray,
} from '@/utils/common'
import NativeUploader from '@/components/common/NativeUploader.vue'
import { isRN } from '@/utils/native/nativeApi'
import { filesUploader, setError } from '@/hooks/useUploader'
import { compressImage } from '@/utils/dealImg'

const attrs = useAttrs()
const slots = useSlots()

const props = defineProps({
  uploadOptions: {
    type: Object,
    default: () => {},
  },
  modelValue: {
    type: [Array, String],
    default: () => [],
  },
  //一次最多可以上传几个文件
  oneMaxCount: {
    type: Number,
    default: 1,
  },
  // 是否自动上传
  autoUpload: {
    type: Boolean,
    default: true,
  },
  // 文件后缀 ['.pdf','.doc'] 配合accept使用，有些安装机型不支持 accept="image/*,.pdf" 写法
  fileExtension: {
    type: Array,
    default: () => [],
  },
  stringSeparator: {
    type: String,
    default: null,
  },
  actions: { type: Array, default: () => [] },
  compressor: { type: String, default: '0' }, //是否压缩图片 0 压缩，1 原图
})

const emit = defineEmits(['update:modelValue', 'success', 'error', 'update:loading'])

const showSheet = ref(false)
const uploaderRef = ref(null)
const uploading = ref(false)

const getOriginType = (origin) => Object.prototype.toString.call(origin)

const createFileItem = (origin) => {
  const originType = getOriginType(origin)
  const fileItem = {
    uid: Date.now() + String(Math.random()).substr(3, 6),
  }
  if (originType === '[object File]') {
    return {
      ...fileItem,
      url: origin.url,
      file: origin,
      name: origin.name,
    }
  } else if (originType === '[object String]') {
    return {
      ...fileItem,
      url: origin,
      file: null,
      name: origin.split('/').slice(-1)[0],
    }
  } else {
    return {
      ...fileItem,
      ...origin,
    }
  }
}

// 初始化文件列表
const initFileList = (value = '') => {
  if (!value) return []
  if (typeof value === 'string') {
    if (!isObjectString(value) && props.stringSeparator) {
      value = stringToArray(value, props.stringSeparator)
    }
  }
  return value.map((item) => createFileItem(item))
}

const fileList = computed({
  get: () => {
    return initFileList(props.modelValue)
  },
  set: (val) => {
    let list = val
    if (val.length > 0 && attrs.accept) {
      const fileTypeList = getAcceptFileTypes(attrs.accept)
      list = val.filter((fileItem) => {
        return acceptFileValidate(fileItem?.file?.name || fileItem?.url, fileTypeList)
      })
    }
    const originType = getOriginType(props.modelValue)
    // 处理文件格式
    if (['[object String]', '[object Array]'].includes(originType) && props.stringSeparator) {
      list = list.map((item) => item.url).join(props.stringSeparator)
    }
    emit('update:modelValue', list)
  },
})

const getAcceptFileTypes = (accept) => {
  const acceptList = accept.split(',')
  return [
    ...acceptList
      .map((acceptItem) => {
        if (acceptItem.includes('*')) {
          const audioTypes = Object.keys(AUDIO_TYPES).map((item) => item.replace('.', ''))
          return { 'image/*': imageTypes, 'video/*': videoTypes, 'audio/*': audioTypes }[acceptItem]
        } else if (acceptItem.includes('.')) {
          return acceptItem.replace('.', '')
        } else {
          return ''
        }
      })
      .flat()
      .filter((acceptItem) => acceptItem || acceptItem != ''),
    ...props.fileExtension.map((item) => item.replace('.', '')),
  ]
}

const onAfterRead = async (res) => {
  try {
    uploading.value = true
    console.log(res)
    let files = Array.isArray(res) ? res : [res]
    if (props.autoUpload) {
      // 是图片并且开启压缩并且不是原生环境才进行压缩
      files = await Promise.all(
        files.map(async (fileItem) => {
          const { file } = fileItem
          if (imageTypes.includes(file.type.split('/')[1]) && props.compressor === '0') {
            const newFile = await compressImage(file)
            console.log('newFile', newFile)
            return { ...fileItem, file: newFile }
          }
          return fileItem
        })
      )
      console.log('files', files)
      const fileList = await filesUploader(files, props.uploadOptions, {
        accept: attrs.accept,
        oneMaxCount: props.oneMaxCount,
        fileExtension: props.fileExtension,
      })
      emit('success', fileList)
      return
    }
    emit('success', files)
  } catch (error) {
    console.warn(error)
    fileList.value = fileList.value.map((fileItem) => setError(fileItem))
    if (error == 'cancel') showToast('取消了上传')
    emit('error', error)
    throw new Error(JSON.stringify(error))
  } finally {
    uploading.value = false
  }
}

const closeImagePreview = () => uploaderRef.value?.closeImagePreview()
const chooseFile = () => uploaderRef.value?.chooseFile()

const onClickUpload = () => {
  if (!isRN()) return
  showSheet.value = true
}

defineExpose({ closeImagePreview, chooseFile })
</script>

<template>
  <van-uploader
    ref="uploaderRef"
    v-model="fileList"
    v-bind="attrs"
    :readonly="isRN()"
    :after-read="onAfterRead"
    @click-upload="onClickUpload"
  >
    <template v-for="(_, scopeSlotName) in slots" :key="scopeSlotName" #[scopeSlotName]="scope">
      <slot :name="scopeSlotName" v-bind="scope" :loading="uploading" />
    </template>
  </van-uploader>
  <NativeUploader
    v-model:show="showSheet"
    v-bind="attrs"
    :maxlength="props.oneMaxCount"
    :actions="props.actions"
    :auto-upload="false"
    :compressor="props.compressor"
    @after-read="onAfterRead"
  />
</template>
