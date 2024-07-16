<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
defineOptions({ name: 'NotFound' })

const route = useRoute()
const router = useRouter()
const message = ref('')

const init = () => {
  message.value = route.query.message
}

init()
</script>

<template>
  <div>
    <van-empty image="error" description="出错了，请联系管理员">
      <van-button type="primary" round @click="router.replace('/')">返回首页</van-button>
    </van-empty>
    <van-divider v-if="message != ''">
      {{ message }}
    </van-divider>
  </div>
</template>
