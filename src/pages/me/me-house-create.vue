<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { setHouseList } from '@/apis/houseApi'
import SmartUploader from '@/components/common/SmartUploader.vue'
import houseStore from '@/store/houseStore'

const router = useRouter()
const houseName = ref(null)
const houseImage = ref('')
const fileList = ref([])

const onSubmit = async () => {
  const { useGetHouseListSync } = houseStore()
  const { code, data } = await setHouseList({
    poarams: { op: 2 },
    data: {
      bianhao: '',
      mingcheng: houseName.value,
      img: houseImage.value,
    },
  })
  await useGetHouseListSync()
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="创建家庭" />
    <van-form class="mt-6" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="houseName"
          name="houseName"
          label="家庭名称"
          placeholder="请填写家庭名称"
          clearable
          center
          maxlength="30"
          :rules="[{ required: true, message: '家庭名称必填项' }]"
        />
        <van-cell center clickable title="家庭图片">
          <SmartUploader v-model="fileList" accept="image/*" :max-count="1" reupload />
        </van-cell>
      </van-cell-group>
      <div class="m-6">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>
