<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import { setDeviceList } from '@/apis/smartApi'
import PickerSearch from '@/components/common/PickerSearch.vue'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'
import { showToast } from 'vant'

defineOptions({ name: 'TriggerAttrConfig' })

const { roomList, floorList } = storeToRefs(houseStore())
const { deviceList } = storeToRefs(deviceStore())

const props = defineProps({
  id: { type: String, default: '', required: true },
})

const roomPickerRef = ref(false)
const showForm = ref(false)
const loading = ref(false)
const deviceItem = computed(() => deviceList.value?.find((item) => item.id == props.id))
const rId = ref('') //房间编号

watch(
  () => deviceItem.value,
  (val) => {
    rId.value = val?.rId
  },
  { immediate: true }
)

const roomName = computed(() => {
  if (rId.value == '') return ''
  const roomItem = roomList.value.find((item) => item.id == rId.value)
  const floorItem = floorList.value.find((item) => item.id == roomItem.fId)
  return `${floorItem?.label} - ${roomItem?.label}`
})

const checked = computed({
  get: () => deviceItem.value?.collect == 1,
  set: (value) => {
    const { useDeviceItemChange } = deviceStore()
    useDeviceItemChange({ ...deviceItem.value, collect: value ? 1 : 0 })
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
  rId.value = selectedValues[1]
  await setDeviceList({
    params: { op: 3 },
    data: { bianhao: props.id, fangjianbianhao: rId.value },
  })

  const { useDeviceItemChange } = deviceStore()
  useDeviceItemChange({ id: props.id, rId: rId.value })
}

const onSubmit = async () => {
  try {
    loading.value = true
    await setDeviceList({
      params: { op: 3 },
      data: {
        bianhao: props.id,
        mingcheng: deviceItem.value?.label,
      },
    })
    const { useDeviceItemChange } = deviceStore()
    useDeviceItemChange({
      id: props.id,
      label: deviceItem.value?.label,
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
      params: { op: 5 },
      data: {
        shebeibianhao: props.id,
        leixing: value ? 1 : 0,
        paixu: deviceItem.value?.sort,
      },
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <section class="m-4 overflow-hidden rounded-xl">
      <van-cell-group>
        <van-cell
          center
          title="设备名称"
          :value="deviceItem?.label"
          is-link
          @click="showForm = true"
        />
        <van-cell center title="所属房间" :label="roomName" is-link @click="roomPickerRef.open()" />
        <van-cell center title="常用设备">
          <van-switch v-model="checked" :loading="loading" @change="onCollectChange" />
        </van-cell>
      </van-cell-group>
    </section>
    <PickerSearch
      ref="roomPickerRef"
      :columns-field-names="{ text: 'label', value: 'id', children: 'roomList' }"
      :columns="columns"
      @select="onPickerConfirm"
    />
    <!--房间编辑-->
    <van-popup v-model:show="showForm" round teleport="body" position="center" closeable>
      <van-form class="p-4" @submit="onSubmit">
        <van-field
          v-model.trim="deviceItem.label"
          name="label"
          label="设备名称"
          placeholder="请填写设备名称"
          maxlength="6"
          :rules="[{ required: true, message: '设备名称不能为空' }]"
        />
        <div class="pt-8 pb-4">
          <van-button round block native-type="submit" :loading="loading"> 提交 </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>
