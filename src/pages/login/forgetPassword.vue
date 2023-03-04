<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { vaildPhone, trimFormat } from '@/hooks/useFormValidator.js'

const router = useRouter()
const form = ref({})
const checked = ref(false) // 是否记住账号密码
const show = ref(false) //是否展示记住的账号
const accountList = ref([])

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
    <HeaderNavbar />
    <h1 class="my-8">忘记密码</h1>
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.phone"
        name="phone"
        placeholder="手机号码"
        :rules="[{ required: true, message: '请填写手机号码' }]"
      />
      <div class="my-10">
        <van-button round block type="primary" native-type="submit" :disabled="!form.phone">
          下一步
        </van-button>
      </div>
    </van-form>
  </div>
</template>
