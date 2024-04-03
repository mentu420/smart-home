import mqtt from 'mqtt'

export default class MQTT {
  constructor(host, opts, qos) {
    this.mqClient = null
    this.host = host
    this.opts = opts
    this.qos = qos ?? 0
    this.connect(host, opts)
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
  destory() {
    if (!this.mqClient) return
    this.mqClient.end(true)
    this.mqClient = null
  }
  connect(host, opts) {
    this.mqClient = new mqtt.connect(host, opts)
    this.mqClient.on('connect', () => {
      console.log('连接成功---', this.mqClient.connected)
    })
    // this.mqClient.on('message', (topic, payload) => {
    //   console.log('数据响应了---', topic)
    // })
    // this.mqClient.on('error', (err) => {
    //   console.log('连接错误--------------------', err)
    // })
    // this.mqClient.on('reconnect', () => {
    //   console.log('重连中......')
    // })
  }
}
