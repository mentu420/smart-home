/**
 * funcObj {key:func} key 挂载到window对象下的方法名称，与原生统一，func 执行的方法
 * **/
export function setNativeMethods(funcObj) {
  Object.keys(funcObj).forEach((key) => {
    window[key] = funcObj[key]
  })
}
