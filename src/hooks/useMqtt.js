import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { createPahoMqttPlugin, $mqtt } from 'vue-paho-mqtt'

import deviceStore from '@/store/deviceStore'
import smartStore from '@/store/smartStore'
import userStore from '@/store/userStore'
import { getStorage } from '@/utils/storage'
import { isObjectString } from '@/utils/common'
import deviceInfo from '@/utils/deviceInfo'

const SENCE = 'Sence'
const DEVICE = 'Device'

const getLogStyle = (color) => {
  return deviceInfo.platform == 'devtools' ? `color: ${color}; font-weight: bold;` : ''
}

const getTimeStamp = () => new Date().valueOf()

const getMsgid = (yonghubianhao, theme, id) => {
  return `${yonghubianhao}/${theme}/${id}/${getTimeStamp()}`
}

// showNotifications 是否打印
export default function useMqtt() {
  const heartTimer = ref(null) //记录心跳定时器
  const heartDuration = ref(10 * 1000) // 心跳时长
  const { VITE_APP_DEVELOPER } = import.meta.env || {}
  const showLog = ref(getStorage(VITE_APP_DEVELOPER) || true)

  const PluginOptions = {
    autoConnect: false, //插件初始化时是否自动连接到代理。
    showNotifications: false, //是否显示错误和成功通知。
  }

  function createMqtt(app) {
    const { useGetToken } = userStore()
    const { yonghubianhao, acessToken } = useGetToken() || {}
    const clientID = `APP_${yonghubianhao}` //App_用户编号
    const plugins = createPahoMqttPlugin({
      PluginOptions,

      MqttOptions: {
        host: '152.136.150.207', //MQTT 代理的主机名或 IP 地址
        port: 8083, //MQTT 代理的端口号
        // useSSL: true,
        clientId: clientID, //连接到代理时使用的客户端标识符
        mainTopic: 'Cloud', // 主题
        enableMainTopic: true, // 是否启用主题
        username: yonghubianhao, //连接到代理时使用的用户名
        password: acessToken, //连接到代理时使用的密码
      },
    })
    app.use(plugins)
  }

  function createHeartTimer() {
    if (heartTimer.value) return
    heartTimer.value = setInterval(() => {
      if (getMqttStatus() !== 'connected') return
      const { useGetToken } = userStore()
      const { acessToken, yonghubianhao } = useGetToken()
      // if (showLog.value) {
      //   console.log('%cMQTT发送心跳', getLogStyle('orange'), getMqttStatus())
      // }
      $mqtt.publish(
        `App/HeartBeat/${yonghubianhao}`,
        JSON.stringify({
          acessToken,
          msgid: getMsgid(yonghubianhao, 'HeartBeat', '123'),
          timeStamp: getTimeStamp(),
        }),
        'B',
        false
      )
    }, heartDuration.value)
  }

  function clearHeartTimer() {
    clearInterval(heartTimer.value)
    heartTimer.value = null
  }

  // 发起链接、心跳
  function mqttSubscribe() {
    const { useGetToken } = userStore()
    const { yonghubianhao } = useGetToken()
    $mqtt.connect({
      onConnect: (res) => {
        if (showLog.value) console.log(res)
        createHeartTimer()
      },
      onFailure: (err) => {
        if (showLog.value) console.log('%cMQTT链接失败', getLogStyle('red'), err)
        clearHeartTimer()
      },
      onConnectionLost: (err) => {
        if (showLog.value) console.log('%cMQTT链接丢失', getLogStyle('red'), err)
        clearHeartTimer()
      },
    })

    /**
     * 当设备的状态发生改变，云端或者网关会主动推送设备状态给App； 云端/网关->App
     * @data {bianhao:'设备编号 ',shuxing:'状态变化设备的物模型属性',shuxingzhuangtai:'状态变化设备的物模型属性状态',shuxingzhi:'状态变化设备的物模型属性值'}
     * **/
    $mqtt.subscribe(`${DEVICE}/State/${yonghubianhao}`, (data) => {
      if (showLog.value) console.log('%c设备状态接收主题', getLogStyle('blue'), data)
      if (!isObjectString(data)) return
      const { bianhao, shuxing, shuxingzhuangtai, shuxingzhi } = JSON.parse(data)
      const { deviceList } = storeToRefs(deviceStore())
      deviceList.value = deviceList.value.map((item) => {
        if (item.id == bianhao) {
          const newModeList = item.modeList.map((modeItem) => {
            if (modeItem.use == shuxing) {
              return { ...modeItem, useStatus: shuxingzhuangtai, useValue: shuxingzhi }
            }
            return modeItem
          })
          return {
            ...item,
            modeList: newModeList,
            modeStatusList: newModeList.map(({ useColumns, ...statusItem }) => statusItem),
          }
        }
        return item
      })
    })
    /**
     * 应答通知
     * 云端/网关在完成一个操作后，进行应答 云服务器/网关->App
     * @data {msgid:'消息唯一id，服务器会返回该msgid消息的执行结果',code:'0：操作成功',desc:'描述'}
     * **/
    $mqtt.subscribe(`Result/${yonghubianhao}`, async (data) => {
      if (!isObjectString(data)) return
      const { msgid, code } = JSON.parse(data)
      const [userId, theme, id, timeStamp] = msgid.split('/')
      if (showLog.value && theme != 'HeartBeat') {
        console.log('%c通用结果应答主题', getLogStyle('pink'), data)
      }
      if (theme === SENCE) {
        const { setSceneLoading } = smartStore()
        if (code == 0) setSceneLoading(id, false)
      } else if (theme === DEVICE) {
        /**
         * 设备控制时：不管是卡片的快捷控制还是控制页面控制，200ms内秒收到mqtt控制回应就算指令发送成功，此时需要更新控制的图片的状态；如果200ms没有收到mqtt控制回应，就不切换；如果200ms回应设备离线等操作失败时也不需要切换控制图片
         * 控制后如果正常收到指令控制成功的mqtt消息回应，还要延时5S启动检查，刷新当前页面上设备真实状态，以保证获取设备的真实状态；（所有设备的状态数据要缓存起来，mqtt收到状态后就更新缓存）
         * **/
        const { setDeviceLoading } = deviceStore()
        if (code == 0) setDeviceLoading(id, false)
      }
    })
  }
  // 设备推送
  async function mqttDevicePublish({ id, use, useStatus, useValue }, mode = 'B') {
    const message = {
      bianhao: id,
      shuxing: use,
      shuxingzhuangtai: useStatus,
      shuxingzhi: useValue || '1',
    }
    useMqttPublish(DEVICE, message, mode)
    const { setDeviceLoading } = deviceStore()
    setDeviceLoading(id, true)
  }

  // 场景推送
  function mqttScenePublish({ id }, mode = 'B') {
    const message = { bianhao: id }
    const { setSceneLoading } = smartStore()
    setSceneLoading(id, true)
    useMqttPublish(SENCE, message, mode)
  }

  /**
   * 推送
   * Publish a message
   * @message {msgid,bianhao,shuxing,shuxingzhuangtai,shuxingzhi}
   * {
   *  msgid: 自动生成 '消息唯一id，服务器会返回该msgid消息的执行结果',
   *  bianhao: id, '控制的设备编号',
   *  shuxing: use '要控制的设备的物模型属性',
   *  shuxingzhuangtai: useStatus '要控制的物模型的属性状态',
   *  shuxingzhi: useValue'要控制的设备的物模型属性值 说明：只有是动态属性值(亮度，温度，色温等)的才需要传该值，否则可以默认传"1" ',
   * }
   * **/
  function useMqttPublish(theme, message, mode) {
    const status = getMqttStatus()
    if (!['connecting', 'connected'].includes(status)) mqttSubscribe(true)
    const { useGetToken } = userStore()
    const { yonghubianhao } = useGetToken()
    if (showLog.value) console.log('%c主题', getLogStyle('green'), theme, message)
    $mqtt.publish(
      `${theme}/Control/${yonghubianhao}`,
      JSON.stringify({
        msgid: getMsgid(yonghubianhao, theme, message.bianhao),
        ...message,
      }),
      mode
    )
  }

  //connected | disconnected | connecting | error | lost | null
  function getMqttStatus() {
    return $mqtt.status()
  }

  function mqttDisconnect() {
    if (getMqttStatus() === 'connected') $mqtt.disconnect()
    clearHeartTimer
  }

  return {
    createMqtt,
    mqttSubscribe,
    getMqttStatus,
    mqttDevicePublish,
    mqttScenePublish,
    mqttDisconnect,
  }
}
