<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { vaildPhone, trimFormat } from '@/hooks/useFormValidator.js'

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
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        >
          <template #extra>
            <label @click="goForget">获取验证码</label>
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
