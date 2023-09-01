<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { TriggerLamp, TriggerCurtain, TriggerAirCooler } from '@/components/trigger/'
import deviceStore from '@/store/deviceStore'

const route = useRoute()
const router = useRouter()
const { deviceList } = storeToRefs(deviceStore())
const deviceItem = ref({})

const airConfig = ref({ temp: 18, speed: 1, model: 1 })
const brightness = ref(100)
const degree = ref(100)

const init = () => {
  deviceItem.value = deviceList.value.find((item) => item.id == route.query.id)
}
init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar :title="route.query.name">
      <template #right>
        <IconPark type="more" @click="router.push({ path: '/smart-deviceInfo' })" />
      </template>
    </HeaderNavbar>
    <section class="pb-4">
      <van-image
        width="100vw"
        height="100vw"
        fit="cover"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      />
      <TriggerLamp v-if="route.query.classify == '100'" :id="route.query.id" />
      <TriggerCurtain v-if="route.query.classify == '101'" :id="route.query.id" />
      <TriggerAirCooler v-if="route.query.classify == '102'" :id="route.query.id" />
    </section>
  </div>
</template>
