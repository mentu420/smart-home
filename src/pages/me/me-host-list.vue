<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import deviceStore from '@/store/deviceStore'
import { showConfirmDialog } from 'vant'
import { setDeviceList } from '@/apis/smartApi'

defineOptions({ name: 'MeHostList' })

const { hostList } = storeToRefs(deviceStore())

const onUnbindDevice = async (item) => {
  try {
    await showConfirmDialog({ title: '提示', message: '是否解绑？' })
    await setDeviceList({ params: { op: 11, shebeibianhao: item.mac } })
    hostList.value = hostList.value.filter((hostItem) => hostItem.mac != item.mac)
  } catch (error) {
    //
  }
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="主机列表" />
    <van-cell-group inset class="!my-4">
      <van-cell
        v-for="hostItem in hostList"
        :key="hostItem.ip"
        :title="hostItem.mac"
        :label="hostItem.ip"
        center
      >
        <van-button
          v-loading-click="() => onUnbindDevice(hostItem)"
          class="!px-6"
          size="small"
          plain
          round
        >
          解绑
        </van-button>
      </van-cell>
    </van-cell-group>
  </div>
</template>
