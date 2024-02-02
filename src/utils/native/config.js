// import { defaultEmits } from 'vue'
import store from '@/store'

const CUSTOMIZE_IP = localStorage.getItem('customize_ip')

/** 生产服务主机IP */
const RELEASE_SERVER_HOST_IP = CUSTOMIZE_IP || '120.25.83.44'

/** 测试服务主机IP */
const DEBUGGER_SERVER_HOST_IP = CUSTOMIZE_IP || '192.168.168.2'

/** 在关闭生产环境的提示 */
// Vue.config.productionTip = false

/** 当前版本号 */
export const VERSION = '2.1.63.20230220'

/** stomp 是否开启debug 模式 */
export const STOMP_DEBUG = false

/** 开发模式 */
export const DEVELOPMENT_MODE = false

/** 远程主机模式 */
let REMOTE_HOST_MODE = true

/** 挂载到 root vue 的事件中心，在组件内可以 this.$eventHub 访问 */
// export const eventHub = new Vue()

/** 远程服务器主机地址 */
export const REMOTE_HOST = `${
  DEVELOPMENT_MODE ? DEBUGGER_SERVER_HOST_IP : RELEASE_SERVER_HOST_IP
}:81`

/** 本地服务器主机地址 */
// export let OFFLINE_HOST = '192.168.168.128'
export let OFFLINE_HOST = '127.0.0.1'

/** 消息服务器主机地址 */
export const WEB_STOMP_SOCKET_URL = `ws://${
  DEVELOPMENT_MODE ? DEBUGGER_SERVER_HOST_IP : RELEASE_SERVER_HOST_IP
}:15674/ws`

export const API_NEW_VERSION = 'API_NEW_VERSION'

export function setOffLineHost(host) {
  OFFLINE_HOST = host
}

export function getOffLineHost() {
  return OFFLINE_HOST
}

export function setRemoteHostMode(enable) {
  if (REMOTE_HOST_MODE === enable) {
    return
  }

  REMOTE_HOST_MODE = enable
  store.commit('SET_OFFLINE_CONTROL_STATE', !enable)

  if (enable) {
    OFFLINE_HOST = '127.0.0.1'
  }
  // eventHub.$emit('onControlModeChange')
}

export function getSuffix() {
  return REMOTE_HOST_MODE ? '.aspx' : ''
}

export function isOnLineMode() {
  return REMOTE_HOST_MODE
}

export function getBaseURL(allWaysRemote = false) {
  if (allWaysRemote) {
    return `http://${REMOTE_HOST}/V4`
  }
  return `http://${REMOTE_HOST_MODE ? REMOTE_HOST : OFFLINE_HOST}/V4`
}
