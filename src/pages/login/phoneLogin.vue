<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { getSms, setUserConfig } from '@/apis/commonApi.js'
import CountDown from '@/components/common/CountDown.vue'
import { vaildPhone, phoneReg, setFormFormat } from '@/hooks/useFormValidator.js'
import userStore from '@/store/userStore'
import DeviceInfo from '@/utils/deviceInfo.js'

const router = useRouter()
const form = ref({})
const checked = ref(true) // 是否记住账号密码
const formRef = ref(null)

const getRegisterCode = async () => {
  try {
    await formRef.value.validate(['phone'])
    return getSms({ shouji: form.value.phone, leixing: 1 })
  } catch (error) {
    return error
  }
}

const onSubmit = async (value) => {
  const { useSetToken } = userStore()
  const { code, data } = await setUserConfig(
    {
      params: { op: '0' },
      data: {
        shoujixinghao: DeviceInfo.platform,
        shoujimingcheng: DeviceInfo.platform,
        xitongleixing: DeviceInfo.system == 'ios' ? 1 : 2,
        dengluleixing: 2,
        shoujihaoma: value.phone,
        mima: value.code,
        tuisongtoken: 'tuisongtoken',
      },
    },
    { withToken: false }
  )
  useSetToken(data.acesstoken)
  router.replace({ path: '/tabbar/tabbarHouse' })
}

const goOtherLogin = () => {
  router.back()
}

const onValidPhone = (value) => vaildPhone(value)
</script>

<template>
  <div class="p-6">
    <h1 class="mb-6 mt-10">验证码登录</h1>
    <van-form ref="formRef" @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="form.phone"
          name="phone"
          placeholder="手机号码"
          maxlength="11"
          type="tel"
          :rules="[
            { required: true, message: '请填写手机号码' },
            { validator: onValidPhone, message: '手机号码格式有误' },
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
            <CountDown :disabled="!form.phone" :duration="60" :request="getRegisterCode" />
          </template>
        </van-field>
      </van-cell-group>
      <div class="ml-2 mt-10">
        <van-checkbox v-model="checked">记住密码</van-checkbox>
      </div>
      <div class="my-4">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
      <div class="text-center" @click="goOtherLogin">密码登录</div>
    </van-form>
  </div>
</template>
