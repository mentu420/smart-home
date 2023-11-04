<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { TriggerLamp, TriggerCurtain, TriggerAirCooler } from '@/components/trigger/'
import deviceStore from '@/store/deviceStore'
import smartStore from '@/store/smartStore'

defineOptions({ name: 'SmartTaskDeviceConfig' })

const { sceneCreateItem } = storeToRefs(smartStore())

const route = useRoute()
const router = useRouter()
const deviceComponents = { 100: TriggerLamp, 101: TriggerCurtain, 102: TriggerAirCooler }

onMounted(() => {})

const onSave = () => {
  router.push({ path: '/smart-scene-create' })
}

const onChange = (actions) => {
  console.log('config', actions)
  console.log(sceneCreateItem.value)
}

const goCreateHome = () => {
  router.go(-3)
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
      <div class="p-8">
        <van-button type="primary" block round @click="goCreateHome">下一步</van-button>
      </div>
    </div>
  </div>
</template>
