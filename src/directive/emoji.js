import {
  moneyReg,
  nameReg,
  passwordReg,
  phoneReg,
  textReg,
  websiteReg,
  wechatReg,
} from '@/hooks/useFormValidator.js'

import inputFilter from './cursor.js'

const regRuleResult = {
  text: textReg,
  name: nameReg,
  money: moneyReg,
  phone: phoneReg,
  website: websiteReg,
  wechat: wechatReg,
  password: passwordReg,
}

/**
 *
 * **/

// 派发自定义事件
const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}

export default {
  mounted(el, binding) {
    el.$handler = (el) => {
      el = el.tagName == 'INPUT' ? el : el.querySelector('input') || el.querySelector('textarea')
      const regRule = binding.value || regRuleResult[binding.arg]
      // el.value = val.replace(regRule, '');
      inputFilter.replaceAndSetPos(el, regRule, '')
      trigger(el, 'input') // 派发自定义事件, 防止出现视图更新数据没有数据的情况
    }
    el.$handler(el)
  },
  update(el) {
    el.$handler && el.$handler(el)
  },
}
