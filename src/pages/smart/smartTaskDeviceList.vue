<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { getDeviceList } from '@/apis/smartApi'
import deviceStore from '@/store/deviceStore'

const router = useRouter()
const deviceChecked = ref([])
const deviceList = ref([])
const checkboxRefs = ref([])
const chedkAll = ref(false)
const checkboxGroup = ref(null)

const toggle = (index) => {
  checkboxRefs.value[index].toggle()
}

const onAllChecked = () => {
  chedkAll.value = !chedkAll.value
  checkboxGroup.value.toggleAll(chedkAll.value)
}

const onCheckChange = (values) => {
  chedkAll.value = values.length == deviceList.value.length
}

const goDeviceConfig = () => {
  router.push({ path: '/smartTaskDeviceConfig' })
}

const onSave = () => {
  router.push({ path: '/smartSceneCreate' })
}

const init = async () => {
  const { useGetDeviceListSync } = deviceStore()
  deviceList.value = await useGetDeviceListSync()
  console.log(deviceList.value)
}

init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="选择设备" />
    <div class="flex items-center justify-between p-4">
      <p class="text-gray-500">选择希望控制的设备</p>
      <van-button size="mini" type="primary" round @click="onAllChecked">
        {{ chedkAll ? '反选' : '全选' }}
      </van-button>
    </div>

    <section v-if="deviceList.length > 0" class="p-4">
      <van-checkbox-group ref="checkboxGroup" v-model="deviceChecked" @change="onCheckChange">
        <div
          v-for="(deviceItem, deviceIndex) in deviceList"
          :key="deviceItem"
          class="mb-4 flex items-center justify-between rounded-lg bg-white p-3 active:opacity-50"
          @touchstart="() => {}"
          @click="goDeviceConfig"
        >
          <div class="flex space-x-2">
            <div v-if="deviceItem.icon" class="h-10 w-10 rounded-full bg-orange-400 p-2">
              <IconPark size="1.8em" :type="deviceItem.icon" fill="#fff" />
            </div>
            <div>
              <p>{{ deviceItem.label }}</p>
              <p class="text-sm text-gray-500">设备房间</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <IconPark size="1.8em" type="setting-two" :stroke-width="2" />
            <van-checkbox
              :ref="(el) => (checkboxRefs[deviceIndex] = el)"
              v-model="deviceItem.checked"
              :name="deviceItem.id"
              @click.stop
            ></van-checkbox>
          </div>
        </div>
      </van-checkbox-group>
    </section>
    <div class="h-24"></div>
    <footer class="fixed bottom-0 left-0 w-screen bg-white px-6 py-4">
      <van-button round type="primary" block :disabled="deviceChecked.length > 0" @click="onSave">
        下一步
      </van-button>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.filter-bar:deep(.van-dropdown-menu__bar) {
  background: transparent;
  box-shadow: none;
}
</style>
