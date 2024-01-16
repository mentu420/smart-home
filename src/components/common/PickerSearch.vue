<script setup>
import { ref, reactive, computed, useAttrs, useSlots } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  ellipsis: {
    type: Boolean,
    default: true,
  },
  searchKey: {
    type: String,
    default: null,
  },
  columns: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['update:show', 'update:modelValue', 'select'])

const attrs = useAttrs()
const slots = useSlots()
const pickerRef = ref(null)
const searchValue = ref('')
const scopeData = ref(null)
const showPicker = ref(false)

const selectedValues = computed({
  get: () => props.modelValue ?? [],
  set: (val) => emits('update:modelValue', val),
})

const popupAttrsKeys = ['click-overlay', 'click-close-icon', 'open', 'close', 'opened', 'closed']

const popupAttrs = computed(() =>
  Object.assign(
    {},
    ...popupAttrsKeys.filter((key) => attrs[key]).map((key) => ({ [key]: attrs[key] }))
  )
)

const _columns = computed(() => {
  const columns = props.columns.length > 0 ? props.columns : scopeData.value.columns
  if (!props.searchKey) return columns
  return searchValue.value == ''
    ? columns
    : columns.filter(
        (item) =>
          item[props.searchKey].includes(searchValue.value) ||
          searchValue.value.includes(item[props.searchKey])
      )
})

function open(data) {
  showPicker.value = true
  scopeData.value = data
}

function close() {
  showPicker.value = false
}

function onConfirm(values) {
  close()
  emits('select', values, scopeData.value)
}

defineExpose({ pickerRef, open, close })
</script>

<template>
  <van-popup v-model:show="showPicker" v-bind="popupAttrs" round position="bottom" teleport="body">
    <van-picker
      ref="pickerRef"
      v-model="selectedValues"
      v-bind="attrs"
      :class="{ ellipsis: !props.ellipsis }"
      :columns="_columns"
      @cancel="showPicker = false"
      @confirm="onConfirm"
    >
      <template #columns-top>
        <form v-if="searchKey" action="/">
          <van-search v-model="searchValue" shape="round" placeholder="请输入关键词搜索" />
        </form>
        <slot name="columns-top"> </slot>
      </template>
      <template v-for="(_, scopeSlotName) in slots" :key="scopeSlotName" #[scopeSlotName]="scope">
        <slot :name="scopeSlotName" v-bind="scope" />
      </template>
    </van-picker>
  </van-popup>
</template>

<style lang="scss" scoped>
.ellipsis:deep(.van-picker__columns .van-ellipsis) {
  overflow: auto;
  white-space: normal;
  text-overflow: clip;
}
</style>
