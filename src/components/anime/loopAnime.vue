<script setup>
import anime from 'animejs/lib/anime.es.js'
import { ref, onMounted } from 'vue'

const tl = ref(null)

const init = () => {
  const wrapperEl = document.querySelector('.wrapper')
  const numberOfEls = 90
  const duration = 6000
  const delay = duration / numberOfEls

  tl.value = anime.timeline({
    duration: delay,
    complete: function () {
      tl.value.restart()
    },
  })

  function createEl(i) {
    let el = document.createElement('div')
    const rotate = (360 / numberOfEls) * i
    const translateY = -50
    const hue = Math.round((360 / numberOfEls) * i)
    el.classList.add('el')
    el.style.backgroundColor = 'hsl(' + hue + ', 40%, 60%)'
    el.style.transform = 'rotate(' + rotate + 'deg) translateY(' + translateY + '%)'
    tl.value.add({
      begin: function () {
        anime({
          targets: el,
          backgroundColor: ['hsl(' + hue + ', 40%, 60%)', 'hsl(' + hue + ', 60%, 80%)'],
          rotate: [rotate + 'deg', rotate + 10 + 'deg'],
          translateY: [translateY + '%', translateY + 10 + '%'],
          scale: [1, 1.25],
          easing: 'easeInOutSine',
          direction: 'alternate',
          duration: duration * 0.1,
        })
      },
    })
    wrapperEl.appendChild(el)
  }

  for (let i = 0; i < numberOfEls; i++) createEl(i)
}

onMounted(() => {
  init()
})

const restart = () => tl.value.restart()

const pause = () => tl.value.pause()

defineExpose({ restart, pause })
</script>

<template>
  <div class="view">
    <div class="wrapper"></div>
  </div>
</template>

<style>
.view {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 1px;
  height: 100%;
}

.el {
  position: absolute;
  opacity: 1;
  width: 2px;
  height: 12vh;
  margin-top: -12vh;
  transform-origin: 50% 100%;
  background: white;
}
</style>
