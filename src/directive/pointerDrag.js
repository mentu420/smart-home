/**
 * use
 * <div v-pointer-drag:[finish]="[maxWidth,maxHeight]" >拖拽的元素</div>
 *
 * @finish 拖拽完成后执行的函数
 * @value  拖拽限制的宽高 Array
 * **/

export default {
  mounted(el, binding) {
    let isPointerDown = false
    const [maxWidth = window.screen.width, maxHeight = window.screen.height] = binding.value || []

    const finish = binding.arg

    el.addEventListener('pointerdown', function (e) {
      isPointerDown = true
    })

    el.addEventListener('pointermove', function (e) {
      //捕获
      el.setPointerCapture(e.pointerId)
      if (isPointerDown) {
        const left = el.getBoundingClientRect().left
        const top = el.getBoundingClientRect().top
        let newLeft = e.clientX - left
        let newTop = e.clientY - top
        let x = newLeft + left - el.clientWidth / 2
        let y = newTop + top - el.clientHeight / 2
        if (x <= 0) x = 0
        if (x >= maxWidth - el.clientWidth) {
          x = maxWidth - el.clientWidth
        }
        if (y <= 0) y = 0
        if (y >= maxHeight - el.clientHeight) {
          y = maxHeight - el.clientHeight
        }
        el.style.left = x + 'px'
        el.style.top = y + 'px'
        el.style.opacity = 0.7
      }
    })

    const cancel = () => {
      isPointerDown = false
      el.style.opacity = 1
      finish ? finish() : console.log('拖拽结束')
    }

    el.addEventListener('pointercancel', function (e) {
      cancel()
    })
    el.addEventListener('pointerleave', function (e) {
      cancel()
    })
    el.addEventListener('pointerup', function (e) {
      cancel()
    })
  },
}
