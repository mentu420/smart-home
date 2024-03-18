<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  TriggerLamp,
  TriggerCurtain,
  TriggerAirCooler,
  TriggerUnderfloorHeat,
  TriggerFreshAir,
  TriggerMusic,
} from '@/components/trigger/'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'

defineOptions({ name: 'SmartDeviceStatus' })

const route = useRoute()
const router = useRouter()
const { deviceList } = storeToRefs(deviceStore())
const { houseUserPower, currentHouse } = storeToRefs(houseStore())
const deviceItem = ref({})
const triggerComponents = {
  100: TriggerLamp,
  101: TriggerCurtain,
  102: TriggerAirCooler,
  103: TriggerUnderfloorHeat,
  104: TriggerFreshAir,
  105: TriggerMusic,
}

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
          v-if="houseUserPower(currentHouse.id) != 2"
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
      <SmartImage width="100vw" height="100vw" fit="cover" :src="deviceItem?.imageUrl" />
      <component :is="triggerComponents[route.query.classify]" :id="route.query.id" />
    </section>
  </div>
</template>
