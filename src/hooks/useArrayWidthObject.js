// 数组对象删除重复数据
export const objDelMap = (key, arr) => {
  const map = new Map()
  for (const item of arr) {
    if (!map.has(item[key])) {
      map.set(item[key], item)
    }
  }
  return [...map.values()]
}

// 根据数组值删除对象中的值
export const objDelByValues = (values, obj) => {
  if (!Array.isArray(values)) throw new Error('values required array')
  Object.keys(obj).forEach((key) => {
    if (values.includes(obj[key])) delete obj[key]
  })
  return obj
}
