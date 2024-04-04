import mqtt from 'mqtt'

/**
 * QoS 0：最多接收一次：数据包已发送，仅此而已。没有验证是否已收到。
 * QoS 1：至少接收一次：只要客户端未收到服务器的确认，就会发送并存储数据包。 MQTT 确保它会被接收，但可能会出现重复。
 * QoS 2：仅接收一次：与 QoS 1 相同，但没有重复。
 **/
export default class MQTT {
  constructor(opts, qos) {
    this.mqClient = null
    this.opts = opts
    this.qos = qos ?? 0
    this.reconnectCount = 0
  }
  /**  是否已连接到服务器 */
  isConnected() {
    return this.mqClient?.connected == true
  }
  /**  订阅主题  */
  subscribe(topic, callback) {
    if (this.isConnected()) {
      console.log('订阅主题----', topic)
      this.mqClient.subscribe(topic, { qos: this.qos }, callback)
    }
  }
  publish(topic, message) {
    if (this.isConnected()) {
      console.log('订阅主题----', topic, message)
      this.mqClient.publish(topic, { qos: this.qos })
    }
  }
  static destory() {
    this.disReconnect()
  }
  disReconnect() {
    if (!this.mqClient) return
    this.mqClient.end(true)
    this.mqClient = null
  }
  connect(host, opts) {
    if (this.isConnected()) return
    this.mqClient = new mqtt.connect(host, opts)
    this.mqClient.on('connect', () => {
      console.log('成功连接---', this.mqClient?.connected)
    })
    this.mqClient.on('message', (topic, payload) => {
      console.log('数据响应了---', topic, payload)
    })
    this.mqClient.on('error', (err) => {
      console.log('连接错误--------------------', err)
    })
    this.mqClient.on('disconnect', (err) => {
      console.log('断开连接--------------------', err)
    })
    this.mqClient.on('reconnect', () => {
      ++this.reconnectCount
      console.log('重连中......', this.reconnectCount)
      if (this.reconnectCount == 4) {
        this.disReconnect()
      }
    })
    return this.mqClient
  }
}
