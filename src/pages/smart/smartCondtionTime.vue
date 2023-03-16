<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import TimePicker from '@/components/common/TimePicker.vue'
import sceneStore from '@/store/sceneStore'

const { sceneCreateItem } = storeToRefs(sceneStore())

const router = useRouter()
const columsType = ref(['hour', 'minute'])
const currentTime = ref(dayjs().format('HH:ss').split(':'))
const showTimePicker = ref(false)
const conditionTimeList = ref([])
const repeatTime = ref('每天')
const showRepeatAction = ref(false)
const timePickerRef = ref(null)
const repeatActions = ref([
  { id: 0, name: '每天', value: [0, 1, 2, 3, 4, 5, 6, 7] },
  { id: 1, name: '工作日', value: [1, 2, 3, 4, 5, 6] },
  { id: 2, name: '周末', value: [0, 7] },
  { id: 3, name: '自定义日期', value: [] },
])

const weekData = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
}

const showWeek = ref(false)
const weekChecked = ref([])
const checkboxRefs = ref([])

const onTimeConfirm = ({ selectedValues }) => {
  conditionTimeList.value.push(selectedValues.join(':'))
  timePickerRef.value.close()
}

const delTimeItem = (i) => {
  conditionTimeList.value = conditionTimeList.value.filter((item, index) => index != i)
}

const toggle = (index) => {
  checkboxRefs.value[index].toggle()
}

const onWeekConfirm = () => {
  showWeek.value = false
  const repeatItem = repeatActions.value.find(
    (action) => action.value.length == weekChecked.value.length
  )
  if (repeatItem && repeatItem.value.length != 0) {
    repeatTime.value = repeatItem.name
    return
  }
  repeatTime.value = weekChecked.value.map((item) => weekData[item]).join('、')
}

const onRepeatSelect = (detail) => {
  if (detail.id == 3) {
    weekChecked.value = []
    showWeek.value = true
    return
  }
  weekChecked.value = detail.value
  repeatTime.value = detail.name
}

const onSave = () => {
  sceneCreateItem.value = {
    ...sceneCreateItem.value,
    events: conditionTimeList.value.map((timeItem) => ({
      leixing: 2,
      tiaojian: { time: timeItem },
    })),
  }
  router.go(-2)
}

const init = () => {
  const { events = [] } = sceneCreateItem.value
  if (events.length == 0) return
  conditionTimeList.value = events
    .filter((item) => item.leixing == 2)
    .map((item) => item.tiaojian.time)
}

init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="时间日期" />
    <section class="space-y-4 p-4">
      <van-cell class="rounded-lg" title="添加时间" is-link @click="timePickerRef.open()" />
      <van-swipe-cell
        v-for="(timeItem, timeIndex) in conditionTimeList"
        :key="timeIndex"
        class="overflow-hidden rounded-lg"
      >
        <van-cell :border="false" :title="`时间${timeIndex + 1}`" :value="timeItem" />
        <template #right>
          <van-button square type="danger" text="删除" @click="delTimeItem(timeIndex)" />
        </template>
      </van-swipe-cell>
      <van-cell
        center
        class="rounded-lg"
        title="日期与重复"
        is-link
        :value="repeatTime"
        @click="showRepeatAction = true"
      />
    </section>
    <TimePicker
      ref="timePickerRef"
      v-model="currentTime"
      title="添加时间"
      :columns-type="columsType"
      @confirm="onTimeConfirm"
    />
    <van-action-sheet
      v-model:show="showRepeatAction"
      :actions="repeatActions"
      cancel-text="取消"
      close-on-click-action
      @select="onRepeatSelect"
    />
    <div class="p-6">
      <van-button type="primary" block round @click="onSave"> 下一步 </van-button>
    </div>
    <van-popup v-model:show="showWeek" safe-area-inset-bottom position="bottom">
      <div>
        <van-cell title="自定义日期">
          <van-button type="primary" size="small" round @click="onWeekConfirm">确定</van-button>
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
                <van-checkbox
                  :ref="(el) => (checkboxRefs[weekIndex] = el)"
                  :name="key"
                  @click.stop
                />
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
    </van-popup>
  </div>
</template>
