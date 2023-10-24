import { Client, Message } from 'paho-mqtt'
import { ref } from 'vue'

import { getStorage } from '@/utils/storage'

let client = null

export function initClient() {
  const url = 'ws://152.136.150.207:2883/mqtt'
  const { yonghubianhao, acessToken } = getStorage(import.meta.env.VITE_APP_STORAGE_TOKEN)
  const clientID = `APP_${yonghubianhao}` //App_用户编号
  client = new Client(url, clientID)
  client.onConnectionLost = onConnectionLost
  client.onMessageArrived = onMessageArrived
  client.connect({ userName: yonghubianhao, password: acessToken, onSuccess: onConnect })
  console.log('client', client)
}

//连接成功
function onConnect() {
  console.log('链接成功')
  const { yonghubianhao } = getStorage(import.meta.env.VITE_APP_STORAGE_TOKEN)
  var topic1 = `Cloud/Device/State/${yonghubianhao}` //设备状态接收主题
  var topic2 = `Cloud/Result/${yonghubianhao}` //通用结果应答主题
  client.subscribe(topic1)
  client.subscribe(topic2)
}

//连接断开
function onConnectionLost(responseObject) {
  console.log('Lost connection', responseObject)
}

//收到消息
function onMessageArrived(message) {
  console.log('PUBLISH ', message)
}

//发送消息
function sendMessage(msg) {
  var message = new Message(msg)
  message.destinationName = 'cloud/device/control'
  client.send(message)
}
