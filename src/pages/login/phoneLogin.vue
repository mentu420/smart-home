<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import CountDown from '@/components/common/CountDown.vue'
import { vaildPhone, phoneReg, setFormFormat } from '@/hooks/useFormValidator.js'

const router = useRouter()
const form = ref({})
const checked = ref(false) // 是否记住账号密码

const onSubmit = async () => {}

const goForget = () => {
  router.push({ path: '/' })
}
const goOtherLogin = () => {
  router.back()
}
</script>

<template>
  <div class="p-6">
    <h1 class="mt-10 mb-6">验证码登录</h1>
    <van-form @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="form.phone"
          name="phone"
          placeholder="手机号码"
          maxlength="11"
          type="tel"
          :formatter="(value) => setFormFormat(value, phoneReg)"
          :rules="[
            { required: true, message: '请填写手机号码' },
            { validator: (value) => vaildPhone(value), message: '手机号码格式有误' },
          ]"
        />
        <van-field
          v-model="form.code"
          name="code"
          placeholder="验证码"
          maxlength="6"
          :rules="[{ required: true, message: '请填写验证码' }]"
        >
          <template #extra>
            <CountDown :disabled="!form.phone" :duration="60" />
          </template>
        </van-field>
      </van-cell-group>
      <div class="mt-10 ml-2">
        <van-checkbox v-model="checked">记住密码</van-checkbox>
      </div>
      <div class="my-4">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
      <div class="text-center" @click="goOtherLogin">密码登录</div>
    </van-form>
  </div>
</template>
