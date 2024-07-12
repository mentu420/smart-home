import { ref } from 'vue'
import router from '@/router/'

export const nativeBase64List = ref([])

/**
 * funcObj {key:func} key 挂载到window对象下的方法名称，与原生统一，func 执行的方法
 * **/
export function setNativeMethods(funcObj) {
  Object.keys(funcObj).forEach((key) => {
    window[key] = funcObj[key]
  })
}

// 禁止手势的路径
const disabledPaths = [
  '/tabbar/tabbar-house',
  '/tabbar/tabbar-smart',
  '/tabbar/tabbar-me',
  '/account-login',
]

// 原生手势返回
function h5Back() {
  if (disabledPaths.includes(router.currentRoute.value.path)) return
  router.goBack()
}
//安卓返回键处理
function onBackKeyForAndroid() {
  if (disabledPaths.includes(router.currentRoute.value.path)) return
  router.goBack()
}
/**
 * 3: 唤醒,
 * 4: 后台
 * 5: 相机相册,
 * 6: 相机相册
 * **/
function onNativeMessage(type, data) {
  console.log('原生回调onMessage ', type)
  if (type == 5 || type == 6) {
    nativeBase64List.value = data?.split(',')
  } else if (type == 4) {
    //
  } else if (type == 3) {
    //
  }
}

// 函数挂载window 原生调用
setNativeMethods({
  h5Back,
  routerBack: onBackKeyForAndroid,
  onMessage: onNativeMessage,
})
