<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { setHouseItem } from '@/apis/houseApi'
import SmartUploader from '@/components/common/SmartUploader.vue'
import houseStore from '@/store/houseStore'

defineOptions({ name: 'MeHouseCreate' })

const router = useRouter()
const houseName = ref(null)
const houseImage = ref('https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg')
const loading = ref(false)

const onSubmit = async () => {
  const { useGetHouseListSync } = houseStore()
  await setHouseItem({
    params: { op: 2 },
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
          <SmartUploader
            v-model="houseImage"
            v-model:loading="loading"
            reupload
            accept="image/*"
            string-separator=","
            :max-count="1"
          />
        </van-cell>
      </van-cell-group>
      <div class="m-6">
        <van-button :loading="loading" round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
