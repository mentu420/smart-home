<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AirCoolerTrigger from '@/components/common/AirCoolerTrigger.vue'
import CurtainTrigger from '@/components/common/CurtainTrigger.vue'
import LightTrigger from '@/components/common/LightTrigger.vue'
import ClickableOpacity from '@/components/layout/clickableOpacity.vue'
import deviceStore from '@/store/deviceStore'

const route = useRoute()
const router = useRouter()

const airConfig = ref({ temp: 18, speed: 1, model: 1 })
const brightness = ref(100)
const degree = ref(100)

onMounted(() => {})
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="设备名称">
      <template #right>
        <IconPark type="more" @click="router.push({ path: '/smartDeviceInfo' })" />
      </template>
    </HeaderNavbar>
    <section>
      <van-image
        width="100vw"
        height="100vw"
        fit="cover"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      />
      <CurtainTrigger v-model="degree" />
      <LightTrigger v-model="brightness" />
      <AirCoolerTrigger v-model="airConfig" />
    </section>
  </div>
</template>
