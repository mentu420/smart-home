<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import sceneStore from '@/store/sceneStore'

defineOptions({ name: 'SmartSceneGallery' })

const checkboxRefs = ref([])

const { sceneGallery, sceneCreateItem } = storeToRefs(sceneStore())

const route = useRoute()
const router = useRouter()
const checked = ref(sceneCreateItem.value.img)

const onComfirm = () => {
  const { updateSceneCreateItem } = sceneStore()
  updateSceneCreateItem({ img: checked.value })
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="场景图库" />
    <van-radio-group v-model="checked">
      <ul class="grid grid-cols-2 gap-4 p-4">
        <li
          v-for="(imageItem, imageIndex) in sceneGallery"
          :key="imageIndex"
          class="relative"
          @click="checked = imageItem.src"
        >
          <van-image class="h-20 w-full" fit="cover" radius="10" :src="imageItem.src" />
          <div class="absolute bottom-0 left-2 right-0 top-0 flex items-center">
            <p class="rounded bg-black bg-opacity-50 px-3 py-2 text-white">{{ imageItem.text }}</p>
          </div>
          <div class="absolute right-0 top-0">
            <van-radio
              :ref="(el) => (checkboxRefs[imageIndex] = el)"
              :name="imageItem.src"
              @click.stop
            />
          </div>
        </li>
      </ul>
    </van-radio-group>
    <div class="h-[80px]"></div>
    <div class="fixed bottom-0 left-0 z-10 w-screen bg-white px-6 py-4">
      <van-button type="primary" block round @click="onComfirm"> 确定 </van-button>
    </div>
  </div>
</template>
