<script setup>
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'

import TimePicker from '@/components/common/TimePicker.vue'
import sceneStore from '@/store/sceneStore'

const { repeatActions, weekData, getRepeatTimeText } = storeToRefs(sceneStore())

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [0, 1, 2, 3, 4, 5, 6],
  },
})

const emits = defineEmits(['update:modelValue'])

const showRepeatAction = ref(false)
const showWeek = ref(false)
const checkboxRefs = ref([])

const weekChecked = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})

const onRepeatSelect = (detail) => {
  if (detail.id == 3) {
    weekChecked.value = []
    showWeek.value = true
    return
  }
  weekChecked.value = detail.value
}

const toggle = (index) => {
  checkboxRefs.value[index].toggle()
}
</script>

<template>
  <van-cell
    center
    class="rounded-lg"
    title="日期与重复"
    is-link
    :value="getRepeatTimeText(weekChecked)"
    @click="showRepeatAction = true"
  />
  <van-action-sheet
    v-model:show="showRepeatAction"
    :actions="repeatActions"
    cancel-text="取消"
    close-on-click-action
    @select="onRepeatSelect"
  />
  <van-popup v-model:show="showWeek" safe-area-inset-bottom position="bottom">
    <div>
      <van-cell title="自定义日期">
        <van-button type="primary" size="small" round @click="showWeek = false">确定</van-button>
      </van-cell>

      <van-checkbox-group v-model="weekChecked">
        <van-cell-group inset>
          <van-cell
            v-for="(value, key, weekIndex) in weekData"
            :key="key"
            clickable
            :title="value"
            @click="toggle(weekIndex)"
          >
            <template #right-icon>
              <van-checkbox :ref="(el) => (checkboxRefs[weekIndex] = el)" :name="key" @click.stop />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </div>
  </van-popup>
</template>
