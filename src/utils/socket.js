import { Client, Message } from 'paho-mqtt'
import { ref } from 'vue'

let client = null

export function initClient() {
  const clientID = 'APP_12312312312312' //App_用户编号
  const url = 'ws://152.136.150.207:2883/mqtt'
  client = new Client(url, clientID)
  client.onConnectionLost = onConnectionLost
  client.onMessageArrived = onMessageArrived
  client.connect({ userName: 'acematic', password: 'ACEMATIC2018_', onSuccess: onConnect })
  console.log('client', client)
}

//连接成功
function onConnect() {
  console.log('链接成功')
  var topic1 = 'Cloud/Device/State/用户编号' //设备状态接收主题
  var topic2 = 'Cloud/Result/用户编号' //通用结果应答主题
  client.subscribe(topic1)
  client.subscribe(topic2)
}

//连接断开
function onConnectionLost(responseObject) {
  console.log('Lost connection')
}

//收到消息
function onMessageArrived(message) {
  console.log('PUBLISH ' + message.destinationName + ' ' + message.payloadString)
}

//发送消息
function sendMessage(msg) {
  var message = new Message(msg)
  message.destinationName = 'cloud/device/control'
  client.send(message)
}
