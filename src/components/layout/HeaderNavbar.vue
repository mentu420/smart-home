<script setup>
import { ref, reactive, computed, useAttrs, useSlots } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'HeaderNavbar' })

const router = useRouter()

const attrs = useAttrs()
const slots = useSlots()

const useDefaultSlots = ['title', 'left', 'right']

const slotsKeys = computed(() => Object.keys(slots).filter((key) => useDefaultSlots.includes(key)))

const _attrs = computed(() => {
  return {
    border: false,
    fixed: true,
    placeholder: true,
    'left-arrow': true,
    'safe-area-inset-top': true,
    'z-index': 50,
    ...attrs,
  }
})

const onClickLeft = () => {
  if (typeof attrs['onClickLeft'] === 'function') return
  router.goBack()
}
</script>

<template>
  <van-nav-bar v-bind="_attrs" @click-left="onClickLeft">
    <template v-for="slotName of slotsKeys" #[slotName]>
      <slot :name="slotName"></slot>
    </template>
  </van-nav-bar>
</template>
