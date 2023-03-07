<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <div class="flex items-center p-6">
      <van-image
        width="3rem"
        height="3rem"
        fit="cover"
        round
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      />
      <h4 class="ml-4">用户名称</h4>
    </div>
    <van-grid class="me-grid-list" :column-num="2" :gutter="10">
      <van-grid-item icon="photo-o" text="文字" />
      <van-grid-item icon="photo-o" text="文字" />
    </van-grid>

    <ul class="p-3">
      <li class="flex items-center justify-between rounded-lg bg-white p-4">
        <div class="flex items-center">
          <IconPark type="config" theme="filled" />
          <p class="ml-4">设置</p>
        </div>
        <van-icon name="arrow" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.me-grid-list:deep(.van-grid-item__content),
.me-cell-group:deep(.van-cell) {
  border-radius: 16px;
  overflow: hidden;
}
</style>
