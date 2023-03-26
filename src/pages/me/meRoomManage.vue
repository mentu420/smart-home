<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { getRoomList } from '@/apis/houseApi'

const route = useRoute()

const init = async () => {
  const { data } = await getRoomList({ op: 1 })
}

init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="房间管理" />
  </div>
</template>
