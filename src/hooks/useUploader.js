import { uploadFile } from '@/apis/commonApi'
import { compressBase64 } from '@/utils/dealImg'

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

export const useUploader = async (file) => {
  setLoading(file)

  //压缩base64
  let base64 = await compressBase64(file.content)

  let { code, data } = await uploadFile({ file: base64 })
  if (code != 0) {
    setError(file)
    return
  }
  setFinish(file, data)

  return data
}
