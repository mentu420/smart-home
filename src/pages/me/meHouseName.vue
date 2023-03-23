<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { setHouseList } from '@/apis/houseApi'
import houseStore from '@/store/houseStore'

const route = useRoute()
const houseName = ref('')
const { houseList } = storeToRefs(houseStore())

const init = () => {
  houseName.value = route.query.houseName
}

init()

const onSubmit = async () => {
  await setHouseList({ mingcheng: houseName.value, bianhao: route.query.id })
  const payload = houseList.value.map((item) => {
    if (item.bianhao == route.query.id) return { ...item, mingcheng: houseName.value }
    return item
  })
  const { editHouseList } = houseStore()
  editHouseList(payload)
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="家庭管理" />
    <van-form class="mt-6" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="houseName"
          name="houseName"
          placeholder="请填写家庭名称"
          clearable
          maxlength="30"
          :rules="[{ required: true, message: '家庭名称必填项' }]"
        />
      </van-cell-group>
      <div class="m-6">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>
