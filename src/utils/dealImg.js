import { FILE_TYPE } from '@/enums/fileType.js'
import { acceptFileValidate, videoTypes, imageTypes } from '@/utils/common.js'

// 分析文件获取文件名称、文件类型
export const getFileAttribute = (fileUrl) => {
  let arr = fileUrl.split('/')
  let fileName = arr[arr.length - 1]
  let mimeArr = fileName.split('.')
  let type = mimeArr[mimeArr.length - 1]
  let mime = acceptFileValidate(fileUrl, imageTypes)
    ? `image/*`
    : acceptFileValidate(fileUrl, videoTypes)
      ? `video/*`
      : FILE_TYPE['.' + type]
  if (!mime) mime = FILE_TYPE['']

  return { fileName, mime }
}

//压缩base64    判断base64是否小于maxsize，是：直接上传，否：进行压缩后返回base64,只能一个一个参数穿进来压缩
export const compressBase64 = (
  base64,
  type = 'image/jpeg',
  maxsize = 500 * 1024,
  maxLen = 1200
) => {
  //压缩图片
  if (!base64) throw new Error('require base64')
  return new Promise((resolve) => {
    if (base64.length <= maxsize) {
      //如果图片小于maxsize 500kb，则直接上传
      resolve(base64)
      return
    }
    var img = new Image()
    img.src = base64
    img.onload = function () {
      var initSize = img.src.length //base64初始长度
      //生成比例
      var width = img.width
      var height = img.height
      //计算缩放比例
      var rate = 1
      if (width >= height) {
        if (width > maxLen) {
          rate = maxLen / width
        }
      } else {
        if (height > maxLen) {
          rate = maxLen / height
        }
      }
      img.width = width * rate
      img.height = height * rate
      //生成canvas
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var ndata = canvas.toDataURL(type, 0.8)

      console.log('压缩前：' + initSize)
      console.log('压缩后：' + ndata.length)
      console.log('压缩率：' + ~~((100 * (initSize - ndata.length)) / initSize) + '%')

      resolve(ndata)
    }
  })
}

//bse64转换为file
export const convertFiles = (dataurl, filename = 'base64tofile') => {
  filename = filename == 'base64tofile' ? filename + new Date().valueOf() : filename
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  console.log('mime', mime)
  let suffix = mime.split('/')[1]
  console.log('suffix', suffix)
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  const blob = new Blob([u8arr], { type: mime })
  return new File([blob], `${filename}.${suffix}`, { blob: blob.type })
}

//本地图片转换为base64
export const convertBase64 = (url, outputFormat = null) => {
  return new Promise((resolve, reject) => {
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var img = new Image()
    img.src = url
    img.setAttribute('crossOrigin', 'Anonymous')
    img.onload = function () {
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      try {
        var dataURL = canvas.toDataURL(outputFormat || 'image/png')
        resolve(dataURL)
        canvas = null
      } catch (error) {
        console.log('error', error)
        reject(error)
      }
    }
  })
}

//base64转Blob
export const convertBlob = (base64, filename = 'blob') => {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime, name: filename })
}

//将文件读取后返回其URL，适合图片预览
export const readFiles = (file) => {
  return new Promise((resolve) => {
    let reader = new FileReader() //构造FileReader对象
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      resolve(e.target.result)
    }
  })
}

// 获取网络图片base64格式
export const getWebBase64 = (url, type = 'image/png') => {
  return new Promise((resolve) => {
    let Img = new Image()
    let dataURL = ''
    Img.setAttribute('crossOrigin', 'Anonymous')
    Img.src = url + '?v=' + Math.random()
    Img.onload = function () {
      // 要先确保图片完整获取到，这是个异步事件
      let canvas = document.createElement('canvas') // 创建canvas元素
      let width = Img.width // 确保canvas的尺寸和图片一样
      let height = Img.height
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(Img, 0, 0, width, height) // 将图片绘制到canvas中
      dataURL = canvas.toDataURL(type) // 转换图片为dataURL
      resolve(dataURL)
    }
  })
}
