//验证文本框输入
export const textReg =
  /[^a-zA-Z0-9\u4E00-\u9FA5\\:：.,；;。，、……|%￥$#?？`·~^()（）《》*【】'‘’"“”{}_-——=@！!+↵/\s/\n/\r]/g
//中文姓名或英文姓名
export const nameReg = /^(?:[\u4e00-\u9fa5·]{2,16}|[a-zA-Z]{1}[a-zA-Z\s]{0,20}[a-zA-Z]{1})$/
//数字/货币金额（支持负数、千分位分隔符）
export const moneyReg =
  /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/
//中国手机号(宽松), 只要是13,14,15,16,17,18,19开头即可
export const phoneReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
//网址(支持端口和"?+参数"和"#+参数)
export const websiteReg =
  /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/
//验证微信号，2-20个字母、数字、下划线和减号，必须字母开头部分大小写
export const wechatReg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/
//中英文、数字和空格
export const cnWidthEnReg = /^[\u4e00-\u9fa5\u0020_a-zA-Z0-9]+$/
//汉字名称
export const chineNameReg = /^[\u4e00-\u9fa5·]{2,16}$/
//密码不能包含中文、全角字符、问号和空格。最短长度为6位。最长长度为32位。
export const passwordReg = /^(?!.*[\u4E00-\u9FA5\uFF00-\uFFEF\u3000\uFF1F\s]).{6,32}$/
//正则匹配中文英文字符、数据及标点
export const keyboardReg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_.])*$/

export function vaildText(value) {
  textReg.lastIndex = 0
  return textReg.test(value)
}

export function vaildName(value) {
  nameReg.lastIndex = 0
  if (nameReg.test(value)) {
    return true
  }
  return false
}

export function vaildMoney(value) {
  moneyReg.lastIndex = 0
  if (moneyReg.test(value)) {
    return true
  }
  return false
}

export function vaildPhone(value) {
  phoneReg.lastIndex = 0
  return phoneReg.test(value)
}

export function vaildWebsite(value) {
  websiteReg.lastIndex = 0
  if (websiteReg.test(value)) {
    return true
  }
  return false
}

export function vaildWechat(value) {
  wechatReg.lastIndex = 0
  if (wechatReg.test(value)) {
    return true
  }
  return false
}

export function vaildCnWidthEn(value) {
  cnWidthEnReg.lastIndex = 0
  return cnWidthEnReg.test(value)
}
//验证百家姓。1：是汉字并且符合百家姓
export function vaildChineName(value) {
  chineNameReg.lastIndex = 0
  return chineNameReg.test(value)
}

export function validPassword(value) {
  passwordReg.lastIndex = 0
  return passwordReg.test(value)
}

export function validKeyboard(value) {
  keyboardReg.lastIndex = 0
  return keyboardReg.test(value)
}

export const trimFormat = (value) => {
  return value.replace(/\s+/g, '')
}
export const textFormat = (value) => {
  return value.replace(textReg, '')
}

export const useFormVaildator = (value, reg) => {
  reg.lastIndex = 0
  return reg.test(value)
}

// 设置表单格式化输出
export const setFormFormat = (value, reg) => {
  return value.replace(reg, '')
}
