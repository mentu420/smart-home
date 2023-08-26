<script setup>
import { ref } from 'vue'

import image1 from '@/assets/images/smart/smart-bg-1.jpg'

const props = defineProps({
  src: {
    type: String,
    default: image1,
  },
})
</script>

<template>
  <div
    v-clickable-active
    :style="{ backgroundImage: 'url(' + props.src + ')' }"
    class="w-full flex items-center overflow-hidden rounded-lg bg-gray-300 bg-cover bg-center bg-no-repeat min-h-[76px] relative"
  >
    <div
      class="bg-black bg-opacity-50 p-3 absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center text-white"
    >
      <slot> </slot>
    </div>
  </div>
</template>
