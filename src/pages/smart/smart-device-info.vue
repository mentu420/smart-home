<script setup>
import { useRoute, useRouter } from 'vue-router'
import { TriggerAttrConfig } from '@/components/trigger/'

defineOptions({ name: 'SmartDeviceInfo' })

const route = useRoute()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="设置" />
    <TriggerAttrConfig :id="route.query.id" />
  </div>
</template>
