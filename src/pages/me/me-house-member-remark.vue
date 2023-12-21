<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { setFamily } from '@/apis/houseApi.js'
import loadingClick from '@/directive/loadingClick'
import house from '@/router/modules/house'
import houseStore from '@/store/houseStore'

defineOptions({ name: 'MeNickname' })

const route = useRoute()
const router = useRouter()
const remark = ref('')
const loading = ref(false)
const { familyList } = storeToRefs(houseStore())
const familyItem = computed(() => familyList.value?.find((item) => item.id == route.query.id) || {})

const init = () => {
  remark.value = route.query.value
}

init()

const onSubmit = async () => {
  try {
    loading.value = true
    const {
      bianhao,
      shouji,
      juese,
      fangjianquanxian,
      shebeiquanxian,
      changjingquanxian,
      fangwubianhao,
    } = familyItem.value
    await setFamily({
      params: { op: 3 },
      data: {
        bianhao,
        shouji,
        juese,
        fangjianquanxian,
        shebeiquanxian,
        changjingquanxian,
        fangwubianhao,
        xingming: remark.value,
      },
    })
    // const { useGetFamilyListSync } = houseStore()
    // await useGetFamilyListSync(true)
    familyList.value = familyList.value.map((item) => {
      if (item.id == bianhao) return { ...familyItem.value, xingming: remark.value }
      return item
    })
    router.back()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="备注名" />
    <van-form class="mt-6" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="remark"
          name="remark"
          placeholder="请填备注名"
          clearable
          maxlength="30"
          :rules="[{ required: true, message: '备注名必填项' }]"
        />
      </van-cell-group>
      <div class="m-6">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
