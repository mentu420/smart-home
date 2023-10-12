import qs from 'qs'

// 合并Promise请求
export function mergingStep(wrapped) {
  let runningInstance = null
  return function (...args) {
    if (runningInstance) {
      // 若步骤正在进行，则监听并使用其执行结果，而不是重新发起该步骤
      return runningInstance
    }
    const res = wrapped.apply(this, args)

    if (!(res instanceof Promise)) {
      return res
    }
    runningInstance = res
    runningInstance
      .then(function () {
        runningInstance = null
      })
      .catch(function () {
        runningInstance = null
      })
    return runningInstance
  }
}

// 手机号码加密
export const diplayPhone = (value = '', replace = '$1****$2') => {
  if (!value) return ''
  return value.replace(/(\d{3})\d{4}(\d{4})/, replace)
}

// 拼接字符串
export const joinStr = (...args) => {
  return args.reduce((acc, cur) => {
    return acc + (cur || '')
  }, '')
}

export const onLoadOptions2Obj = (options) => {
  let querys = options
  if (options.q) {
    try {
      const searchStr = decodeURIComponent(options.q).split('?')[1]
      querys = qs.parse(searchStr)
    } catch (e) {
      console.warn(e)
    }
  }
  return (key) => {
    if (querys[key]) {
      return querys[key]
    } else {
      return ''
    }
  }
}

// 判断是否引入了 sctipt 脚本
const isIncludeJs = (url) => {
  const es = document.getElementsByTagName('script')
  for (let i = 0; i < es.length; i++) if (es[i].src.indexOf(url) != -1) return true
  return false
}

/**
 * 动态加载js
 * @param url    要加载url
 */
export const loadScript = (url, parentEl = document.head) => {
  const src = `${url}&callback=onScriptLoad`
  if (isIncludeJs(src)) return Promise.resolve()
  return new Promise((resolve, reject) => {
    window.onScriptLoad = function () {
      resolve()
    }
    const script = document.createElement('script')
    script.src = src
    script.onerror = reject
    parentEl.appendChild(script)
  })
}

/**
 * 防抖 用于减少函数触发的频率，在一个delay时间内，如果触发delay时间归零，直到delay时间到才会触发函数
 * @param fn  要执行的函数
 * @param delay 延迟的时间
 * @params immediate 为 true 表示第一次触发后执行
 */
export function debounce(fn, delay = 50, immediate) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    // timer 为空表示首次触发
    if (immediate && !timer) {
      fn.apply(this, args)
    }

    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * throttle节流函数定义：就是无论频率多快，每过一段时间就执行一次。 https://juejin.cn/post/6844903863061839885
 * @param fn  要执行的函数
 * @param delay 延迟的时间
 */
export function throttle(fn, delay) {
  // previous 是上一次执行 fn 的时间
  // timer 是定时器
  let previous = 0,
    timer = null

  // 将 throttle 处理结果当作函数返回
  return function (...args) {
    // 获取当前时间，转换成时间戳，单位毫秒
    let now = +new Date()

    // ------ 新增部分 start ------
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔
    if (now - previous < delay) {
      // 如果小于，则为本次触发操作设立一个新的定时器
      // 定时器时间结束后执行函数 fn
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        previous = now
        fn.apply(this, args)
      }, delay)
      // ------ 新增部分 end ------
    } else {
      // 第一次执行
      // 或者时间间隔超出了设定的时间间隔，执行函数 fn
      previous = now
      fn.apply(this, args)
    }
  }
}

// 判断一个字符串是否为JSON字符串
export const isObjectString = (value) => /^{(.?)+}$/.test(value) || /^\[(.?)+\]$/.test(value)

// generateReqKey ：用于根据当前请求的信息，生成请求 Key；
export function generateReqKey(config) {
  // 响应的时候，response.config 中的data 是一个JSON字符串，所以需要转换一下
  if (config && config.data && isObjectString(config.data)) {
    config.data = JSON.parse(config.data)
  }
  const { method, url, params, data } = config // 请求方式，参数，请求地址，
  return [method, url, qs.stringify(params), qs.stringify(data)].join('&') // 拼接
}

// 数组对象删除重复数据
export const objDelMap = (key, arr) => {
  const map = new Map()
  for (const item of arr) {
    if (!map.has(item[key])) {
      map.set(item[key], item)
    }
  }
  return [...map.values()]
}

// 根据数组值删除对象中的值
export const objDelByValues = (values, obj) => {
  if (!Array.isArray(values)) throw new Error('values required array')
  Object.keys(obj).forEach((key) => {
    if (values.includes(obj[key])) delete obj[key]
  })
  return obj
}

/**
 * 使用input元素选中 value 复制
 * @value 复制的值
 * @el 在什么元素里面插入input
 * **/
export const onCopyContent = (value, success) => {
  if (!value) return console.warn('没有需要复制的目标内容')
  // 创建textarea标签
  const textarea = document.createElement('textarea')
  // 设置相关属性
  textarea.readOnly = 'readonly'
  textarea.style.position = 'fixed'
  textarea.style.top = '-99999px'
  // 把目标内容赋值给它的value属性
  textarea.value = value
  // 插入到页面
  document.body.appendChild(textarea)
  // 调用onselect()方法
  textarea.select()
  // 把目标内容复制进剪贴板, 该API会返回一个Boolean
  const res = document.execCommand('Copy')
  //复制成功后其他操作
  res && success ? success(value) : console.log('复制成功，剪贴板内容：' + value)
  // 移除textarea标签
  document.body.removeChild(textarea)
}

