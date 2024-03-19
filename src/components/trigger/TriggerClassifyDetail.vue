<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted, computed } from 'vue'

import {
  TriggerLamp,
  TriggerCurtain,
  TriggerAirCooler,
  TriggerUnderfloorHeat,
  TriggerFreshAir,
  TriggerMusic,
} from '@/components/trigger/'
import deviceStore from '@/store/deviceStore'

defineOptions({ name: 'TriggerClassifyDetail' })

const props = defineProps({
  id: { type: String, default: '', required: true },
})

const { deviceList } = storeToRefs(deviceStore())

const deviceItem = computed(() => deviceList.value.find((item) => item.id == props.id))

const triggerComponents = {
  100: TriggerLamp,
  101: TriggerCurtain,
  102: TriggerAirCooler,
  103: TriggerUnderfloorHeat,
  104: TriggerFreshAir,
  105: TriggerMusic,
}
</script>

<template>
  <div>
    <SmartImage class="w-full h-full" fit="cover" :src="deviceItem?.imageUrl" />
    <component :is="triggerComponents[deviceItem?.classify]" :id="props.id" />
  </div>
</template>
