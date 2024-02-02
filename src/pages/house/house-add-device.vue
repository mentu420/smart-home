<script setup>
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'

import LoopAnime from '@/components/anime/loopAnime.vue'
import houseStore from '@/store/houseStore'

import { getIPAddress, getNetworkType, startUdpService, stopUdpService } from '@/utils/native/'

import {
  setRemoteHostMode,
  setOffLineHost,
  getOffLineHost,
  isOnLineMode,
} from '@/utils/native/config'

defineOptions({ name: 'HouseAddDevice' })

const animeRef = ref(null)
const textList = ['正在扫描附件的设备...', '未发现附近的设备！']
const action = ref(0)
const { currentHouse } = storeToRefs(houseStore())

const onStart = () => {
  action.value = 0
  animeRef.value.play()
  onPause()
}

const onPause = () => {
  setTimeout(() => {
    action.value = 1
    animeRef.value.pause()
  }, 10 * 1000)
}

const onFoundGateway = (item) => {
  if (isOnLineMode() && item.cmd === 'lan') {
    const { ip, fangwubianhao } = item.data
    if (fangwubianhao === currentHouse.value.id && getOffLineHost() !== ip) {
      console.log('切换到了网关' + ip)
      setOffLineHost(ip)
      setRemoteHostMode(false)
      this.cancelBroadcast()
    }
  }
}

function getUdpData(evt) {
  console.log('getUdpData', evt)
  try {
    console.log('接收到udp 数据：' + evt)
    const message = JSON.parse(evt)
    this.onFoundGateway(message)
    this.$eventHub.$emit('onReceivedUdpData', message)
  } catch (e) {
    console.error(e)
  }
}

const init = () => {}

onMounted(() => {
  getIPAddress()
  startUdpService()
  //stopUdpService()
  // onPause()
})
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="添加设备" />
    <div class="flex h-80 items-center justify-center">
      <LoopAnime ref="animeRef" />
    </div>
    <div class="text-center">{{ textList[action] }}</div>
    <div v-if="action == 1" class="m-10">
      <van-button round block @click="onStart">重新扫描</van-button>
    </div>
  </div>
</template>
