<script setup>
import { ref, useAttrs } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['update:show', 'reset', 'confirm'])

const attrs = useAttrs()

const visible = ref(false)

const close = () => (visible.value = false)

const open = () => (visible.value = true)

const onRest = () => {
  close()
  emits('reset')
}

const onConfirm = () => {
  close()
  emits('confirm')
}

defineExpose({ open, close })
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
              <van-button block round plain size="small" @click="onRest"> 重置 </van-button>
            </li>
            <li>
              <van-button block round size="small" @click="onConfirm"> 确定 </van-button>
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
