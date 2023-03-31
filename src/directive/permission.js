//权限指令
function toolPermission(el, binding) {
  const ownPermission = binding.arg
  if (binding.value && !ownPermission.includes(binding.value)) {
    el.parentNode && el.parentNode.removeChild(el) // 关键代码, 没有权限则删除元素
  }
}

/**
 * use
 * <button v-permission:[ownPermission]="value" >点击复制</button>
 *
 * @ownPermission 权限数组
 * @value 权限值
 * **/
export default {
  mounted(el, binding) {
    toolPermission(el, binding)
  },
  updated(el, binding) {
    toolPermission(el, binding)
  },
}
