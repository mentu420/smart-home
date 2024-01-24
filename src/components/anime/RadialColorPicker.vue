<script setup>
import Rotator from '@radial-color-picker/rotator'
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick, toRefs } from 'vue'

import { debounce } from '@/utils/common'

defineOptions({ name: 'ColorPicker' })

const keys = {
  ArrowUp: (oldAngle, step) => oldAngle + step,
  ArrowRight: (oldAngle, step) => oldAngle + step,
  ArrowDown: (oldAngle, step) => oldAngle - step,
  ArrowLeft: (oldAngle, step) => oldAngle - step,
  PageUp: (oldAngle, step) => oldAngle + step * 10,
  PageDown: (oldAngle, step) => oldAngle - step * 10,
  Home: () => 0,
  End: () => 359,
}

const props = defineProps({
  gradientColors: {
    type: Array,
    default: () => ['to bottom', '#FB8C1A', '#FAF6F7'],
  },
  gradientType: {
    type: String,
    default: 'linear', //
  },
  hue: {
    type: Number,
    default: 0,
  },
  saturation: {
    type: Number,
    default: 100,
  },
  luminosity: {
    type: Number,
    default: 50,
  },
  alpha: {
    type: Number,
    default: 1,
  },
  step: {
    type: Number,
    default: 1,
  },
  mouseScroll: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'collapsible', // collapsible | persistent
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  initiallyCollapsed: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    default: 'color picker',
  },
  ariaRoledescription: {
    type: String,
    default: 'radial slider',
  },
  ariaValuetext: {
    type: String,
    default: '',
  },
  ariaLabelColorWell: {
    type: String,
    default: 'color well',
  },
  range: {
    type: Array,
    default: () => [0, 100],
  },
})

const emits = defineEmits(['select', 'input', 'change', 'confirm'])

const show = ref(false)
// template refs
const el = ref(null)
const rotator = ref(null)
const { hue, initiallyCollapsed } = toRefs(props)
// instance values
let rcp = null
// state
const initialAngle = hue.value + 'deg'
const angle = ref(hue.value)
const isPaletteIn = ref(!initiallyCollapsed.value)
const isKnobIn = ref(!initiallyCollapsed.value)
const isPressed = ref(false)
const isRippling = ref(false)
const isDragging = ref(false)
const scopeData = ref(null)
const ratio = ref(0)

const drawGradientCircle = (gradientType, colors, angle) => {
  const canvas = document.createElement('canvas')
  canvas.width = 400
  canvas.height = 400
  // document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(centerX, centerY) - 10
  const startAngle = -Math.PI / 2
  const endAngle = startAngle + Math.PI * 2

  // 创建渐变色
  let gradient
  if (gradientType === 'linear') {
    gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
  } else if (gradientType === 'radial') {
    gradient = ctx.createRadialGradient(centerX, centerY, radius / 2, centerX, centerY, radius)
  }

  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color)
  })

  // 绘制圆环
  ctx.beginPath()
  ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2)
  ctx.closePath()

  ctx.fillStyle = gradient
  ctx.fill()

  const radians = ((angle - 90) * Math.PI) / 180 // 将角度转化为弧度
  const x = canvas.width / 2 + Math.cos(radians) * (canvas.width / 2) // 计算点的x坐标
  const y = canvas.height / 2 + Math.sin(radians) * (canvas.height / 2) // 计算点的y坐标
  const imageData = ctx.getImageData(x, y, 1, 1)
  const color = `rgb(${imageData.data[0]}, ${imageData.data[1]}, ${imageData.data[2]})`

  return color
}

const color = computed(() => {
  const hexColorRegex = /^#([0-9a-fA-F]{3}){1,2}$/
  const colors = props.gradientColors.filter((color) => hexColorRegex.test(color))
  return drawGradientCircle(props.gradientType, colors, angle.value)
})

const rcpStyles = computed(() => {
  return {
    background: `${props.gradientType}-gradient(${props.gradientColors.join(',')})`,
  }
})

const valuetext = computed(() => {
  const n = props.gradientColors.length >= 6 ? 6 : props.gradientColors.length
  return props.gradientColors[Math.round(angle.value / n)]
})

watch(
  () => props.hue,
  (value) => {
    angle.value = value
    rcp.angle = value
  }
)

watch(
  () => angle.value,
  (val) => {
    const { min, max } = scopeData.value
    const minValue = min || props.range[0]
    const maxValue = max || props.range[1]
    const angleValue = val > 180 ? 360 - val : val
    const ratioValue = angleValue / 180
    const value = (Number(maxValue) - Number(minValue)) * ratioValue + Number(minValue)
    ratio.value = value.toFixed()
  }
)

