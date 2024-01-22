<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { setUserConfig } from '@/apis/commonApi.js'
import { validPassword } from '@/hooks/useFormValidator'
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
        v-model.trim="form[formKey]"
        center
        name="password"
        maxlength="18"
        class="!py-5"
        :placeholder="formLabel"
        :type="showPassword ? 'text' : 'password'"
        :rules="[
          { required: true, message: `${formLabel}不能为空` },
          {
            validator: formKey == 'password' ? () => true : repeatValid,
            message: '新密码与确认密码不一致',
          },
          {
            validator: formKey == 'password' ? () => true : validPassword,
            message: '新密码不能包含中文、全角字符、问号和空格',
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
      <p class="p-4 text-gray-300 text-xs">
        提示：密码不能含有中文、全角字符、问号和空格。密码最短不能少于6位，密码最长不能超过32字符
      </p>
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
