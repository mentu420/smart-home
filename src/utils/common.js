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
export const diplayPhone = (value = '', replace = '$1 ****') => {
  if (!value) {
    return
  }
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
  const src = `${url}?callback=onScriptLoad`
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
 * 防抖函数
 * @param fn  要执行的函数
 * @param delay 延迟的时间
 */
export function debounce(fn, delay) {
  var timer = null
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(this)
    }, delay)
  }
}

/**
 * 节流函数
 * @param fn  要执行的函数
 * @param delay 延迟的时间
 */
export function throttle(fn, delay) {
  var lastTime = 0
  return function () {
    var nowTime = Date.now()
    if (nowTime - lastTime > delay) {
      fn.call(this)
      lastTime = nowTime
    }
  }
}

// 判断一个字符串是否为JSON字符串
export let isJsonStr = (str) => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj == 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e)
      return false
    }
  }
}

// generateReqKey ：用于根据当前请求的信息，生成请求 Key；
export function generateReqKey(config) {
  // 响应的时候，response.config 中的data 是一个JSON字符串，所以需要转换一下
  if (config && config.data && isJsonStr(config.data)) {
    config.data = JSON.parse(config.data)
  }
  const { method, url, params, data } = config // 请求方式，参数，请求地址，
  return [method, url, qs.stringify(params), qs.stringify(data)].join('&') // 拼接
}
