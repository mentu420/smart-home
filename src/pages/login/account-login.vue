<script setup>
import { showDialog } from 'vant'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { trimFormat } from '@/hooks/useFormValidator.js'
import useLogin from '@/hooks/useLogin'
import { getStorage, setStorage } from '@/utils/storage.js'

defineOptions({ name: 'AccountLogin' })

const router = useRouter()
const form = ref({})
const checked = ref(true) // 是否记住账号密码
const show = ref(false) //是否展示记住的账号
const showPassword = ref(false)
const accountList = ref([])
const loading = ref(false)

const onSubmit = async (values) => {
  try {
    loading.value = true
    if (checked.value) {
      accountList.value = accountList.value.map((accountItem) => {
        if (accountItem.username == values.username) return values
        return accountItem
      })
      setStorage('account-list', accountList.value)
    }
    await useLogin({ shoujihaoma: values.username, mima: values.password, dengluleixing: 1 })

    router.replace({ path: '/tabbar/tabbar-house' })
  } catch (error) {
    showDialog({ title: '错误', message: error?.data?.des || JSON.stringify(error?.data) })
  } finally {
    loading.value = false
  }
}

const selectAccountItem = (item) => {
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
const goOtherLogin = () => {
  router.push({ path: '/phone-login' })
}
</script>

<template>
  <div class="p-4">
    <h1 class="mb-10 ml-2 mt-10">密码登录</h1>
    <van-form class="m-2" @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="form.username"
          center
          name="username"
          placeholder="用户名"
          :formatter="trimFormat"
          maxlength="30"
          :rules="[{ required: true, message: '请填写用户名' }]"
        >
          <template #extra>
            <span @click="show = !show">
              <van-icon :name="show ? 'arrow-down' : 'arrow'" />
            </span>
          </template>
        </van-field>
        <transition name="van-fade">
          <van-cell-group v-if="show">
            <van-cell
              v-for="(accountItem, accountIndex) in accountList"
              :key="accountIndex"
              class="account-item"
              :title="accountItem.username"
              @click="selectAccountItem(accountItem)"
            >
              <van-icon name="clear" @click="delectAccountItem(accountIndex)" />
            </van-cell>
          </van-cell-group>
        </transition>
        <van-field
          v-model="form.password"
          center
          :type="showPassword ? 'text' : 'password'"
          name="password"
          placeholder="密码"
          maxlength="18"
          :rules="[{ required: true, message: '请填写密码' }]"
        >
          <template #right-icon>
            <van-icon
              :name="showPassword ? 'eye-o' : 'closed-eye'"
              @click="showPassword = !showPassword"
            />
          </template>
          <template #extra>
            <label class="ml-4" @click="goForget">忘记密码</label>
          </template>
        </van-field>
      </van-cell-group>
      <div class="ml-2 mt-10">
        <van-checkbox v-model="checked">记住密码</van-checkbox>
      </div>
      <div class="my-4">
        <van-button round block type="primary" :loading="loading" native-type="submit">
          登录
        </van-button>
      </div>
      <div class="text-center" @click="goOtherLogin">其他方式登录</div>
    </van-form>
  </div>
</template>

<style scoped lang="scss">
.account-item {
  background: #f5f5f5;
}
</style>
