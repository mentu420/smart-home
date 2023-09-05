<script setup>
import { showToast } from 'vant'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { setUserConfig } from '@/apis/commonApi'
import { validPassword, trimFormat } from '@/hooks/useFormValidator.js'
import { useLogout } from '@/hooks/useLogout'

defineOptions({ name: 'SetPassword' })

const router = useRouter()
const route = useRoute()
const password = ref(null)
const loading = ref(false)

const onSubmit = async () => {
  try {
    loading.value = true
    const { phone, code } = route.query
    await setUserConfig({
      params: { op: 5 },
      data: {
        mima: password.value,
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
        v-model="password"
        name="password"
        placeholder="密码"
        maxlength="18"
        :rules="[
          { required: true, message: '请填写密码' },
          { validator: (value) => validPassword(value), message: '密码必须包含大、小写字母和数字' },
        ]"
      />
      <div class="my-10">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :disabled="!password"
          :loading="loading"
        >
          下一步
        </van-button>
      </div>
    </van-form>
  </div>
</template>
