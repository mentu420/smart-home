<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref, useAttrs } from 'vue'
import TriggerClassifyDetail from './TriggerClassifyDetail.vue'
import houseStore from '@/store/houseStore'
import deviceStore from '@/store/deviceStore'
import { useRouter } from 'vue-router'

defineOptions({ name: 'TriggerFloatBubble' })

const router = useRouter()

const props = defineProps({
  id: { type: String, default: '', required: true },
  title: { type: String, default: '' },
})

const { houseUserPower, currentHouse } = storeToRefs(houseStore())
const visible = ref(false)
const offset = ref({ x: window.screen.width - window.screen.width / 3, y: 100 })
const { deviceList } = storeToRefs(deviceStore())
const deviceItem = computed(() => deviceList.value.find((item) => item.id == props.id))

const onShow = () => (visible.value = true)

const onHide = () => (visible.value = false)

defineExpose({ onShow, onHide })
</script>

<template>
  <van-popup
    v-model:show="visible"
    lock-scroll
    teleport="#app"
    position="right"
    round
    safe-area-inset-top
    safe-area-inset-bottom
    z-index="2000"
    class="trigger-popup"
  >
    <div class="h-screen p-4 mt-safe">
      <div class="w-[32vw] min-h-[50vh] bg-page-gray text-[#323233] rounded-xl overflow-hidden">
        <ul class="flex justify-between items-center p-4">
          <li>
            <van-icon name="arrow-left" @click="onHide" />
            <span class="ml-2">{{ props.title }}</span>
          </li>
          <li>
            <IconFont
              v-if="houseUserPower(currentHouse.id) != 2"
              class="text-xs text-gray-400"
              icon="more-round"
              @click="
                router.push({
                  path: '/smart-device-info',
                  query: {
                    id: props.id,
                    rId: deviceItem.rId,
                  },
                })
              "
            />
          </li>
        </ul>
        <TriggerClassifyDetail :id="props.id" />
      </div>
    </div>
    <!-- <van-floating-bubble
      v-if="visible"
      v-model:offset="offset"
      axis="xy"
      magnetic="x"
      class="trigger-float !w-[30vw] min-h-[50vh] !rounded-none !z-[2001] !bg-transparent !active:opacity-100"
    >
      <div class="w-[30vw] min-h-[50vh] bg-page-gray text-[#323233] rounded-xl overflow-hidden">
        <ul class="flex justify-between items-center p-4">
          <li>
            <van-icon name="arrow-left" @click="onHide" />
            <span class="ml-2">{{ props.title }}</span>
          </li>
          <li>
            <IconFont
              v-if="houseUserPower(currentHouse.id) != 2"
              class="text-xs text-gray-400"
              icon="more-round"
              @click="
                router.push({
                  path: '/smart-device-info',
                  query: { ...route.query, rId: deviceItem.rId },
                })
              "
            />
          </li>
        </ul>
        <TriggerClassifyDetail :id="props.id" />
      </div>
    </van-floating-bubble> -->
  </van-popup>
</template>

<style scoped lang="scss">
.trigger-popup {
  background: transparent !important;
}

.trigger-float:active {
  opacity: 1 !important;
}
:deep(.van-floating-bubble:active) {
  opacity: 1 !important;
}
</style>
