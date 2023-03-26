<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { getDeviceList } from '@/apis/smartApi'

const router = useRouter()
const deviceChecked = ref([])
const deviceList = ref([{ name: '1' }, { name: '2' }])
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

    <section class="p-4">
      <van-checkbox-group ref="checkboxGroup" v-model="deviceChecked" @change="onCheckChange">
        <div
          v-for="(deviceItem, deviceIndex) in deviceList"
          :key="deviceItem"
          class="mb-4 flex items-center justify-between rounded-lg bg-white p-3 active:opacity-50"
          @touchstart="() => {}"
          @click="goDeviceConfig"
        >
          <div class="flex space-x-2">
            <div class="h-10 w-10 rounded-full bg-orange-400 p-2">
              <IconPark size="1.8em" type="switch-one" fill="#fff" />
            </div>
            <div>
              <p>智能设备</p>
              <p class="text-sm text-gray-500">设备房间</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <IconPark size="1.8em" type="switch-one" />
            <van-checkbox
              :ref="(el) => (checkboxRefs[deviceIndex] = el)"
              v-model="deviceItem.checked"
              :name="deviceItem.name"
              @click.stop
            ></van-checkbox>
          </div>
        </div>
      </van-checkbox-group>
    </section>
  </div>
</template>

<style scoped lang="scss">
.filter-bar:deep(.van-dropdown-menu__bar) {
  background: transparent;
  box-shadow: none;
}
</style>
