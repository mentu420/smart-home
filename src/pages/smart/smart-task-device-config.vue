<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { TriggerLamp, TriggerCurtain, TriggerAirCooler } from '@/components/trigger/'
import deviceStore from '@/store/deviceStore'

defineOptions({ name: 'SmartTaskDeviceConfig' })

const { useGetDeviceItem, deviceUseList } = deviceStore()

const route = useRoute()
const router = useRouter()
const deviceComponents = { 100: TriggerLamp, 101: TriggerCurtain, 102: TriggerAirCooler }

onMounted(() => {})

const onSave = () => {
  router.push({ path: '/smart-scene-create' })
}

const onChange = (config) => {
  console.log('config', config)
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="设备配置" />
    <div>
      <template v-for="(deviceItem, deviceClassify) in deviceComponents" :key="deviceClassify">
        <component
          :is="deviceItem"
          v-if="deviceClassify == route.query.classify"
          :id="route.query.id"
          @change="onChange"
        />
      </template>
    </div>
  </div>
</template>
