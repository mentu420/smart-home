<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getSms, setUserConfig } from '@/apis/commonApi.js'
import CountDown from '@/components/common/CountDown.vue'
import { vaildPhone, trimFormat } from '@/hooks/useFormValidator.js'
import userStore from '@/store/userStore'

defineOptions({ name: 'MePhoneChange' })

const route = useRoute()
const router = useRouter()
const form = ref({})
const setp = ref(0) //记录是否点击更换手机号码
const formRef = ref(null)

const sendCode = async () => {
  await formRef.value.validate('phone')
  return getSms({ shouji: form.value.phone, leixing: 3 })
}

const onSubmit = async () => {
  await formRef.value.validate()
  await setUserConfig({ params: { op: 2 }, data: { shouji: form.value.phone } })
  const { useUserInfoSync } = userStore()
  await useUserInfoSync(true)
  router.goBack()
}
</script>

<template>
  <div class="min-h-scree">
    <HeaderNavbar title="绑定手机号" />
    <div class="m-6 mb-20">
      <p class="my-4">已经绑定手机</p>
      <h2>{{ route.query.value }}</h2>
    </div>
    <div v-if="setp == 0" class="mx-6 mt-20">
      <van-button round block type="success" @click="++setp"> 更换手机号 </van-button>
    </div>
    <van-form v-else ref="formRef" class="mx-6" @submit="onSubmit">
      <p class="my-4">绑定新手机号码</p>
      <van-field
        v-model.trim="form.phone"
        name="phone"
        placeholder="新手机号码"
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
        :rules="[{ required: true, message: '请填写短信验证码' }]"
      >
        <template #extra>
          <CountDown
            :disabled="form.phone == ''"
            :request="sendCode"
            format="ss秒"
            cookie-key="phone-change-countdown"
          />
        </template>
      </van-field>
      <div class="my-10 flex space-x-4">
        <van-button round block native-type="button" @click="--setp"> 取消 </van-button>
        <van-button round block type="success" native-type="submit" :disabled="!form.phone">
          下一步
        </van-button>
      </div>
    </van-form>
  </div>
</template>
