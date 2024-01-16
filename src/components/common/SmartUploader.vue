<script setup>
import { showToast, showConfirmDialog, showDialog } from 'vant'
import { ref, reactive, computed, useAttrs, useSlots } from 'vue'

import { uploadFile } from '@/apis/commonApi'
import { AUDIO_TYPES } from '@/enums/fileType'
import {
  acceptFileValidate,
  videoTypes,
  imageTypes,
  isObjectString,
  stringToArray,
} from '@/utils/common'

const attrs = useAttrs()
const slots = useSlots()

const props = defineProps({
  uploadOptions: {
    type: Object,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [Array, String],
    default: () => [],
  },
  //一次最多可以上传几个文件
  oneMaxCount: {
    type: Number,
    default: 0,
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
})

const emits = defineEmits(['update:modelValue', 'success', 'error', 'update:loading'])

const uploaderRef = ref(null)
const uploading = computed({
  get: () => props.loading || false,
  set: (val) => emits('update:loading', val),
})

const setLoading = (file) => {
  file.status = 'uploading'
}
const setFinish = (file, url) => {
  file.status = ''
  file.message = ''
  file.url = url
}
const setError = (file) => {
  file.status = 'failed'
}

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
    console.log('originType', originType)
    // 处理文件格式
    if (['[object String]', '[object Array]'].includes(originType) && props.stringSeparator) {
      list = list.map((item) => item.url).join(props.stringSeparator)
    }
    emits('update:modelValue', list)
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

/**
 * 多文件上传
 * @params files 可以是对象 单文件 数组 多文件
 * @params uploadOptions obs 上传进度对象
 * @params {fastPass,accept} fastPass 是否md5对比检查  accept 是input 标签的原生属性，检查文件类型
 * **/
const filesUploader = async (files, uploadOptions = {}, options = {}) => {
  const { accept } = options
  const { onUploadProgress } = uploadOptions
  let fileMap = Array.isArray(files) ? files : [files]
  //判断文件类型只判断图片与视频
  if (accept) {
    const fileTypeList = getAcceptFileTypes(accept)
    console.log('fileTypeList')
    const isAccordAccept = fileMap.every((fileItem) =>
      acceptFileValidate(fileItem?.file?.name || fileItem?.url, fileTypeList)
    )
    if (!isAccordAccept) {
      const errMessage = '文件格式有误!'
      await showDialog({ title: errMessage, message: '请重新选择上传' })
      throw new Error(errMessage)
    }
  }

  //限制一次上传文件数
  if (props.oneMaxCount > 0 && fileMap.length > props.oneMaxCount) {
    await showConfirmDialog({
      title: `一次最多只能上传${props.oneMaxCount}个文件`,
      message: `是否为您上传选择的前${props.oneMaxCount}个文件`,
    })
    fileMap = fileMap.slice(0, 15)
  }
  //文件上传
  fileMap.forEach((file) => setLoading(file))
  return await Promise.all(
    fileMap.map(async (fileItem) => {
      const { data = {} } = await uploadFile({
        params: { op: 1 },
        data: { file: fileItem.file },
        onUploadProgress,
      })
      const { name: url } = data
      if (url) {
        setFinish(fileItem, url)
      } else {
        setError(fileItem)
      }
      return { ...fileItem, url }
    })
  )
}

const onAfterRead = async (files) => {
  try {
    uploading.value = true
    if (props.autoUpload) {
      const fileList = await filesUploader(files, props.uploadOptions, { accept: attrs.accept })
      emits('success', fileList)
      return
    }
    emits('success', files)
  } catch (error) {
    console.log(error)
    fileList.value = fileList.value.map((fileItem) => setError(fileItem))
    if (error == 'cancel') showToast('取消了上传')
    emits('error', error)
    throw new Error(JSON.stringify(error))
  } finally {
    uploading.value = false
  }
}

const closeImagePreview = () => uploaderRef.value?.closeImagePreview()
const chooseFile = () => uploaderRef.value?.chooseFile()

// defineOptions({ inheritAttrs: false })

defineExpose({ closeImagePreview, chooseFile })
</script>

<template>
  <van-uploader ref="uploaderRef" v-model="fileList" v-bind="attrs" :after-read="onAfterRead">
    <template v-for="(_, scopeSlotName) in slots" :key="scopeSlotName" #[scopeSlotName]="scope">
      <slot :name="scopeSlotName" v-bind="scope" :loading="uploading" />
    </template>
  </van-uploader>
</template>
