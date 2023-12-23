<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { setFamily } from '@/apis/houseApi'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'
import smartStore from '@/store/smartStore'

defineOptions({ name: 'MeHousePowers' })

const route = useRoute()
const router = useRouter()

const { deviceList } = storeToRefs(deviceStore())
const { sceneList } = storeToRefs(smartStore())
const { roomList, familyList, powerList } = storeToRefs(houseStore())
const loading = ref(false)
const checkboxRefs = ref([])
const checked = ref([])

const powerKey = computed(
  () => ['fangjianquanxian', 'shebeiquanxian', 'changjingquanxian'][route.query.power]
)

const list = computed(() =>
  [roomList.value, deviceList.value, sceneList.value][route.query.power].map((item) => ({
    ...item,
    checked: checked.value.includes(item.id),
  }))
)

const onEditPower = async () => {
  try {
    loading.value = true
    await setFamily({
      params: { op: 3 },
      data: {
        shouji: route.query.shouji,
        bianhao: route.query.id,
        [powerKey.value]: checked.value,
      },
    })
    familyList.value = familyList.value.map((item) => {
      if (item.id == route.query.id) return { ...item, [powerKey.value]: checked.value }
      return item
    })
  } finally {
    loading.value = false
  }
}

const toggle = (index) => {
  checkboxRefs.value[index].toggle()
}

async function onSubmit() {
  if (route.query.id) {
    onEditPower()
  } else {
    powerList.value = powerList.value.map((item, i) => {
      if (route.query.power == i) return checked.value
      return item
    })
  }
  router.back()
}

function init() {
  if (route.query.id) {
    if (familyList.value.length == 0) return []
    const familyItem = familyList.value?.find((item) => item.id == route.query.id)
    checked.value = familyItem[powerKey.value]
  } else {
    checked.value = powerList.value[route.query.power]
  }
  console.log('checked', checked.value)
}

init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar :title="['房间权限', '设备权限', '场景权限'][route.query.power]">
      <template #right>
        <van-button type="primary" size="small" :loading="loading" @click="onSubmit">
          保存
        </van-button>
      </template>
    </HeaderNavbar>
    <div class="p-4 text-xs">
      {{
        [
          '选择房间，改用户可查看和控制房间内所有设备',
          '选择设备并保存，该用户可查看和控制此设备',
          '',
        ][route.query.power]
      }}
    </div>
    <van-checkbox-group v-model="checked">
      <van-cell-group inset>
        <van-cell
          v-for="(powerItem, powerIndex) in list"
          :key="powerItem.id"
          clickable
          :title="powerItem.label"
          @click="toggle(powerIndex)"
        >
          <template #right-icon>
            <van-checkbox
              :ref="(el) => (checkboxRefs[powerIndex] = el)"
              :name="powerItem.id"
              @click.stop
            />
          </template>
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>
  </div>
</template>
