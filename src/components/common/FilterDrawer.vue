<script setup>
import { computed, useAttrs } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['update:show', 'reset', 'confirm'])

const attrs = useAttrs()

const visible = computed({
  get: () => props.show,
  set: (val) => emits('update:show', val),
})

const onClose = () => {
  visible.value = false
}

const onRest = () => {
  onClose()
  emits('reset')
}

const onConfirm = () => {
  onClose()
  emits('confirm')
}
</script>

<template>
  <van-popup
    v-model:show="visible"
    lock-scroll
    get-container="body"
    position="right"
    v-bind="attrs"
  >
    <div class="body">
      <van-sticky>
        <van-cell :title="props.title">
          <template #right-icon>
            <van-icon color="#999" size="24" name="clear" @click="onClose" />
          </template>
        </van-cell>
      </van-sticky>
      <div class="content">
        <slot></slot>
      </div>
      <div class="footer">
        <slot name="footer">
          <ul class="footer-btn">
            <li>
              <van-button block round type="primary" plain size="small" @click="onRest">
                重置
              </van-button>
            </li>
            <li>
              <van-button block round type="primary" size="small" @click="onConfirm">
                确定
              </van-button>
            </li>
          </ul>
        </slot>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.body {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.content {
  height: calc(100vh - 104px);
  @include interior-scroll;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  .footer-btn {
    display: flex;
    background-color: #fff;
    padding: 16px;
    justify-content: space-around;
    & > li {
      flex: 1;
      padding: 0 16px;
    }
  }
}
</style>
