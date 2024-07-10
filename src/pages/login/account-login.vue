<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { trimFormat } from '@/hooks/useFormValidator.js'
import useLogin from '@/hooks/useLogin'
import { mergeObjectIntoArray } from '@/utils/common'
import { getStorage, setStorage } from '@/utils/storage.js'
import { showDialog } from 'vant'
import AgreementConceal from '@/components/common/AgreementConceal.vue'

defineOptions({ name: 'AccountLogin' })

const router = useRouter()
const form = ref({})
const checked = ref(true) // 是否记住账号密码
const agree = ref(true)
const showPopover = ref(false) //是否展示记住的账号
const showPassword = ref(false)
const accountList = ref([])
const loading = ref(false)

const onSubmit = async (values) => {
  try {
    loading.value = true
    // if (checked.value) {
    //   accountList.value = mergeObjectIntoArray(values, accountList.value, 'username')
    //   setStorage('account-list', accountList.value)
    // }
    await useLogin({ shoujihaoma: values.username, mima: values.password, dengluleixing: 1 })

    router.replace({ path: '/tabbar' })
  } catch (error) {
    showDialog({
      title: '错误',
      message: error?.data?.des ?? error.message ?? JSON.stringify(error?.data),
    })
  } finally {
    loading.value = false
  }
}

const selectAccountItem = (item) => {
  showPopover.value = false
  form.value = item
}
const delectAccountItem = (index) => {
  accountList.value = accountList.value.filter((item, i) => index != i)
}

const init = () => {
  accountList.value = getStorage('account-list') || []
}

init()

const goForget = () => {
  router.push({ path: '/forget-password' })
}
const goOtherLogin = (type) => {
  router.push({ path: '/phone-login', query: { type } })
}
</script>

<template>
  <div class="p-4 pt-safe-offset-4 h-screen">
    <h1 class="mb-10 ml-2 mt-10">密码登录</h1>
    <van-form class="m-2" @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model.trim="form.username"
          center
          name="username"
          placeholder="用户名"
          maxlength="30"
          class="!py-6"
          :formatter="trimFormat"
          :rules="[{ required: true, message: '请填写用户名' }]"
          @focus="showPopover = true"
          @blur="showPopover = false"
        >
          <!-- <template #extra>
            <van-popover v-model:show="showPopover" placement="bottom-end">
              <template #reference>
                <van-icon :name="showPopover ? 'arrow-down' : 'arrow'" />
              </template>
              <van-cell-group class="w-[80vw]">
                <van-cell
                  v-for="(accountItem, accountIndex) in accountList"
                  :key="accountIndex"
                  clickable
                  :title="accountItem.username"
                  @click="selectAccountItem(accountItem)"
                >
                  <van-icon name="clear" @click="delectAccountItem(accountIndex)" />
                </van-cell>
              </van-cell-group>
            </van-popover>
          </template> -->
        </van-field>
        <!-- <transition name="van-fade"> </transition> -->
        <van-field
          v-model.trim="form.password"
          center
          name="password"
          placeholder="密码"
          maxlength="18"
          class="!py-6"
          :type="showPassword ? 'text' : 'password'"
          :rules="[{ required: true, message: '请填写密码' }]"
        >
          <template #extra>
            <div class="flex items-center">
              <van-icon
                :name="showPassword ? 'eye-o' : 'closed-eye'"
                @click="showPassword = !showPassword"
              />
              <label class="ml-4" @click="goForget">忘记密码</label>
            </div>
          </template>
        </van-field>
        <AgreementConceal v-model="agree" />
      </van-cell-group>
      <!-- <div class="ml-2 mt-10">
        <van-checkbox v-model="checked">记住密码</van-checkbox>
      </div> -->
      <div class="my-4">
        <van-button round block type="success" :loading="loading" native-type="submit">
          登录
        </van-button>
      </div>
      <ul class="text-center flex justify-between items-center p-4">
        <li @click="goOtherLogin(0)">立即注册</li>
        <li @click="goOtherLogin(1)">验证码登录</li>
      </ul>
    </van-form>
  </div>
</template>
