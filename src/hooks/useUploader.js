import { showToast } from 'vant'

import { postFiles } from '@/apis/common/'
import DealImg from '@/utils/dealImg'

const setLoading = (file) => {
  file.status = 'uploading'
  file.message = '上传中...'
}
const setFinish = (file, item) => {
  file.status = ''
  file.message = ''
  file.url = item.url
}
const setError = (file) => {
  file.status = 'failed'
  file.message = '上传失败'
}

export const useAfterRead = async (files) => {
  let fileArr = Array.isArray(files) ? files : [files]
  fileArr.forEach((file) => setLoading(file))

  //压缩base64
  let base64 = await Promise.all(
    fileArr.map(async (item) => await DealImg.compressBase64(item.content))
  )
  // //base64转文件
  let compressFiles = base64.map((item) => DealImg.convertFiles(item))

  let formData = new FormData()
  compressFiles.forEach((item) => {
    formData.append('dataFiles', item)
  })
  let { status, list } = await postFiles(formData)
  if (status == 0) {
    fileArr.forEach((file) => setError(file))
    return
  }
  fileArr.forEach((file, i) => setFinish(file, list[i]))

  return list
}
