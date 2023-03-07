<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const houseName = ref('')

const init = () => {
  houseName.value = route.query.houseName
}

init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="成语与权限" />
  </div>
</template>
