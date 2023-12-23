import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { createPahoMqttPlugin, $mqtt } from 'vue-paho-mqtt'

import deviceStore from '@/store/deviceStore'
import userStore from '@/store/userStore'
import { getStorage } from '@/utils/storage'

// showNotifications 是否打印
export default function useMqtt() {
  const heartTimer = ref(null) //记录心跳定时器
  const heartDuration = ref(10 * 1000) // 心跳时长
  const showLog = ref(false)

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
        port: 2883, //MQTT 代理的端口号
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
      if (showLog.value || getStorage('DEVELOPMENT')) {
        console.log('%cMQTT发送心跳', 'color: orange; font-weight: bold;', getMqttStatus())
      }
      $mqtt.publish(
        `App/HeartBeat/${yonghubianhao}`,
        JSON.stringify({
          acessToken,
          msgid: `${yonghubianhao}/${new Date().valueOf()}`,
          timeStamp: new Date().valueOf(),
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
        if (showLog.value || getStorage('DEVELOPMENT')) console.log(res)
        createHeartTimer()
      },
      onFailure: (err) => {
        if (showLog.value || getStorage('DEVELOPMENT'))
          console.log('%cMQTT链接失败', 'color: red; font-weight: bold;', err)
        clearHeartTimer()
      },
      onConnectionLost: (err) => {
        if (showLog.value || getStorage('DEVELOPMENT'))
          console.log('%cMQTT链接丢失', 'color: red; font-weight: bold;', err)
        clearHeartTimer()
      },
    })

    /**
     * 当设备的状态发生改变，云端或者网关会主动推送设备状态给App； 云端/网关->App
     * @data {bianhao:'设备编号 ',shuxing:'状态变化设备的物模型属性',shuxingzhuangtai:'状态变化设备的物模型属性状态',shuxingzhi:'状态变化设备的物模型属性值'}
     * **/
    $mqtt.subscribe(`Device/State/${yonghubianhao}`, (data) => {
      if (showLog.value || getStorage('DEVELOPMENT'))
        console.log('%c设备状态接收主题', 'color: blue; font-weight: bold;', data)
      const { bianhao, shuxing, shuxingzhuangtai, shuxingzhi } = JSON.parse(data)
      const { deviceList } = storeToRefs(deviceStore())
      deviceList.value = deviceList.value.map((item) => {
        if (item.id == bianhao) {
          if (showLog.value || getStorage('DEVELOPMENT')) console.log(item.label)
          return {
            ...item,
            modeList: item.modeList.map((modeItem) => {
              if (modeItem.use == shuxing) {
                return { ...modeItem, useStatus: shuxingzhuangtai, useValue: shuxingzhi }
              }
              return modeItem
            }),
          }
        }
        return item
      })
    })
    /**
     * 云端/网关在完成一个操作后，进行应答 云服务器/网关->App
     * @data {msgid:'消息唯一id，服务器会返回该msgid消息的执行结果',code:'0：操作成功',desc:'描述'}
     * **/
    $mqtt.subscribe(`Result/${yonghubianhao}`, (data) => {
      if (showLog.value || getStorage('DEVELOPMENT'))
        console.log('%c通用结果应答主题', 'color: pink; font-weight: bold;', data)
    })
  }
  /**
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
  function mqttDevicePublish({ id, use, useStatus, useValue }, mode = 'B') {
    const message = {
      bianhao: id,
      shuxing: use,
      shuxingzhuangtai: useStatus,
      shuxingzhi: useValue || '1',
    }
    useMqttPublish('Device', message, mode)
  }

  function mqttScenePublish({ id }, mode = 'B') {
    const message = { bianhao: id }
    useMqttPublish('Sence', message, mode)
  }

  function useMqttPublish(theme, message, mode) {
    const { useGetToken } = userStore()
    const { yonghubianhao } = useGetToken()
    if (showLog.value || getStorage('DEVELOPMENT'))
      console.log('%c主题', 'color: green; font-weight: bold;', theme, message)
    $mqtt.publish(
      `${theme}/Control/${yonghubianhao}`,
      JSON.stringify({
        msgid: `${yonghubianhao}/${theme}/${message.bianhao}/${new Date().valueOf()}`,
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
    $mqtt.disconnect()
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
