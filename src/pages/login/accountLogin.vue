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
    <h1>密码登录</h1>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        >
          <template #extra>
            <span @click="show = !show">
              <van-icon v-if="show" name="arrow-down" />
              <van-icon v-else name="arrow" />
            </span>
          </template>
        </van-field>
        <transition name="van-slide-down">
          <van-cell-group v-if="show">
            <van-cell title="单元格" right-icon="clear" />
            <van-cell title="单元格" right-icon="clear" />
          </van-cell-group>
        </transition>
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        >
          <template #extra>
            <label @click="goForget">忘记密码</label>
          </template>
        </van-field>
      </van-cell-group>
      <van-checkbox v-model="checked">记住密码</van-checkbox>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
      <div @click="goOtherLogin">其他方式登录</div>
    </van-form>
  </div>
</template>
