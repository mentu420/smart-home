import { createPahoMqttPlugin, $mqtt } from 'vue-paho-mqtt'

import userStore from '@/store/userStore'

export default function useMqtt() {
  function createMqtt(app) {
    const { useGetToken } = userStore()
    const { yonghubianhao, acessToken } = useGetToken() || {}
    const clientID = `APP_${yonghubianhao}` //App_用户编号
    const plugins = createPahoMqttPlugin({
      PluginOptions: {
        autoConnect: false, //插件初始化时是否自动连接到代理。
        showNotifications: true, //是否显示错误和成功通知。
      },

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

  // 添加订阅
  function mqttSubscribe() {
    const { useGetToken } = userStore()
    const { yonghubianhao } = useGetToken()

    $mqtt.connect()

    /**
     * 当设备的状态发生改变，云端或者网关会主动推送设备状态给App； 云端/网关->App
     * @data {bianhao:'设备编号 ',shuxing:'状态变化设备的物模型属性',shuxingzhuangtai:'状态变化设备的物模型属性状态',shuxingzhi:'状态变化设备的物模型属性值'}
     * **/
    $mqtt.subscribe(`Device/State/${yonghubianhao}`, (data) => {
      console.log('设备状态接收主题', data)
    })
    /**
     * 云端/网关在完成一个操作后，进行应答 云服务器/网关->App
     * @data {msgid:'消息唯一id，服务器会返回该msgid消息的执行结果',code:'0：操作成功',desc:'描述'}
     * **/
    $mqtt.subscribe(`Result/${yonghubianhao}`, (data) => {
      console.log('通用结果应答主题', data)
    })
  }
  /**
   * Publish a message
   * @message {msgid,bianhao,shuxing,shuxingzhuangtai,shuxingzhi}
   * {
   *  msgid: '消息唯一id，服务器会返回该msgid消息的执行结果',
   *  bianhao: '控制的设备编号',
   *  shuxing: '要控制的设备的物模型属性',
   *  shuxingzhuangtai: '要控制的物模型的属性状态',
   *  shuxingzhi:'要控制的设备的物模型属性值 说明：只有是动态属性值(亮度，温度，色温等)的才需要传该值，否则可以默认传"1" ',
   * }
   * **/
  function mqttPublish(message) {
    const { useGetToken } = userStore()
    const { yonghubianhao } = useGetToken()
    $mqtt.publish(`Device/Control/${yonghubianhao}`, message, 'B')
  }

  //connected | disconnected | connecting | error | lost | null
  function getMqttStatus() {
    return $mqtt.status()
  }

  return { createMqtt, mqttSubscribe, getMqttStatus, mqttPublish }
}
