//压缩base64    判断base64是否小于maxsize，是：直接上传，否：进行压缩后返回base64,只能一个一个参数穿进来压缩

export default class DealImg {
  constructor() {
    this.canvas = null
  }
  static compressBase64(base64, type = 'image/jpeg', maxsize = 500 * 1024, maxLen = 1200) {
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
  static convertFiles(dataurl, filename = 'img.jpg') {
    //bse64转换为file
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }
  static convertBase64(url, outputFormat = null) {
    //本地图片转换为base64
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
  static convertBlob(base64) {
    //base64转Blob
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }
  static readFiles(file) {
    return new Promise((resolve) => {
      let reader = new FileReader() //构造FileReader对象
      reader.readAsDataURL(file) //将文件读取后返回其URL，适合图片预览
      reader.onload = (e) => {
        resolve(e.target.result)
      }
    })
  }
  //网络图片转base64
  static getWebBase64(url, type = 'image/jpeg') {
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
}
