<script setup>
import { ref, reactive, computed, useAttrs, toRefs } from 'vue'

import { useListLoad } from '@/hooks/useListLoad.js'

/**
 * @config {request:function,options:{},success:function}
 * **/

const props = defineProps({
  config: {
    type: Object,
    default: () => {},
    required: true,
  },
})

const { config } = toRefs(props)

const emits = defineEmits(['scroll', 'update:loading', 'update:moreLoading'])
const attrs = useAttrs()
const listRef = ref(null)
const state = reactive({
  empty: { description: '暂无数据' },
})

const { loading, moreLoading, finished, list, errMessage, onMore, onReload } = useListLoad(
  config.value
)

// 默认不展示，加载数据后根据list.length判断
const showEmpty = computed(() => {
  return !loading.value && list.value.length == 0
})

const finishedText = computed(() => (showEmpty.value ? null : `~ END ~`))

//empty attrs
const emptyAttrs = computed(() => {
  const result = ['image', 'image-size', 'description']
    .filter((key) => attrs[key])
    .map((key) => ({ [key]: attrs[key] }))
  if (errMessage.value) {
    return { image: 'network', description: errMessage.value }
  }
  return Object.assign(state.empty, ...result)
})

// 暴露列表数据
const getList = () => list.value

defineExpose({ onReload, getList })
</script>

<template>
  <van-pull-refresh v-model="loading" @refresh="onReload">
    <van-list
      ref="listRef"
      v-model:loading="moreLoading"
      :immediate-check="false"
      :finished="finished"
      :finished-text="finishedText"
      @load="onMore"
    >
      <slot :list="list"></slot>
      <div v-if="loading && list.length == 0" class="h-10"></div>
      <slot name="empty" :show="showEmpty">
        <van-empty v-if="showEmpty" v-bind="emptyAttrs"> </van-empty>
      </slot>
    </van-list>
  </van-pull-refresh>
</template>
