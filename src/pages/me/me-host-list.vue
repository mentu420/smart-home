<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import deviceStore from '@/store/deviceStore'
import { setDeviceList } from '@/apis/smartApi'
import { reloadStoreSync } from '@/store/utils'
import houseStore from '@/store/houseStore'
import { showConfirmDialog } from 'vant'

const { houseUserPower, currentHouse } = storeToRefs(houseStore())

defineOptions({ name: 'MeHostList' })

const { hostList } = storeToRefs(deviceStore())

const onUnbindDevice = async (item) => {
  try {
    await showConfirmDialog({ title: '提示', message: '是否解绑？' })
    await setDeviceList({ params: { op: 11, shebeibianhao: item.bianhao } })
    await reloadStoreSync()
  } catch (error) {
    //
  }
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="主机列表" />
    <van-cell-group inset class="!my-4">
      <van-cell v-for="hostItem in hostList" :key="hostItem.ip" :title="hostItem.mac" center>
        <template #label>
          <p
            v-for="(hostLabel, hostKey) in {
              mingcheng: '名称',
              ip: 'IP',
              model: '型号',
              SWVersion: '软件版本',
              HWVersion: '硬件版本',
            }"
            :key="hostKey"
          >
            {{ hostLabel }} : {{ hostItem[hostKey] }}
          </p>
        </template>
        <template #extra>
          <van-button
            v-if="houseUserPower(currentHouse?.id) != 2"
            v-loading-click="() => onUnbindDevice(hostItem)"
            class="!px-6"
            size="small"
            plain
            round
          >
            解绑
          </van-button>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>
