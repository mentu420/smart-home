<template>
  <label>{{ animatedNumber }}</label>
</template>

<script>
//https://greensock.com/docs/v3/GSAP/gsap.to()
//状态过度
import { gsap } from 'gsap'

export default {
  name: 'AnimatedNumber',
  components: {},
  props: {
    number: {
      type: [Number, String],
      default: 0,
    },
    fixed: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      tweenedNumber: 0,
    }
  },
  computed: {
    animatedNumber() {
      return this.tweenedNumber.toFixed(this.fixed)
    },
  },
  watch: {
    number(newValue) {
      gsap.to(this.$data, { duration: 0.5, tweenedNumber: newValue })
    },
  },
}
</script>

<style scoped lang="scss"></style>
