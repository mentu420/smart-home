<script setup>
import { showToast } from 'vant'
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { getSms, setUserConfig } from '@/apis/commonApi.js'
import CountDown from '@/components/common/CountDown.vue'
import { validPassword, trimFormat } from '@/hooks/useFormValidator.js'
import { useLogout } from '@/hooks/useLogout'
import userStore from '@/store/userStore'

defineOptions({ name: 'SetPassword' })

const router = useRouter()
const route = useRoute()
const password = ref(null)
const loading = ref(false)
const form = ref({})
const showEye = ref([false, false])

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

const getRegisterCode = async () => {
  try {
    const { shouji } = await userStore().useUserInfoSync()
    return getSms({ shouji, leixing: 1 })
  } catch (error) {
    return error
  }
}

const onSubmit = async () => {
  try {
    loading.value = true
    const { shouji } = await userStore().useUserInfoSync()
    await setUserConfig({
      params: { op: 5 },
      data: {
        mima: form.value.password,
        shoujihaoma: shouji,
        yanzhengma: form.value.code,
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
    <h1 class="my-8">设置密码</h1>
    <van-form @submit="onSubmit">
      <van-field
        v-for="(pLabel, pKey, pIndex) in { password: '密码', repeatPassword: '确认密码' }"
        :key="pKey"
        v-model.trim="form[pKey]"
        :name="pKey"
        :placeholder="pLabel"
        :type="showEye[pIndex] ? 'text' : 'password'"
        maxlength="18"
        clearable
        :rules="vaildPasswordFormat"
      >
        <template #extra>
          <div @click="showEye[pIndex] = !showEye[pIndex]">
            <van-icon v-if="showEye[pIndex]" class="!text-[20px] ml-4" name="eye-o" />
            <van-icon v-else class="!text-[20px] ml-4" name="closed-eye" />
          </div>
        </template>
      </van-field>
      <van-field
        v-model="form.code"
        name="code"
        placeholder="验证码"
        maxlength="6"
        :rules="[{ required: true, message: '请填写验证码' }]"
      >
        <template #extra>
          <CountDown :duration="60" :request="getRegisterCode" />
        </template>
      </van-field>
      <div class="my-10">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :disabled="form.password != '' && form.repeatPassword != '' && form.code != ''"
          :loading="loading"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
