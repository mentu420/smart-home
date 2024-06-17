<script>
import { ref, onMounted, onActivated } from 'vue'

import useCountDownTime from '@/hooks/useCountDownTime.js'

export default {
  name: 'CountDown',
  props: {
    format: {
      type: String,
      default: 'ss 秒重新获取',
    },
    request: {
      type: Function,
      default: () => {},
      require: true,
    },
    duration: {
      type: Number,
      default: 60,
    },
    cookieKey: {
      type: String,
      default: 'count-down-cookie',
    },
  },
  setup(props, { emit }) {
    const countTime = ref(0)
    const codeStatus = ref(0) // 0 未获取验证码  1 已经获取过验证码
    const loading = ref(false)

    const fetchDownCountTime = () => {
      const s = useCountDownTime({
        key: props.cookieKey,
      })
      countTime.value = Number(s) * 1000
      if (countTime.value > 0) codeStatus.value = 1
    }

    onActivated(() => {
      fetchDownCountTime()
    })

    const onChange = (value) => {
      const { seconds } = value
      useCountDownTime({
        key: props.cookieKey,
        duration: props.duration,
        seconds,
      })
    }

    const onFinish = (value) => {
      countTime.value = 0
    }

    const sendSms = async () => {
      try {
        loading.value = true
        if (countTime.value > 0) return
        await props.request()
        countTime.value = props.duration * 1000
        codeStatus.value = 1
      } finally {
        loading.value = false
      }
    }

    return {
      countTime,
      codeStatus,
      loading,
      onChange,
      onFinish,
      sendSms,
    }
  },
}
</script>

<template>
  <van-button size="small" native-type="button" :loading="loading" v-bind="$attrs" @click="sendSms">
    <van-count-down
      v-if="countTime > 0"
      :time="countTime"
      :format="format"
      @change="onChange"
      @finish="onFinish"
    />
    <label v-else>
      {{ codeStatus == 0 ? '发送验证码' : '重新获取' }}
    </label>
  </van-button>
</template>
