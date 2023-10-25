<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { TriggerLamp, TriggerCurtain, TriggerAirCooler, TriggerMusic } from '@/components/trigger/'
import deviceStore from '@/store/deviceStore'

defineOptions({ name: 'SmartDeviceStatus' })

const route = useRoute()
const router = useRouter()
const { deviceList } = storeToRefs(deviceStore())
const deviceItem = ref({})
const triggerConfig = ref({})

const init = () => {
  deviceItem.value = deviceList.value.find((item) => item.id == route.query.id)
}
init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar :title="route.query.name">
      <template #right>
        <IconFont
          class="text-xs text-gray-400"
          icon="more-round"
          @click="
            router.push({
              path: '/smart-device-info',
              query: { ...route.query, rId: deviceItem.rId },
            })
          "
        />
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
      <TriggerMusic v-if="route.query.classify == '105'" :id="route.query.id" />
    </section>
  </div>
</template>
