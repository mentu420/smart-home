<script setup>
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { ref, computed, nextTick } from 'vue'

import smartStore from '@/store/smartStore'

import PickerSearch from './PickerSearch.vue'

const { repeatActions, weekData, getRepeatTimeText } = storeToRefs(smartStore())

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {},
  },
})

const emits = defineEmits(['update:modelValue'])

const showRepeatAction = ref(false)
const showWeek = ref(false)
const dateRef = ref(null)
const checkboxRefs = ref([])
// 选中后的重复类型与重复日期 type:string 重复类型，list:array 重复日期
const checkedDate = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})

const sheetActions = computed(() =>
  repeatActions.value.map((item) => {
    return {
      ...item,
      subname: item.id == checkedDate.value.type ? getRepeatTimeText.value(checkedDate.value) : '',
    }
  })
)

const onRepeatSelect = async (detail) => {
  showRepeatAction.value = false
  checkedDate.value = {
    type: detail.id,
    list: [],
  }
  const nowYear = dayjs().year()
  const yearList = Array.from({ length: 10 }, (_, index) => ({
    text: `${nowYear + index}年`,
    value: nowYear + index,
  }))
  const monthList = Array.from({ length: 12 }, (_, index) => ({
    text: `${index + 1}月`,
    value: index + 1,
  }))
  const dayList = Array.from({ length: 31 }, (_, index) => ({
    text: `${index + 1}日`,
    value: index + 1,
  }))

  await nextTick()
  switch (detail.id) {
    case 3:
      checkedDate.value = {
        ...checkedDate.value,
        value: [-1],
      }
      break
    case 4:
      showWeek.value = true
      break
    case 5:
      dateRef.value?.open({
        columns: dayList,
      })
      checkedDate.value = {
        ...checkedDate.value,
        list: [1],
        value: [],
      }
      break
    case 6:
      dateRef.value?.open({
        columns: [monthList, dayList],
      })
      checkedDate.value = {
        ...checkedDate.value,
        list: [1, 1],
        value: ['01-01'],
      }
      break
    case 7:
      dateRef.value?.open({
        columns: [yearList, monthList, dayList],
      })

      checkedDate.value = {
        ...checkedDate.value,
        list: dayjs().format('YYYY-MM-DD').split('-'),
        value: [dayjs().format('YYYY-MM-DD')],
      }
      break
    default:
      break
  }
}

const onWeekChange = (value) => {
  console.log(value)
  checkedDate.value = {
    ...checkedDate.value,
    value: value,
  }
}

const selectMonthDay = ({ selectedValues }) => {
  checkedDate.value = {
    ...checkedDate.value,
    list: selectedValues,
    value:
      checkedDate.value.type == 5
        ? selectedValues
        : [selectedValues.map((num) => (num < 10 ? '0' + num : num)).join('-')],
  }
}

const toggle = (index) => {
  checkboxRefs.value[index].toggle()
}
</script>

<template>
  <van-cell
    center
    title="日期与重复"
    is-link
    :label="getRepeatTimeText(checkedDate)"
    @click="showRepeatAction = true"
  />
  <van-action-sheet
    v-model:show="showRepeatAction"
    :actions="sheetActions"
    cancel-text="取消"
    close-on-click-action
    teleport="#app"
    @select="onRepeatSelect"
  />
  <van-popup v-model:show="showWeek" safe-area-inset-bottom position="bottom" teleport="body">
    <div>
      <van-cell title="自定义日期">
        <van-button type="primary" size="small" round @click="showWeek = false">关闭</van-button>
      </van-cell>

      <van-checkbox-group v-model="checkedDate.list" @change="onWeekChange">
        <van-cell-group inset>
          <van-cell
            v-for="(value, key, weekIndex) in weekData"
            :key="key"
            clickable
            :title="value"
            @click="toggle(weekIndex)"
          >
            <template #right-icon>
              <van-checkbox
                :ref="(el) => (checkboxRefs[weekIndex] = el)"
                :name="weekIndex"
                @click.stop
              />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </div>
  </van-popup>
  <PickerSearch ref="dateRef" @confirm="selectMonthDay" />
</template>
