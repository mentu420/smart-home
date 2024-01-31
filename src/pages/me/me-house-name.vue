<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { setHouseItem } from '@/apis/houseApi'
import houseStore from '@/store/houseStore'

defineOptions({ name: 'MeHouseName' })

const route = useRoute()
const router = useRouter()
const houseName = ref('')
const { houseList } = storeToRefs(houseStore())
const loading = ref(false)
const init = () => {
  houseName.value = route.query.houseName
}

init()

const onSubmit = async () => {
  try {
    loading.value = true
    await setHouseItem({
      params: { op: 3 },
      data: { mingcheng: houseName.value, bianhao: route.query.id },
    })
    const payload = houseList.value.find((item) => item.bianhao == route.query.id)
    const { setHouseList, setCurrentHouse } = houseStore()
    setHouseList({
      ...payload,
      fangwumingcheng: houseName.value,
      label: houseName.value,
    })
    setCurrentHouse(route.query.id)
    router.goBack()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="家庭管理" />
    <van-form class="mt-6" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model.trim="houseName"
          name="houseName"
          placeholder="请填写家庭名称"
          clearable
          maxlength="30"
          :rules="[{ required: true, message: '家庭名称必填项' }]"
        />
      </van-cell-group>
      <div class="m-6">
        <van-button round block native-type="submit" :loading="loading"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>
