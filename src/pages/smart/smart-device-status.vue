<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { TriggerClassifyDetail } from '@/components/trigger/'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'

defineOptions({ name: 'SmartDeviceStatus' })

const route = useRoute()
const router = useRouter()
const { houseUserPower, currentHouse } = storeToRefs(houseStore())
const { deviceList } = storeToRefs(deviceStore())

const goConfig = () => {
  const deviceItem = deviceList.value.find((item) => item.id == route.query.id)
  router.push({
    path: '/smart-device-info',
    query: { ...route.query, rId: deviceItem.rId },
  })
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar :title="route.query.name">
      <template #right>
        <IconFont
          v-if="houseUserPower(currentHouse?.id) != 2"
          class="text-xs text-gray-400"
          icon="more-round"
          @click="goConfig"
        />
      </template>
    </HeaderNavbar>
    <section class="pb-4">
      <TriggerClassifyDetail :id="route.query.id" />
    </section>
  </div>
</template>
