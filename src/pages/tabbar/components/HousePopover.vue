<script setup>
import { computed, ref, useAttrs, useSlots } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const attrs = useAttrs()
const props = defineProps({
  modelValue: { type: String, default: '' },
  valueKey: { type: String, default: 'id' },
  labelKey: { type: String, default: 'label' },
  moreAction: {
    type: Object,
    default: () => ({ id: -1, label: '管理', icon: 'setting', path: '' }),
  },
})

const emits = defineEmits(['select', 'update:modelValue'])

const scopeData = ref({})
const show = ref(false)
const actionName = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})

const open = (data) => {
  show.value = true
  scopeData.value = data
}

const close = () => (show.value = false)

const onSelect = (item) => {
  actionName.value = item[props.valueKey]
  close()
  emits('select', item)
}

const goMore = () => {
  if (props.moreAction.path == '') return
  close()
  router.push(props.moreAction.path)
}

defineExpose({ open })
</script>

<template>
  <van-popover v-model:show="show" v-bind="attrs">
    <van-cell-group>
      <van-cell
        v-for="actionItem in attrs.actions"
        :key="actionItem[props.valueKey]"
        @click="onSelect(actionItem)"
      >
        <template #title>
          <div
            class="flex justify-center items-center space-x-2"
            :class="{ 'text-[#ff9d36]': actionName == actionItem[props.valueKey] }"
          >
            <van-icon v-if="actionName == actionItem[props.valueKey]" name="location" />
            <label>{{ actionItem[props.labelKey] }}</label>
          </div>
        </template>
      </van-cell>
      <div class="h-1 bg-page-gray"></div>
      <van-cell @click="goMore">
        <template #title>
          <div class="flex justify-center items-center space-x-2">
            <van-icon name="setting" />
            <label>{{ props.moreAction.label }}</label>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <template #reference>
      <slot name="reference"></slot>
    </template>
  </van-popover>
</template>
