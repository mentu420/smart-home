<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const checked = ref(true)
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="设置" />
    <section class="m-4 overflow-hidden rounded-xl">
      <van-cell-group>
        <van-cell title="设备名称" value="内容" is-link />
        <van-cell title="所属空间" value="内容" is-link />
        <van-cell center title="常用设备">
          <van-switch v-model="checked" />
        </van-cell>
      </van-cell-group>
    </section>
  </div>
</template>
