<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { setHouseItem } from '@/apis/houseApi'
import SmartUploader from '@/components/common/SmartUploader.vue'
import houseStore from '@/store/houseStore'
import { getWebUrlName } from '@/utils/common'

defineOptions({ name: 'MeHouseCreate' })

const router = useRouter()
const houseName = ref(null)
const houseImage = ref('')
const loading = ref(false)

const onSubmit = async () => {
  const { useGetHouseListSync, useGetFamilyListSync } = houseStore()
  await setHouseItem({
    params: { op: 2 },
    data: {
      bianhao: '',
      mingcheng: houseName.value,
      img: getWebUrlName(houseImage.value),
    },
  })
  await useGetHouseListSync(true)
  await useGetFamilyListSync(true)
  router.goBack()
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="创建家庭" />
    <van-form class="mt-6" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model.trim="houseName"
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
            reupload
            accept="image/*"
            string-separator=","
            :max-count="1"
            @success="(fileList) => (houseImage = fileList[0].url)"
          >
            <template #default="slotProps">
              <div class="w-[80px] h-[80px] flex justify-center items-center bg-page-gray">
                <van-loading v-if="slotProps.loading" />
                <SmartImage v-else class="w-[80px] h-[80px]" fit="cover" round :src="houseImage" />
              </div>
            </template>
          </SmartUploader>
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
