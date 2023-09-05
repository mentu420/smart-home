<script setup>
import { ref } from 'vue'

defineOptions({ name: 'LoginPage' })

const title = ref('login')
</script>

<template>
  <div>{{ title }}</div>
</template>
