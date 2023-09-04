/**
 * 使用
 * <button v-loading-click="onClick" >按钮</button>
 * 参数
 * @onClick  promise函数
 * **/

const bindListener = (el, binding, vnode) => {
  if (el._loadingClickListener) {
    el.removeEventListener('click', el._loadingClickListener)
  }
  el._loadingClickListener = async (event) => {
    if (binding.modifiers.stop) event.stopPropagation()
    const copyHtml = el.innerHTML

    const html = `<div class="van-button__content"><div class="van-loading van-loading--circular van-button__loading" aria-live="polite" aria-busy="true"><span class="van-loading__spinner van-loading__spinner--circular"><svg class="van-loading__circular" viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none"></circle></svg></span><!----></div><!----><!----></div>`

    el.innerHTML = html
    try {
      await binding.value()
    } catch (error) {
      console.warn(error)
    } finally {
      el.innerHTML = copyHtml
    }
  }

  el.addEventListener('click', el._loadingClickListener, binding.modifiers)
}

export default {
  mounted: bindListener,
  updated: bindListener,
  unmounted(el) {
    if (el._loadingClickListener) {
      el.removeEventListener('click', el._loadingClickListener)
    }
  },
}
