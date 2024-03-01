import * as nativeApi from './nativeApi'
import { getBroadcastIPAddress, MULTICAST_ADDRESS, UDP_HOST, WiFi } from './config'
import { ref } from 'vue'
import dayjs from 'dayjs'

var udpServiceTimer = null // upd局域网设备探测定时器

// 关闭udp服务 清除udp服务计时器
export const closeUdpService = () => {
  console.log('关闭udp服务')
  nativeApi.stopUdpService()
  clearInterval(udpServiceTimer)
  udpServiceTimer = null
  console.log('udpServiceTimer', udpServiceTimer)
}

// 根据网络类型出发udp
export function openUdpService() {
  const networkType = nativeApi.getNetworkType()
  if (networkType !== WiFi) {
    closeUdpService()
    return
  }
  console.log('开启udp服务', nativeApi)
  nativeApi.startUdpService(UDP_HOST, getBroadcastIPAddress())
  nativeApi.startUdpService(UDP_HOST, MULTICAST_ADDRESS)

  if (udpServiceTimer) return
  // 定时广播 发送局域网设备探测
  udpServiceTimer = setInterval(() => {
    console.log('udp定时广播', dayjs().format('HH:mm:ss'))
    const data = JSON.stringify({ cmd: 'lan', data: '' })
    nativeApi.sendUdpData(getBroadcastIPAddress(), UDP_HOST, data)
    nativeApi.sendUdpData(MULTICAST_ADDRESS, UDP_HOST, data)
  }, 3000)
}

// 原生通知手机的网络状态改变
function netStateChange(networkType) {
  console.log('netStateChange', networkType)
  openUdpService()
}

window.netStateChange = netStateChange
