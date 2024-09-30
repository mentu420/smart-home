import { defineStore, storeToRefs } from 'pinia'
import { computed, watch, ref } from 'vue'
import userStore from './userStore'
import deviceStore from './deviceStore'
import smartStore from './smartStore'
import { openUdpService, closeUdpService } from '@/utils/native/udpService'
import deviceInfo from '@/utils/deviceInfo'
import { isObjectString, mergingStep } from '@/utils/common'
import { getStorage } from '@/utils/storage'
import PahoMQTT from 'paho-mqtt'
import { showToast } from 'vant'

const getLogStyle = (color) => {
  return deviceInfo.platform == 'devtools' ? `color: ${color}; font-weight: bold;` : ''
}

const getTimeStamp = () => new Date().valueOf()

export default defineStore('socketStore', () => {
  const { sceneList } = storeToRefs(smartStore())
  const { onLine } = storeToRefs(userStore())
  let heartTimer = null
  let mqClient = null
  const heartDuration = 10 * 1000
  const username = ref('')
  const password = ref('')
  const reconnectCount = ref(0)
  const host = '152.136.150.207'
  const port = 8083
  const SENCE = 'Sence'
  const DEVICE = 'Device'
  const resultTopic = ref('') // 通用应答主推
  const heartTopic = ref('') // 心跳主图
  const deviceStateTopic = ref('') // 设备状态主题
  const deviceOnlineTopic = ref('') // 设备/网关在线主题
  const isDisConnect = ref(false) // 是否主动断开链接
  const showLog = ref(getStorage(import.meta.env.VITE_APP_DEVELOPER) ?? false)

  const useSetShowLog = (value) => {
    console.log('useSetShowLog', value)
    showLog.value = value
  }

  const getMsgid = (theme, id) => {
    return `${username.value}/${theme}/${id}/${getTimeStamp()}`
  }

  const init = () => {
    const { useGetToken } = userStore()
    const { yonghubianhao, acessToken } = useGetToken() || {}
    username.value = yonghubianhao
    password.value = acessToken

    resultTopic.value = `Cloud/Result/${username.value}`

    heartTopic.value = `App/HeartBeat/${username.value}`

    deviceStateTopic.value = `Cloud/${DEVICE}/State/${username.value}`

    deviceOnlineTopic.value = `App/Online/${username.value}`

    initClient()
    waitConnected()
  }

  function initClient() {
    mqClient = new PahoMQTT.Client(host, port, `APP_${username.value}`)

    console.log('mqClient', mqClient)

    // set callback handlers
    mqClient.onConnected = (err) => {
      console.log('断开连接--------------------', err)
    }
    mqClient.onMessageArrived = (message) => {
      const { payloadString, topic } = message
      if (!payloadString || !isObjectString(payloadString)) return
      const data = JSON.parse(payloadString)

      if (topic == deviceStateTopic.value) {
        onDeviceStatusSubscribe(data)
      } else if (topic === deviceOnlineTopic.value) {
        onDeviceOnlineSubscribe(data)
      } else if (topic == resultTopic.value) {
        onResponesSubscribe(data)
      } else {
        if (showLog.value) {
          console.log('%c接收到信息', getLogStyle('gray'), topic, data)
        }
        if (topic != heartTopic.value) return
        onSmartSuccess(data)
      }
    }
    mqClient.onMessageDelivered = (message) => {
      if (showLog.value) console.log('发送信息--------------------', message)
    }
  }

  const onConnectSuccess = () => {
    createHeartTimer(heartTopic.value)
    mqClient?.subscribe(deviceStateTopic.value, {
      onSuccess: () => {
        console.log('订阅设备状态主题成功')
      },
    })
    mqClient?.subscribe(deviceOnlineTopic.value, {
      onSuccess: () => {
        console.log('订阅设备在线主题成功')
      },
    })
    mqClient?.subscribe(resultTopic.value, {
      onSuccess: () => {
        console.log('订阅通用应答结果主题成功')
      },
    })
  }

  const onClientConnecte = () => {
    if (!mqClient) initClient()
    return new Promise((resolve, reject) => {
      if (mqClient?.isConnected()) {
        resolve(mqClient)
        return
      }
      const connect = () => {
        mqClient?.connect({
          timeout: 10 * 1000,
          reconnect: false,
          userName: username.value,
          password: password.value,
          onSuccess: () => {
            console.log('连接成功--------------------', mqClient)
            isDisConnect.value = false
            resolve(mqClient)
            onConnectSuccess()
          },
          onFailure: (err) => {
            console.log('链接失败--------------------', err)
            reconnect()
          },
        })
      }

      const reconnect = () => {
        ++reconnectCount.value
        if (mqClient) {
          console.log('重连中......', reconnectCount.value)
          connect()
        }
        if (reconnectCount.value == 4) {
          reconnectCount.value = 0
          disReconnect()
          reject(new Error('重连失败'))
        }
      }

      connect()

      mqClient.onConnectionLost = (err) => {
        console.log('链接丢失--------------------', err)
        if (!isDisConnect.value) reconnect()
      }
    })
  }

  const waitConnected = mergingStep(onClientConnecte)

  function disReconnect() {
    isDisConnect.value = true
    clearHeartTimer()
    mqClient?.disconnect()
    mqClient = null
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
  async function useMqttPublish(theme, message) {
    try {
      if (!mqClient?.isConnected()) {
        await waitConnected()
      }
      if (showLog.value) console.log('%c推送', getLogStyle('green'), theme, message)
      mqClient?.publish(
        `Cloud/${theme}/Control/${username.value}`,
        JSON.stringify({
          msgid: getMsgid(theme, message.bianhao),
          ...message,
        })
      )
    } catch (error) {
      console.log(error)
      sceneList.value = sceneList.value.map((item) => ({ ...item, loading: false }))
      showToast({ message: '操作失败！', position: 'bottom' })
    }
  }

  //发送心跳
  function createHeartTimer(topic) {
    if (heartTimer) return
    heartTimer = setInterval(() => {
      if (!mqClient?.isConnected()) return
      if (showLog.value) {
        console.log('%cMQTT发送心跳', getLogStyle('orange'))
      }
      mqClient?.publish(
        topic,
        JSON.stringify({
          acessToken: password.value,
          msgid: getMsgid('HeartBeat', '123'),
          timeStamp: getTimeStamp(),
        })
      )
    }, heartDuration)
  }

  function clearHeartTimer() {
    clearInterval(heartTimer)
    heartTimer = null
  }

  function onSmartSuccess(data) {
    const { msgid = '', code } = data
    const [userId, theme, id, timeStamp] = msgid.split('/')
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
  }

  /**
   * 当设备的状态发生改变，云端或者网关会主动推送设备状态给App； 云端/网关->App
   * @data {bianhao:'设备编号 ',shuxing:'状态变化设备的物模型属性',shuxingzhuangtai:'状态变化设备的物模型属性状态',shuxingzhi:'状态变化设备的物模型属性值'}
   * **/
  function onDeviceStatusSubscribe(data) {
    if (showLog.value) console.log('%c设备状态接收主题', getLogStyle('blue'), data)

    const { bianhao, shuxing, shuxingzhuangtai, shuxingzhi } = data
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
  }

  /***
   * 设备、网关在线状态改变订阅 online
   * ***/
  function onDeviceOnlineSubscribe(data) {
    console.log('%c设备/网关在线接收主题', getLogStyle('blue'), data)
    const { bianhao, shifouwangguan, zaixianzhuangtai } = data
    const { deviceList } = storeToRefs(deviceStore())
    deviceList.value = deviceList.value.map((item) => {
      if (item.id === bianhao) return { ...item, online: zaixianzhuangtai === '1' }
      return item
    })
  }

  /**
   * 应答通知
   * 云端/网关在完成一个操作后，进行应答 云服务器/网关->App
   * @data {msgid:'消息唯一id，服务器会返回该msgid消息的执行结果',code:'0：操作成功',desc:'描述'}
   * **/
  function onResponesSubscribe(data) {
    if (showLog.value) {
      console.log('%c通用结果应答主题', getLogStyle('pink'), data)
    }
    const { msgid = '', code } = data
    const [userId, theme, id, timeStamp] = msgid.split('/')
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
  }

  // 设备推送
  function mqttDevicePublish({ id, use, useStatus, useValue }) {
    const message = {
      bianhao: id,
      shuxing: use,
      shuxingzhuangtai: useStatus,
      shuxingzhi: useValue || '1',
    }
    useMqttPublish(DEVICE, message)
    const { setDeviceLoading } = deviceStore()
    setDeviceLoading(id, true)
  }

  // 场景推送
  function mqttScenePublish({ id }) {
    const message = { bianhao: id }
    const { setSceneLoading } = smartStore()
    setSceneLoading(id, true)
    useMqttPublish(SENCE, message)
  }

  return { mqttScenePublish, mqttDevicePublish, useSetShowLog, disReconnect, waitConnected, init }
})
