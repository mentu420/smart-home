<script setup>
import { ref } from 'vue'
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="添加设备" />
    <div class="flex items-center justify-center">
      <van-image
        width="20rem"
        height="20rem"
        fit="contain"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      />
    </div>
    <div class="text-center">正在扫描附件的设备...</div>
  </div>
</template>
