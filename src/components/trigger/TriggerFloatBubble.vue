<script setup>
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref, useAttrs } from 'vue'
import { TriggerAttrConfig, TriggerClassifyDetail } from '@/components/trigger/'
import houseStore from '@/store/houseStore'
import deviceStore from '@/store/deviceStore'
import { useRect } from '@vant/use'

defineOptions({ name: 'TriggerFloatBubble' })

const props = defineProps({
  id: { type: String, default: '', required: true },
  title: { type: String, default: '' },
})

const { houseUserPower, currentHouse } = storeToRefs(houseStore())
const { deviceList } = storeToRefs(deviceStore())
const deviceItem = computed(() => deviceList.value.find((item) => item.id == props.id))
const visible = ref(false)
const active = ref(0) //0 显示设备触发器 1 显示设备配置
const transitionName = computed(() => (active.value > 0 ? 'van-slide-left' : 'van-slide-right'))
const popupHeight = ref('')
const contentRef = ref(null)

const onShow = () => (visible.value = true)

const onHide = () => (visible.value = false)

const onBack = () => {
  if (active.value > 0) {
    --active.value
    return
  }
  onHide()
}

const onMore = () => {
  if (active.value == 1) return
  ++active.value
}

const onOpened = async () => {
  await nextTick()
  const { height } = useRect(contentRef.value)
  console.log('height', height)
  popupHeight.value = height + 'px'
}

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
    @closed="active = 0"
    @opened="onOpened"
  >
    <div class="h-full p-4 flex justify-center items-center" @click.self="onHide">
      <div
        ref="contentRef"
        :style="{ height: popupHeight }"
        class="w-[32vw] min-h-[50vh] bg-page-gray text-[#323233] rounded-xl overflow-hidden"
      >
        <ul class="flex justify-between items-center p-4">
          <li>
            <van-icon name="arrow-left" @click="onBack" />
            <span class="ml-2">{{ props.title }}</span>
          </li>
          <li>
            <IconFont
              v-if="houseUserPower(currentHouse.id) != 2"
              class="text-xs text-gray-400"
              :class="{ 'opacity-30': active == 1 }"
              icon="more-round"
              @click="onMore"
            />
          </li>
        </ul>
        <transition-group :name="transitionName">
          <div v-if="active == 0" class="h-full">
            <TriggerClassifyDetail :id="props.id" />
          </div>
          <div v-else class="h-full">
            <TriggerAttrConfig :id="props.id" />
          </div>
        </transition-group>
      </div>
    </div>
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
