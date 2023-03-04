<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({})
const checked = ref(false) // 是否记住账号密码
const show = ref(false) //是否展示记住的账号
const accountList = ref([])

const onSubmit = async () => {}

const goForget = () => {
  router.push({ path: '/forgetPassword' })
}
const goOtherLogin = () => {
  router.push({ path: '/phoneLogin' })
}
</script>

<template>
  <div class="p-4">
    <h1 class="mt-10 ml-2 mb-10">密码登录</h1>
    <van-form class="m-2" @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="form.username"
          name="username"
          placeholder="用户名"
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
            <van-cell class="account-item" title="单元格">
              <van-icon name="clear" />
            </van-cell>
          </van-cell-group>
        </transition>
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        >
          <template #extra>
            <label @click="goForget">忘记密码</label>
          </template>
        </van-field>
      </van-cell-group>
      <div class="mt-10 ml-2">
        <van-checkbox v-model="checked">记住密码</van-checkbox>
      </div>
      <div class="my-4">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
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
