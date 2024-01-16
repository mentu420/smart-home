<script setup>
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { numberKeyboardProps } from 'vant'
import { ref, computed } from 'vue'

import TimePicker from '@/components/common/TimePicker.vue'
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
const showCalendar = ref(false)
const mounthRef = ref(null)
const checkboxRefs = ref([])
const minDate = new Date()
const maxDate = new Date(dayjs().add(10, 'y').format('YYYY-MM-DD'))
// 选中后的重复类型与重复日期 type:string 重复类型，list:array 重复日期
const checkedDate = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})

const onRepeatSelect = (detail) => {
  console.log('detail', detail)
  checkedDate.value = {
    type: detail.id,
    list: [],
  }
  switch (detail.id) {
    case 3:
      checkedDate.value = {
        ...checkedDate.value,
        chongfuzhi: [-1],
      }
      break
    case 4:
      showWeek.value = true
      break
    case 5:
      mounthRef.value?.open({
        columns: Array.from({ length: 31 }, (_, index) => ({
          text: `${index + 1}日`,
          value: index + 1,
        })),
      })
      checkedDate.value = {
        ...checkedDate.value,
        chongfuzhi: [],
      }
      break
    case 6:
      mounthRef.value?.open({
        columns: [
          Array.from({ length: 12 }, (_, index) => ({
            text: `${index + 1}月`,
            value: index + 1,
          })),
          Array.from({ length: 31 }, (_, index) => ({
            text: `${index + 1}日`,
            value: index + 1,
          })),
        ],
      })
      checkedDate.value = {
        ...checkedDate.value,
        list: [1, 1],
        chongfuzhi: ['01-01'],
      }
      break
    case 7:
      showCalendar.value = true
      checkedDate.value = {
        ...checkedDate.value,
        list: dayjs().format('YYYY-MM-DD').split('-'),
        chongfuzhi: [dayjs().format('YYYY-MM-DD')],
      }
      break
    default:
      break
  }
}

const onWeekChange = (value) => {
  checkedDate.value = {
    ...checkedDate.value,
    chongfuzhi: value,
  }
}

const selectMWithY = ({ selectedValues }) => {
  checkedDate.value = {
    ...checkedDate.value,
    list: selectedValues,
    chongfuzhi:
      checkedDate.value.type == 5
        ? selectedValues
        : [selectedValues.map((num) => (num < 10 ? '0' + num : num)).join('-')],
  }
}

const onCalendarConfirm = (value) => {
  checkedDate.value = {
    ...checkedDate.value,
    list: dayjs(value).format('YYYY-MM-DD').split('-'),
    chongfuzhi: [dayjs(value).format('YYYY-MM-DD')],
  }
  showCalendar.value = false
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
    :value="getRepeatTimeText(checkedDate)"
    @click="showRepeatAction = true"
  />
  <van-action-sheet
    v-model:show="showRepeatAction"
    :actions="repeatActions"
    cancel-text="取消"
    close-on-click-action
    teleport="body"
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
              <van-checkbox :ref="(el) => (checkboxRefs[weekIndex] = el)" :name="key" @click.stop />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </div>
  </van-popup>
  <PickerSearch ref="mounthRef" @confirm="selectMWithY" />
  <van-calendar
    v-model:show="showCalendar"
    :min-date="minDate"
    :max-date="maxDate"
    teleport="#app"
    @confirm="onCalendarConfirm"
  />
</template>
