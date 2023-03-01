/**
 * use
 * <button v-copy:[success]="msg" >点击复制</button>
 *
 * @success 复制成功后操作函数 可不传
 * @msg 需要复制的值
 * **/

export default {
  mounted(el, binding) {
    el.targetContent = binding.value
    const success = binding.arg
    el.addEventListener('click', (event) => {
      event.stopPropagation()
      if (!el.targetContent) return console.warn('没有需要复制的目标内容')
      // 创建textarea标签
      const textarea = document.createElement('textarea')
      // 设置相关属性
      textarea.readOnly = 'readonly'
      textarea.style.position = 'fixed'
      textarea.style.top = '-99999px'
      // 把目标内容赋值给它的value属性
      textarea.value = el.targetContent
      // 插入到页面
      document.body.appendChild(textarea)
      // 调用onselect()方法
      textarea.select()
      // 把目标内容复制进剪贴板, 该API会返回一个Boolean
      const res = document.execCommand('Copy')
      res && console.log('复制成功，剪贴板内容：' + el.targetContent)
      //复制成功后其他操作
      res && success
        ? success(el.targetContent)
        : console.log('复制成功，剪贴板内容：' + el.targetContent)
      // 移除textarea标签
      document.body.removeChild(textarea)
    })
  },
  update(el, binding) {
    // 实时更新最新的目标内容
    el.targetContent = binding.value
  },
  unbind(el) {
    el.removeEventListener('click', () => {})
  },
}
