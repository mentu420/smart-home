<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  useAttrs,
  useSlots,
  onMounted,
  onDeactivated,
  nextTick,
} from 'vue'

import { useListLoad } from '@/hooks/useListLoad.js'

const props = defineProps({
  config: {
    type: Object,
    default: () => {},
    required: true,
  },
})

const emits = defineEmits(['scroll', 'update:loading', 'update:moreLoading'])
const attrs = useAttrs()
const slots = useSlots()
const listRef = ref(null)
const state = reactive({
  empty: { description: '暂无数据' },
})

const { loading, moreLoading, finished, list, onMore, onReload } = useListLoad(props.config)

const showEmpty = computed(() => {
  return list.value.length == 0
})

const finishedText = computed(() => (showEmpty.value ? null : `~ END ~`))

//empty attrs
const emptyAttrs = computed(() => {
  const result = ['image', 'image-size', 'description']
    .filter((key) => attrs[key])
    .map((key) => ({ [key]: attrs[key] }))
  return Object.assign(state.empty, ...result)
})

// body scroll event
const scrollTo = (params) => {
  //behavior  类型String,表示滚动行为,支持参数 smooth(平滑滚动),instant(瞬间滚动),默认值auto
  window.scroll({ left: 0, top: 0, behavior: 'smooth', ...params })
}

const onScroll = () => {
  const scrollTop =
    window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  emits('scroll', scrollTop)
}
// 数据请求出错处理
const useNetwork = (err) => {
  state.empty = {
    image: 'network',
    description: err.message || '网络错误',
  }
}

defineExpose({ onReload })
</script>

<template>
  <van-pull-refresh v-model="loading" @refresh="onReload">
    <van-list
      ref="listRef"
      v-model:loading="moreLoading"
      :immediate-check="false"
      :finished="finished"
      @load="onMore"
    >
      <slot :list="list"></slot>
      <template #finished>
        <slot name="empty" :show="showEmpty">
          <van-empty v-if="showEmpty" v-bind="emptyAttrs"> </van-empty>
        </slot>
        <div>{{ finishedText }}</div>
      </template>
    </van-list>
  </van-pull-refresh>
</template>
