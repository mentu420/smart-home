<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { setUserConfig } from '@/apis/commonApi.js'
import userStore from '@/store/userStore'

defineOptions({ name: 'MeNickname' })

const route = useRoute()
const router = useRouter()
const nickname = ref('')

const init = () => {
  nickname.value = route.query.value
}

init()

const onSubmit = async () => {
  await setUserConfig({ params: { op: 2 }, data: { xingming: nickname.value } })
  const { useUserInfoSync } = userStore()
  await useUserInfoSync(true)
  router.goBack()
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="昵称" />
    <van-form class="mt-6" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model.trim="nickname"
          name="nickname"
          placeholder="请填写昵称"
          clearable
          maxlength="30"
          :rules="[{ required: true, message: '昵称必填项' }]"
        />
      </van-cell-group>
      <div class="m-6">
        <van-button round block native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>
