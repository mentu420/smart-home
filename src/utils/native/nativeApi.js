/** 所有原生的方法都存在这里 */
//   trident: userAgent.indexOf('Trident') > -1, // IE内核
//   presto: userAgent.indexOf('Presto') > -1, // opera内核
//   webKit: userAgent.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
//   gecko: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') === -1,// 火狐内核
//   mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
//   ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
//   android: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1, // android终端
//   iPhone: userAgent.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
//   iPad: userAgent.indexOf('iPad') > -1, // 是否iPad
//   webApp: userAgent.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
//   weixin: userAgent.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）

const userAgent = navigator.userAgent
const _toString = Object.prototype.toString
const noopInterface = { getVersion: () => 'pc' }
/**
 * webview 信息
 * */
export const browser = {
  versions: {
    tablet: userAgent.indexOf('Tablet') > -1,
    iPad: userAgent.indexOf('iPad') > -1,
    ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  },
}

function isFunction(val) {
  const typeStr = _toString.call(val)
  return typeStr === '[object Function]' || typeStr === '[object CallbackFunction]'
}

function getNativeInterface() {
  return window.jdwl || noopInterface
}

/**
 * 执行原生方法
 * */
function isNativeMethod(methodName, onsuccess) {
  const _interface = getNativeInterface()
  if (isFunction(_interface[methodName])) {
    return onsuccess(_interface, methodName)
  }
}

/** 获取设备操作系统 */
export function getMobileOS() {
  return browser.versions.ios ? 'ios' : 'android'
}

export function deviceToken() {
  if (!browser.deviceToken) {
    isNativeMethod('getDeviceToken', (api, methodName) => {
      browser.versions.ios
        ? api[methodName]((token) => {
            browser.deviceToken = token
          })
        : (browser.deviceToken = api[methodName]())
    })
  }
  return browser.deviceToken
}

/** 获取设备型号 */
export function deviceModel() {
  return isNativeMethod('getDeiviceType', (api, methodName) => api[methodName]())
}

/** 获取设备名称 */
export function deviceName() {
  return isNativeMethod('getDeviceName', (api, methodName) => api[methodName]())
}

/** 手机唯一标识 */
export function deviceMac() {
  return isNativeMethod('getMac', (api, methodName) => api[methodName]())
}

/** 获取app版本号 */
export function getVersion() {
  if (!browser.appVersion) {
    browser.appVersion = isNativeMethod('getVersion', (api, methodName) => api[methodName]())
  }
  return browser.appVersion
}

/** 二维码扫描  回调参数为扫码结果和二维码的类型  回调数据格式  {type: string, value: string} */
export function scanCode(callbackName = 'onScanCode') {
  return isNativeMethod('scanCode', (api, methodName) => api[methodName](callbackName))
}

/** 拍照
 * @param {string} original  1 返回原图、0返回压缩后的图
 * */
export function takePhoto(original = '0') {
  return isNativeMethod('openCamera', (api, methodName) =>
    browser.versions.ios ? api[methodName]() : api[methodName]('onMessage', original)
  )
}

/** 相册
 * @param {Number} num 最大可选相片数
 * @param {String} callbackName 选择完毕回调函数名
 * @param {string} original  1 返回原图、0返回压缩后的图
 * */
export function getPhoto(num = 9, original = '0', callbackName = 'onMessage') {
  return isNativeMethod('getPhoto', (api, methodName) =>
    browser.versions.ios ? api[methodName](num) : api[methodName](num, callbackName)
  )
}

/** 通讯录 */
export function getTelPeople(callbackName) {
  return isNativeMethod('getTelPeople', (api, methodName) => api[methodName](callbackName))
}

/** 拨打电话 */
export function callTel(tel) {
  return isNativeMethod('callTel', (api, methodName) => api[methodName](tel))
}

/** 向原生设置token */
export function setKey(key = 'acessToken', value) {
  return isNativeMethod('setkey', (api, methodName) => api[methodName](key, value))
}

/** 安卓返回键退出app */
export function exitApp() {
  return isNativeMethod('back', (api, methodName) => api[methodName]())
}

/** 云对讲呼叫 */
export function onIntercomCall(callId, path) {
  return isNativeMethod('onCall', (api, methodName) => api[methodName](callId, path))
}

/** 云对讲通话 */
export function onIntercomTalk(callId, pullUrl, pushUrl) {
  return isNativeMethod('onTalk', (api, methodName) => api[methodName](callId, pullUrl, pushUrl))
}

/** 云对讲挂断 */
export function onIntercomHangUp(callId = '') {
  return isNativeMethod('onHandup', (api, methodName) => api[methodName](callId))
}

/** 云监控 */
export function openMonitor() {
  return isNativeMethod('openMonitor', (api, methodName) => api[methodName]())
}

/** 获取设备ip 地址 */
export function getIPAddress() {
  return isNativeMethod('getIPAddress', (api, methodName) => api[methodName]())
}

/** 开始udp服务 */
export function startUdpService(port, multIp) {
  return isNativeMethod('startUdpService', (api, methodName) => {
    api[methodName](port, multIp)
  })
}

/** 停止udp服务 */
export function stopUdpService() {
  return isNativeMethod('stopUdpService', (api, methodName) => api[methodName]())
}

/** 发送udp数据 */
export function sendUdpData(ip, port, data) {
  return isNativeMethod('sendUdpData', (api, methodName) => {
    try {
      api[methodName](ip, port, data)
    } catch (e) {
      console.warn('sendUdpData:', e)
    }
  })
}

/** 获取网络连接类型 */
export function getNetworkType() {
  return isNativeMethod('getNetStateType', (api, methodName) => api[methodName]())
}

/** 获取手机状态栏高度 ios暂不支持 */
export function getStatusBarHeight() {
  return isNativeMethod('getStatusBarHeight', (api, methodName) => api[methodName]()) || 0
}
