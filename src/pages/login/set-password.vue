<script setup>
import { showToast } from 'vant'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { setUserConfig } from '@/apis/commonApi'
import { validPassword } from '@/hooks/useFormValidator.js'
import { useLogout } from '@/hooks/useLogout'

defineOptions({ name: 'SetPassword' })

const router = useRouter()
const route = useRoute()
const form = ref({})
const loading = ref(false)

const vaildPasswordFormat = [
  { required: true, message: '请填写密码' },
  {
    validator: (value) => validPassword(value),
    message: '密码不能含有中文、全角字符、问号和空格。密码最短不能少于6位，密码最长不能超过32字符',
  },
  {
    validator: () => {
      const { password = '', repeatPassword = '' } = form.value
      return !(password != '' && repeatPassword != '' && password != repeatPassword)
    },
    message: '密码与确认密码不一致',
  },
]

const onSubmit = async () => {
  try {
    loading.value = true
    const { phone, code } = route.query
    await setUserConfig({
      params: { op: 5 },
      data: {
        mima: form.value.password,
        shoujihaoma: phone,
        yanzhengma: code,
      },
    })
    useLogout('密码修改成功，请使用新密码登录')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-6">
    <HeaderNavbar />
    <h1 class="my-8">设置新密码</h1>
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.password"
        name="password"
        placeholder="密码"
        maxlength="18"
        :rules="vaildPasswordFormat"
      />
      <van-field
        v-model="form.repeatPassword"
        name="repeatPassword"
        placeholder="确认密码"
        maxlength="18"
        :rules="vaildPasswordFormat"
      />
      <div class="my-10">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :disabled="!form.password || !form.repeatPassword"
          :loading="loading"
        >
          下一步
        </van-button>
      </div>
    </van-form>
  </div>
</template>
