<script setup>
import { Devices } from '@icon-park/vue-next/es/map'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { setDeviceList } from '@/apis/smartApi'
import PickerSearch from '@/components/common/PickerSearch.vue'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'

defineOptions({ name: 'SmartDeviceInfo' })

const useDeviceStore = deviceStore()

const { roomList } = storeToRefs(houseStore())
const { deviceList } = storeToRefs(useDeviceStore)

const route = useRoute()
const showPicker = ref(false)
const showForm = ref(false)
const loading = ref(false)
const rId = ref(route.query.rId) //房间编号
const deviceItem = computed(() => useDeviceStore.useGetDeviceItem(route.query.id))
const roomName = computed(() => roomList.value.find((item) => item.id == rId.value)?.label)
const checked = computed({
  get: () => deviceItem.value.collect == 1,
  set: (value) => {
    useDeviceStore.useDeviceItemChange({ ...deviceItem.value, collect: value ? 1 : 0 })
  },
})

const columns = computed(() => {
  const { useGetFloorTree } = houseStore()
  return useGetFloorTree()
})

const onPickerConfirm = async ({ selectedValues }) => {
  if (!selectedValues[1]) {
    showToast('沒有房间！不能变更')
    return
  }
  showPicker.value = false
  rId.value = selectedValues[1]
  await setDeviceList({
    params: { op: 3 },
    data: { bianhao: route.query.id, fangjianbianhao: rId.value },
  })

  const { useDeviceItemChange } = deviceStore()
  useDeviceItemChange({ id: route.query.id, rId: rId.value })
}

const onSubmit = async () => {
  try {
    loading.value = true
    await setDeviceList({
      params: { op: 3 },
      data: {
        bianhao: route.query.id,
        mingcheng: deviceItem.value.label,
      },
    })
    const { useDeviceItemChange } = deviceStore()
    useDeviceItemChange({
      id: route.query.id,
      label: deviceItem.value.label,
    })
    showForm.value = false
  } finally {
    loading.value = false
  }
}

const onCollectChange = async (value) => {
  try {
    loading.value = true
    await setDeviceList({
      params: { op: 4 },
      data: {
        shebeibianhao: route.query.id,
        leixing: value ? 1 : 0,
        paixu: deviceItem.value.sort,
      },
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="设置" />
    <section class="m-4 overflow-hidden rounded-xl">
      <van-cell-group>
        <van-cell title="设备名称" :value="deviceItem?.label" is-link @click="showForm = true" />
        <van-cell title="所属房间" :value="roomName" is-link @click="showPicker = true" />
        <van-cell center title="常用设备">
          <van-switch v-model="checked" :loading="loading" @change="onCollectChange" />
        </van-cell>
      </van-cell-group>
    </section>
    <PickerSearch
      v-model:show="showPicker"
      :columns-field-names="{ text: 'label', value: 'id', children: 'roomList' }"
      :columns="columns"
      @confirm="onPickerConfirm"
    />
    <!--房间编辑-->
    <van-popup v-model:show="showForm" round teleport="body" position="center" closeable>
      <van-form class="p-4" @submit="onSubmit">
        <van-field
          v-model.trim="deviceItem.label"
          name="label"
          label="房间名称"
          placeholder="请填写房间名称"
          :rules="[{ required: true, message: '房间名称不能为空' }]"
        />
        <div class="pt-8 pb-4">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            提交
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>
