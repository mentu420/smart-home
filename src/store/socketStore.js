import { defineStore, storeToRefs } from 'pinia'
import { computed, watch, ref } from 'vue'
import userStore from './userStore'
import deviceStore from './deviceStore'
import smartStore from './smartStore'
import mqtt from 'mqtt/dist/mqtt.esm'
import { openUdpService, closeUdpService } from '@/utils/native/udpService'
import deviceInfo from '@/utils/deviceInfo'
import { isObjectString, mergingStep } from '@/utils/common'
import { showToast } from 'vant'
import { getStorage } from '@/utils/storage'

export default defineStore('socketStore', () => {
  const { onLine } = storeToRefs(userStore())
  const username = ref('')
  const password = ref('')
  const showLog = ref(
    getStorage(import.meta.env.VITE_APP_DEVELOPER) || import.meta.env.MODE === 'development'
  )
  const { sceneList } = storeToRefs(smartStore())
  const SENCE = 'Sence'
  const DEVICE = 'Device'
  let heartTimer = null
  let mqClient = null
  const heartDuration = 10 * 1000
  const reconnectCount = ref(0)

  const getLogStyle = (color) => {
    return deviceInfo.platform == 'devtools' ? `color: ${color}; font-weight: bold;` : ''
  }

  const getTimeStamp = () => new Date().valueOf()

  const getMsgid = (theme, id) => {
    return `${username.value}/${theme}/${id}/${getTimeStamp()}`
  }

  const initClient = mergingStep(() => {
    return new Promise((resolve, reject) => {
      const { useGetToken } = userStore()
      const { yonghubianhao, acessToken } = useGetToken() || {}
      username.value = yonghubianhao
      password.value = acessToken
      const host = 'ws://152.136.150.207:8083/mqtt'
      mqClient = new mqtt.connect(host, {
        clientId: `APP_${username.value}`, //连接到代理时使用的客户端标识符
        autoUseTopicAlias: true, // 主题
        autoAssignTopicAlias: true, // 是否启用主题
        username: yonghubianhao, //连接到代理时使用的用户名
        password: password.value, //连接到代理时使用的密码
      })
      mqClient.on('connect', () => {
        console.log('连接成功--------------------', mqClient)
        resolve(mqClient)
        createHeartTimer()
        onDeviceSubscribe()
        onResponesSubscribe()
      })
      mqClient.on('message', (topic, payload) => {
        if (!payload) return
        const data = JSON.parse(payload.toString())
        const { msgid = '', code } = data
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
      mqClient.on('error', (err) => {
        console.log('连接错误--------------------', err)
      })
      mqClient.on('disconnect', (err) => {
        console.log('断开连接--------------------', err)
      })
      mqClient.on('reconnect', () => {
        ++reconnectCount.value
        console.log('重连中......', reconnectCount.value)
        if (reconnectCount.value == 4) {
          reject(`连接失败`)
          reconnectCount.value = 0
          disReconnect()
        }
      })
    })
  })

  const isConnected = computed(() => mqClient?.connected)

  function disReconnect() {
    clearHeartTimer()
    mqClient?.end()
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
      if (!isConnected.value) {
        await initClient()
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
  function createHeartTimer() {
    if (heartTimer) return
    heartTimer = setInterval(() => {
      if (!isConnected.value) return
      if (showLog.value) {
        console.log('%cMQTT发送心跳', getLogStyle('orange'))
      }
      mqClient?.publish(
        `App/HeartBeat/${username.value}`,
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

  /**
   * 当设备的状态发生改变，云端或者网关会主动推送设备状态给App； 云端/网关->App
   * @data {bianhao:'设备编号 ',shuxing:'状态变化设备的物模型属性',shuxingzhuangtai:'状态变化设备的物模型属性状态',shuxingzhi:'状态变化设备的物模型属性值'}
   * **/
  function onDeviceSubscribe() {
    mqClient?.subscribe(`Cloud/${DEVICE}/State/${username.value}`, (data) => {
      if (showLog.value) console.log('%c设备状态接收主题', getLogStyle('blue'), data)
      if (!data || !isObjectString(data)) return
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
  }

  /**
   * 应答通知
   * 云端/网关在完成一个操作后，进行应答 云服务器/网关->App
   * @data {msgid:'消息唯一id，服务器会返回该msgid消息的执行结果',code:'0：操作成功',desc:'描述'}
   * **/
  function onResponesSubscribe() {
    mqClient?.subscribe(`Cloud/Result/${username.value}`, async (data) => {
      if (showLog.value) {
        console.log('%c通用结果应答主题', getLogStyle('pink'), data)
      }
      if (!data || !isObjectString(data)) return

      const { msgid = '', code } = JSON.parse(data)
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
    })
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

  watch(
    () => onLine.value,
    (val) => {
      if (val) {
        initClient()
      } else {
        closeUdpService()
        disReconnect()
      }
    },
    { immediate: true }
  )

  return { mqttScenePublish, mqttDevicePublish }
})
