<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const status = ref(true)
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="设备名称">
      <template #right>
        <icon-park type="more" @click="router.push({ path: '/smartDeviceInfo' })" />
      </template>
    </HeaderNavbar>
    <section>
      <van-image
        width="100vw"
        height="100vw"
        fit="cover"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      />
      <div class="p-4">
        <div
          class="mb-4 flex items-center justify-between rounded-lg bg-white p-3 active:opacity-50"
          @touchstart="() => {}"
        >
          <div>
            {{ status ? '已开启' : '已关闭' }}
          </div>
          <div @click="status = !status">
            <div
              v-if="status"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-theme-color"
            >
              <icon-park size="24" type="power" theme="filled" fill="#fff" />
            </div>
            <div v-else class="flex h-10 w-10 items-center justify-center">
              <icon-park size="24" type="power" theme="filled" fill="#999" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
