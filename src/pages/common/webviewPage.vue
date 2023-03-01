<template>
  <div class="view">
    <HeaderNavbar v-if="hideHeader" :title="$route.query.title" />
    <iframe
      :src="$route.query.url"
      frameborder="0"
      class="iframe-view"
      @load="bindOnload"
      @error="onRrror"
    ></iframe>
  </div>
</template>

<script>
import { showLoadingToast, closeToast } from 'vant'
export default {
  name: 'WebviewPage',
  data() {
    return {
      length: 0,
      hideHeader: false,
    }
  },
  mounted() {
    const { hideHeader } = this.$route.query
    this.hideHeader = hideHeader ? false : true
    this.loading = showLoadingToast({
      className: 'small-loading',
      forbidClick: true,
      duration: 10000,
      loadingType: 'spinner',
    })
  },
  methods: {
    bindOnload() {
      closeToast()
    },
    onRrror() {
      closeToast()
    },
  },
}
</script>

<style lang="scss" scoped>
.iframe-view {
  min-height: 100vh;
  width: 100vw;
}
</style>
