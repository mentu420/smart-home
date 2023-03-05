<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import CountDown from '@/components/common/CountDown.vue'
import { vaildPhone, trimFormat } from '@/hooks/useFormValidator.js'

const router = useRouter()
const phone = ref(null)
const code = ref(null)
const time = ref(60 * 1000)

const onSubmit = async () => {
  router.push({ path: '/setPassword', query: { phone: phone.value, code: code.value } })
}

const sendCode = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
}

const goOtherLogin = () => {
  router.back()
}
</script>

<template>
  <div class="p-6">
    <HeaderNavbar />
    <h1 class="my-8">忘记密码</h1>
    <van-form @submit="onSubmit">
      <van-field
        v-model="phone"
        name="phone"
        placeholder="手机号码"
        :rules="[
          { required: true, message: '请填写手机号码' },
          { validator: (value) => vaildPhone(value), message: '手机号码格式有误' },
        ]"
      />
      <van-field
        v-model="code"
        name="code"
        placeholder="短信验证码"
        maxlength="6"
        :rules="[{ required: true, message: '请填写短信验证码' }]"
      >
        <template #extra>
          <CountDown format="ss秒" :request="sendCode" />
        </template>
      </van-field>
      <div class="my-10">
        <van-button round block type="primary" native-type="submit" :disabled="!phone">
          下一步
        </van-button>
      </div>
    </van-form>
  </div>
</template>
