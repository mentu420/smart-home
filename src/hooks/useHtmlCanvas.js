import html2canvas from 'html2canvas'

import { uploadFiles } from '@/apis/common/'
import DealImg from '@/utils/dealImg'

export const captureImage = (el) => {
  if (!el) return
  const saveImgStyle = window.getComputedStyle(el)
  const width = parseInt(saveImgStyle.width)
  const height = parseInt(saveImgStyle.height)

  return html2canvas(el, {
    allowTaint: true, //允许污染
    taintTest: true, //在渲染前测试图片(没整明白有啥用)
    useCORS: true, //使用跨域(当allowTaint为true时这段代码没什么用)
    logging: true,

    width: width,
    height: height,
  })
}

export const getHtmlCanvas = async (el) => {
  const canvas = await captureImage(el)
  const base64 = canvas.toDataURL('image/jpeg', 1)
  //上传捕获的图片
  const formData = new FormData()
  formData.append('dataFile', DealImg.convertFiles(base64))

  const { code, url } = await uploadFiles(formData)
  return url
}
