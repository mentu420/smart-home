<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { updateUserInfo, getAuthToken } from '@/apis/common/user.js'
import useUserStore from '@/store/userStore.js'
import { isObjectString } from '@/utils/storage.js'

const route = useRoute()

const loadingText = ref('加载中...')
const { useUserInfoSync, useSetToken } = useUserStore()

const goRedirectUri = (url) => {
  window.location.replace(url)
}

const init = async () => {
  /***
   * @query
   * redirect_uri 重定向的url
   * scope snsapi_base 静默授权 snsapi_userinfo 跳转登录授权
   * state scope为snsapi_base时 里面存储userId和positionCrmId 用于获取token与职位设置 格式encodeURIComponent(JSON.stringify({ userId, positionCrmId }));
   * white_redirect 白名单 scope不用处理直接进行重定向
   * ***/
  const { redirect_uri, state, white_redirect, scope } = route.query
  console.log(redirect_uri, state, white_redirect, scope)
  const redirectUri = `${decodeURIComponent(redirect_uri)}&state=${state}`
  if (white_redirect) {
    goRedirectUri(redirectUri)
    return
  }
  if (!isObjectString(state) || scope === 'snsapi_userinfo') return
  const { userId, positionCrmId } = JSON.parse(decodeURIComponent(state))
  if (!userId) {
    console.warn('required userId')
    loadingText.value = '静默授权失败'
    return
  }
  const { code, data, msg } = await getAuthToken({ userId })
  if (code != 0) {
    loadingText.value = msg
    return
  }
  useSetToken(data)
  loadingText.value = '获取授权完成'
  //设置当前职位
  if (positionCrmId) {
    await updateUserInfo({ primaryPositionId: positionCrmId })
    loadingText.value = '职位设置完成'
  }
  await useUserInfoSync()
  loadingText.value = '获取用户信息完成'
  goRedirectUri(redirectUri)
}

init()
</script>

<template>
  <div class="view">
    <van-loading type="spinner" vertical>{{ loadingText }}</van-loading>
  </div>
</template>

<style lang="scss" scoped>
.view {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
