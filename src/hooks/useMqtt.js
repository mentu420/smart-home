import { storeToRefs } from 'pinia'
import { createPahoMqttPlugin, $mqtt } from 'vue-paho-mqtt'

import deviceStore from '@/store/deviceStore'
import smartStore from '@/store/smartStore'
import userStore from '@/store/userStore'
import { getStorage } from '@/utils/storage'
import { isObjectString } from '@/utils/common'
import deviceInfo from '@/utils/deviceInfo'
import MQTT from '@/utils/mqtt'

const SENCE = 'Sence'
const DEVICE = 'Device'

const getLogStyle = (color) => {
  return deviceInfo.platform == 'devtools' ? `color: ${color}; font-weight: bold;` : ''
}

const getTimeStamp = () => new Date().valueOf()

const getMsgid = (yonghubianhao, theme, id) => {
  return `${yonghubianhao}/${theme}/${id}/${getTimeStamp()}`
}

export default class MqttClient extends MQTT {
  constructor(url = 'ws://152.136.150.207:8083/mqtt', opts, qos) {
    super(url, opts, qos)
    // this.connect(url, opts)
    this.initClient(url, opts)
  }

  initClient(url, opts) {
    const { useGetToken } = userStore()
    const { yonghubianhao, acessToken } = useGetToken() || {}
    const clientID = `APP_${yonghubianhao}` //App_用户编号
    this.connect(url, {
      clientId: clientID, //连接到代理时使用的客户端标识符
      mainTopic: 'Cloud', // 主题
      enableMainTopic: true, // 是否启用主题
      username: yonghubianhao, //连接到代理时使用的用户名
      password: acessToken, //连接到代理时使用的密码
      reconnectPeriod: 1000, //两次重连之间的时间间隔。通过设置为 禁用自动重新连接0
    })
  }
}
