<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { vaildPhone, trimFormat } from '@/hooks/useFormValidator.js'

const router = useRouter()
const route = useRoute()
const form = ref({})
const checked = ref(false) // 是否记住账号密码
const show = ref(false) //是否展示记住的账号
const accountList = ref([])
const phone = ref(null)
const code = ref(null)
const time = ref(60 * 1000)

const onSubmit = async () => {
  router.push({ path: '/setPassword', query: { ...route.query, code: code.value } })
}

const goOtherLogin = () => {
  router.back()
}
</script>

<template>
  <div class="p-6">
    <HeaderNavbar />
    <h1 class="mt-8 mb-2">验证码已发送至</h1>
    <div class="mb-8 flex justify-between">
      <label>{{ route.query.phone }}</label>
      <van-count-down format="ss秒" :time="time" />
    </div>
    <van-form @submit="onSubmit">
      <van-field
        v-model="code"
        name="code"
        placeholder="短信验证码"
        maxlength="6"
        :rules="[{ required: true, message: '请填写短信验证码' }]"
      />
      <div class="my-10">
        <van-button round block type="primary" native-type="submit" :disabled="!code">
          下一步
        </van-button>
      </div>
    </van-form>
  </div>
</template>
