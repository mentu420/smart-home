<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { setHouseList } from '@/apis/houseApi'
import houseStore from '@/store/houseStore'
const router = useRouter()
const houseName = ref(null)
const houseImage = ref('')

const afterRead = () => {}

const onSubmit = async () => {
  const { setCurrentHouse, initHouse } = houseStore()
  const { code, data } = await setHouseList({
    bianhao: '',
    mingcheng: houseName.value,
    img: houseImage.value,
  })
  await initHouse()
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
        <van-cell center clickable title="家庭图片" is-link>
          <van-uploader accept="image/*" :after-read="afterRead">
            <van-image width="3rem" height="3rem" fit="cover" round :src="houseImage" />
          </van-uploader>
        </van-cell>
      </van-cell-group>
      <div class="m-6">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>
