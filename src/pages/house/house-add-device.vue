<script setup>
import { storeToRefs } from 'pinia'
import { ref, onMounted, computed } from 'vue'
import { setDeviceList } from '@/apis/smartApi'
import LoopAnime from '@/components/anime/loopAnime.vue'
import houseStore from '@/store/houseStore'
import {
  getBroadcastIPAddress,
  MULTICAST_ADDRESS,
  UDP_HOST,
  WiFi,
  getOffLineHost,
  isOnLineMode,
  CMD_DISCOVER,
} from '@/utils/native/config'
import { getNetworkType, stopUdpService, sendUdpData } from '@/utils/native/nativeApi'
import { showConfirmDialog, showDialog } from 'vant'
import dayjs from 'dayjs'
import { isObjectString } from '@/utils/common'

defineOptions({ name: 'HouseAddDevice' })

const animeRef = ref(null)
const textList = [
  { title: '正在扫描附件的设备...', des: '请确保设备在手机附近,已接通电源,且连接WIFI' },
  { title: '未发现附近的设备！', des: '没有发现想要的设备，可点击下方的“重新扫描”' },
  { title: '发现设备', des: '请选择设备并绑定' },
]
const action = ref(0) //0 扫描设备 1 停止扫描并没有发现设备 2：停止扫描并发现设备
const { currentHouse } = storeToRefs(houseStore())

const devices = ref([])
const searchCount = ref(3)

const onStart = () => {
  action.value = 0
  searchCount.value = 3
  animeRef.value?.play()
  initSearch()
}

const onPause = () => {
  action.value = 1
  animeRef.value.pause()
  stopUdpService()
}

const onFoundGateway = (item) => {
  if (isOnLineMode() && item.cmd === 'lan') {
    const { ip, fangwubianhao } = item.data
    if (fangwubianhao === currentHouse.value.id && getOffLineHost() !== ip) {
      console.log('切换到了网关' + ip)
      // setOffLineHost(ip)
      // setRemoteHostMode(false)
      // this.cancelBroadcast()
    }
  }
}

function getUdpData(evt) {
  if (!evt) return
  try {
    if (!isObjectString(evt)) return
    const message = JSON.parse(evt)
    onFoundGateway(message)
    console.log('接收到udp 数据：' + evt)
    if (Object.prototype.toString.call(evt) === '[object Object]' && evt.cmd === CMD_DISCOVER) {
      const { ip, mac, fangwubianhao } = evt.data
      if (fangwubianhao) return
      const index = devices.value.findIndex((item) => item.mac === mac)
      index > -1 ? (devices.value[index].ip = ip) : devices.value.push({ ip, mac })
    }
  } catch (e) {
    console.error(e)
  }
}

window.getUdpData = getUdpData

const initSearch = async (timeout = 4000) => {
  console.log('searchCount', searchCount.value)
  const networkType = getNetworkType()
  if (networkType !== WiFi) {
    onPause()
    await showDialog({ title: '提示', message: '请切换至WIFI环境，再重新扫描设备' })
    return
  }

  --searchCount.value
  if (searchCount.value <= 0) {
    onPause()
    return
  }
  console.log('upd扫描设备', dayjs().format('HH:mm:ss'))
  const data = JSON.stringify({ cmd: CMD_DISCOVER, data: '' })
  sendUdpData(getBroadcastIPAddress(), UDP_HOST, data)
  sendUdpData(MULTICAST_ADDRESS, UDP_HOST, data)
  setTimeout(initSearch, timeout)
}

const onBindDevice = async (item) => {
  try {
    await showConfirmDialog({ title: '提示', message: '是否绑定？' })
    const params = {
      params: { op: 10 },
      data: { shebeibianhao: item.mac, fangwubianhao: currentHouse.value.id },
    }
    console.log('绑定设备的参数：', params)
    const res = await setDeviceList(params)
    console.log('绑定设备返回的结果：', res)
    if (res.code != 0) return
    devices.value = devices.value.filter((deviceItem) => deviceItem.mac != item.mac)
    await showDialog({ title: '绑定成功' })
  } catch (error) {
    //
  }
}

const init = () => {
  action.value = 0
  initSearch()
}

onMounted(init)
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="添加设备" />
    <div class="flex h-80 items-center justify-center">
      <LoopAnime ref="animeRef" />
    </div>
    <div class="text-center space-y-4">
      <p>{{ textList[action].title }}</p>
      <p v-if="action == 0" class="text-xs text-gray-300">{{ textList[action].des }}</p>
    </div>
    <div v-if="action == 1" class="m-10">
      <van-button round block @click="onStart">重新扫描</van-button>
    </div>
    <van-cell-group v-if="devices.length > 0">
      <van-cell
        v-for="deviceItem in devices"
        :key="deviceItem.ip"
        :title="deviceItem.mac"
        :label="deviceItem.ip"
      >
        <van-button v-loading-click="() => onBindDevice(deviceItem)" size="small" plain round>
          绑定
        </van-button>
      </van-cell>
    </van-cell-group>
  </div>
</template>
