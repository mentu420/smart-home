<script>
import { useRoute } from 'vue-router'
export default {
  name: 'NotFount',
  setup(props) {
    const route = useRoute()
    const message = route.query.message

    return {
      message,
    }
  },
}
</script>

<template>
  <div>
    <van-empty image="error" description="出错了，请联系管理员" />
    <van-divider v-if="message != ''">
      {{ message }}
    </van-divider>
  </div>
</template>
