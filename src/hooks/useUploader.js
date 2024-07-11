import {
  acceptFileValidate,
  videoTypes,
  imageTypes,
  isObjectString,
  stringToArray,
} from '@/utils/common'
import { showConfirmDialog, showDialog, showToast } from 'vant'
import { AUDIO_TYPES } from '@/enums/fileType'
import { uploadFile } from '@/apis/commonApi'
import Compressor from 'compressorjs'
import { isRN } from '@/utils/native/nativeApi'

export const setLoading = (file) => {
  file.status = 'uploading'
}
export const setFinish = (file, url) => {
  file.status = ''
  file.message = ''
  file.url = url
}
export const setError = (file) => {
  file.status = 'failed'
}
/**
 * @accept
 * @fileExtension
 * **/
// @fileExtension 文件后缀 ['.pdf','.doc'] 配合accept使用，有些安装机型不支持 accept="image/*,.pdf" 写法
const getAcceptFileTypes = (accept, fileExtension = []) => {
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
    ...fileExtension.map((item) => item.replace('.', '')),
  ]
}

function compressorImage(file, options) {
  return new Promise((success, error) => {
    new Compressor(file, {
      checkOrientation: false,
      ...options,
      success,
      error,
    })
  })
}

export const controller = new AbortController()

/**
 * 多文件上传
 * @files  可以是对象 单文件 数组 多文件
 * @uploadOptions  onUploadProgress  上传进度对象回调函数
 * @options {fastPass,accept,oneMaxCount,compressor,fileExtension}
 * fastPass 是否md5对比检查  accept 是input 标签的原生属性，检查文件类型 oneMaxCount 一次最多上传几张图片 compressor 是否压缩 0 不压缩 1 压缩 fileExtension 文件后缀 ['.pdf','.doc']
 * **/
export const filesUploader = async (files, uploadOptions = {}, options = {}) => {
  const { accept, oneMaxCount = 1, compressor = '1', fileExtension = [] } = options
  const { onUploadProgress } = uploadOptions
  let fileMap = Array.isArray(files) ? files : [files]
  //判断文件类型只判断图片与视频
  if (accept) {
    const fileTypeList = getAcceptFileTypes(accept, fileExtension)
    const isAccordAccept = fileMap.every((fileItem) =>
      acceptFileValidate(fileItem?.file?.name || fileItem?.url, fileTypeList)
    )
    if (!isAccordAccept) {
      const errMessage = '文件格式有误!'
      await showDialog({ title: errMessage, message: '请重新选择上传' })
      throw new Error(errMessage)
    }
  }

  //限制一次上传文件数 oneMaxCount
  if (oneMaxCount > 0 && fileMap.length > oneMaxCount) {
    await showConfirmDialog({
      title: `一次最多只能上传${oneMaxCount}个文件`,
      message: `是否为您上传选择的前${oneMaxCount}个文件`,
    })
    fileMap = fileMap.slice(0, 15)
  }
  //文件上传
  fileMap.forEach((file) => setLoading(file))
  return await Promise.all(
    fileMap.map(async (fileItem) => {
      let file = fileItem.file
      // 是图片并且开启压缩并且不是原生环境才进行压缩
      if (imageTypes.includes(file.type.split('/')[1]) && compressor === '0' && !isRN()) {
        const blob = await compressorImage(fileItem.file)
        file = new File([blob], file.name, {
          type: blob.type, // 保持原有的媒体类型
          lastModified: new Date().getTime(), // 可以使用当前时间作为文件的最后修改时间
        })
      }
      const { data = {} } = await uploadFile({
        params: { op: 1 },
        data: { file },
        onUploadProgress,
        signal: controller.signal,
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
