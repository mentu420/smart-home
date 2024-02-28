<script setup>
import { gsap } from 'gsap'
import { ref, onMounted } from 'vue'

const roundRef = ref([])
const roundList = ref([1, 2, 3, 4])
const timeline = ref(null)

const play = () => {
  timeline.value.forEach((a) => a?.play())
}
const pause = () => {
  timeline.value.forEach((a) => a?.pause())
}

onMounted(() => {
  // timeline.value = gsap.timeline()
  const duration = 6
  timeline.value = [
    ...roundList.value.map((item, i) => {
      return gsap.fromTo(
        roundRef.value[i],
        { scale: 1, duration, repeat: -1, ease: 'ease' },
        { scale: 5, opacity: 0, duration, repeat: -1, ease: 'ease', delay: i }
      )
    }),
    gsap.fromTo('.conic-round', { rotate: 0 }, { rotate: 360, duration, repeat: -1 }),
  ]
})

defineExpose({ play, pause, timeline })
</script>

<template>
  <div class="relative h-[212px] w-[212px] rounded-full overflow-hidden">
    <div
      class="w-full h-full rounded-full bg-[#666] bg-opacity-5 flex justify-center items-center"
    ></div>
    <div
      v-for="(item, i) in roundList"
      :key="item"
      :ref="(el) => (roundRef[i] = el)"
      class="w-[42px] h-[42px] bg-[#666] rounded-full bg-opacity-30 flex justify-center items-center absolute left-[85px] top-[85px]"
    ></div>
    <div
      class="conic-round h-[212px] w-[212px] bg-green-300 rounded-full absolute left-0 top-0"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.conic-round {
  background: conic-gradient(#5ea8f1 1deg, 1%, transparent 15deg);
  transform: rotateY(180deg);
}
</style>
