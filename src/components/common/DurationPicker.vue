<template>
  <div>
    <van-form class="duration-time">
      <van-field
        readonly
        clickable
        name="startTime"
        :model-value="startTime"
        :border="false"
        placeholder="开始时间"
        @click="openStartTime"
      />
      <label>-</label>
      <van-field
        readonly
        clickable
        name="endTime"
        :model-value="endTime"
        :border="false"
        placeholder="结束时间"
        @click="openEndTime"
      />
    </van-form>
    <DatePicker ref="startTime" :type="type" title="选择开始时间" @confirm="startTimeConfirm" />
    <DatePicker ref="endTime" :type="type" title="选择结束时间" @confirm="endTimeConfirm" />
  </div>
</template>

<script>
import moment from 'moment'

import DatePicker from '@/components/common/DatePicker.vue'

export default {
  name: 'DurationPicker',
  components: {
    DatePicker,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: 'date',
    },
  },
  emits: ['change'],
  data() {
    return {
      startTime: '',
      endTime: '',
    }
  },
  watch: {
    value(val) {
      this.setTime(val)
    },
  },
  mounted() {
    this.setTime(this.value)
  },
  methods: {
    setTime(value) {
      if (!value) return
      this.startTime = value[0]
      this.endTime = value[1]
    },
    openStartTime() {
      this.$refs.startTime.show()
    },
    openEndTime() {
      if (this.startTime == '') {
        this.openStartTime()
        return
      }
      this.$refs.endTime.show()
    },
    startTimeConfirm({ selectedValues }) {
      this.$refs.startTime.close()
      const day = moment(selectedValues.join('-')).format('YYYY-MM-DD')
      if (this.endTime != '' && this.endTime < day) {
        this.startTime = this.endTime
        this.endTime = day
      } else {
        this.startTime = day
        if (this.endTime != '') return
        setTimeout(() => {
          this.$refs.endTime.show()
        }, 500)
      }
    },
    endTimeConfirm({ selectedValues }) {
      this.$refs.endTime.close()
      const day = moment(selectedValues.join('-')).format('YYYY-MM-DD')
      if (this.startTime < day) {
        this.endTime = day
      } else {
        this.endTime = this.startTime
        this.startTime = day
      }
      this.$emit('change', [this.startTime, this.endTime])
    },
  },
}
</script>

<style scoped lang="scss">
.duration-time {
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > label {
    margin: 0 16px;
  }
  &:deep(.van-cell) {
    border: 1px solid #ebedf0;
    padding: 6px 16px;
    border-radius: $border-radius-md;
  }
}
</style>
