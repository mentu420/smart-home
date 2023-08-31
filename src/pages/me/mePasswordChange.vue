<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { setUserConfig } from '@/apis/commonApi.js'
import { useLogout } from '@/hooks/useLogout'
import userStore from '@/store/userStore'

const router = useRouter()
const password = ref('')
const newPassword = ref('')
const formRef = ref(null)

const onSubmit = async () => {
  await setUserConfig({
    params: { op: 3 },
    data: { oldmima: password.value, mima: newPassword.value },
  })
  useLogout('密码修改成功，请使用新密码重新登录')
}
</script>

<template>
  <div class="min-h-screen">
    <HeaderNavbar title="修改密码" />
    <van-form ref="formRef" class="m-6" @submit="onSubmit">
      <van-field
        v-model="password"
        name="password"
        placeholder="请输入旧密码"
        :rules="[{ required: true, message: '旧密码不能为空' }]"
      />
      <van-field
        v-model="newPassword"
        name="newPassword"
        placeholder="请输入新密码"
        maxlength="6"
        :rules="[{ required: true, message: '新密码不能为空' }]"
      />
      <div class="my-10">
        <van-button round block type="primary" native-type="submit"> 完成 </van-button>
        <div
          class="m-4 text-center text-sm text-gray-500"
          @click="router.push({ path: '/forget-password' })"
        >
          忘记密码
        </div>
      </div>
    </van-form>
  </div>
</template>
