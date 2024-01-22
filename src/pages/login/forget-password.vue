<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { getSms } from '@/apis/commonApi'
import CountDown from '@/components/common/CountDown.vue'
import { vaildPhone, trimFormat } from '@/hooks/useFormValidator.js'

defineOptions({ name: 'ForgetPassword' })

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const form = ref({})

const onSubmit = async () => {
  router.push({
    path: '/set-password',
    query: { ...form.value },
  })
}

const sendCode = async () => {
  try {
    await formRef.value.validate(['phone'])
    return getSms({ shouji: form.value.phone, leixing: 2 }) //1注册验证码 2找回密码验证码 3验证码登录
  } catch (error) {
    return error
  }
}

watch(
  () => route.path,
  (to, from) => {
    if (to === '/forget-password' && ['/me-password-change', '/account-login'].includes(from)) {
      form.value = {}
    }
  }
)
</script>

<template>
  <div class="p-6">
    <HeaderNavbar />
    <h1 class="my-8">忘记密码</h1>
    <van-form ref="formRef" @submit="onSubmit">
      <van-field
        v-model.trim="form.phone"
        name="phone"
        placeholder="手机号码"
        class="!py-4"
        center
        :rules="[
          { required: true, message: '请填写手机号码' },
          { validator: (value) => vaildPhone(value), message: '手机号码格式有误' },
        ]"
      />
      <van-field
        v-model.trim="form.code"
        name="code"
        placeholder="短信验证码"
        maxlength="6"
        class="!py-4"
        center
        :rules="[{ required: true, message: '请填写短信验证码' }]"
      >
        <template #extra>
          <CountDown format="ss秒" :request="sendCode" />
        </template>
      </van-field>
      <div class="my-10">
        <van-button round block type="primary" native-type="submit" :disabled="!form.phone">
          下一步
        </van-button>
      </div>
    </van-form>
  </div>
</template>
