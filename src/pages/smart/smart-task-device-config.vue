<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { TriggerLamp, TriggerCurtain, TriggerAirCooler } from '@/components/trigger/'
import deviceStore from '@/store/deviceStore'
import sceneStore from '@/store/sceneStore'

defineOptions({ name: 'SmartTaskDeviceConfig' })

const { useGetDeviceItem, deviceUseList } = deviceStore()
const { sceneCreateItem } = storeToRefs(sceneStore())

const route = useRoute()
const router = useRouter()
const deviceComponents = { 100: TriggerLamp, 101: TriggerCurtain, 102: TriggerAirCooler }

onMounted(() => {})

const onSave = () => {
  router.push({ path: '/smart-scene-create' })
}

const onChange = (deviceItem, config) => {
  console.log('config', deviceItem, config)
  /**
   * {
"ziyuanleixing":1,
"ziyuanbianhao":"006bc426-965d-4a7b-bc6a-3c986b4f8e46",
"yanshi":0,
"caozuo":{
"shuxing":"switch",
"shuxingzhuangtai":"on",
"shuxingzhi":""
}
}**/
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
