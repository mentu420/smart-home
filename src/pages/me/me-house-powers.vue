<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { setFamily, getRoomList, getFamily } from '@/apis/houseApi'
import { getDeviceList, getSceneList } from '@/apis/smartApi'
import houseStore from '@/store/houseStore'
import { stringToArray } from '@/utils/common'

defineOptions({ name: 'MeHousePowers' })

const route = useRoute()
const router = useRouter()

const powerKeys = ['fangjianquanxian', 'shebeiquanxian', 'changjingquanxian']

const { powerList, familyList } = storeToRefs(houseStore())
const loading = ref(false)
const checkboxRefs = ref([])
const checked = ref([])
const list = ref([])
const familyItem = ref({})
const powerKey = computed(() => powerKeys[route.query.power])
const checkedAll = ref(false)
const checkGroupRef = ref(null)

watch(
  () => checked.value,
  (val) => {
    checkedAll.value = val.length > 0 && val.length == list.value.length
  }
)

const onEditPower = async () => {
  try {
    loading.value = true
    const data = {
      ...Object.assign({}, ...powerKeys.map((key) => ({ [key]: familyItem.value[key] }))),
      shouji: route.query.shouji,
      bianhao: route.query.id,
      [powerKey.value]: checked.value,
      fangwubianhao: route.query.hId,
    }
    await setFamily({ params: { op: 3 }, data })
    familyList.value = familyList.value.map((item) => {
      if (item.id == route.query.id) return { ...item, [powerKey.value]: checked.value }
      return item
    })
    router.goBack()
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
    router.goBack()
  }
}

async function init() {
  try {
    loading.value = true
    const { hId, shouji } = route.query

    if (shouji) {
      familyItem.value = await getFamily({ op: 5, fangwubianhao: hId }).then(({ data = [] }) =>
        data.find((item) => item.shouji == shouji)
      )
      checked.value = stringToArray(familyItem.value[powerKeys[route.query.power]])
    }

    const getList = [getRoomList, getDeviceList, getSceneList][route.query.power]

    const { data = [] } = await getList({ op: 6, fangwubianhao: hId })

    list.value = data.map((item) => ({
      ...item,
      label: item.mingcheng,
      id: item.bianhao,
    }))
  } finally {
    loading.value = false
  }
}

init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar :title="['房间权限', '设备权限', '场景权限'][route.query.power]">
      <template #right>
        <van-button size="small" :loading="loading" @click="onSubmit"> 保存 </van-button>
      </template>
    </HeaderNavbar>
    <div class="p-4 text-xs flex justify-between items-center">
      <p>
        {{
          [
            '选择房间，改用户可查看和控制房间内所有设备',
            '选择设备并保存，该用户可查看和控制此设备',
            '选择设备并保存，该用户可查看和控制此场景',
          ][route.query.power]
        }}
      </p>
      <van-button size="small" round @click="checkGroupRef.toggleAll(!checkedAll)">
        {{ checkedAll ? '取消' : '全选' }}
      </van-button>
    </div>
    <van-checkbox-group ref="checkGroupRef" v-model="checked">
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
    <div class="h-4"></div>
  </div>
</template>
