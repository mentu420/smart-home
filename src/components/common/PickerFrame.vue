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

const emits = defineEmits(['update:show', 'update:modelValue'])

const attrs = useAttrs()
const slots = useSlots()
const pickerRef = ref(null)
const searchValue = ref('')
const showPicker = computed({
  get: () => props.show,
  set: (val) => {
    emits('update:show', val)
  },
})

const selectedValues = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})

const defineSlots = ['toolbar', 'title', 'confirm', 'cancel', 'option', 'columns-bottom']

const slotsKeys = computed(() => Object.keys(slots).filter((key) => defineSlots.includes(key)))

const popupAttrsKeys = ['click-overlay', 'click-close-icon', 'open', 'close', 'opened', 'closed']

const popupAttrs = computed(() =>
  Object.assign(
    {},
    ...popupAttrsKeys.filter((key) => attrs[key]).map((key) => ({ [key]: attrs[key] }))
  )
)

const _columns = computed(() => {
  if (!props.searchKey) return props.columns
  return searchValue.value == ''
    ? props.columns
    : props.columns.filter(
        (item) =>
          item[props.searchKey].includes(searchValue.value) ||
          searchValue.value.includes(item[props.searchKey])
      )
})

defineExpose({ defineSlots, pickerRef })
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
    >
      <template #columns-top>
        <form v-if="searchKey" action="/">
          <van-search v-model="searchValue" shape="round" placeholder="????????????????????????" />
        </form>
        <slot name="columns-top"> </slot>
      </template>
      <template v-for="slotName of slotsKeys" #[slotName]>
        <slot :name="slotName"></slot>
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
