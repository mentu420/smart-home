<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')
const newPassword = ref('')

const onSubmit = async () => {}
</script>

<template>
  <div class="min-h-screen">
    <HeaderNavbar title="修改密码" />
    <van-form class="m-6" @submit="onSubmit">
      <van-field
        v-model="password"
        name="password"
        placeholder="请输入旧密码"
        :rules="[{ required: true, message: '旧密码不能为空' }]"
      />
      <van-field
        v-model="newPassword"
        name="newPassword"
        placeholder="请输入新密码"
        maxlength="6"
        :rules="[{ required: true, message: '新密码不能为空' }]"
      />
      <div class="my-10">
        <van-button round block type="primary" native-type="submit"> 完成 </van-button>
        <div
          class="m-4 text-center text-sm text-gray-500"
          @click="router.push({ path: '/forgetPassword' })"
        >
          忘记密码
        </div>
      </div>
    </van-form>
  </div>
</template>
