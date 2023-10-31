<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { setUserConfig } from '@/apis/commonApi.js'
import { useLogout } from '@/hooks/useLogout'
import userStore from '@/store/userStore'

defineOptions({ name: 'MePasswordChange' })

const router = useRouter()
const formRef = ref(null)
const showPassword = ref(false)
const form = ref({})

const repeatValid = () => {
  const { newPassword = '', repeatPassword = '' } = form.value
  return newPassword != '' && repeatPassword != '' && newPassword == repeatPassword
}

const onSubmit = async () => {
  await setUserConfig({
    params: { op: 3 },
    data: { oldmima: form.value.password, mima: form.value.newPassword },
  })
  useLogout('密码修改成功，请使用新密码重新登录')
}
</script>

<template>
  <div class="min-h-screen">
    <HeaderNavbar title="修改密码" />
    <van-form ref="formRef" validate-trigger="onSubmit" class="m-6" @submit="onSubmit">
      <van-field
        v-for="(formLabel, formKey) in {
          password: '旧密码',
          newPassword: '新密码',
          repeatPassword: '确认密码',
        }"
        :key="formKey"
        v-model="form[formKey]"
        center
        name="password"
        maxlength="18"
        :placeholder="formLabel"
        :type="showPassword ? 'text' : 'password'"
        :rules="[
          { required: true, message: `${formLabel}不能为空` },
          {
            validator: formKey == 'password' ? () => true : repeatValid,
            message: '新密码与确认密码不一致',
          },
        ]"
      >
        <template #right-icon>
          <van-icon
            :name="showPassword ? 'eye-o' : 'closed-eye'"
            @click="showPassword = !showPassword"
          />
        </template>
      </van-field>
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
