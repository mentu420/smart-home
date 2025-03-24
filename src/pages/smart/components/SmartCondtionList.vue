<script setup>
import { ref } from 'vue'

import smartStore from '@/store/smartStore'

const { getRepeatTimeText } = smartStore()

const props = defineProps({
  item: { type: Object, default: () => {} },
})

const emits = defineEmits(['openTime', 'openMode'])

const selectTime = (item) => emits('openTime', item)

const selectMode = (modeItem, item) => emits('openMode', modeItem, item)
</script>

<template>
  <span
    v-if="props.item?.leixing == 1"
    class="van-haptics-feedback leading-[40px] rounded-full bg-gray-100 px-4 py-1"
    @click.stop="selectTime(props.item)"
  >
    <span>{{
      getRepeatTimeText({
        type: props.item?.tiaojian.chongfuleixing,
        value: props.item?.tiaojian.chongfuzhi,
      })
    }}</span>
    <span class="ml-2">{{
      props.item?.tiaojian?.shijian
        ? props.item?.tiaojian?.shijian
        : `${props.item?.tiaojian?.kaishishijian}至${props.item?.tiaojian?.jieshushijian}`
    }}</span>
  </span>
  <template v-else>
    <span
      v-for="(modeItem, modeIndex) in props.item?.tiaojian?.modeList"
      :key="modeItem.id"
      class="break-all"
    >
      <span v-if="modeIndex != 0" class="mx-2">且</span>
      <span
        class="van-haptics-feedback leading-[40px] rounded-full bg-gray-100 px-4 py-1 break-all mr-2"
      >
        {{ props.item?.tiaojian?.label }}
      </span>
      <span
        class="van-haptics-feedback leading-[40px] rounded-full bg-gray-100 px-4 py-1 break-all mr-2"
        @click="selectMode(modeItem, props.item)"
      >
        {{ modeItem.label }} -
        {{
          modeItem.valueIsNum
            ? modeItem.useValue
            : props.item?.tiaojian?.modeNames[`${modeItem.use}-${modeItem.useStatus}`]
        }}
      </span>
    </span>
  </template>
</template>
