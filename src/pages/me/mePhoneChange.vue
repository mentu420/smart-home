<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import CountDown from '@/components/common/CountDown.vue'
import { vaildPhone, trimFormat } from '@/hooks/useFormValidator.js'

const route = useRoute()
const form = ref({})
const setp = ref(0) //记录是否点击更换手机号码

const sendCode = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
}

const onSubmit = async () => {}
</script>

<template>
  <div class="min-h-scree">
    <HeaderNavbar title="绑定手机号" />
    <div class="m-6 mb-20">
      <p class="my-4">已经绑定手机</p>
      <h2>188888888888</h2>
    </div>
    <div v-if="setp == 0" class="mx-6 mt-20">
      <van-button round block type="primary" @click="++setp"> 更换手机号 </van-button>
    </div>
    <van-form v-else class="mx-6" @submit="onSubmit">
      <p class="my-4">绑定新手机号码</p>
      <van-field
        v-model="form.phone"
        name="phone"
        placeholder="新手机号码"
        :rules="[
          { required: true, message: '请填写手机号码' },
          { validator: (value) => vaildPhone(value), message: '手机号码格式有误' },
        ]"
      />
      <van-field
        v-model="form.code"
        name="code"
        placeholder="短信验证码"
        maxlength="6"
        :rules="[{ required: true, message: '请填写短信验证码' }]"
      >
        <template #extra>
          <CountDown format="ss秒" :request="sendCode" />
        </template>
      </van-field>
      <div class="my-10 flex space-x-4">
        <van-button round block native-type="button" @click="--setp"> 取消 </van-button>
        <van-button round block type="primary" native-type="submit" :disabled="!form.phone">
          下一步
        </van-button>
      </div>
    </van-form>
  </div>
</template>
