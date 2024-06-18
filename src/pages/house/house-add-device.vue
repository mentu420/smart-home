<script setup>
import { storeToRefs } from 'pinia'
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
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
import { getNetworkType, sendUdpData } from '@/utils/native/nativeApi'
import dayjs from 'dayjs'
import { isObjectString } from '@/utils/common'
import deviceStore from '@/store/deviceStore'
import { openUdpService, closeUdpService, updServiceTimeout } from '@/utils/native/udpService'
import { useRouter } from 'vue-router'
import { reloadStoreSync } from '@/store/utils'
import { showConfirmDialog, showDialog } from 'vant'

defineOptions({ name: 'HouseAddDevice' })

const router = useRouter()

const animeRef = ref(null)
const textList = [
  { title: '正在扫描附近的设备...', des: '请确保设备在手机附近,已接通电源,且连接WIFI' },
  { title: '未发现附近的设备！', des: '没有发现想要的设备，可点击下方的“重新扫描”' },
  { title: '发现设备', des: '请选择设备并绑定' },
]
const action = ref(0) //0 扫描设备 1 停止扫描并没有发现设备 2：停止扫描并发现设备
const { currentHouse } = storeToRefs(houseStore())

//
const devices = ref([])
const searchCount = ref(9)

const onStart = () => {
  action.value = 0
  searchCount.value = 3
  animeRef.value?.play()
  openUdpService()
  initSearch()
}

const onPause = () => {
  clearTimeout(sendUdpTimer)
  sendUdpTimer = null
  action.value = 1
  animeRef.value.pause()
  closeUdpService()
}

function getUdpData(evt) {
  if (!evt) return
  try {
    if (!isObjectString(evt)) return
    const message = JSON.parse(evt)
    console.log('接收到udp 数据：', message)
    if (message.data != '' && message.cmd === CMD_DISCOVER) {
      const { ip, mac, type = null } = message.data
      if (type === null) return
      const index = devices.value.findIndex((item) => item.mac === mac)
      index > -1 ? (devices.value[index].ip = ip) : devices.value.push({ ip, mac })
    }
  } catch (e) {
    console.error(e)
  }
}

window.getUdpData = getUdpData

var sendUdpTimer = null

const initSearch = async (timeout = updServiceTimeout) => {
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
  sendUdpTimer = setTimeout(initSearch, timeout)
}

//{"cmd":"discover","data":{"ip":"10.10.20.49","mac":"0a:52:11:6c:6c:da","sn":"3704d936-6664-48d9-970c-c48a33790b1f","type":"1"}}
const onBindDevice = async (item) => {
  try {
    await showConfirmDialog({ title: '提示', message: '是否绑定？' })
    const params = {
      params: { op: 10 },
      data: { shebeibianhao: item.mac, fangwubianhao: currentHouse.value?.id },
    }
    const { code } = await setDeviceList(params)
    if (code != 0) return
    await reloadStoreSync()

    devices.value = devices.value.filter((deviceItem) => deviceItem.mac != item.mac)
    await showDialog({ title: '绑定成功' })
    router.push({ path: '/me-host-list' })
  } catch (error) {
    console.log(error)
  }
}

const init = () => {
  action.value = 0
  openUdpService()
  initSearch()
}

onMounted(init)

onBeforeUnmount(onPause)
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="添加设备" />
    <div class="mb-4">
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
    </div>
    <van-cell-group v-if="devices.length > 0" inset>
      <van-cell
        v-for="deviceItem in devices"
        :key="deviceItem.ip"
        :title="deviceItem.mac"
        :label="deviceItem.ip"
        center
      >
        <van-button
          v-loading-click="() => onBindDevice(deviceItem)"
          class="!px-6"
          size="small"
          plain
          round
        >
          绑定
        </van-button>
      </van-cell>
    </van-cell-group>
  </div>
</template>