// ignore testing code that will be removed by dead code elimination for production
// istanbul ignore next
if (props.initiallyCollapsed && props.variant === 'persistent') {
  console.warn(
    `Incorrect config: using variant="persistent" and :initiallyCollapsed="true" at the same time is not supported.`
  )
}

const onInput = () => {
  const values = { angle: angle.value, ratio: ratio.value, color: color.value }
  emits('input', values)
}

const onChange = debounce(() => {
  const values = { angle: angle.value, ratio: ratio.value, color: color.value }
  emits('change', values)
}, 350)

watch(
  () => show.value,
  (val) => {
    if (!val) return
    nextTick(() => {
      rcp = new Rotator(rotator.value, {
        angle: angle.value,
        onRotate(hue) {
          angle.value = hue
          onInput()
        },
        onDragStart() {
          isDragging.value = true
        },
        onDragStop() {
          isDragging.value = false
          onChange()
        },
      })
    })
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (!rcp) return
  rcp.destroy()
  rcp = null
})

const onKeyDown = (ev) => {
  if (props.disabled || isPressed.value || !isKnobIn.value || !(ev.key in keys)) return

  ev.preventDefault()

  rcp.angle = keys[ev.key](rcp.angle, props.step)

  angle.value = rcp.angle
  onInput()
  onChange()
}

const onScroll = (ev) => {
  if (isPressed.value || !isKnobIn.value) return

  ev.preventDefault()

  if (ev.deltaY > 0) {
    rcp.angle += props.step
  } else {
    rcp.angle -= props.step
  }

  angle.value = rcp.angle
  onInput()
  onChange()
}

const selectColor = () => {
  isPressed.value = true

  if (isPaletteIn.value && isKnobIn.value) {
    emits('select', angle.value)
    isRippling.value = true
  } else {
    isPaletteIn.value = true
  }
}

const togglePicker = () => {
  if (props.variant !== 'persistent') {
    if (isKnobIn.value) {
      isKnobIn.value = false
    } else {
      isKnobIn.value = true
      isPaletteIn.value = true
    }
  }

  isRippling.value = false
  isPressed.value = false
}

const hidePalette = () => {
  if (!isKnobIn.value) {
    isPaletteIn.value = false
  }
}

const getAngle = (min, max, value) => {
  const ratio = (Number(value) - Number(min)) / (Number(max) - Number(min))
  console.log('getAngle', ratio)
  const angleValue = ratio * 180
  console.log('angleValue', angleValue)
  const angle = angleValue > 180 ? 360 - angleValue : angleValue
  return angle.toFixed()
}

function open(data) {
  scopeData.value = data
  const { min, max } = scopeData.value
  const minValue = min || props.range[0]
  const maxValue = max || props.range[1]
  if (data.ratio) {
    ratio.value = data.ratio
    angle.value = data.angle || getAngle(minValue, maxValue, data.ratio)
  }

  show.value = true
}

const close = () => (show.value = false)

function onConfirm() {
  close()
  emits('confirm', { ratio: ratio.value, color: color.value, angle: angle.value }, scopeData.value)
}

defineExpose({ open, close })
</script>

<template>
  <van-popup v-model:show="show" round teleport="body" position="bottom">
    <van-cell title="色温">
      <template #right-icon>
        <van-icon name="success" size="26" @click="onConfirm" />
      </template>
    </van-cell>
    <div class="flex items-center justify-center p-8">
      <div
        ref="el"
        role="slider"
        :aria-roledescription="ariaRoledescription"
        :aria-label="ariaLabel"
        :aria-expanded="isPaletteIn"
        aria-valuemin="0"
        aria-valuemax="359"
        :aria-valuenow="angle"
        :aria-valuetext="ariaValuetext || valuetext"
        :aria-disabled="disabled"
        class="rcp"
        :class="{ dragging: isDragging, disabled: disabled }"
        :tabindex="disabled ? -1 : 0"
        :style="{ '--rcp-initial-angle': initialAngle }"
        @keyup.enter="selectColor"
        @keydown="onKeyDown"
      >
        <div class="rcp__palette" :class="isPaletteIn ? 'in' : 'out'" :style="rcpStyles" />

        <div
          ref="rotator"
          class="rcp__rotator"
          :style="{
            'pointer-events': disabled || isPressed || !isKnobIn ? 'none' : null,
          }"
          v-on="mouseScroll ? { wheel: onScroll } : {}"
        >
          <div
            class="rcp__knob"
            :class="isKnobIn ? 'in' : 'out'"
            @transitionend="hidePalette"
          ></div>
        </div>

        <button
          type="button"
          class="rcp__well"
          :aria-label="ariaLabelColorWell"
          :disabled="disabled"
          :tabindex="disabled ? -1 : 0"
          :class="{ pressed: isPressed }"
          @animationend="togglePicker"
          @click="selectColor"
        >
          <slot :angle="angle" :ratio="ratio">
            <div
              class="rcp__ripple"
              :class="{ rippling: isRippling }"
              :style="{ borderColor: color, backgroundColor: color }"
            ></div>
          </slot>
        </button>
      </div>
    </div>
  </van-popup>