// 多张图片加载完成
export const onImagesLoad = (mulitImg = []) => {
  return new Promise((resolve) => {
    let promiseAll = [],
      img = [],
      imgTotal = mulitImg.length
    for (let i = 0; i < imgTotal; i++) {
      promiseAll[i] = new Promise((resolve, reject) => {
        img[i] = new Image()
        img[i].src = mulitImg[i]
        img[i].onload = function () {
          //第i张加载完成
          resolve(img[i])
        }
      })
    }
    Promise.all(promiseAll).then(() => {
      setTimeout(() => {
        resolve()
      }, 100)
    })
  })
}

//判断两个对象是否相等：
export function isObjectValueEqual(a, b) {
  //取对象a和b的属性名
  var aProps = Object.getOwnPropertyNames(a)
  var bProps = Object.getOwnPropertyNames(b)
  //判断属性名的length是否一致
  if (aProps.length != bProps.length) {
    return false
  }
  //循环取出属性名，再判断属性值是否一致
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i]
    if (a[propName] !== b[propName]) {
      return false
    }
  }
  return true
}

//视频格式
export const videoTypes = new Array(
  'avi',
  'wmv',
  'mpg',
  'mpeg',
  'mov',
  'rm',
  'ram',
  'swf',
  'flv',
  'mp4',
  'mp3',
  'wma',
  'avi',
  'rm',
  'rmvb',
  'flv',
  'mpg',
  'mkv'
)

//图片格式
export const imageTypes = new Array(
  'bmp',
  'jpg',
  'jpeg',
  'png',
  'tif',
  'gif',
  'pcx',
  'tga',
  'exif',
  'fpx',
  'svg',
  'psd',
  'cdr',
  'pcd',
  'dxf',
  'ufo',
  'eps',
  'ai',
  'raw',
  'wmf',
  'webp',
  'avif',
  'apng'
)

export const getFileExtension = (webUrl) => webUrl.match(/^(.*)(\.)(.{1,8})$/)[3]

/**
 * 验证网络图片是视频还是图片
 * @params url 网络路径
 * @params types 视频、图片的文件后缀
 * **/
export const acceptFileValidate = (url, types) => {
  if (!url || url == 0 || url == '') return false
  const webUrl = url.includes('?') ? url.split('?')[0] : url
  return types.includes(getFileExtension(webUrl).toLowerCase())
}

//字符串转驼峰
export const toCamelCase = (str) => {
  return str
    .replace(/[\s_-](\w)/g, function (match, p1) {
      return p1.toUpperCase()
    })
    .replace(/^[A-Z]/, function (match) {
      return match.toLowerCase()
    })
}

/**
 * 获取视频宽高比转化为当前浏览器宽高
 * @params src 视频源
 * @params el 视频元素的父元素，获取父元素的宽度
 * **/
export const getPlayerRect = (src, el = document.body) => {
  console.log(src)
  return new Promise((resolve) => {
    let video = document.createElement('video')
    video.preload = 'metadata'
    video.src = src
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      const { width } = el.getBoundingClientRect()
      const ratio = video.videoHeight == 0 ? 9 / 16 : video.videoHeight / video.videoWidth
      resolve({ width, height: ratio * width })
    }
  })
}

// 添加水印
export const watermark = (el, str) => {
  const text = '内部资料，禁止外发'
  const addWaterMarker = (text, str, el) => {
    const canvas = document.createElement('canvas')
    canvas.width = 250
    canvas.height = 180
    const cans = canvas.getContext('2d')
    cans.rotate((-20 * Math.PI) / 180) //旋转弧度
    cans.font = '14px Microsoft JhengHei' //字体
    cans.fillStyle = 'rgba(0, 0, 0, 0.1)' //字体填充颜色
    cans.textAlign = 'center' //对齐方式
    cans.textBaseline = 'Middle' //基线
    cans.fillText(text, canvas.width / 3, canvas.height / 2) //被填充的文本
    cans.fillText(str, canvas.width / 2, 110) //被填充的文本
    el.style.backgroundImage = `url(${canvas.toDataURL('image/png')})` //插入背景图
  }

  addWaterMarker(text, str, el)
}

//获取url上面的值 name 是key
export const getUrlQueryItem = (name, url) => {
  if (!url) url = location.href
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  var regexS = '[\\?&]' + name + '=([^&#]*)'
  var regex = new RegExp(regexS)
  var results = regex.exec(url)
  return results == null ? null : results[1]
}

export const stringToArray = (str, separators = [',', ';']) => {
  if (Array.isArray(str)) {
    return str
  }
  for (let i = 0; i < separators.length; i++) {
    const separator = separators[i]
    if ((str || '').includes(separator)) {
      return str.split(separator)
    }
  }
  return str ? [str] : []
}

// 16进制颜色值的正则
export const colorRgba = (color, alpha = 0.5) => {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  // 把颜色值变成小写
  color = color.toLowerCase()
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      let colorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1))
      }
      color = colorNew
    }
    // 处理六位的颜色值，转为RGB
    const colorChange = []
    for (let i = 1; i < 7; i += 2) {
      colorChange.push(parseInt('0x' + color.slice(i, i + 2)))
    }
    return `rgba(${colorChange.join(',')},${alpha})`
  } else {
    return color
  }
}

// RGB颜色值的正则
export const colorHex = (color) => {
  const reg = /^(rgb|RGB)/
  if (reg.test(color)) {
    let strHex = '#'
    // 把RGB的3个数值变成数组
    const colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
    // 转成16进制
    for (let i = 0; i < colorArr.length; i++) {
      let hex = Number(colorArr[i]).toString(16)
      if (hex === '0') {
        hex += hex
      }
      strHex += hex
    }
    return strHex
  } else {
    return String(color)
  }
}
