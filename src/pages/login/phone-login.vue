<script setup>
import { showDialog } from 'vant'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { getSms, setUserConfig } from '@/apis/commonApi.js'
import CountDown from '@/components/common/CountDown.vue'
import { vaildPhone, phoneReg, setFormFormat } from '@/hooks/useFormValidator.js'
import useLogin from '@/hooks/useLogin'

defineOptions({ name: 'PhoneLogin' })

const router = useRouter()
const form = ref({})
const checked = ref(true) // 是否记住账号密码
const formRef = ref(null)
const loading = ref(false)

const getRegisterCode = async () => {
  try {
    await formRef.value.validate(['phone'])
    return getSms({ shouji: form.value.phone, leixing: 1 })
  } catch (error) {
    return error
  }
}

const onSubmit = async (value) => {
  try {
    loading.value = true
    await useLogin({ shoujihaoma: value.phone, mima: value.code })
    router.replace({ path: '/tabbar/tabbar-house' })
  } catch (error) {
    showDialog({ title: '错误', message: error?.data?.des || JSON.stringify(error?.data) })
  } finally {
    loading.value = false
  }
}

const goOtherLogin = () => {
  router.goBack()
}

const onValidPhone = (value) => vaildPhone(value)
</script>

<template>
  <div class="p-4 mt-safe h-screen">
    <h1 class="mb-10 ml-2 mt-10">验证码登录</h1>
    <van-form ref="formRef" class="m-2" @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model.trim="form.phone"
          name="phone"
          placeholder="手机号码"
          maxlength="11"
          type="tel"
          class="!py-6"
          center
          :rules="[
            { required: true, message: '请填写手机号码' },
            { validator: onValidPhone, message: '手机号码格式有误' },
          ]"
        />
        <van-field
          v-model.trim="form.code"
          name="code"
          placeholder="验证码"
          maxlength="6"
          class="!py-6"
          center
          :rules="[{ required: true, message: '请填写验证码' }]"
        >
          <template #extra>
            <CountDown :disabled="!form.phone" :duration="60" :request="getRegisterCode" />
          </template>
        </van-field>
      </van-cell-group>
      <div class="ml-2 mt-10">
        <van-checkbox v-model="checked">记住密码</van-checkbox>
      </div>
      <div class="my-4">
        <van-button round block type="success" native-type="submit"> 提交 </van-button>
      </div>
      <div class="text-center" @click="goOtherLogin">密码登录</div>
    </van-form>
  </div>
</template>