</template>

<style>
.rcp,
.rcp div,
.rcp button {
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  box-sizing: border-box;
}

.rcp {
  display: block;
  overflow: hidden;
  width: 280px;
  height: 280px;
  position: relative;
  transform: scale(1.001);
  transition: transform 0.15s cubic-bezier(0.68, 0, 0.47, 2);
}

.rcp:focus {
  outline: 0;
}

.rcp:hover .rcp__knob {
  box-shadow:
    0 0 20px rgba(0, 0, 0, 0.19),
    0 0 10px rgba(0, 0, 0, 0.24);
}

.rcp.dragging {
  transform: scale(1.04);
}

.rcp.disabled {
  cursor: not-allowed;
  transform: scale(0.96);
}

.rcp.dragging .rcp__rotator {
  z-index: 1;
}

.rcp__palette {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  /* background-image: conic-gradient(red, yellow, lime, aqua, blue, magenta, red); */
  -webkit-mask-image: radial-gradient(circle at 50% 50%, transparent 53.5%, black 54%);
  mask-image: radial-gradient(circle at 50% 50%, transparent 53.5%, black 54%);
  border-radius: 50%;
  overflow: hidden;
  will-change: transform, opacity;
  transition:
    transform 0.5s cubic-bezier(0.35, 0, 0.25, 1),
    opacity 0.5s cubic-bezier(0.35, 0, 0.25, 1);
}

.rcp__palette.in {
  transform: scale(1);
  opacity: 1;
}

.rcp__palette.out {
  transform: scale(0);
  opacity: 0;
}

.disabled .rcp__palette {
  filter: contrast(0.25);
}

.rcp__rotator {
  width: 100%;
  height: 100%;
  position: absolute;
  transform: rotate(var(--rcp-initial-angle));
}

.rcp__knob {
  box-shadow:
    0 0 10px rgba(0, 0, 0, 0.12),
    0 0 5px rgba(0, 0, 0, 0.16);
  border-radius: 50%;
  position: absolute;
  width: 7%;
  height: 7%;
  top: 2.5%;
  left: 46.5%;
  background-color: #fff;
  transition: transform 0.4s cubic-bezier(0.35, 0, 0.25, 1);
  outline: 0;
  border-style: none;
}

.rcp__knob.in {
  transform: scale(1);
}

.rcp__knob.out {
  transform: scale(0);
}

.disabled .rcp__knob {
  box-shadow: none;
  pointer-events: none;
}

.rcp__well {
  position: absolute;
  width: 25%;
  height: 25%;
  top: 37.5%;
  left: 37.5%;
  padding: 0;
  margin: 0;
  border-radius: 50%;
  background-color: #fff;
  outline: 0;
  cursor: pointer;
  overflow: visible;
  border: 6px solid #fff;
  box-shadow: 0 0 0 1px #b2b2b2;
}

.rcp__well::-moz-focus-inner {
  border: 0;
}

.rcp__well:hover {
  box-shadow: 0 0 1px 1px #333;
}

.rcp__well:focus {
  box-shadow: 0 0 1px 2px #b2b2b2;
}

.rcp__well.pressed {
  animation: rcp-beat 0.4s cubic-bezier(0.35, 0, 0.25, 1) forwards;
}

.disabled .rcp__well {
  background-color: #bfbfbf !important;
  pointer-events: none;
}

.rcp__ripple {
  width: 20%;
  height: 20%;
  border-radius: 50%;
  border: #ff0000 solid 8px;
  opacity: 0;
  position: absolute;
  top: 40%;
  left: 40%;
  z-index: -1;
}

.rcp__ripple.rippling {
  z-index: 0;
  animation: rcp-ripple 0.5s cubic-bezier(0.35, 0, 0.25, 1) forwards;
}

@keyframes rcp-ripple {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    opacity: 0;
    border-width: 0;
    transform: scale(3.8);
  }
}

@keyframes rcp-beat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
