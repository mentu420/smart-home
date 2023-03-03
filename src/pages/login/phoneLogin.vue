<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({})
const checked = ref(false) // 是否记住账号密码
const show = ref(false) //是否展示记住的账号
const accountList = ref([])

const goForget = () => {
  router.push({ path: '/' })
}
const goOtherLogin = () => {
  router.push({ path: '/' })
}
</script>

<template>
  <div>
    <h1>验证码登录</h1>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.phone"
          name="phone"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        >
          <template #extra>
            <label @click="goForget">获取验证码</label>
          </template>
        </van-field>
      </van-cell-group>
      <van-checkbox v-model="checked">记住密码</van-checkbox>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
      <div @click="goOtherLogin">密码登录</div>
    </van-form>
  </div>
</template>
