<script setup>
import { ref, reactive, computed, useAttrs, useSlots } from 'vue'
import { useRouter } from 'vue-router'

import DeviceInfo from '@/utils/deviceInfo.js'

const router = useRouter()

const attrs = useAttrs()
const slots = useSlots()

const useDefaultSlots = ['title', 'left', 'right']

const slotsKeys = computed(() => Object.keys(slots).filter((key) => useDefaultSlots.includes(key)))

const _attrs = computed(() => {
  const leftArrow = !DeviceInfo.isWechat
  return {
    border: false,
    fixed: true,
    placeholder: true,
    'left-arrow': leftArrow,
    'safe-area-inset-top': true,
    'z-index': 50,
    ...attrs,
  }
})

const onClickLeft = () => {
  if (typeof attrs['onClickLeft'] === 'function') return
  router.back()
}
</script>

<script>
export default {
  name: 'HeaderNavbar',
}
</script>

<template>
  <div class="header-navbar">
    <van-nav-bar v-bind="_attrs" @click-left="onClickLeft">
      <template v-for="slotName of slotsKeys" #[slotName]>
        <slot :name="slotName"></slot>
      </template>
    </van-nav-bar>
    <van-sticky offset-top="2.875rem">
      <slot></slot>
    </van-sticky>
  </div>
</template>

<style scoped lang="scss">
.header-navbar {
  position: relative;
  z-index: 1;
}
.van-nav-bar__left {
  display: none;
}
.header-right__btn.van-button--info {
  border: none;
}
</style>
