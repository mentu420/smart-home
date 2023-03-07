<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const houseName = ref('')

const init = () => {
  houseName.value = route.query.houseName
}

init()

const onSubmit = async () => {}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="家庭位置">
      <template #right>
        <label>保存</label>
      </template>
    </HeaderNavbar>
  </div>
</template>
