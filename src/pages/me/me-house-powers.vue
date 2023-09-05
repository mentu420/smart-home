<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import { setFamily } from '@/apis/houseApi'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'
import sceneStore from '@/store/sceneStore'

const { useGetFamilyListSync } = houseStore()

const route = useRoute()

const { deviceList } = storeToRefs(deviceStore())
const { sceneList } = storeToRefs(sceneStore())
const { roomList, familyList } = storeToRefs(houseStore())
const loading = ref(false)

const powerKey = computed(
  () => ['fangjianquanxian', 'shebeiquanxian', 'changjingquanxian'][route.query.power]
)

const powerIds = computed(() => {
  if (familyList.value.length == 0) return []
  const familyItem = familyList.value?.find((item) => item.id == route.query.id)
  return familyItem[powerKey.value]
})

const powerList = computed(() =>
  [roomList.value, deviceList.value, sceneList.value][route.query.power].map((item) => ({
    ...item,
    checked: powerIds.value.includes(item.id),
  }))
)

const onSwitchClick = async (id) => {
  try {
    loading.value = true
    let ids = []
    if (powerIds.value.includes(id)) {
      ids = powerIds.value.filter((item) => item != id)
    } else {
      ids = [...powerIds, id]
    }
    await setFamily({
      params: { op: 3 },
      data: { shouji: route.query.shouji, bianhao: route.query.id, [powerKey.value]: ids },
    })
    await useGetFamilyListSync(true)
  } catch (error) {
    //
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar :title="['房间权限', '设备权限', '场景权限'][route.query.power]" />
    <van-cell-group>
      <van-cell v-for="powerItem in powerList" :key="powerItem.id" :title="powerItem.label">
        <van-switch
          v-model="powerItem.checked"
          :loading="loading"
          @change="onSwitchClick(powerItem.id)"
        />
      </van-cell>
    </van-cell-group>
  </div>
</template>
